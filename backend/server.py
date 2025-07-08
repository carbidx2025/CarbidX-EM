from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import json
import asyncio
import bcrypt
import jwt
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# JWT configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'carbidx-secret-key-2025')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Security
security = HTTPBearer()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_connections: Dict[str, List[str]] = {}
        
    async def connect(self, websocket: WebSocket, user_id: str, connection_id: str):
        await websocket.accept()
        self.active_connections[connection_id] = websocket
        if user_id not in self.user_connections:
            self.user_connections[user_id] = []
        self.user_connections[user_id].append(connection_id)
        
    def disconnect(self, user_id: str, connection_id: str):
        if connection_id in self.active_connections:
            del self.active_connections[connection_id]
        if user_id in self.user_connections:
            self.user_connections[user_id] = [
                conn for conn in self.user_connections[user_id] if conn != connection_id
            ]
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]
                
    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.user_connections:
            for connection_id in self.user_connections[user_id]:
                if connection_id in self.active_connections:
                    try:
                        await self.active_connections[connection_id].send_text(message)
                    except:
                        pass
                        
    async def broadcast_to_auction(self, message: str, auction_id: str):
        for connection_id, websocket in self.active_connections.items():
            try:
                await websocket.send_text(message)
            except:
                pass

manager = ConnectionManager()

# Enums
class UserRole(str, Enum):
    BUYER = "buyer"
    DEALER = "dealer"
    ADMIN = "admin"

class DealerTier(str, Enum):
    STANDARD = "standard"
    PREMIUM = "premium"
    GOLD = "gold"

class AuctionStatus(str, Enum):
    ACTIVE = "active"
    CLOSED = "closed"
    CANCELLED = "cancelled"

class BidStatus(str, Enum):
    ACTIVE = "active"
    WINNING = "winning"
    LOST = "lost"

# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    role: UserRole
    dealer_tier: Optional[DealerTier] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserRegister(BaseModel):
    email: str
    password: str
    name: str
    role: UserRole
    dealer_tier: Optional[DealerTier] = None
    phone: Optional[str] = None
    location: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class CarRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    buyer_id: str
    title: str
    make: str
    model: str
    year: int
    max_budget: float
    description: str
    location: str
    preferred_color: Optional[str] = None
    transmission: Optional[str] = None
    fuel_type: Optional[str] = None
    mileage_preference: Optional[str] = None
    auction_duration: int = 24  # hours
    status: AuctionStatus = AuctionStatus.ACTIVE
    created_at: datetime = Field(default_factory=datetime.utcnow)
    ends_at: datetime = Field(default_factory=lambda: datetime.utcnow() + timedelta(hours=24))
    winning_bid_id: Optional[str] = None

class CarRequestCreate(BaseModel):
    title: str
    make: str
    model: str
    year: int
    max_budget: float
    description: str
    location: str
    preferred_color: Optional[str] = None
    transmission: Optional[str] = None
    fuel_type: Optional[str] = None
    mileage_preference: Optional[str] = None
    auction_duration: int = 24

class Bid(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    auction_id: str
    dealer_id: str
    dealer_name: str
    dealer_tier: DealerTier
    price: float
    message: Optional[str] = None
    status: BidStatus = BidStatus.ACTIVE
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BidCreate(BaseModel):
    auction_id: str
    price: float
    message: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

# Utility functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_data = await db.users.find_one({"email": email})
    if user_data is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user_data)

