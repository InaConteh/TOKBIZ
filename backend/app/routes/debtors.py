"""Debtor management routes"""
from datetime import datetime

from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db
from app.models import Business, Debtor, Payment

debtors_bp = Blueprint("debtors", __name__)


@debtors_bp.route("", methods=["GET", "POST"])
@jwt_required()
def manage_debtors():
    """List and create debtors"""
    user_id = int(get_jwt_identity())

    if request.method == "POST":
        payload = request.get_json() or {}
        business_id = payload.get("business_id")
        customer_name = payload.get("customer_name")
        amount_owed = float(payload.get("amount_owed", 0.0))
        due_date = payload.get("due_date")

        if not business_id or not customer_name:
            return {"message": "Business ID and customer name are required."}, 400

        business = Business.query.filter_by(id=business_id, owner_id=user_id).first()
        if not business:
            return {"message": "Business not found."}, 404

        debtor = Debtor(
            business_id=business.id,
            customer_name=customer_name.strip(),
            amount_owed=amount_owed,
            due_date=datetime.fromisoformat(due_date).date() if due_date else None,
        )
        debtor.update_status()
        db.session.add(debtor)
        db.session.commit()

        return {"message": "Debtor created.", "debtor": debtor.to_dict()}, 201

    debtors = Debtor.query.join(Business).filter(Business.owner_id == user_id).all()
    return {"debtors": [debtor.to_dict() for debtor in debtors]}, 200


@debtors_bp.route("/<int:debtor_id>", methods=["GET", "PUT"])
@jwt_required()
def debtor_details(debtor_id):
    """Get and update debtor"""
    user_id = get_jwt_identity()
    debtor = Debtor.query.get(debtor_id)
    if not debtor or debtor.business.owner_id != user_id:
        return {"message": "Debtor not found."}, 404

    if request.method == "PUT":
        payload = request.get_json() or {}
        debtor.customer_name = payload.get("customer_name", debtor.customer_name)
        debtor.amount_owed = float(payload.get("amount_owed", debtor.amount_owed))
        due_date = payload.get("due_date")
        debtor.due_date = datetime.fromisoformat(due_date).date() if due_date else debtor.due_date
        debtor.update_status()
        db.session.commit()
        return {"message": "Debtor updated.", "debtor": debtor.to_dict()}, 200

    return {"debtor": debtor.to_dict()}, 200


@debtors_bp.route("/<int:debtor_id>/payments", methods=["POST"])
@jwt_required()
def record_payment(debtor_id):
    """Record payment for debtor"""
    user_id = int(get_jwt_identity())
    debtor = Debtor.query.get(debtor_id)
    if not debtor or debtor.business.owner_id != user_id:
        return {"message": "Debtor not found."}, 404

    payload = request.get_json() or {}
    amount_paid = float(payload.get("amount_paid", 0.0))
    if amount_paid <= 0:
        return {"message": "Payment amount must be positive."}, 400

    payment = Payment(debtor_id=debtor.id, amount_paid=amount_paid, date=datetime.utcnow())
    debtor.amount_owed = max(0.0, debtor.amount_owed - amount_paid)
    debtor.update_status()
    db.session.add(payment)
    db.session.commit()

    return {
        "message": "Payment recorded.",
        "payment": payment.to_dict(),
        "debtor": debtor.to_dict(),
    }, 201
