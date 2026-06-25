"""Business management routes"""
from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db
from app.models import Business

business_bp = Blueprint("business", __name__)


@business_bp.route("", methods=["GET", "POST"])
@jwt_required()
def manage_businesses():
    """List and create businesses"""
    user_id = int(get_jwt_identity())

    if request.method == "POST":
        payload = request.get_json() or {}
        name = payload.get("name")
        category = payload.get("category")
        location = payload.get("location")

        if not name:
            return {"message": "Business name is required."}, 400

        business = Business(
            owner_id=user_id,
            name=name.strip(),
            category=category,
            location=location,
        )
        db.session.add(business)
        db.session.commit()

        return {"message": "Business created.", "business": business.to_dict()}, 201

    businesses = Business.query.filter_by(owner_id=user_id).all()
    return {"businesses": [business.to_dict() for business in businesses]}, 200


@business_bp.route("/<int:business_id>", methods=["GET", "PUT"])
@jwt_required()
def get_update_business(business_id):
    """Get and update business"""
    user_id = get_jwt_identity()
    business = Business.query.filter_by(id=business_id, owner_id=user_id).first()
    if not business:
        return {"message": "Business not found."}, 404

    if request.method == "PUT":
        payload = request.get_json() or {}
        business.name = payload.get("name", business.name)
        business.category = payload.get("category", business.category)
        business.location = payload.get("location", business.location)
        db.session.commit()
        return {"message": "Business updated.", "business": business.to_dict()}, 200

    return {"business": business.to_dict()}, 200
