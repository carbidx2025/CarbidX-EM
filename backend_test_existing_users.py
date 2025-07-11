import requests
import json
import time
import unittest
import os
from dotenv import load_dotenv
import logging
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv('/app/frontend/.env')
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL')
API_URL = f"{BACKEND_URL}/api"

print(f"Testing backend with existing users at: {API_URL}")

class TestCarBidXExistingUsers(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Test users as specified in the review request
        cls.buyer_email = "test@test.com"
        cls.buyer_password = "123456"
        cls.dealer_email = "dealer@test.com"
        cls.dealer_password = "123456"
        cls.admin_email = "admin@autobidpro.com"
        cls.admin_password = "admin123"
        
        # Store tokens and IDs
        cls.buyer_token = None
        cls.dealer_token = None
        cls.admin_token = None
        cls.buyer_id = None
        cls.dealer_id = None
        cls.admin_id = None
        cls.car_request_id = None
        cls.bid_id = None
        
    def test_01_login_existing_buyer(self):
        """Test login with existing buyer credentials"""
        response = requests.post(
            f"{API_URL}/login",
            json={
                "email": self.buyer_email,
                "password": self.buyer_password
            }
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.__class__.buyer_token = data["access_token"]
        
        # Get buyer details
        response = requests.get(
            f"{API_URL}/me",
            headers={"Authorization": f"Bearer {self.__class__.buyer_token}"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["email"], self.buyer_email)
        self.assertEqual(data["role"], "buyer")
        self.__class__.buyer_id = data["id"]
        print(f"✅ Buyer login successful: {data['name']} ({data['email']})")
        
    def test_02_login_existing_dealer(self):
        """Test login with existing dealer credentials"""
        response = requests.post(
            f"{API_URL}/login",
            json={
                "email": self.dealer_email,
                "password": self.dealer_password
            }
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.__class__.dealer_token = data["access_token"]
        
        # Get dealer details
        response = requests.get(
            f"{API_URL}/me",
            headers={"Authorization": f"Bearer {self.__class__.dealer_token}"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["email"], self.dealer_email)
        self.assertEqual(data["role"], "dealer")
        self.__class__.dealer_id = data["id"]
        print(f"✅ Dealer login successful: {data['name']} ({data['email']}) - Tier: {data.get('dealer_tier', 'N/A')}")
        
    def test_03_login_existing_admin(self):
        """Test login with existing admin credentials"""
        response = requests.post(
            f"{API_URL}/login",
            json={
                "email": self.admin_email,
                "password": self.admin_password
            }
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.__class__.admin_token = data["access_token"]
        
        # Get admin details
        response = requests.get(
            f"{API_URL}/me",
            headers={"Authorization": f"Bearer {self.__class__.admin_token}"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["email"], self.admin_email)
        self.assertEqual(data["role"], "admin")
        self.__class__.admin_id = data["id"]
        print(f"✅ Admin login successful: {data['name']} ({data['email']})")
        
    def test_04_buyer_create_car_request(self):
        """Test buyer creating a car request"""
        response = requests.post(
            f"{API_URL}/car-requests",
            headers={"Authorization": f"Bearer {self.__class__.buyer_token}"},
            json={
                "title": "Looking for a luxury sedan",
                "make": "BMW",
                "model": "3 Series",
                "year": 2023,
                "max_budget": 45000.00,
                "description": "Looking for a well-maintained luxury sedan with premium features",
                "location": "Miami, FL",
                "preferred_color": "Black",
                "transmission": "Automatic",
                "fuel_type": "Gasoline",
                "mileage_preference": "Under 20,000 miles",
                "auction_duration": 72
            }
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["buyer_id"], self.__class__.buyer_id)
        self.assertEqual(data["make"], "BMW")
        self.assertEqual(data["model"], "3 Series")
        self.assertEqual(data["status"], "active")
        self.__class__.car_request_id = data["id"]
        print(f"✅ Car request created successfully: {data['title']}")
        
    def test_05_dealer_place_bid(self):
        """Test dealer placing a bid"""
        response = requests.post(
            f"{API_URL}/bids",
            headers={"Authorization": f"Bearer {self.__class__.dealer_token}"},
            json={
                "auction_id": self.__class__.car_request_id,
                "price": 42000.00,
                "message": "I have a certified pre-owned BMW 3 Series that matches your requirements perfectly"
            }
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["auction_id"], self.__class__.car_request_id)
        self.assertEqual(data["dealer_id"], self.__class__.dealer_id)
        self.assertEqual(data["price"], 42000.00)
        self.assertEqual(data["status"], "winning")
        self.__class__.bid_id = data["id"]
        print(f"✅ Bid placed successfully: ${data['price']:,.2f}")
        
    def test_06_admin_user_management(self):
        """Test admin user management endpoints"""
        # Get all users
        response = requests.get(
            f"{API_URL}/admin/users",
            headers={"Authorization": f"Bearer {self.__class__.admin_token}"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) >= 3)  # At least our 3 test users
        print(f"✅ Admin can view all users: {len(data)} users found")
        
        # Verify non-admin cannot access
        response = requests.get(
            f"{API_URL}/admin/users",
            headers={"Authorization": f"Bearer {self.__class__.buyer_token}"}
        )
        self.assertEqual(response.status_code, 403)
        
    def test_07_admin_auction_management(self):
        """Test admin auction management endpoints"""
        # Get all auctions
        response = requests.get(
            f"{API_URL}/admin/auctions",
            headers={"Authorization": f"Bearer {self.__class__.admin_token}"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) >= 1)  # At least our test auction
        print(f"✅ Admin can view all auctions: {len(data)} auctions found")
        
        # Find our test auction
        test_auction = next((auction for auction in data if auction["id"] == self.__class__.car_request_id), None)
        self.assertIsNotNone(test_auction)
        self.assertIn("buyer", test_auction)
        self.assertIn("bid_count", test_auction)
        
        # Verify non-admin cannot access
        response = requests.get(
            f"{API_URL}/admin/auctions",
            headers={"Authorization": f"Bearer {self.__class__.dealer_token}"}
        )
        self.assertEqual(response.status_code, 403)
        
    def test_08_admin_bid_management(self):
        """Test admin bid management endpoints"""
        # Get all bids
        response = requests.get(
            f"{API_URL}/admin/bids",
            headers={"Authorization": f"Bearer {self.__class__.admin_token}"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) >= 1)  # At least our test bid
        print(f"✅ Admin can view all bids: {len(data)} bids found")
        
        # Find our test bid
        test_bid = next((bid for bid in data if bid["id"] == self.__class__.bid_id), None)
        self.assertIsNotNone(test_bid)
        self.assertIn("auction", test_bid)
        self.assertIn("dealer", test_bid)
        
        # Verify non-admin cannot access
        response = requests.get(
            f"{API_URL}/admin/bids",
            headers={"Authorization": f"Bearer {self.__class__.buyer_token}"}
        )
        self.assertEqual(response.status_code, 403)
        
    def test_09_admin_analytics(self):
        """Test admin analytics endpoint"""
        response = requests.get(
            f"{API_URL}/admin/analytics",
            headers={"Authorization": f"Bearer {self.__class__.admin_token}"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("daily_auctions", data)
        self.assertIn("daily_bids", data)
        self.assertIn("daily_registrations", data)
        self.assertIn("top_auctions", data)
        print(f"✅ Admin analytics working: {len(data['top_auctions'])} top auctions found")
        
        # Verify non-admin cannot access
        response = requests.get(
            f"{API_URL}/admin/analytics",
            headers={"Authorization": f"Bearer {self.__class__.dealer_token}"}
        )
        self.assertEqual(response.status_code, 403)
        
    def test_10_admin_system_health(self):
        """Test admin system health endpoint"""
        response = requests.get(
            f"{API_URL}/admin/system/health",
            headers={"Authorization": f"Bearer {self.__class__.admin_token}"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("database", data)
        self.assertIn("websocket_connections", data)
        self.assertIn("status", data)
        self.assertEqual(data["database"], "healthy")
        self.assertEqual(data["status"], "healthy")
        print(f"✅ System health check passed: Database {data['database']}, WebSocket connections: {data['websocket_connections']}")
        
        # Verify non-admin cannot access
        response = requests.get(
            f"{API_URL}/admin/system/health",
            headers={"Authorization": f"Bearer {self.__class__.buyer_token}"}
        )
        self.assertEqual(response.status_code, 403)
        
    def test_11_role_based_access_control(self):
        """Test role-based access control across all endpoints"""
        # Test buyer accessing dealer-only endpoints
        response = requests.get(
            f"{API_URL}/my-bids",
            headers={"Authorization": f"Bearer {self.__class__.buyer_token}"}
        )
        self.assertEqual(response.status_code, 403)
        
        # Test dealer creating car requests (should fail)
        response = requests.post(
            f"{API_URL}/car-requests",
            headers={"Authorization": f"Bearer {self.__class__.dealer_token}"},
            json={
                "title": "This should fail",
                "make": "Honda",
                "model": "Civic",
                "year": 2022,
                "max_budget": 25000.00,
                "description": "This request should not be allowed",
                "location": "Los Angeles",
                "auction_duration": 24
            }
        )
        self.assertEqual(response.status_code, 403)
        
        # Test dealer accessing admin endpoints
        response = requests.get(
            f"{API_URL}/dashboard/stats",
            headers={"Authorization": f"Bearer {self.__class__.dealer_token}"}
        )
        self.assertEqual(response.status_code, 403)
        
        print("✅ Role-based access control is working correctly")
        
    def test_12_profile_management(self):
        """Test profile update functionality"""
        # Test buyer profile update
        response = requests.put(
            f"{API_URL}/profile",
            headers={"Authorization": f"Bearer {self.__class__.buyer_token}"},
            json={
                "name": "Updated Buyer Name",
                "phone": "555-123-4567",
                "location": "Updated Location"
            }
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["name"], "Updated Buyer Name")
        self.assertEqual(data["phone"], "555-123-4567")
        print("✅ Buyer profile update successful")
        
        # Test dealer profile update
        response = requests.put(
            f"{API_URL}/profile",
            headers={"Authorization": f"Bearer {self.__class__.dealer_token}"},
            json={
                "name": "Updated Dealer Name",
                "phone": "555-987-6543"
            }
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["name"], "Updated Dealer Name")
        self.assertEqual(data["phone"], "555-987-6543")
        print("✅ Dealer profile update successful")

if __name__ == "__main__":
    unittest.main(verbosity=2)