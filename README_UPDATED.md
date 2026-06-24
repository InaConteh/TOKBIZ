# TokBiz - AI Business Intelligence Platform for MSMEs

## Overview

TokBiz is an innovative AI-powered platform designed to transform how Micro, Small, and Medium Enterprises (MSMEs) in Sierra Leone manage their business operations. By combining digital tools with intelligent insights, TokBiz helps business owners:

- 📊 **Track Operations**: Digitize sales, inventory, and debt management
- 🤖 **Get AI Insights**: Receive actionable business intelligence
- 💰 **Optimize Revenue**: Identify best-selling products and revenue opportunities
- ⚠️ **Manage Risk**: Predict debt risks and recommend recovery strategies
- 📈 **Forecast Growth**: Get intelligent inventory and restocking recommendations

## Key Features

### MVP (Phase 1-2)
- ✅ User Authentication (Owner/Staff roles)
- ✅ Business Profile Management
- ✅ Inventory Management with stock tracking
- ✅ Sales Recording & History
- ✅ Debt/Credit Management
- ✅ Analytics Dashboard
- ✅ AI Business Assistant

### Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + Shadcn UI
- Recharts (data visualization)
- React Router (navigation)

**Backend:**
- Flask (Python)
- SQLAlchemy ORM
- Flask-JWT-Extended (authentication)
- PostgreSQL (production) / SQLite (development)

**AI Integration:**
- Ollama (local Llama 3) or OpenAI API

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Git

### Setup (Automated)

**Windows:**
```powershell
.\setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

See [SETUP.md](SETUP.md) for detailed setup instructions.

## Project Structure

```
TOKBIZ/
├── backend/              # Flask REST API
├── frontend/             # React TypeScript SPA
├── docs/                 # Documentation
├── diagrams.md          # Architecture diagrams
├── SETUP.md             # Setup guide
└── README.md            # This file
```

## Development

### Start Backend
```bash
cd backend
source venv/bin/activate
python run.py
```

### Start Frontend
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

## API Documentation

See [SETUP.md](SETUP.md#api-endpoints) for complete API endpoint list.

## Roadmap

### Phase 1: Core Features ✅
- Authentication & Authorization
- Business Management
- Inventory System
- Sales Recording
- Debt Tracking
- Basic Analytics

### Phase 2: AI Integration
- Sales Analysis & Insights
- Debt Risk Prediction
- Inventory Forecasting
- Business Health Score

### Phase 3: Advanced Features
- Mobile App
- Payment Integration
- Supplier Management
- Expense Tracking
- Multi-currency Support

## Testing

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm run test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

See deployment-specific guides for:
- [Frontend Deployment (Vercel)](docs/deployment/FRONTEND.md)
- [Backend Deployment (Render)](docs/deployment/BACKEND.md)
- [Database Setup (Neon)](docs/deployment/DATABASE.md)

## Troubleshooting

See [SETUP.md#troubleshooting](SETUP.md#troubleshooting) for common issues and solutions.

## Documentation

- [Setup Guide](SETUP.md)
- [Design Document](TokBiz%20Design%20Document.md)
- [Technical Document](TokBiz%20Technical%20Document.md)
- [Product Requirements](TokBiz%20Product%20Requirements%20Document%20\(PRD\).md)
- [Architecture Diagrams](diagrams.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or suggestions:
1. Check existing [issues](https://github.com/tokbiz/tokbiz/issues)
2. Review [SETUP.md](SETUP.md#troubleshooting)
3. Create a new issue with detailed description

## Team & Acknowledgments

- Product Vision: Built for MSMEs in Sierra Leone
- Special thanks to all contributors

---

**Last Updated:** 2026-06-24  
**Current Version:** 0.1.0 (Setup Phase)
