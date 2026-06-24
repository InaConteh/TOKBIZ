"""Flask Configuration"""
import os
from datetime import timedelta


class Config:
    """Base configuration"""
    # Flask
    DEBUG = False
    TESTING = False
    
    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # CORS
    CORS_HEADERS = "Content-Type"


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///tokbiz_dev.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    
    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-key")


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    
    # Database
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT
    JWT_SECRET_KEY = "test-secret-key"


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    
    # Ensure critical environment variables are set
    @classmethod
    def init_app(cls, app):
        """Initialize production configuration"""
        if not os.getenv("DATABASE_URL"):
            raise ValueError("DATABASE_URL environment variable is not set")
        if not os.getenv("JWT_SECRET_KEY"):
            raise ValueError("JWT_SECRET_KEY environment variable is not set")
