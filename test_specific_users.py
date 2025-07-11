#!/usr/bin/env python3
"""
Test script for specific test users mentioned in the review request:
- Buyer: test@test.com / password: 123456
- Dealer: dealer@test.com / password: 123456  
- Admin: admin@autobidpro.com / password: admin123
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL')
API_URL = f"{BACKEND_URL}/api"

print(f"Testing specific users at: {API_URL}")

def test_specific_users():
    """Test the specific test users mentioned in the review request"""
    
    # Test users from the review request
    test_users = [
        {"email": "test@test.com", "password": "123456", "role": "buyer"},
        {"email": "dealer@test.com", "password": "123456", "role": "dealer"},
        {"email": "admin@autobidpro.com", "password": "admin123", "role": "admin"}
    ]
    
    tokens = {}
    user_data = {}
    
    print("\n=== Testing Authentication for Specific Test Users ===")
    
    for user in test_users:
        print(f"\nTesting login for {user['email']} ({user['role']})...")
        
        # Test login
        response = requests.post(
            f"{API_URL}/login",
            json={
                "email": user["email"],
                "password": user["password"]
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            tokens[user["role"]] = data["access_token"]
            print(f"✅ Login successful for {user['email']}")
            
            # Get user profile
            profile_response = requests.get(
                f"{API_URL}/me",
                headers={"Authorization": f"Bearer {data['access_token']}"}
            )
            
            if profile_response.status_code == 200:
                profile_data = profile_response.json()
                user_data[user["role"]] = profile_data
                print(f"✅ Profile retrieved for {user['email']}: {profile_data['name']} ({profile_data['role']})")
                
                if user["role"] == "dealer" and "dealer_tier" in profile_data:
                    print(f"   Dealer tier: {profile_data['dealer_tier']}")
            else:
                print(f"❌ Failed to get profile for {user['email']}: {profile_response.status_code}")
        else:
            print(f"❌ Login failed for {user['email']}: {response.status_code}")
            if response.status_code == 401:
                print("   This might be expected if the user doesn't exist yet")
    
    # Test role-based access control
    print("\n=== Testing Role-Based Access Control ===")
    
    if "buyer" in tokens:
        print("\nTesting buyer permissions...")
        
        # Test car request creation (should work)
        response = requests.post(
            f"{API_URL}/car-requests",
            headers={"Authorization": f"Bearer {tokens['buyer']}"},
            json={
                "title": "Looking for a reliable sedan",
                "make": "Honda",
                "model": "Accord",
                "year": 2021,
                "max_budget": 28000.00,
                "description": "Looking for a well-maintained sedan with good fuel economy",
                "location": "San Francisco",
                "preferred_color": "Silver",
                "transmission": "Automatic",
                "fuel_type": "Gasoline",
                "auction_duration": 24
            }
        )
        
        if response.status_code == 200:
            print("✅ Buyer can create car requests")
            car_request_id = response.json()["id"]
        else:
            print(f"❌ Buyer cannot create car requests: {response.status_code}")
            car_request_id = None
        
        # Test admin dashboard access (should fail)
        response = requests.get(
            f"{API_URL}/dashboard/stats",
            headers={"Authorization": f"Bearer {tokens['buyer']}"}
        )
        
        if response.status_code == 403:
            print("✅ Buyer correctly denied access to admin dashboard")
        else:
            print(f"❌ Buyer should not access admin dashboard: {response.status_code}")
    
    if "dealer" in tokens:
        print("\nTesting dealer permissions...")
        
        # Test car request creation (should fail)
        response = requests.post(
            f"{API_URL}/car-requests",
            headers={"Authorization": f"Bearer {tokens['dealer']}"},
            json={
                "title": "This should fail",
                "make": "Toyota",
                "model": "Camry",
                "year": 2022,
                "max_budget": 30000.00,
                "description": "This should not be allowed",
                "location": "Los Angeles",
                "auction_duration": 24
            }
        )
        
        if response.status_code == 403:
            print("✅ Dealer correctly denied car request creation")
        else:
            print(f"❌ Dealer should not create car requests: {response.status_code}")
        
        # Test viewing active car requests (should work)
        response = requests.get(
            f"{API_URL}/car-requests",
            headers={"Authorization": f"Bearer {tokens['dealer']}"}
        )
        
        if response.status_code == 200:
            print("✅ Dealer can view active car requests")
            requests_data = response.json()
            print(f"   Found {len(requests_data)} active car requests")
        else:
            print(f"❌ Dealer cannot view car requests: {response.status_code}")
        
        # Test bidding (if there's a car request available)
        if "buyer" in tokens and car_request_id:
            print("   Testing bidding functionality...")
            response = requests.post(
                f"{API_URL}/bids",
                headers={"Authorization": f"Bearer {tokens['dealer']}"},
                json={
                    "auction_id": car_request_id,
                    "price": 27500.00,
                    "message": "I can provide this vehicle with excellent condition"
                }
            )
            
            if response.status_code == 200:
                print("✅ Dealer can place bids")
                bid_data = response.json()
                print(f"   Bid placed: ${bid_data['price']} with status '{bid_data['status']}'")
            else:
                print(f"❌ Dealer cannot place bids: {response.status_code}")
                if response.status_code == 403:
                    print("   This might be due to license verification requirements")
    
    if "admin" in tokens:
        print("\nTesting admin permissions...")
        
        # Test admin dashboard access (should work)
        response = requests.get(
            f"{API_URL}/dashboard/stats",
            headers={"Authorization": f"Bearer {tokens['admin']}"}
        )
        
        if response.status_code == 200:
            print("✅ Admin can access dashboard")
            stats = response.json()
            print(f"   Dashboard stats: {stats['total_users']} users, {stats['total_auctions']} auctions, {stats['total_bids']} bids")
        else:
            print(f"❌ Admin cannot access dashboard: {response.status_code}")
        
        # Test user management (should work)
        response = requests.get(
            f"{API_URL}/admin/users",
            headers={"Authorization": f"Bearer {tokens['admin']}"}
        )
        
        if response.status_code == 200:
            print("✅ Admin can access user management")
            users = response.json()
            print(f"   Found {len(users)} users in the system")
        else:
            print(f"❌ Admin cannot access user management: {response.status_code}")
        
        # Test analytics endpoint
        response = requests.get(
            f"{API_URL}/admin/analytics",
            headers={"Authorization": f"Bearer {tokens['admin']}"}
        )
        
        if response.status_code == 200:
            print("✅ Admin can access analytics")
            analytics = response.json()
            print(f"   Analytics data includes: {list(analytics.keys())}")
        else:
            print(f"❌ Admin cannot access analytics: {response.status_code}")
    
    print("\n=== Test Summary ===")
    print(f"Successfully authenticated users: {list(tokens.keys())}")
    print("All role-based access control tests completed.")

if __name__ == "__main__":
    test_specific_users()