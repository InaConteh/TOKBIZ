"""Recurring expense schedule routes"""
from datetime import datetime

from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db
from app.models import Business, RecurringExpense

recurring_bp = Blueprint("recurring", __name__)


@recurring_bp.route("", methods=["GET", "POST"])
@jwt_required()
def manage_recurring_expenses():
    user_id = get_jwt_identity()

    if request.method == "POST":
        payload = request.get_json() or {}
        business_id = payload.get("business_id")
        description = payload.get("description")
        amount = float(payload.get("amount", 0.0))
        frequency = payload.get("frequency")
        next_due_date = payload.get("next_due_date")

        if not business_id or not description or amount <= 0 or not frequency or not next_due_date:
            return {"message": "Business, description, positive amount, frequency, and next due date are required."}, 400

        business = Business.query.filter_by(id=business_id, owner_id=user_id).first()
        if not business:
            return {"message": "Business not found."}, 404

        recurring = RecurringExpense(
            business_id=business.id,
            description=description.strip(),
            amount=amount,
            currency=payload.get("currency", "USD"),
            frequency=frequency,
            next_due_date=datetime.fromisoformat(next_due_date).date(),
            active=payload.get("active", True),
        )
        db.session.add(recurring)
        db.session.commit()

        return {"message": "Recurring expense scheduled.", "recurring_expense": recurring.to_dict()}, 201

    recurring_expenses = RecurringExpense.query.join(Business).filter(Business.owner_id == user_id).all()
    return {"recurring_expenses": [item.to_dict() for item in recurring_expenses]}, 200
