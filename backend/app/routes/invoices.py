"""Supplier invoice routes"""
from datetime import datetime

from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db
from app.models import Business, Invoice, Supplier

invoices_bp = Blueprint("invoices", __name__)


@invoices_bp.route("", methods=["GET", "POST"])
@jwt_required()
def manage_invoices():
    user_id = get_jwt_identity()

    if request.method == "POST":
        payload = request.get_json() or {}
        business_id = payload.get("business_id")
        supplier_id = payload.get("supplier_id")
        amount = float(payload.get("amount", 0.0))
        description = payload.get("description")

        if not business_id or not supplier_id or amount <= 0 or not description:
            return {"message": "Business, supplier, description and positive amount are required."}, 400

        business = Business.query.filter_by(id=business_id, owner_id=user_id).first()
        if not business:
            return {"message": "Business not found."}, 404

        supplier = Supplier.query.filter_by(id=supplier_id, business_id=business.id).first()
        if not supplier:
            return {"message": "Supplier not found or does not belong to this business."}, 404

        invoice = Invoice(
            business_id=business.id,
            supplier_id=supplier.id,
            description=description.strip(),
            amount=amount,
            currency=payload.get("currency", "USD"),
            due_date=datetime.fromisoformat(payload.get("due_date")).date() if payload.get("due_date") else datetime.utcnow().date(),
            status=payload.get("status", "pending"),
            approved=payload.get("approved", False),
        )
        db.session.add(invoice)
        db.session.commit()

        return {"message": "Invoice created.", "invoice": invoice.to_dict()}, 201

    invoices = Invoice.query.join(Business).filter(Business.owner_id == user_id).all()
    return {"invoices": [invoice.to_dict() for invoice in invoices]}, 200


@invoices_bp.route("/<int:invoice_id>", methods=["GET", "PUT", "DELETE"])
@jwt_required()
def invoice_detail(invoice_id):
    user_id = get_jwt_identity()
    invoice = Invoice.query.get(invoice_id)
    if not invoice or invoice.business.owner_id != user_id:
        return {"message": "Invoice not found."}, 404

    if request.method == "DELETE":
        db.session.delete(invoice)
        db.session.commit()
        return {"message": "Invoice deleted."}, 200

    payload = request.get_json() or {}
    invoice.description = payload.get("description", invoice.description)
    invoice.amount = float(payload.get("amount", invoice.amount))
    invoice.currency = payload.get("currency", invoice.currency)
    invoice.due_date = datetime.fromisoformat(payload.get("due_date")).date() if payload.get("due_date") else invoice.due_date
    invoice.status = payload.get("status", invoice.status)
    invoice.approved = payload.get("approved", invoice.approved)
    invoice.paid = payload.get("paid", invoice.paid)
    db.session.commit()

    return {"message": "Invoice updated.", "invoice": invoice.to_dict()}, 200
