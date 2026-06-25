import pytest
from app import create_app, db

@pytest.fixture
def app():
    app = create_app("testing")
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_header(client):
    """Provide a valid auth header for tests"""
    # Register and login a test user
    client.post("/api/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    })
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    data = response.get_json()
    token = data["access_token"]
    return {"Authorization": f"Bearer {token}"}
