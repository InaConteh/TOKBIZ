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
    
    # Register blueprints
    with app.app_context():
        from app.routes.auth import auth_bp
        from app.routes.business import business_bp
        from app.routes.products import products_bp
        from app.routes.sales import sales_bp
        from app.routes.debtors import debtors_bp
        from app.routes.analytics import analytics_bp
        from app.routes.ai import ai_bp
        
        app.register_blueprint(auth_bp, url_prefix="/api/auth")
        app.register_blueprint(business_bp, url_prefix="/api/businesses")
        app.register_blueprint(products_bp, url_prefix="/api/products")
        app.register_blueprint(sales_bp, url_prefix="/api/sales")
        app.register_blueprint(debtors_bp, url_prefix="/api/debtors")
        app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
        app.register_blueprint(ai_bp, url_prefix="/api/ai")
        
        # Create tables
        db.create_all()
    
    return app
