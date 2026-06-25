"""Payment channel information routes"""
from flask import Blueprint
from flask_jwt_extended import jwt_required

payment_channels_bp = Blueprint("payment_channels", __name__)


@payment_channels_bp.route("", methods=["GET"])
@jwt_required()
def get_payment_channels():
    channels = [
        {
            "id": "manual",
            "name": "Manual Cash/Bank Transfer",
            "description": "Record cash or direct bank transfers manually.",
        },
        {
            "id": "mobile_money",
            "name": "Mobile Money",
            "description": "Support local mobile money payments and receipts.",
        },
        {
            "id": "card",
            "name": "Card Payments",
            "description": "Accept card payments via integrated gateway.",
        },
        {
            "id": "ussd",
            "name": "USSD Payments",
            "description": "Enable local USSD transaction flows for low-bandwidth environments.",
        },
    ]
    return {"payment_channels": channels}, 200
