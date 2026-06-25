"""TokBiz Flask Application Factory"""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()


def create_app(config_name=None):
    """Application factory function"""
    app = Flask(__name__)
    
    # Load configuration
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")
    
    if config_name == "production":
        from app.config import ProductionConfig
        app.config.from_object(ProductionConfig)
    elif config_name == "testing":
        from app.config import TestingConfig
        app.config.from_object(TestingConfig)
    else:
        from app.config import DevelopmentConfig
        app.config.from_object(DevelopmentConfig)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Import models so SQLAlchemy can create tables
    from app import models  # noqa: F401
    
    # Register blueprints
    with app.app_context():
        from app.routes.auth import auth_bp
        from app.routes.business import business_bp
        from app.routes.products import products_bp
        from app.routes.sales import sales_bp
        from app.routes.debtors import debtors_bp
        from app.routes.analytics import analytics_bp
        from app.routes.ai import ai_bp
        from app.routes.suppliers import suppliers_bp
        from app.routes.expenses import expenses_bp
        from app.routes.payments import payments_bp
        from app.routes.invoices import invoices_bp
        from app.routes.notifications import notifications_bp
        from app.routes.exchange_rates import exchange_rates_bp
        from app.routes.payment_channels import payment_channels_bp
        from app.routes.recurring import recurring_bp
        from app.routes.roles import roles_bp
        from app.routes.marketplace import marketplace_bp
        from app.routes.partners import partners_bp
        from app.routes.recommendations import recommendations_bp
        from app.routes.trust import trust_bp
        from app.routes.developer_api import developer_api_bp
        
        app.register_blueprint(auth_bp, url_prefix="/api/auth")
        app.register_blueprint(business_bp, url_prefix="/api/businesses")
        app.register_blueprint(products_bp, url_prefix="/api/products")
        app.register_blueprint(sales_bp, url_prefix="/api/sales")
        app.register_blueprint(debtors_bp, url_prefix="/api/debtors")
        app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
        app.register_blueprint(ai_bp, url_prefix="/api/ai")
        app.register_blueprint(suppliers_bp, url_prefix="/api/suppliers")
        app.register_blueprint(expenses_bp, url_prefix="/api/expenses")
        app.register_blueprint(payments_bp, url_prefix="/api/payments")
        app.register_blueprint(invoices_bp, url_prefix="/api/invoices")
        app.register_blueprint(notifications_bp, url_prefix="/api/notifications")
        app.register_blueprint(exchange_rates_bp, url_prefix="/api/exchange-rates")
        app.register_blueprint(payment_channels_bp, url_prefix="/api/payment-channels")
        app.register_blueprint(recurring_bp, url_prefix="/api/recurring-expenses")
        app.register_blueprint(roles_bp, url_prefix="/api/roles")
        app.register_blueprint(marketplace_bp, url_prefix="/api/marketplace")
        app.register_blueprint(partners_bp, url_prefix="/api/partners")
        app.register_blueprint(recommendations_bp, url_prefix="/api/recommendations")
        app.register_blueprint(trust_bp, url_prefix="/api/trust")
        app.register_blueprint(developer_api_bp, url_prefix="/api/developer-api")
        
        # Create tables
        db.create_all()
    
    return app
