"""Authentication routes"""
from flask import Blueprint

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user"""
    return {"message": "Register endpoint - to be implemented"}, 501

@auth_bp.route("/login", methods=["POST"])
def login():
    """Login user"""
    return {"message": "Login endpoint - to be implemented"}, 501

@auth_bp.route("/refresh", methods=["POST"])
def refresh():
    """Refresh JWT token"""
    return {"message": "Refresh endpoint - to be implemented"}, 501
