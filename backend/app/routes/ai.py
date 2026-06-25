"""AI Business Assistant routes"""
import os
from collections import Counter
from datetime import datetime, timedelta, timezone

import openai
from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.models import Business, Debtor, Product, Sale, SaleItem
from app.services.ai_service import AiService

ai_bp = Blueprint("ai", __name__)


def openai_response(prompt: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    if not api_key:
        return prompt

    openai.api_key = api_key
    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are an AI assistant for business analytics and forecasting."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=450,
        )
        return response.choices[0].message.content.strip()
    except Exception as exc:
        return f"Unable to call AI service: {exc}"


def _build_business_context(user_id):
    businesses = Business.query.filter_by(owner_id=user_id).all()
    business_ids = [b.id for b in businesses]
    sales = Sale.query.filter(Sale.business_id.in_(business_ids)).all()
    products = Product.query.filter(Product.business_id.in_(business_ids)).all()
    debtors = Debtor.query.filter(Debtor.business_id.in_(business_ids)).all()
    sale_items = SaleItem.query.join(Sale).filter(Sale.business_id.in_(business_ids)).all()
    return businesses, sales, products, debtors, sale_items


@ai_bp.route("/sales-insights", methods=["POST"])
@jwt_required()
def get_sales_insights():
    """Get AI sales insights"""
    user_id = get_jwt_identity()
    _, sales, products, _, _ = _build_business_context(user_id)

    total_sales = sum(sale.total_amount for sale in sales)

    # Use timedelta for safe date calculation
    three_months_ago = datetime.now(timezone.utc) - timedelta(days=90)

    quarter_sales = sum(
        sale.total_amount for sale in sales
        if sale.date >= three_months_ago.replace(tzinfo=None)
    )
    popular_products = Counter()
    for item in sale_items:
        popular_products[item.product.name] += item.quantity

    prompt = (
        f"Sales performance summary for your business: total sales ${total_sales:.2f}. "
        f"Recent quarter sales ${quarter_sales:.2f}. "
        f"Top selling products: {', '.join([f'{name} ({count})' for name, count in popular_products.most_common(3)]) or 'none'}. "
        f"Please provide three actionable insights to improve sales and inventory turnover."
    )

    return {"insights": openai_response(prompt)}, 200


@ai_bp.route("/debt-risks", methods=["POST"])
@jwt_required()
def get_debt_risks():
    """Get AI debt risk analysis"""
    user_id = int(get_jwt_identity())
    _, _, _, debtors, _ = _build_business_context(user_id)

    if not debtors:
        return {"risks": "No outstanding debtors found."}, 200

    debt_summary = "; ".join(
        f"{debtor.customer_name}: ${debtor.amount_owed:.2f}, due {debtor.due_date.isoformat() if debtor.due_date else 'N/A'}, status {debtor.status}"
        for debtor in debtors
    )
    prompt = (
        f"Analyze the following debtor portfolio and identify the highest risk debtors: {debt_summary}. "
        "Recommend three actions to reduce credit risk and improve collections."
    )

    return {"risks": openai_response(prompt)}, 200


@ai_bp.route("/inventory-forecast", methods=["POST"])
@jwt_required()
def get_inventory_forecast():
    """Get AI inventory forecast"""
    user_id = get_jwt_identity()
    _, sales, products, _, _ = _build_business_context(user_id)

    if not products:
        return {"forecast": "No products available to forecast."}, 200

    three_months_ago = datetime.now(timezone.utc) - timedelta(days=90)
    demand = Counter()
    for item in sale_items:
        if item.sale.date >= three_months_ago.replace(tzinfo=None):
            demand[item.product.name] += item.quantity

    prompt = (
        f"Your product stock levels: {', '.join([f'{product.name}({product.quantity})' for product in products])}. "
        f"Recent demand: {', '.join([f'{name}({count})' for name, count in demand.most_common(5)])}. "
        "Forecast inventory needs for the next 30 days and list three products to reorder soon."
    )

    return {"forecast": openai_response(prompt)}, 200


@ai_bp.route("/health-score", methods=["POST"])
@jwt_required()
def get_health_score():
    """Get business health score"""
    user_id = int(get_jwt_identity())
    businesses, sales, products, debtors, _ = _build_business_context(user_id)

    total_revenue = sum(sale.total_amount for sale in sales)
    total_debt = sum(debtor.amount_owed for debtor in debtors)
    inventory_value = sum(product.price * product.quantity for product in products)
    business_count = len(businesses)

    prompt = (
        f"Calculate a business health score based on these metrics: "
        f"{business_count} businesses, total revenue ${total_revenue:.2f}, total debt ${total_debt:.2f}, inventory value ${inventory_value:.2f}. "
        "Provide a 0-100 score and a short explanation of the score."
    )

    return {"health_score": openai_response(prompt)}, 200
