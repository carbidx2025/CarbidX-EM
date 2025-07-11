import requests
import json
import time
import unittest
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL')
API_URL = f"{BACKEND_URL}/api"

print(f"Running comprehensive backend API validation at: {API_URL}")

class TestCarBidXComprehensive(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Use existing test users
        cls.buyer_email = "test@test.com"
        cls.buyer_password = "123456"
        cls.dealer_email = "dealer@test.com"
        cls.dealer_password = "123456"
        cls.admin_email = "admin@autobidpro.com"
        cls.admin_password = "admin123"
        
        # Login all users
        cls.buyer_token = cls.login_user(cls.buyer_email, cls.buyer_password)
        cls.dealer_token = cls.login_user(cls.dealer_email, cls.dealer_password)
        cls.admin_token = cls.login_user(cls.admin_email, cls.admin_password)
        
    @classmethod
    def login_user(cls, email, password):
        response = requests.post(f"{API_URL}/login", json={"email": email, "password": password})
        if response.status_code == 200:
            return response.json()["access_token"]
        return None
        
    def test_01_all_authentication_endpoints(self):
        """Test all authentication endpoints"""
        endpoints_tested = []
        
        # Test /api/me for all users
        for role, token in [("buyer", self.buyer_token), ("dealer", self.dealer_token), ("admin", self.admin_token)]:
            response = requests.get(f"{API_URL}/me", headers={"Authorization": f"Bearer {token}"})
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertEqual(data["role"], role)
            endpoints_tested.append(f"/api/me ({role})")
            
        print(f"✅ Authentication endpoints working: {', '.join(endpoints_tested)}")
        
    def test_02_car_request_management_endpoints(self):
        """Test all car request management endpoints"""
        endpoints_tested = []
        
        # Create car request as buyer
        response = requests.post(
            f"{API_URL}/car-requests",
            headers={"Authorization": f"Bearer {self.buyer_token}"},
            json={
                "title": "Test comprehensive car request",
                "make": "Tesla",
                "model": "Model 3",
                "year": 2024,
                "max_budget": 50000.00,
                "description": "Looking for a Tesla Model 3 with autopilot",
                "location": "San Francisco, CA",
                "auction_duration": 24
            }
        )
        self.assertEqual(response.status_code, 200)
        car_request_id = response.json()["id"]
        endpoints_tested.append("POST /api/car-requests")
        
        # Get car requests as buyer
        response = requests.get(f"{API_URL}/car-requests", headers={"Authorization": f"Bearer {self.buyer_token}"})
        self.assertEqual(response.status_code, 200)
        endpoints_tested.append("GET /api/car-requests (buyer)")
        
        # Get car requests as dealer
        response = requests.get(f"{API_URL}/car-requests", headers={"Authorization": f"Bearer {self.dealer_token}"})
        self.assertEqual(response.status_code, 200)
        endpoints_tested.append("GET /api/car-requests (dealer)")
        
        # Get specific car request
        response = requests.get(f"{API_URL}/car-requests/{car_request_id}", headers={"Authorization": f"Bearer {self.buyer_token}"})
        self.assertEqual(response.status_code, 200)
        endpoints_tested.append("GET /api/car-requests/{id}")
        
        print(f"✅ Car request endpoints working: {', '.join(endpoints_tested)}")
        return car_request_id
        
    def test_03_bidding_system_endpoints(self):
        """Test all bidding system endpoints"""
        # First create a car request
        car_request_id = self.test_02_car_request_management_endpoints()
        endpoints_tested = []
        
        # Place bid as dealer
        response = requests.post(
            f"{API_URL}/bids",
            headers={"Authorization": f"Bearer {self.dealer_token}"},
            json={
                "auction_id": car_request_id,
                "price": 48000.00,
                "message": "I have the perfect Tesla Model 3 for you"
            }
        )
        self.assertEqual(response.status_code, 200)
        bid_id = response.json()["id"]
        endpoints_tested.append("POST /api/bids")
        
        # Get auction bids
        response = requests.get(f"{API_URL}/bids/{car_request_id}", headers={"Authorization": f"Bearer {self.buyer_token}"})
        self.assertEqual(response.status_code, 200)
        endpoints_tested.append("GET /api/bids/{auction_id}")
        
        # Get dealer's bids
        response = requests.get(f"{API_URL}/my-bids", headers={"Authorization": f"Bearer {self.dealer_token}"})
        self.assertEqual(response.status_code, 200)
        endpoints_tested.append("GET /api/my-bids")
        
        print(f"✅ Bidding endpoints working: {', '.join(endpoints_tested)}")
        
    def test_04_admin_dashboard_endpoints(self):
        """Test all admin dashboard endpoints"""
        endpoints_tested = []
        
        # Dashboard stats
        response = requests.get(f"{API_URL}/dashboard/stats", headers={"Authorization": f"Bearer {self.admin_token}"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("total_users", data)
        self.assertIn("total_auctions", data)
        endpoints_tested.append("GET /api/dashboard/stats")
        
        print(f"✅ Admin dashboard endpoints working: {', '.join(endpoints_tested)}")
        
    def test_05_admin_management_endpoints(self):
        """Test all admin management endpoints"""
        endpoints_tested = []
        
        # User management
        response = requests.get(f"{API_URL}/admin/users", headers={"Authorization": f"Bearer {self.admin_token}"})
        self.assertEqual(response.status_code, 200)
        endpoints_tested.append("GET /api/admin/users")
        
        # Auction management
        response = requests.get(f"{API_URL}/admin/auctions", headers={"Authorization": f"Bearer {self.admin_token}"})
        self.assertEqual(response.status_code, 200)
        endpoints_tested.append("GET /api/admin/auctions")
        
        # Bid management
        response = requests.get(f"{API_URL}/admin/bids", headers={"Authorization": f"Bearer {self.admin_token}"})
        self.assertEqual(response.status_code, 200)
        endpoints_tested.append("GET /api/admin/bids")
        
        # Analytics
        response = requests.get(f"{API_URL}/admin/analytics", headers={"Authorization": f"Bearer {self.admin_token}"})
        self.assertEqual(response.status_code, 200)
        endpoints_tested.append("GET /api/admin/analytics")
        
        # System health
        response = requests.get(f"{API_URL}/admin/system/health", headers={"Authorization": f"Bearer {self.admin_token}"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        endpoints_tested.append("GET /api/admin/system/health")
        
        print(f"✅ Admin management endpoints working: {', '.join(endpoints_tested)}")
        
    def test_06_role_based_access_validation(self):
        """Validate role-based access control across all endpoints"""
        access_tests = []
        
        # Test buyer cannot access dealer endpoints
        response = requests.get(f"{API_URL}/my-bids", headers={"Authorization": f"Bearer {self.buyer_token}"})
        self.assertEqual(response.status_code, 403)
        access_tests.append("Buyer blocked from dealer endpoints ✓")
        
        # Test dealer cannot access admin endpoints
        response = requests.get(f"{API_URL}/admin/users", headers={"Authorization": f"Bearer {self.dealer_token}"})
        self.assertEqual(response.status_code, 403)
        access_tests.append("Dealer blocked from admin endpoints ✓")
        
        # Test buyer cannot access admin endpoints
        response = requests.get(f"{API_URL}/dashboard/stats", headers={"Authorization": f"Bearer {self.buyer_token}"})
        self.assertEqual(response.status_code, 403)
        access_tests.append("Buyer blocked from admin endpoints ✓")
        
        print(f"✅ Role-based access control: {', '.join(access_tests)}")
        
    def test_07_data_serialization_validation(self):
        """Test that all endpoints return properly serialized JSON data"""
        serialization_tests = []
        
        # Test admin analytics (complex data with dates)
        response = requests.get(f"{API_URL}/admin/analytics", headers={"Authorization": f"Bearer {self.admin_token}"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        # Verify it's valid JSON and contains expected structure
        self.assertIsInstance(data, dict)
        self.assertIn("daily_auctions", data)
        serialization_tests.append("Admin analytics JSON serialization ✓")
        
        # Test admin auctions (contains ObjectId fields)
        response = requests.get(f"{API_URL}/admin/auctions", headers={"Authorization": f"Bearer {self.admin_token}"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        serialization_tests.append("Admin auctions JSON serialization ✓")
        
        # Test admin bids (contains nested objects)
        response = requests.get(f"{API_URL}/admin/bids", headers={"Authorization": f"Bearer {self.admin_token}"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        serialization_tests.append("Admin bids JSON serialization ✓")
        
        print(f"✅ Data serialization: {', '.join(serialization_tests)}")

if __name__ == "__main__":
    unittest.main(verbosity=2)