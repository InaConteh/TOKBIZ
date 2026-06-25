"""Marketplace listing routes"""
from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db
from app.models import Business, MarketplaceListing

marketplace_bp = Blueprint("marketplace", __name__)


@marketplace_bp.route("", methods=["GET", "POST"])
@jwt_required()
def manage_marketplace_listings():
    user_id = get_jwt_identity()

    if request.method == "POST":
        payload = request.get_json() or {}
        business_id = payload.get("business_id")
        title = payload.get("title")
        description = payload.get("description")
        category = payload.get("category")
        price = float(payload.get("price", 0.0))
        active = payload.get("active", True)

        if not business_id or not title or not description or price <= 0:
            return {
                "message": "Business, title, description, category, and positive price are required."
            }, 400

        business = Business.query.filter_by(id=business_id, owner_id=user_id).first()
        if not business:
            return {"message": "Business not found."}, 404

        listing = MarketplaceListing(
            business_id=business.id,
            title=title.strip(),
            description=description.strip(),
            category=category.strip() if category else "General",
            price=price,
            active=active,
        )
        db.session.add(listing)
        db.session.commit()

        return {"message": "Marketplace listing created.", "listing": listing.to_dict()}, 201

    listings = MarketplaceListing.query.filter_by(active=True).all()
    return {"marketplace_listings": [listing.to_dict() for listing in listings]}, 200
