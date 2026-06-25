"""Third-party developer API metadata routes"""
from flask import Blueprint
from flask_jwt_extended import jwt_required

developer_api_bp = Blueprint("developer_api", __name__)


@developer_api_bp.route("", methods=["GET"])
@jwt_required()
def get_developer_api():
    api_endpoints = [
        {"path": "/api/marketplace", "method": "GET", "description": "List available marketplace listings."},
        {"path": "/api/marketplace", "method": "POST", "description": "Create a new marketplace listing."},
        {"path": "/api/partners", "method": "GET", "description": "Discover partner logistics, financing, and distribution services."},
        {"path": "/api/recommendations", "method": "GET", "description": "Get AI-driven recommendations for product bundling and promotions."},
        {"path": "/api/trust", "method": "GET", "description": "Fetch trust scoring metrics for marketplace businesses."},
        {"path": "/api/roles", "method": "GET", "description": "List available user roles."},
    ]
    return {"developer_api": api_endpoints}, 200
