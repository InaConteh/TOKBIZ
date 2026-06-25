"""Marketplace recommendation and optimization routes"""
from flask import Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db
from app.models import Business, Product, Sale, SaleItem

recommendations_bp = Blueprint("recommendations", __name__)


@recommendations_bp.route("", methods=["GET"])
@jwt_required()
def get_optimizations():
    user_id = get_jwt_identity()
    top_products = (
        db.session.query(
            Product.id,
            Product.name,
            db.func.sum(SaleItem.quantity).label("units_sold"),
        )
        .join(SaleItem, SaleItem.product_id == Product.id)
        .join(Sale, Sale.id == SaleItem.sale_id)
        .join(Business, Business.id == Sale.business_id)
        .filter(Business.owner_id == user_id)
        .group_by(Product.id)
        .order_by(db.func.sum(SaleItem.quantity).desc())
        .limit(5)
        .all()
    )

    if not top_products:
        return {
            "recommendations": [
                {
                    "title": "Start tracking product sales",
                    "detail": "Create product and sale entries to enable AI-driven recommendations.",
                }
            ]
        }, 200

    recommendations = [
        {
            "title": f"Promote {product.name}",
            "detail": f"{int(product.units_sold)} units sold recently. Bundle this product with complementary items to increase average order value.",
        }
        for product in top_products
    ]

    if len(top_products) >= 2:
        bundle = ", ".join([product.name for product in top_products[:2]])
        recommendations.insert(
            0,
            {
                "title": "Create a product bundle",
                "detail": f"Bundle {bundle} into a promotional package to increase cross-sell revenue.",
            },
        )

    return {"recommendations": recommendations}, 200
