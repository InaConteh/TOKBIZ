"""Supplier management routes"""
from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db
from app.models import Business, Supplier

suppliers_bp = Blueprint("suppliers", __name__)


@suppliers_bp.route("", methods=["GET", "POST"])
@jwt_required()
def manage_suppliers():
    user_id = get_jwt_identity()

    if request.method == "POST":
        payload = request.get_json() or {}
        business_id = payload.get("business_id")
        name = payload.get("name")

        if not business_id or not name:
            return {"message": "Business ID and supplier name are required."}, 400

        business = Business.query.filter_by(id=business_id, owner_id=user_id).first()
        if not business:
            return {"message": "Business not found."}, 404

        supplier = Supplier(
            business_id=business.id,
            name=name.strip(),
            contact_name=payload.get("contact_name"),
            email=payload.get("email"),
            phone=payload.get("phone"),
            address=payload.get("address"),
            notes=payload.get("notes"),
            currency=payload.get("currency", "USD"),
        )
        db.session.add(supplier)
        db.session.commit()

        return {"message": "Supplier created.", "supplier": supplier.to_dict()}, 201

    suppliers = Supplier.query.join(Business).filter(Business.owner_id == user_id).all()
    return {"suppliers": [supplier.to_dict() for supplier in suppliers]}, 200


@suppliers_bp.route("/<int:supplier_id>", methods=["GET", "PUT", "DELETE"])
@jwt_required()
def supplier_detail(supplier_id):
    user_id = get_jwt_identity()
    supplier = Supplier.query.get(supplier_id)
    if not supplier or supplier.business.owner_id != user_id:
        return {"message": "Supplier not found."}, 404

    if request.method == "DELETE":
        db.session.delete(supplier)
        db.session.commit()
        return {"message": "Supplier deleted."}, 200

    payload = request.get_json() or {}
    supplier.name = payload.get("name", supplier.name)
    supplier.contact_name = payload.get("contact_name", supplier.contact_name)
    supplier.email = payload.get("email", supplier.email)
    supplier.phone = payload.get("phone", supplier.phone)
    supplier.address = payload.get("address", supplier.address)
    supplier.notes = payload.get("notes", supplier.notes)
    supplier.currency = payload.get("currency", supplier.currency)
    db.session.commit()

    return {"message": "Supplier updated.", "supplier": supplier.to_dict()}, 200