# Authentication routes
@api_router.post("/register", response_model=Token)
async def register(user_data: UserRegister):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = hash_password(user_data.password)
    
    # Create user
    user = User(
        email=user_data.email,
        name=user_data.name,
        role=user_data.role,
        dealer_tier=user_data.dealer_tier,
        phone=user_data.phone,
        location=user_data.location
    )
    
    # Store user with hashed password
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    await db.users.insert_one(user_dict)
    
    # Create token
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# Car request routes
@api_router.post("/car-requests", response_model=CarRequest)
async def create_car_request(request_data: CarRequestCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.BUYER:
        raise HTTPException(status_code=403, detail="Only buyers can create car requests")
    
    car_request = CarRequest(
        buyer_id=current_user.id,
        **request_data.dict(),
        ends_at=datetime.utcnow() + timedelta(hours=request_data.auction_duration)
    )
    
    await db.car_requests.insert_one(car_request.dict())
    
    # Notify all dealers about new auction
    await manager.broadcast_to_auction(
        json.dumps({
            "type": "new_auction",
            "auction": {k: v.isoformat() if isinstance(v, datetime) else v for k, v in car_request.dict().items()}
        }),
        car_request.id
    )
    
    return car_request

@api_router.get("/car-requests", response_model=List[CarRequest])
async def get_car_requests(current_user: User = Depends(get_current_user)):
    if current_user.role == UserRole.BUYER:
        requests = await db.car_requests.find({"buyer_id": current_user.id}).to_list(1000)
    else:
        requests = await db.car_requests.find({"status": AuctionStatus.ACTIVE}).to_list(1000)
    
    return [CarRequest(**request) for request in requests]

@api_router.get("/car-requests/{request_id}", response_model=CarRequest)
async def get_car_request(request_id: str, current_user: User = Depends(get_current_user)):
    request_data = await db.car_requests.find_one({"id": request_id})
    if not request_data:
        raise HTTPException(status_code=404, detail="Car request not found")
    
    return CarRequest(**request_data)

# Bidding routes
@api_router.post("/bids", response_model=Bid)
async def create_bid(bid_data: BidCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.DEALER:
        raise HTTPException(status_code=403, detail="Only dealers can place bids")
    
    # Check if auction exists and is active
    auction = await db.car_requests.find_one({"id": bid_data.auction_id})
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    
    if auction["status"] != AuctionStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Auction is not active")
    
    if datetime.utcnow() > auction["ends_at"]:
        raise HTTPException(status_code=400, detail="Auction has ended")
    
    # Check if bid is lower than current lowest bid
    current_bids = await db.bids.find({"auction_id": bid_data.auction_id}).sort("price", 1).to_list(1000)
    if current_bids and bid_data.price >= current_bids[0]["price"]:
        raise HTTPException(status_code=400, detail="Bid must be lower than current lowest bid")
    
    # Check if bid is within budget
    if bid_data.price > auction["max_budget"]:
        raise HTTPException(status_code=400, detail="Bid exceeds maximum budget")
    
    # Create bid
    bid = Bid(
        auction_id=bid_data.auction_id,
        dealer_id=current_user.id,
        dealer_name=current_user.name,
        dealer_tier=current_user.dealer_tier,
        price=bid_data.price,
        message=bid_data.message,
        status=BidStatus.WINNING  # Set initial status to winning
    )
    
    await db.bids.insert_one(bid.dict())
    
    # Update bid statuses
    await db.bids.update_many(
        {"auction_id": bid_data.auction_id, "id": {"$ne": bid.id}},
        {"$set": {"status": BidStatus.LOST}}
    )
    
    await db.bids.update_one(
        {"id": bid.id},
        {"$set": {"status": BidStatus.WINNING}}
    )
    
    # Broadcast bid update
    await manager.broadcast_to_auction(
        json.dumps({
            "type": "new_bid",
            "bid": {k: v.isoformat() if isinstance(v, datetime) else v for k, v in bid.dict().items()},
            "auction_id": bid_data.auction_id
        }),
        bid_data.auction_id
    )
    
    return bid

@api_router.get("/bids/{auction_id}", response_model=List[Bid])
async def get_auction_bids(auction_id: str, current_user: User = Depends(get_current_user)):
    bids = await db.bids.find({"auction_id": auction_id}).sort("price", 1).to_list(1000)
    return [Bid(**bid) for bid in bids]

@api_router.get("/my-bids", response_model=List[Bid])
async def get_my_bids(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.DEALER:
        raise HTTPException(status_code=403, detail="Only dealers can view their bids")
    
    bids = await db.bids.find({"dealer_id": current_user.id}).sort("created_at", -1).to_list(1000)
    return [Bid(**bid) for bid in bids]

# WebSocket endpoint
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    connection_id = str(uuid.uuid4())
    await manager.connect(websocket, user_id, connection_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "join_auction":
                await manager.send_personal_message(
                    json.dumps({"type": "joined_auction", "auction_id": message["auction_id"]}),
                    user_id
                )
            elif message.get("type") == "heartbeat":
                await manager.send_personal_message(
                    json.dumps({"type": "heartbeat_response"}),
                    user_id
                )
                
    except WebSocketDisconnect:
        manager.disconnect(user_id, connection_id)

# Dashboard routes
@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    total_users = await db.users.count_documents({})
    total_auctions = await db.car_requests.count_documents({})
    active_auctions = await db.car_requests.count_documents({"status": AuctionStatus.ACTIVE})
    total_bids = await db.bids.count_documents({})
    
    return {
        "total_users": total_users,
        "total_auctions": total_auctions,
        "active_auctions": active_auctions,
        "total_bids": total_bids
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()