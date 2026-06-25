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


class Supplier(db.Model, TimestampMixin):
    __tablename__ = "suppliers"

    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey("businesses.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    contact_name = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    address = db.Column(db.String(512), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    currency = db.Column(db.String(10), nullable=False, default="USD")

    business = db.relationship(
        "Business",
        backref="suppliers",
        lazy=True,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "business_id": self.business_id,
            "name": self.name,
            "contact_name": self.contact_name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "notes": self.notes,
            "currency": self.currency,
            **self.timestamp_dict(),
        }


class Expense(db.Model, TimestampMixin):
    __tablename__ = "expenses"

    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey("businesses.id"), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey("suppliers.id"), nullable=True)
    description = db.Column(db.String(512), nullable=False)
    category = db.Column(db.String(128), nullable=True)
    amount = db.Column(db.Float, nullable=False, default=0.0)
    currency = db.Column(db.String(10), nullable=False, default="USD")
    expense_date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    paid = db.Column(db.Boolean, nullable=False, default=False)

    business = db.relationship(
        "Business",
        backref="expenses",
        lazy=True,
    )
    supplier = db.relationship(
        "Supplier",
        lazy=True,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "business_id": self.business_id,
            "supplier_id": self.supplier_id,
            "description": self.description,
            "category": self.category,
            "amount": self.amount,
            "currency": self.currency,
            "expense_date": self.expense_date.isoformat() if self.expense_date else None,
            "paid": self.paid,
            **self.timestamp_dict(),
        }


class Invoice(db.Model, TimestampMixin):
    __tablename__ = "invoices"

    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey("businesses.id"), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey("suppliers.id"), nullable=False)
    description = db.Column(db.String(512), nullable=False)
    amount = db.Column(db.Float, nullable=False, default=0.0)
    currency = db.Column(db.String(10), nullable=False, default="USD")
    due_date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    status = db.Column(db.String(32), nullable=False, default="pending")
    approved = db.Column(db.Boolean, nullable=False, default=False)
    paid = db.Column(db.Boolean, nullable=False, default=False)

    business = db.relationship(
        "Business",
        backref="invoices",
        lazy=True,
    )
    supplier = db.relationship(
        "Supplier",
        lazy=True,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "business_id": self.business_id,
            "supplier_id": self.supplier_id,
            "description": self.description,
            "amount": self.amount,
            "currency": self.currency,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "status": self.status,
            "approved": self.approved,
            "paid": self.paid,
            **self.timestamp_dict(),
        }


class ExchangeRate(db.Model, TimestampMixin):
    __tablename__ = "exchange_rates"

    id = db.Column(db.Integer, primary_key=True)
    base_currency = db.Column(db.String(10), nullable=False)
    target_currency = db.Column(db.String(10), nullable=False)
    rate = db.Column(db.Float, nullable=False, default=0.0)

    def to_dict(self):
        return {
            "id": self.id,
            "base_currency": self.base_currency,
            "target_currency": self.target_currency,
            "rate": self.rate,
            **self.timestamp_dict(),
        }


class RecurringExpense(db.Model, TimestampMixin):
    __tablename__ = "recurring_expenses"

    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey("businesses.id"), nullable=False)
    description = db.Column(db.String(512), nullable=False)
    amount = db.Column(db.Float, nullable=False, default=0.0)
    currency = db.Column(db.String(10), nullable=False, default="USD")
    frequency = db.Column(db.String(64), nullable=False)
    next_due_date = db.Column(db.Date, nullable=False)
    active = db.Column(db.Boolean, nullable=False, default=True)

    business = db.relationship(
        "Business",
        backref="recurring_expenses",
        lazy=True,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "business_id": self.business_id,
            "description": self.description,
            "amount": self.amount,
            "currency": self.currency,
            "frequency": self.frequency,
            "next_due_date": self.next_due_date.isoformat() if self.next_due_date else None,
            "active": self.active,
            **self.timestamp_dict(),
        }


class Role(db.Model, TimestampMixin):
    __tablename__ = "roles"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            **self.timestamp_dict(),
        }


class Permission(db.Model, TimestampMixin):
    __tablename__ = "permissions"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            **self.timestamp_dict(),
        }


class MarketplaceListing(db.Model, TimestampMixin):
    __tablename__ = "marketplace_listings"

    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey("businesses.id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(128), nullable=True)
    price = db.Column(db.Float, nullable=False, default=0.0)
    active = db.Column(db.Boolean, nullable=False, default=True)

    business = db.relationship(
        "Business",
        backref="marketplace_listings",
        lazy=True,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "business_id": self.business_id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "price": self.price,
            "active": self.active,
            **self.timestamp_dict(),
        }


class PaymentTransaction(db.Model, TimestampMixin):
    __tablename__ = "payment_transactions"

    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey("businesses.id"), nullable=False)
    target_type = db.Column(db.String(32), nullable=False)
    target_id = db.Column(db.Integer, nullable=True)
    amount = db.Column(db.Float, nullable=False, default=0.0)
    currency = db.Column(db.String(10), nullable=False, default="USD")
    gateway = db.Column(db.String(64), nullable=False, default="manual")
    status = db.Column(db.String(32), nullable=False, default="completed")
    transaction_reference = db.Column(db.String(255), nullable=True)
    description = db.Column(db.String(512), nullable=True)

    business = db.relationship(
        "Business",
        backref="payment_transactions",
        lazy=True,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "business_id": self.business_id,
            "target_type": self.target_type,
            "target_id": self.target_id,
            "amount": self.amount,
            "currency": self.currency,
            "gateway": self.gateway,
            "status": self.status,
            "transaction_reference": self.transaction_reference,
            "description": self.description,
            **self.timestamp_dict(),
        }
