def test_register(client):
    response = client.post("/api/auth/register", json={
        "name": "New User",
        "email": "new@example.com",
        "password": "password123"
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "User registered successfully."
    assert "access_token" in data
    assert data["user"]["email"] == "new@example.com"

def test_login(client):
    # First register
    client.post("/api/auth/register", json={
        "name": "Login User",
        "email": "login@example.com",
        "password": "password123"
    })

    # Then login
    response = client.post("/api/auth/login", json={
        "email": "login@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Login successful."
    assert "access_token" in data

def test_login_invalid_credentials(client):
    response = client.post("/api/auth/login", json={
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert response.get_json()["message"] == "Invalid credentials."
