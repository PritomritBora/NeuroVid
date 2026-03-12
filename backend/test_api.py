"""
Simple API test script
Run: python test_api.py
"""

import requests
import sys

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False

def test_root():
    """Test root endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Root endpoint: {data['message']}")
            return True
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
        return False

def main():
    print("🧪 Testing AI Video Intelligence API\n")
    
    tests = [
        ("Health Check", test_health),
        ("Root Endpoint", test_root),
    ]
    
    passed = 0
    failed = 0
    
    for name, test_func in tests:
        print(f"\nTesting: {name}")
        if test_func():
            passed += 1
        else:
            failed += 1
    
    print(f"\n{'='*50}")
    print(f"Results: {passed} passed, {failed} failed")
    print(f"{'='*50}\n")
    
    if failed > 0:
        print("⚠️  Some tests failed. Make sure the backend is running:")
        print("   cd backend && python main.py")
        sys.exit(1)
    else:
        print("🎉 All tests passed! Backend is ready.")
        print(f"\n📚 API Documentation: {BASE_URL}/docs")
        sys.exit(0)

if __name__ == "__main__":
    main()
