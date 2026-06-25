"""Analytics routes"""
from collections import defaultdict
from datetime import datetime

from flask import Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.models import Business, Debtor, Product, Sale, SaleItem

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/summary", methods=["GET"])
@jwt_required()
def get_summary():
    """Get analytics summary"""
    user_id = get_jwt_identity()

    businesses = Business.query.filter_by(owner_id=user_id).all()
    business_ids = [business.id for business in businesses]

    sales = Sale.query.filter(Sale.business_id.in_(business_ids)).all()
    products = Product.query.filter(Product.business_id.in_(business_ids)).all()
    debtors = Debtor.query.filter(Debtor.business_id.in_(business_ids)).all()

    total_sales = sum(sale.total_amount for sale in sales)
    total_revenue = total_sales
    total_debt = sum(debtor.amount_owed for debtor in debtors)
    inventory_value = sum(product.price * product.quantity for product in products)

    return {
        "summary": {
            "total_sales": total_sales,
            "total_revenue": total_revenue,
            "total_debt": total_debt,
            "inventory_value": inventory_value,
        }
    }, 200


@analytics_bp.route("/sales-trends", methods=["GET"])
@jwt_required()
def get_sales_trends():
    """Get sales trends"""
    user_id = get_jwt_identity()
    business_ids = [b.id for b in Business.query.filter_by(owner_id=user_id).all()]
    sales = Sale.query.filter(Sale.business_id.in_(business_ids)).all()

    trends = defaultdict(lambda: {"amount": 0.0, "count": 0})
    for sale in sales:
        key = sale.date.date().isoformat()
        trends[key]["amount"] += sale.total_amount
        trends[key]["count"] += 1

    return {"sales_trends": [{"date": date, **value} for date, value in sorted(trends.items())]}, 200


@analytics_bp.route("/top-products", methods=["GET"])
@jwt_required()
def get_top_products():
    """Get top products"""
    user_id = get_jwt_identity()
    business_ids = [b.id for b in Business.query.filter_by(owner_id=user_id).all()]
    sale_items = SaleItem.query.join(Sale).filter(Sale.business_id.in_(business_ids)).all()

    product_totals = defaultdict(lambda: {"quantity_sold": 0, "revenue": 0.0, "name": ""})
    for item in sale_items:
        product_totals[item.product_id]["quantity_sold"] += item.quantity
        product_totals[item.product_id]["revenue"] += item.quantity * item.price
        product_totals[item.product_id]["name"] = item.product.name

    top_products = sorted(
        [
            {
                "name": details["name"],
                "quantity_sold": details["quantity_sold"],
                "revenue": details["revenue"],
            }
            for details in product_totals.values()
        ],
        key=lambda x: x["quantity_sold"],
        reverse=True,
    )

    return {"top_products": top_products[:10]}, 200


@analytics_bp.route("/debt-summary", methods=["GET"])
@jwt_required()
def get_debt_summary():
    """Get debt summary"""
    user_id = get_jwt_identity()
    debtors = Debtor.query.join(Business).filter(Business.owner_id == user_id).all()

    total_debt = sum(debtor.amount_owed for debtor in debtors)
    overdue = sum(1 for debtor in debtors if debtor.status == "Overdue")
    paid = sum(1 for debtor in debtors if debtor.status == "Paid")
    outstanding = sum(1 for debtor in debtors if debtor.status == "Outstanding")

    return {
        "debt_summary": {
            "total_debt": total_debt,
            "overdue_count": overdue,
            "paid_count": paid,
            "outstanding_count": outstanding,
        }
    }, 200


@analytics_bp.route("/inventory-status", methods=["GET"])
@jwt_required()
def get_inventory_status():
    """Get inventory status"""
    user_id = get_jwt_identity()
    products = Product.query.join(Business).filter(Business.owner_id == user_id).all()

    low_stock = [product.to_dict() for product in products if product.quantity <= 5]
    total_inventory = sum(product.quantity for product in products)

    return {
        "inventory_status": {
            "total_products": len(products),
            "total_inventory": total_inventory,
            "low_stock": low_stock,
        }
    }, 200
