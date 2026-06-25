"""Expense tracking routes"""
from datetime import datetime

from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db
from app.models import Business, Expense, Supplier

expenses_bp = Blueprint("expenses", __name__)


@expenses_bp.route("", methods=["GET", "POST"])
@jwt_required()
def manage_expenses():
    user_id = get_jwt_identity()

    if request.method == "POST":
        payload = request.get_json() or {}
        business_id = payload.get("business_id")
        description = payload.get("description")
        amount = float(payload.get("amount", 0.0))

        if not business_id or not description or amount <= 0:
            return {"message": "Business ID, description, and positive amount are required."}, 400

        business = Business.query.filter_by(id=business_id, owner_id=user_id).first()
        if not business:
            return {"message": "Business not found."}, 404

        supplier_id = payload.get("supplier_id")
        if supplier_id:
            supplier = Supplier.query.get(supplier_id)
            if not supplier or supplier.business.owner_id != user_id:
                return {"message": "Supplier not found."}, 404

        expense = Expense(
            business_id=business.id,
            supplier_id=supplier_id,
            description=description.strip(),
            category=payload.get("category"),
            amount=amount,
            currency=payload.get("currency", "USD"),
            expense_date=datetime.fromisoformat(payload.get("expense_date")).date() if payload.get("expense_date") else datetime.utcnow().date(),
            paid=payload.get("paid", False),
        )
        db.session.add(expense)
        db.session.commit()

        return {"message": "Expense recorded.", "expense": expense.to_dict()}, 201

    expenses = Expense.query.join(Business).filter(Business.owner_id == user_id).all()
    return {"expenses": [expense.to_dict() for expense in expenses]}, 200


@expenses_bp.route("/<int:expense_id>", methods=["GET", "PUT", "DELETE"])
@jwt_required()
def expense_detail(expense_id):
    user_id = get_jwt_identity()
    expense = Expense.query.get(expense_id)
    if not expense or expense.business.owner_id != user_id:
        return {"message": "Expense not found."}, 404

    if request.method == "DELETE":
        db.session.delete(expense)
        db.session.commit()
        return {"message": "Expense deleted."}, 200

    payload = request.get_json() or {}
    expense.description = payload.get("description", expense.description)
    expense.category = payload.get("category", expense.category)
    expense.amount = float(payload.get("amount", expense.amount))
    expense.currency = payload.get("currency", expense.currency)
    expense.expense_date = datetime.fromisoformat(payload.get("expense_date")).date() if payload.get("expense_date") else expense.expense_date
    expense.paid = payload.get("paid", expense.paid)
    db.session.commit()

    return {"message": "Expense updated.", "expense": expense.to_dict()}, 200
