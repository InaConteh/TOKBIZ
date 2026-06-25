"""Trust scoring and marketplace governance routes"""
from flask import Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.models import Business, Invoice

trust_bp = Blueprint("trust", __name__)


@trust_bp.route("", methods=["GET"])
@jwt_required()
def get_trust_scores():
    user_id = get_jwt_identity()
    businesses = Business.query.filter_by(owner_id=user_id).all()
    trust_scores = []

    for business in businesses:
        invoices = Invoice.query.filter_by(business_id=business.id).all()
        if invoices:
            paid_count = sum(1 for invoice in invoices if invoice.paid)
            score = int((paid_count / len(invoices)) * 100)
        else:
            score = 70

        trust_scores.append(
            {
                "business_id": business.id,
                "business_name": business.name,
                "trust_score": score,
                "invoice_count": len(invoices),
                "note": "Higher scores reflect more reliable payment behavior and stronger marketplace trust.",
            }
        )

    return {"trust_scores": trust_scores}, 200
