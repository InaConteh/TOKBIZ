"""Payment transaction routes"""
from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db
from app.models import Business, PaymentTransaction

payments_bp = Blueprint("payments", __name__)


@payments_bp.route("", methods=["GET", "POST"])
@jwt_required()
def manage_payments():
    user_id = get_jwt_identity()

    if request.method == "POST":
        payload = request.get_json() or {}
        business_id = payload.get("business_id")
        amount = float(payload.get("amount", 0.0))
        target_type = payload.get("target_type")

        if not business_id or amount <= 0 or not target_type:
            return {"message": "Business ID, target type, and positive amount are required."}, 400

        business = Business.query.filter_by(id=business_id, owner_id=user_id).first()
        if not business:
            return {"message": "Business not found."}, 404

        payment = PaymentTransaction(
            business_id=business.id,
            target_type=target_type,
            target_id=payload.get("target_id"),
            amount=amount,
            currency=payload.get("currency", "USD"),
            gateway=payload.get("gateway", "manual"),
            status=payload.get("status", "completed"),
            transaction_reference=payload.get("transaction_reference"),
            description=payload.get("description"),
        )
        db.session.add(payment)
        db.session.commit()

        return {"message": "Payment transaction recorded.", "payment": payment.to_dict()}, 201

    payments = PaymentTransaction.query.join(Business).filter(Business.owner_id == user_id).all()
    return {"payments": [payment.to_dict() for payment in payments]}, 200


@payments_bp.route("/<int:payment_id>", methods=["GET"])
@jwt_required()
def payment_detail(payment_id):
    user_id = get_jwt_identity()
    payment = PaymentTransaction.query.get(payment_id)
    if not payment or payment.business.owner_id != user_id:
        return {"message": "Payment not found."}, 404
    return {"payment": payment.to_dict()}, 200
