"""Sales management routes"""
from datetime import datetime

from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db
from app.models import Business, Product, Sale, SaleItem

sales_bp = Blueprint("sales", __name__)


@sales_bp.route("", methods=["GET", "POST"])
@jwt_required()
def manage_sales():
    """List and create sales"""
    user_id = int(get_jwt_identity())

    if request.method == "POST":
        payload = request.get_json() or {}
        business_id = payload.get("business_id")
        items = payload.get("items", [])

        if not business_id or not items:
            return {"message": "Business ID and sale items are required."}, 400

        business = Business.query.filter_by(id=business_id, owner_id=user_id).first()
        if not business:
            return {"message": "Business not found."}, 404

        sale = Sale(business_id=business.id, date=datetime.utcnow())
        db.session.add(sale)
        db.session.flush()

        total_amount = 0.0
        for item in items:
            product_id = item.get("product_id")
            quantity = int(item.get("quantity", 0))
            if not product_id or quantity <= 0:
                db.session.rollback()
                return {"message": "Product ID and positive quantity are required."}, 400

            product = Product.query.get(product_id)
            if not product or product.business.owner_id != user_id:
                db.session.rollback()
                return {"message": "Product not found or access denied."}, 404

            if product.quantity < quantity:
                db.session.rollback()
                return {"message": f"Not enough inventory for product {product.name}."}, 400

            line_price = float(product.price) * quantity
            total_amount += line_price
            product.quantity -= quantity

            sale_item = SaleItem(
                sale_id=sale.id,
                product_id=product.id,
                quantity=quantity,
                price=float(product.price),
            )
            db.session.add(sale_item)

        sale.total_amount = total_amount
        db.session.commit()

        return {"message": "Sale recorded.", "sale": sale.to_dict()}, 201

    sales = Sale.query.join(Business).filter(Business.owner_id == user_id).all()
    return {"sales": [sale.to_dict() for sale in sales]}, 200


@sales_bp.route("/<int:sale_id>", methods=["GET"])
@jwt_required()
def get_sale(sale_id):
    """Get sale details"""
    user_id = get_jwt_identity()
    sale = Sale.query.get(sale_id)
    if not sale or sale.business.owner_id != user_id:
        return {"message": "Sale not found."}, 404
    return {"sale": sale.to_dict()}, 200
