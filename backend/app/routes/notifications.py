"""Notifications and alert routes"""
from datetime import datetime

from flask import Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.models import Business, Debtor, Invoice, Product

notifications_bp = Blueprint("notifications", __name__)


@notifications_bp.route("", methods=["GET"])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    businesses = Business.query.filter_by(owner_id=user_id).all()
    business_ids = [business.id for business in businesses]
    today = datetime.utcnow().date()

    low_stock_products = [
        product.to_dict()
        for product in Product.query.filter(Product.business_id.in_(business_ids), Product.quantity <= 5).all()
    ]
    overdue_invoices = [
        invoice.to_dict()
        for invoice in Invoice.query.filter(Invoice.business_id.in_(business_ids), Invoice.due_date < today, Invoice.status != "paid").all()
    ]
    overdue_debtors = [
        debtor.to_dict()
        for debtor in Debtor.query.join(Business).filter(Business.owner_id == user_id, Debtor.status == "Overdue").all()
    ]

    notifications = []
    if low_stock_products:
        notifications.append({
            "type": "low_stock",
            "title": "Low stock alert",
            "message": f"{len(low_stock_products)} product(s) are low on inventory.",
            "items": low_stock_products,
        })
    if overdue_invoices:
        notifications.append({
            "type": "overdue_invoice",
            "title": "Overdue supplier invoices",
            "message": f"{len(overdue_invoices)} overdue invoice(s) require attention.",
            "items": overdue_invoices,
        })
    if overdue_debtors:
        notifications.append({
            "type": "overdue_debtor",
            "title": "Overdue debtor accounts",
            "message": f"{len(overdue_debtors)} overdue debtor(s).",
            "items": overdue_debtors,
        })

    return {"notifications": notifications}, 200
