"""Comprehensive API endpoint testing script"""
import requests
import json
import sys
from datetime import datetime

BASE_URL = "http://localhost:5000/api"
TEST_EMAIL = "test_user_" + str(int(datetime.now().timestamp())) + "@test.com"
TEST_PASSWORD = "TestPassword123!"
TEST_USER_NAME = "Test User"

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

# Store token for authenticated requests
access_token = None

def print_header(text):
    print(f"\n{BLUE}{'='*60}")
    print(f"{text}")
    print(f"{'='*60}{RESET}\n")

def print_success(text):
    print(f"{GREEN}OK {text}{RESET}")

def print_error(text):
    print(f"{RED}FAIL {text}{RESET}")

def print_warning(text):
    print(f"{YELLOW}WARN {text}{RESET}")

def print_info(text):
    print(f"{BLUE}-> {text}{RESET}")

def test_endpoint(method, endpoint, data=None, authenticated=True, name=None):
    """Test an API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    
    if authenticated and access_token:
        headers["Authorization"] = f"Bearer {access_token}"
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=10)
        elif method == "PUT":
            response = requests.put(url, json=data, headers=headers, timeout=10)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers, timeout=10)
        else:
            print_error(f"Unknown method: {method}")
            return None
        
        status = response.status_code
        test_name = name or f"{method} {endpoint}"
        
        if status in [200, 201, 204]:
            print_success(f"{test_name} - Status {status}")
            try:
                return response.json()
            except:
                return response.text
        else:
            print_error(f"{test_name} - Status {status}")
            try:
                print(f"  Response: {response.json()}")
            except:
                print(f"  Response: {response.text}")
            return None
    except requests.exceptions.ConnectionError:
        print_error(f"{name or endpoint} - Connection refused (is backend running?)")
        return None
    except Exception as e:
        print_error(f"{name or endpoint} - {str(e)}")
        return None

print_header("TOKBIZ API ENDPOINT TEST SUITE")
print_info(f"Base URL: {BASE_URL}")
print_info(f"Test User Email: {TEST_EMAIL}")

# ============================================================================
# AUTH ENDPOINTS
# ============================================================================
print_header("PHASE 1: AUTHENTICATION ENDPOINTS")

# Register
print_info("Testing User Registration...")
register_response = test_endpoint("POST", "/auth/register", {
    "name": TEST_USER_NAME,
    "email": TEST_EMAIL,
    "password": TEST_PASSWORD
}, authenticated=False, name="POST /auth/register")

if register_response:
    access_token = register_response.get("access_token")
    if access_token:
        print_success(f"Token obtained: {access_token[:50]}...")
    else:
        print_warning("No access token in response")

# Login
print_info("Testing User Login...")
login_response = test_endpoint("POST", "/auth/login", {
    "email": TEST_EMAIL,
    "password": TEST_PASSWORD
}, authenticated=False, name="POST /auth/login")

if login_response and login_response.get("access_token"):
    access_token = login_response.get("access_token")
    print_success(f"Login successful, token updated")

# Refresh
print_info("Testing Token Refresh...")
test_endpoint("POST", "/auth/refresh", {}, authenticated=True, name="POST /auth/refresh")

# ============================================================================
# BUSINESS ENDPOINTS (Phase 2)
# ============================================================================
print_header("PHASE 2: BUSINESS ENDPOINTS")

# Create Business
print_info("Creating test business...")
business_response = test_endpoint("POST", "/businesses", {
    "name": "Test Business Ltd",
    "registration_number": "TBL001",
    "industry": "Retail",
    "country": "Sierra Leone"
}, authenticated=True, name="POST /businesses")

business_id = None
if business_response:
    business_id = business_response.get("id")

# Get Businesses
test_endpoint("GET", "/businesses", authenticated=True, name="GET /businesses")

# Get Single Business
if business_id:
    test_endpoint("GET", f"/businesses/{business_id}", authenticated=True, name=f"GET /businesses/{business_id}")

# Update Business
if business_id:
    test_endpoint("PUT", f"/businesses/{business_id}", {
        "name": "Updated Test Business"
    }, authenticated=True, name=f"PUT /businesses/{business_id}")

# ============================================================================
# PRODUCT ENDPOINTS (Phase 2)
# ============================================================================
print_header("PHASE 2: PRODUCT ENDPOINTS")

# Create Product
print_info("Creating test product...")
product_response = test_endpoint("POST", "/products", {
    "name": "Test Product",
    "description": "A test product",
    "price": 99.99,
    "quantity": 50,
    "business_id": business_id or 1,
    "sku": "TEST001"
}, authenticated=True, name="POST /products")

product_id = None
if product_response:
    product_id = product_response.get("id")

# Get Products
test_endpoint("GET", "/products", authenticated=True, name="GET /products")

# Get Single Product
if product_id:
    test_endpoint("GET", f"/products/{product_id}", authenticated=True, name=f"GET /products/{product_id}")

# Update Product
if product_id:
    test_endpoint("PUT", f"/products/{product_id}", {
        "price": 129.99,
        "quantity": 45
    }, authenticated=True, name=f"PUT /products/{product_id}")

# ============================================================================
# SALES ENDPOINTS (Phase 2)
# ============================================================================
print_header("PHASE 2: SALES ENDPOINTS")

# Create Sale
print_info("Creating test sale...")
sale_response = test_endpoint("POST", "/sales", {
    "business_id": business_id or 1,
    "customer_name": "Test Customer",
    "total_amount": 299.97,
    "items": [
        {"product_id": product_id or 1, "quantity": 3, "price": 99.99}
    ]
}, authenticated=True, name="POST /sales")

sale_id = None
if sale_response:
    sale_id = sale_response.get("id")

# Get Sales
test_endpoint("GET", "/sales", authenticated=True, name="GET /sales")

# Get Single Sale
if sale_id:
    test_endpoint("GET", f"/sales/{sale_id}", authenticated=True, name=f"GET /sales/{sale_id}")

# ============================================================================
# DEBTOR ENDPOINTS (Phase 2)
# ============================================================================
print_header("PHASE 2: DEBTOR ENDPOINTS")

# Create Debtor
print_info("Creating test debtor...")
debtor_response = test_endpoint("POST", "/debtors", {
    "business_id": business_id or 1,
    "customer_name": "Debtor Customer",
    "amount_owed": 500.00,
    "due_date": "2026-07-25",
    "status": "Outstanding"
}, authenticated=True, name="POST /debtors")

debtor_id = None
if debtor_response:
    debtor_id = debtor_response.get("id")

# Get Debtors
test_endpoint("GET", "/debtors", authenticated=True, name="GET /debtors")

# Get Single Debtor
if debtor_id:
    test_endpoint("GET", f"/debtors/{debtor_id}", authenticated=True, name=f"GET /debtors/{debtor_id}")

# Update Debtor
if debtor_id:
    test_endpoint("PUT", f"/debtors/{debtor_id}", {
        "status": "Paid"
    }, authenticated=True, name=f"PUT /debtors/{debtor_id}")

# ============================================================================
# ANALYTICS ENDPOINTS (Phase 2)
# ============================================================================
print_header("PHASE 2: ANALYTICS ENDPOINTS")

test_endpoint("GET", "/analytics/summary", authenticated=True, name="GET /analytics/summary")
test_endpoint("GET", "/analytics/sales-trends", authenticated=True, name="GET /analytics/sales-trends")
test_endpoint("GET", "/analytics/top-products", authenticated=True, name="GET /analytics/top-products")
test_endpoint("GET", "/analytics/debt-summary", authenticated=True, name="GET /analytics/debt-summary")
test_endpoint("GET", "/analytics/inventory-status", authenticated=True, name="GET /analytics/inventory-status")

# ============================================================================
# AI ENDPOINTS (Phase 2)
# ============================================================================
print_header("PHASE 2: AI ENDPOINTS")

test_endpoint("POST", "/ai/sales-insights", {}, authenticated=True, name="POST /ai/sales-insights")
test_endpoint("POST", "/ai/debt-risks", {}, authenticated=True, name="POST /ai/debt-risks")
test_endpoint("POST", "/ai/inventory-forecast", {}, authenticated=True, name="POST /ai/inventory-forecast")
test_endpoint("POST", "/ai/health-score", {}, authenticated=True, name="POST /ai/health-score")

# ============================================================================
# SUPPLIER ENDPOINTS (Phase 3)
# ============================================================================
print_header("PHASE 3: SUPPLIER ENDPOINTS")

# Create Supplier
print_info("Creating test supplier...")
supplier_response = test_endpoint("POST", "/suppliers", {
    "business_id": business_id or 1,
    "name": "Test Supplier Inc",
    "contact_person": "John Supplier",
    "phone": "+232-XXX-XXXX",
    "email": "supplier@test.com"
}, authenticated=True, name="POST /suppliers")

supplier_id = None
if supplier_response:
    supplier_id = supplier_response.get("id")

test_endpoint("GET", "/suppliers", authenticated=True, name="GET /suppliers")

if supplier_id:
    test_endpoint("GET", f"/suppliers/{supplier_id}", authenticated=True, name=f"GET /suppliers/{supplier_id}")

# ============================================================================
# EXPENSE ENDPOINTS (Phase 3)
# ============================================================================
print_header("PHASE 3: EXPENSE ENDPOINTS")

test_endpoint("POST", "/expenses", {
    "business_id": business_id or 1,
    "category": "Office Supplies",
    "amount": 150.00,
    "description": "Monthly office supplies"
}, authenticated=True, name="POST /expenses")

test_endpoint("GET", "/expenses", authenticated=True, name="GET /expenses")

# ============================================================================
# PAYMENT ENDPOINTS (Phase 4)
# ============================================================================
print_header("PHASE 4: PAYMENT ENDPOINTS")

test_endpoint("POST", "/payments", {
    "business_id": business_id or 1,
    "debtor_id": debtor_id or 1,
    "amount": 250.00,
    "payment_method": "Cash"
}, authenticated=True, name="POST /payments")

test_endpoint("GET", "/payments", authenticated=True, name="GET /payments")

# ============================================================================
# INVOICE ENDPOINTS (Phase 4)
# ============================================================================
print_header("PHASE 4: INVOICE ENDPOINTS")

test_endpoint("POST", "/invoices", {
    "business_id": business_id or 1,
    "sale_id": sale_id or 1,
    "invoice_number": "INV001",
    "amount_due": 299.97
}, authenticated=True, name="POST /invoices")

test_endpoint("GET", "/invoices", authenticated=True, name="GET /invoices")

# ============================================================================
# NOTIFICATION ENDPOINTS (Phase 4)
# ============================================================================
print_header("PHASE 4: NOTIFICATION ENDPOINTS")

test_endpoint("GET", "/notifications", authenticated=True, name="GET /notifications")

# ============================================================================
# EXCHANGE RATE ENDPOINTS (Phase 5)
# ============================================================================
print_header("PHASE 5: EXCHANGE RATE ENDPOINTS")

test_endpoint("POST", "/exchange-rates", {
    "from_currency": "USD",
    "to_currency": "SLL",
    "rate": 21000.00
}, authenticated=True, name="POST /exchange-rates")

test_endpoint("GET", "/exchange-rates", authenticated=True, name="GET /exchange-rates")

# ============================================================================
# PAYMENT CHANNEL ENDPOINTS (Phase 5)
# ============================================================================
print_header("PHASE 5: PAYMENT CHANNEL ENDPOINTS")

test_endpoint("POST", "/payment-channels", {
    "business_id": business_id or 1,
    "channel_name": "Mobile Money",
    "channel_type": "Mobile",
    "account_number": "888123456"
}, authenticated=True, name="POST /payment-channels")

test_endpoint("GET", "/payment-channels", authenticated=True, name="GET /payment-channels")

# ============================================================================
# RECURRING EXPENSE ENDPOINTS (Phase 5)
# ============================================================================
print_header("PHASE 5: RECURRING EXPENSE ENDPOINTS")

test_endpoint("POST", "/recurring-expenses", {
    "business_id": business_id or 1,
    "name": "Monthly Rent",
    "amount": 5000.00,
    "frequency": "monthly",
    "start_date": "2026-06-25"
}, authenticated=True, name="POST /recurring-expenses")

test_endpoint("GET", "/recurring-expenses", authenticated=True, name="GET /recurring-expenses")

# ============================================================================
# ROLE & PERMISSION ENDPOINTS (Phase 5)
# ============================================================================
print_header("PHASE 5: ROLE & PERMISSION ENDPOINTS")

test_endpoint("POST", "/roles", {
    "business_id": business_id or 1,
    "name": "Manager",
    "description": "Business Manager"
}, authenticated=True, name="POST /roles")

test_endpoint("GET", "/roles", authenticated=True, name="GET /roles")

test_endpoint("POST", "/roles/permissions", {
    "role_id": 1,
    "permission": "view_analytics"
}, authenticated=True, name="POST /roles/permissions")

test_endpoint("GET", "/roles/permissions", authenticated=True, name="GET /roles/permissions")

# ============================================================================
# MARKETPLACE ENDPOINTS (Phase 7)
# ============================================================================
print_header("PHASE 7: MARKETPLACE ENDPOINTS")

test_endpoint("POST", "/marketplace", {
    "business_id": business_id or 1,
    "title": "Premium Widget",
    "description": "High quality widget for resale",
    "price": 499.99,
    "category": "Electronics"
}, authenticated=True, name="POST /marketplace")

test_endpoint("GET", "/marketplace", authenticated=True, name="GET /marketplace")

# ============================================================================
# PARTNER ENDPOINTS (Phase 7)
# ============================================================================
print_header("PHASE 7: PARTNER ENDPOINTS")

test_endpoint("GET", "/partners", authenticated=True, name="GET /partners")
test_endpoint("POST", "/partners", {
    "business_id": business_id or 1,
    "partner_name": "Tech Partner Co"
}, authenticated=True, name="POST /partners")

# ============================================================================
# RECOMMENDATIONS ENDPOINTS (Phase 7)
# ============================================================================
print_header("PHASE 7: RECOMMENDATIONS ENDPOINTS")

test_endpoint("GET", "/recommendations", authenticated=True, name="GET /recommendations")

# ============================================================================
# TRUST ENDPOINTS (Phase 7)
# ============================================================================
print_header("PHASE 7: TRUST ENDPOINTS")

test_endpoint("GET", "/trust", authenticated=True, name="GET /trust")

# ============================================================================
# DEVELOPER API ENDPOINTS (Phase 7)
# ============================================================================
print_header("PHASE 7: DEVELOPER API ENDPOINTS")

test_endpoint("GET", "/developer-api", authenticated=True, name="GET /developer-api")

print_header("TEST SUITE COMPLETE")
print_info("All available endpoints have been tested.")
print_info("Review the results above to see which endpoints are working.")
