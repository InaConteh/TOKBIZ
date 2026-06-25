"""Models package"""
from datetime import datetime

from werkzeug.security import check_password_hash, generate_password_hash

from app import db


class TimestampMixin:
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def timestamp_dict(self):
        return {
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class User(db.Model, TimestampMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="Owner")

    businesses = db.relationship(
        "Business",
        backref="owner",
        lazy=True,
        cascade="all, delete-orphan",
    )

    @property
    def password(self):
        raise AttributeError("Password is write-only")

    @password.setter
    def password(self, plain_password):
        self.password_hash = generate_password_hash(plain_password)

    def check_password(self, plain_password):
        return check_password_hash(self.password_hash, plain_password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            **self.timestamp_dict(),
        }


class Business(db.Model, TimestampMixin):
    __tablename__ = "businesses"

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(128), nullable=True)
    location = db.Column(db.String(255), nullable=True)

    products = db.relationship(
        "Product",
        backref="business",
        lazy=True,
        cascade="all, delete-orphan",
    )
    sales = db.relationship(
        "Sale",
        backref="business",
        lazy=True,
        cascade="all, delete-orphan",
    )
    debtors = db.relationship(
        "Debtor",
        backref="business",
        lazy=True,
        cascade="all, delete-orphan",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "name": self.name,
            "category": self.category,
            "location": self.location,
            **self.timestamp_dict(),
        }


class Product(db.Model, TimestampMixin):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey("businesses.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False, default=0.0)
    quantity = db.Column(db.Integer, nullable=False, default=0)

    sale_items = db.relationship(
        "SaleItem",
        backref="product",
        lazy=True,
        cascade="all, delete-orphan",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "business_id": self.business_id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "quantity": self.quantity,
            **self.timestamp_dict(),
        }


class Sale(db.Model, TimestampMixin):
    __tablename__ = "sales"

    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey("businesses.id"), nullable=False)
    total_amount = db.Column(db.Float, nullable=False, default=0.0)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    sale_items = db.relationship(
        "SaleItem",
        backref="sale",
        lazy=True,
        cascade="all, delete-orphan",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "business_id": self.business_id,
            "total_amount": self.total_amount,
            "date": self.date.isoformat() if self.date else None,
            "items": [item.to_dict() for item in self.sale_items],
            **self.timestamp_dict(),
        }


class SaleItem(db.Model, TimestampMixin):
    __tablename__ = "sale_items"

    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey("sales.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price = db.Column(db.Float, nullable=False, default=0.0)

    def to_dict(self):
        return {
            "id": self.id,
            "sale_id": self.sale_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "price": self.price,
            **self.timestamp_dict(),
        }


class Debtor(db.Model, TimestampMixin):
    __tablename__ = "debtors"

    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey("businesses.id"), nullable=False)
    customer_name = db.Column(db.String(255), nullable=False)
    amount_owed = db.Column(db.Float, nullable=False, default=0.0)
    due_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(32), nullable=False, default="Outstanding")

    payments = db.relationship(
        "Payment",
        backref="debtor",
        lazy=True,
        cascade="all, delete-orphan",
    )

    def update_status(self):
        if self.amount_owed <= 0:
            self.status = "Paid"
        elif self.due_date and self.due_date < datetime.utcnow().date():
            self.status = "Overdue"
        else:
            self.status = "Outstanding"

    def to_dict(self):
        return {
            "id": self.id,
            "business_id": self.business_id,
            "customer_name": self.customer_name,
            "amount_owed": self.amount_owed,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "status": self.status,
            "payments": [payment.to_dict() for payment in self.payments],
            **self.timestamp_dict(),
        }


class Payment(db.Model, TimestampMixin):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    debtor_id = db.Column(db.Integer, db.ForeignKey("debtors.id"), nullable=False)
    amount_paid = db.Column(db.Float, nullable=False, default=0.0)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "debtor_id": self.debtor_id,
            "amount_paid": self.amount_paid,
            "date": self.date.isoformat() if self.date else None,
            **self.timestamp_dict(),
        }
