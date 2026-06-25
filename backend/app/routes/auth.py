"""Authentication routes"""
from datetime import timedelta

from flask import Blueprint, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)

from app import db
from app.models import User

auth_bp = Blueprint("auth", __name__)


def make_tokens(user_id):
    # Ensure identity is a string
    identity = str(user_id)
    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)
    return access_token, refresh_token


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user"""
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return {"message": "Name, email, and password are required."}, 400

    if User.query.filter_by(email=email).first():
        return {"message": "Email already registered."}, 409

    user = User(name=name.strip(), email=email.strip().lower())
    user.password = password
    db.session.add(user)
    db.session.commit()

    access_token, refresh_token = make_tokens(user.id)

    return {
        "message": "User registered successfully.",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict(),
    }, 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Login user"""
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"message": "Email and password are required."}, 400

    user = User.query.filter_by(email=email.strip().lower()).first()
    if not user or not user.check_password(password):
        return {"message": "Invalid credentials."}, 401

    access_token, refresh_token = make_tokens(user.id)

    return {
        "message": "Login successful.",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict(),
    }, 200


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Refresh JWT token"""
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=str(user_id))
    return {"message": "Token refreshed.", "access_token": access_token}, 200
