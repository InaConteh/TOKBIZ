"""Partner integration and service discovery routes"""
from flask import Blueprint
from flask_jwt_extended import jwt_required

partners_bp = Blueprint("partners", __name__)


@partners_bp.route("", methods=["GET"])
@jwt_required()
def get_partner_services():
    partners = [
        {
            "id": "logistics",
            "name": "Logistics Partners",
            "description": "Connect with local transport and delivery operators for fast distribution.",
            "integration_type": "logistics",
        },
        {
            "id": "financing",
            "name": "Financing Partners",
            "description": "Access credit and invoice financing services designed for MSMEs.",
            "integration_type": "financing",
        },
        {
            "id": "distribution",
            "name": "Distribution Partners",
            "description": "Join networks that provide warehouse and distribution support.",
            "integration_type": "distribution",
        },
    ]
    return {"partners": partners}, 200
