"""Product management routes"""
from flask import Blueprint

products_bp = Blueprint("products", __name__)

@products_bp.route("", methods=["GET", "POST"])
def manage_products():
    """List and create products"""
    return {"message": "Product management endpoint - to be implemented"}, 501

@products_bp.route("/<int:product_id>", methods=["GET", "PUT", "DELETE"])
def product_details(product_id):
    """Get, update, delete product"""
    return {"message": "Product detail endpoint - to be implemented"}, 501
