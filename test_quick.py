"""Quick API endpoint testing script - skip AI endpoints"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5000/api"
TEST_EMAIL = "test_" + str(int(datetime.now().timestamp())) + "@test.com"
TEST_PASSWORD = "Test123!"
TEST_NAME = "Test User"

access_token = None
results = {"passed": 0, "failed": 0, "skipped": 0}

def test(method, endpoint, data=None, auth=True, skip_ai=False):
    """Test an endpoint"""
    global access_token, results
    
    if skip_ai and "/ai/" in endpoint:
        print(f"SKIP {method} {endpoint}")
        results["skipped"] += 1
        return None
    
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if auth and access_token:
        headers["Authorization"] = f"Bearer {access_token}"
    
    try:
        if method == "GET":
            resp = requests.get(url, headers=headers, timeout=5)
        elif method == "POST":
            resp = requests.post(url, json=data, headers=headers, timeout=5)
        elif method == "PUT":
            resp = requests.put(url, json=data, headers=headers, timeout=5)
        else:
            resp = requests.delete(url, headers=headers, timeout=5)
        
        if resp.status_code in [200, 201, 204]:
            print(f"OK   {method} {endpoint} [{resp.status_code}]")
            results["passed"] += 1
            return resp.json() if resp.text else None
        else:
            print(f"FAIL {method} {endpoint} [{resp.status_code}]")
            results["failed"] += 1
            return None
    except Exception as e:
        print(f"ERR  {method} {endpoint} - {str(e)[:50]}")
        results["failed"] += 1
        return None

print("\n=== TOKBIZ API TEST SUITE ===\n")

# Auth
print("[Auth]")
r = test("POST", "/auth/register", {"email": TEST_EMAIL, "password": TEST_PASSWORD, "name": TEST_NAME}, auth=False)
if r:
    access_token = r.get("access_token")
    print(f"      Token: {access_token[:30]}...")

test("POST", "/auth/login", {"email": TEST_EMAIL, "password": TEST_PASSWORD}, auth=False)

# Business
print("\n[Business]")
r = test("POST", "/businesses", {"name": "Test Biz", "registration_number": "TB001", "industry": "Tech", "country": "SL"})
bid = r.get("id") if r else 1
test("GET", "/businesses")
test("GET", f"/businesses/{bid}")

# Products
print("\n[Products]")
r = test("POST", "/products", {"name": "Widget", "price": 50.0, "quantity": 10, "business_id": bid, "sku": "W001"})
pid = r.get("id") if r else 1
test("GET", "/products")
test("PUT", f"/products/{pid}", {"price": 60.0})

# Sales
print("\n[Sales]")
r = test("POST", "/sales", {"business_id": bid, "customer_name": "John", "total_amount": 100, "items": [{"product_id": pid, "quantity": 2, "price": 50}]})
sid = r.get("id") if r else 1
test("GET", "/sales")

# Debtors
print("\n[Debtors]")
r = test("POST", "/debtors", {"business_id": bid, "customer_name": "Jane", "amount_owed": 200, "status": "Outstanding"})
did = r.get("id") if r else 1
test("GET", "/debtors")

# Analytics
print("\n[Analytics]")
test("GET", "/analytics/summary")
test("GET", "/analytics/sales-trends")
test("GET", "/analytics/top-products")
test("GET", "/analytics/debt-summary")
test("GET", "/analytics/inventory-status")

# AI (skip - Ollama may not be running)
print("\n[AI] (skipped - Ollama not required)")
results["skipped"] += 4

# Suppliers
print("\n[Suppliers]")
test("POST", "/suppliers", {"business_id": bid, "name": "Supplier Co", "contact_person": "Bob"})
test("GET", "/suppliers")

# Expenses
print("\n[Expenses]")
test("POST", "/expenses", {"business_id": bid, "category": "Office", "amount": 75.00})
test("GET", "/expenses")

# Payments
print("\n[Payments]")
test("POST", "/payments", {"business_id": bid, "debtor_id": did, "amount": 100, "payment_method": "Cash"})
test("GET", "/payments")

# Invoices
print("\n[Invoices]")
test("POST", "/invoices", {"business_id": bid, "sale_id": sid, "invoice_number": "INV001", "amount_due": 100})
test("GET", "/invoices")

# Notifications
print("\n[Notifications]")
test("GET", "/notifications")

# Exchange Rates
print("\n[Exchange Rates]")
test("POST", "/exchange-rates", {"from_currency": "USD", "to_currency": "SLL", "rate": 21000})
test("GET", "/exchange-rates")

# Payment Channels
print("\n[Payment Channels]")
test("GET", "/payment-channels")

# Recurring
print("\n[Recurring Expenses]")
test("POST", "/recurring-expenses", {"business_id": bid, "name": "Rent", "amount": 2000, "frequency": "monthly"})
test("GET", "/recurring-expenses")

# Roles
print("\n[Roles]")
test("GET", "/roles")

# Marketplace
print("\n[Marketplace]")
test("POST", "/marketplace", {"business_id": bid, "title": "Widget Pro", "description": "Quality widget", "price": 99.99})
test("GET", "/marketplace")

# Partners
print("\n[Partners]")
test("GET", "/partners")

# Recommendations
print("\n[Recommendations]")
test("GET", "/recommendations")

# Trust
print("\n[Trust]")
test("GET", "/trust")

# Developer API
print("\n[Developer API]")
test("GET", "/developer-api")

print(f"\n=== RESULTS ===")
print(f"Passed:  {results['passed']}")
print(f"Failed:  {results['failed']}")
print(f"Skipped: {results['skipped']}")
total = results['passed'] + results['failed']
pct = (results['passed'] / total * 100) if total > 0 else 0
print(f"Success Rate: {pct:.1f}%\n")
