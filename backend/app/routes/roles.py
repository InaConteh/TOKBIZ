"""Role and permission management routes"""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from app import db
from app.models import Role, Permission

roles_bp = Blueprint("roles", __name__)


@roles_bp.route("", methods=["GET"])
@jwt_required()
def get_roles():
    roles = Role.query.all()
    return {"roles": [role.to_dict() for role in roles]}, 200


@roles_bp.route("/permissions", methods=["GET"])
@jwt_required()
def get_permissions():
    permissions = Permission.query.all()
    return {"permissions": [permission.to_dict() for permission in permissions]}, 200
