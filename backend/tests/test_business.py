def test_create_business(client, auth_header):
    response = client.post("/api/businesses", json={
        "name": "Test Business",
        "category": "Retail",
        "location": "Test City"
    }, headers=auth_header)
    assert response.status_code == 201
    data = response.get_json()
    assert data["business"]["name"] == "Test Business"

def test_get_businesses(client, auth_header):
    # Create one first
    client.post("/api/businesses", json={
        "name": "Business 1"
    }, headers=auth_header)

    response = client.get("/api/businesses", headers=auth_header)
    assert response.status_code == 200
    data = response.get_json()
    assert len(data["businesses"]) >= 1
    assert any(b["name"] == "Business 1" for b in data["businesses"])
