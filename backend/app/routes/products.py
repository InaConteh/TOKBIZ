"""Product management routes"""
from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db
from app.models import Business, Product

products_bp = Blueprint("products", __name__)


@products_bp.route("", methods=["GET", "POST"])
@jwt_required()
def manage_products():
    """List and create products"""
    user_id = int(get_jwt_identity())

    if request.method == "POST":
        payload = request.get_json() or {}
        business_id = payload.get("business_id")
        name = payload.get("name")
        price = payload.get("price", 0.0)
        quantity = payload.get("quantity", 0)
        description = payload.get("description")

        if not business_id or not name:
            return {"message": "Business ID and product name are required."}, 400

        business = Business.query.filter_by(id=business_id, owner_id=user_id).first()
        if not business:
            return {"message": "Business not found."}, 404

        product = Product(
            business_id=business.id,
            name=name.strip(),
            description=description,
            price=float(price),
            quantity=int(quantity),
        )
        db.session.add(product)
        db.session.commit()

        return {"message": "Product created.", "product": product.to_dict()}, 201

    products = Product.query.join(Business).filter(Business.owner_id == user_id).all()
    return {"products": [product.to_dict() for product in products]}, 200


@products_bp.route("/<int:product_id>", methods=["GET", "PUT", "DELETE"])
@jwt_required()
def product_details(product_id):
    """Get, update, delete product"""
    user_id = get_jwt_identity()
    product = Product.query.get(product_id)
    if not product or product.business.owner_id != user_id:
        return {"message": "Product not found."}, 404

    if request.method == "DELETE":
        db.session.delete(product)
        db.session.commit()
        return {"message": "Product deleted."}, 200

    payload = request.get_json() or {}
    product.name = payload.get("name", product.name)
    product.description = payload.get("description", product.description)
    product.price = float(payload.get("price", product.price))
    product.quantity = int(payload.get("quantity", product.quantity))
    db.session.commit()

    return {"message": "Product updated.", "product": product.to_dict()}, 200
