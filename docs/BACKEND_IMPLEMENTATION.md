# Backend Implementation

This document describes the backend implementation details for TokBiz.

## Backend Structure

- `backend/run.py` — application entry point and shell context.
- `backend/app/__init__.py` — Flask app factory, extension initialization, blueprint registration, and database table creation.
- `backend/app/config.py` — environment-specific configuration for development, testing, and production.
- `backend/app/models/__init__.py` — SQLAlchemy models and serialization helpers.
- `backend/app/routes/` — route modules for auth, business, products, sales, debtors, analytics, and AI.

## Models

### User
- Stores `name`, `email`, `password_hash`, and `role`.
- Uses bcrypt-style password hashing via Werkzeug.
- Includes `to_dict()` serialization.

### Business
- Stores `name`, `category`, `location`, and `owner_id`.
- Has relationships to `Product`, `Sale`, and `Debtor`.

### Product
- Tracks `business_id`, `name`, `description`, `price`, and `quantity`.
- Includes `to_dict()` serialization.

### Sale
- Tracks `business_id`, `total_amount`, and `date`.
- Includes `SaleItem` relationships.

### SaleItem
- Stores `sale_id`, `product_id`, `quantity`, and `price`.

### Debtor
- Stores `business_id`, `customer_name`, `amount_owed`, `due_date`, and `status`.
- Includes payments relationship and `update_status()` helper.

### Payment
- Stores `debtor_id`, `amount_paid`, and `date`.

## API Routes

### Authentication
- `POST /api/auth/register` — user registration.
- `POST /api/auth/login` — authentication and token creation.
- `POST /api/auth/refresh` — refresh access tokens.

### Business
- `GET /api/businesses` — list owner businesses.
- `POST /api/businesses` — create a new business.
- `GET /api/businesses/<id>` — retrieve business details.
- `PUT /api/businesses/<id>` — update business details.

### Products
- `GET /api/products` — list products for owner businesses.
- `POST /api/products` — create a new product.
- `GET /api/products/<id>` — retrieve a product.
- `PUT /api/products/<id>` — update a product.
- `DELETE /api/products/<id>` — delete a product.

### Sales
- `GET /api/sales` — list sales for owner businesses.
- `POST /api/sales` — create a sale, reduce inventory, and create sale items.
- `GET /api/sales/<id>` — retrieve sale details.

### Debtors
- `GET /api/debtors` — list debtors.
- `POST /api/debtors` — create debtor records.
- `GET /api/debtors/<id>` — retrieve debtor details.
- `PUT /api/debtors/<id>` — update debtor details.
- `POST /api/debtors/<id>/payments` — record debtor payments.

### Analytics
- `GET /api/analytics/summary`
- `GET /api/analytics/sales-trends`
- `GET /api/analytics/top-products`
- `GET /api/analytics/debt-summary`
- `GET /api/analytics/inventory-status`

### AI Assistant
- `POST /api/ai/sales-insights`
- `POST /api/ai/debt-risks`
- `POST /api/ai/inventory-forecast`
- `POST /api/ai/health-score`

## Configuration

- Uses `.env` and `python-dotenv` for environment variables.
- `DevelopmentConfig` uses SQLite local file `tokbiz_dev.db` and a default JWT secret.
- `ProductionConfig` requires `DATABASE_URL` and `JWT_SECRET_KEY`.

## Notes

- Backend startup uses the `.venv` Python environment.
- The app factory auto-creates tables with `db.create_all()` in development.
- OpenAI integration requires `OPENAI_API_KEY` and optional `OPENAI_MODEL`.
