# TokBiz - Setup & Development Guide

## Project Overview
TokBiz is an AI-powered business intelligence platform for Micro, Small, and Medium Enterprises (MSMEs) in Sierra Leone. This guide covers the complete setup for local development.

## Directory Structure

```
TOKBIZ/
├── backend/                 # Flask REST API
│   ├── app/
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── __init__.py     # App factory
│   │   └── config.py       # Configuration
│   ├── migrations/         # Database migrations
│   ├── tests/              # Unit tests
│   ├── requirements.txt    # Python dependencies
│   ├── run.py             # Entry point
│   ├── .env.example       # Environment template
│   └── .gitignore
│
├── frontend/               # React + TypeScript SPA
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client service
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React context
│   │   ├── styles/        # Global styles
│   │   ├── App.tsx        # Root component
│   │   └── main.tsx       # Entry point
│   ├── public/            # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── .env.example
│   └── .gitignore
│
├── docs/                   # Documentation
├── diagrams.md
├── LICENSE
└── README.md
```

## Prerequisites

- **Node.js** (v18+) and npm/yarn
- **Python** (v3.9+)
- **PostgreSQL** (v14+) for production, SQLite for development
- **Git**

## Backend Setup

### 1. Create Virtual Environment

**Windows (PowerShell):**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
```

**Example `.env` for development:**
```
FLASK_ENV=development
FLASK_APP=run.py
FLASK_PORT=5000
DATABASE_URL=sqlite:///tokbiz_dev.db
JWT_SECRET_KEY=your-secret-key-here
AI_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434
```

### 4. Run the Backend

```bash
python run.py
```

The API will be available at `http://localhost:5000`

**Health Check Endpoint:**
```bash
curl http://localhost:5000/health
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env if needed (defaults should work for local development)
```

**Example `.env` for development:**
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=TokBiz
```

### 3. Run the Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Database Setup

### For Development (SQLite)

The backend automatically creates a SQLite database (`tokbiz_dev.db`) on first run. No additional setup needed.

### For Production (PostgreSQL)

1. Create a PostgreSQL database:
```sql
CREATE DATABASE tokbiz;
CREATE USER tokbiz_user WITH PASSWORD 'your-secure-password';
ALTER ROLE tokbiz_user SET client_encoding TO 'utf8';
ALTER ROLE tokbiz_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE tokbiz_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE tokbiz TO tokbiz_user;
```

2. Update `.env` with PostgreSQL connection string:
```
DATABASE_URL=postgresql://tokbiz_user:your-secure-password@localhost:5432/tokbiz
```

3. Apply migrations (when available):
```bash
flask db upgrade
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### Business
- `GET /api/businesses` - List businesses
- `POST /api/businesses` - Create business
- `GET /api/businesses/<id>` - Get business
- `PUT /api/businesses/<id>` - Update business

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/<id>` - Get product
- `PUT /api/products/<id>` - Update product
- `DELETE /api/products/<id>` - Delete product

### Sales
- `GET /api/sales` - List sales
- `POST /api/sales` - Record sale
- `GET /api/sales/<id>` - Get sale

### Debtors
- `GET /api/debtors` - List debtors
- `POST /api/debtors` - Create debtor
- `GET /api/debtors/<id>` - Get debtor
- `PUT /api/debtors/<id>` - Update debtor
- `POST /api/debtors/<id>/payments` - Record payment

### Analytics
- `GET /api/analytics/summary` - Get summary
- `GET /api/analytics/sales-trends` - Get sales trends
- `GET /api/analytics/top-products` - Get top products
- `GET /api/analytics/debt-summary` - Get debt summary
- `GET /api/analytics/inventory-status` - Get inventory status

### AI
- `POST /api/ai/sales-insights` - Get sales insights
- `POST /api/ai/debt-risks` - Get debt risk analysis
- `POST /api/ai/inventory-forecast` - Get inventory forecast
- `POST /api/ai/health-score` - Get business health score

## Running in Development Mode

### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # or .\venv\Scripts\Activate.ps1 on Windows
python run.py
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Both services are now running:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## Testing

### Backend Tests
```bash
cd backend
pytest tests/
pytest --cov=app tests/  # With coverage
```

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:coverage
```

## Linting & Formatting

### Backend
```bash
# Format with black
black app/

# Check with flake8
flake8 app/

# Check with pylint
pylint app/
```

### Frontend
```bash
# Lint
npm run lint

# Fix issues
npm run lint -- --fix
```

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

**Database errors:**
- Delete `tokbiz_dev.db` to reset
- Ensure PostgreSQL service is running for production

**Module not found:**
```bash
pip install -r requirements.txt
```

### Frontend Issues

**Port already in use:**
```bash
# Change port in vite.config.ts or:
npm run dev -- --port 3000
```

**Dependencies issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Deployment

See `DEPLOYMENT.md` for production deployment instructions.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

See LICENSE file for details.

## Support

For issues and questions, please create an issue on GitHub.
