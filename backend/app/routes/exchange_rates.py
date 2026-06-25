"""Exchange rate management routes"""
from datetime import datetime

from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db
from app.models import Business, ExchangeRate

exchange_rates_bp = Blueprint("exchange_rates", __name__)


@exchange_rates_bp.route("", methods=["GET", "POST"])
@jwt_required()
def manage_exchange_rates():
    user_id = get_jwt_identity()

    if request.method == "POST":
        payload = request.get_json() or {}
        base_currency = payload.get("base_currency")
        target_currency = payload.get("target_currency")
        rate = float(payload.get("rate", 0.0))

        if not base_currency or not target_currency or rate <= 0:
            return {"message": "Base currency, target currency, and positive rate are required."}, 400

        rate_record = ExchangeRate(
            base_currency=base_currency.strip().upper(),
            target_currency=target_currency.strip().upper(),
            rate=rate,
            updated_at=datetime.utcnow(),
        )
        db.session.add(rate_record)
        db.session.commit()

        return {"message": "Exchange rate saved.", "exchange_rate": rate_record.to_dict()}, 201

    rates = ExchangeRate.query.all()
    return {"exchange_rates": [rate.to_dict() for rate in rates]}, 200
