# TokBiz Technical Document

## 1. Introduction
This document outlines the technical architecture, technology stack, and implementation details for the TokBiz platform. TokBiz is a digital business management and intelligence platform designed to help Small and Medium Enterprises (MSMEs) in Sierra Leone manage their daily operations, improve financial tracking, and build trust with customers and resellers.

## 2. System Architecture
The TokBiz platform follows a modern, decoupled four-tier architecture designed for scalability, maintainability, and performance.

### 2.1 Presentation Layer
The frontend is built as a Single Page Application (SPA) using React and TypeScript. It provides a responsive web dashboard and business user interface. The UI components are styled using Tailwind CSS and Shadcn UI, ensuring a consistent and accessible user experience. Recharts is utilized for rendering interactive data visualizations on the analytics dashboard.

### 2.2 Application Layer
The backend is powered by a RESTful API developed with Flask (Python). It handles business logic, user authentication, and data processing. The API acts as the intermediary between the frontend application and the underlying data and intelligence layers.

### 2.3 Data Layer
A PostgreSQL database serves as the primary data store for production environments, ensuring ACID compliance and robust relational data management. During development, SQLite is used for simplicity and speed. SQLAlchemy is employed as the Object-Relational Mapper (ORM) to interact with the database securely and efficiently.

### 2.4 Intelligence Layer
The core differentiator of TokBiz is its AI analysis engine. This layer integrates with an LLM (such as a local Ollama instance or OpenAI API) to process raw business data and generate actionable insights, such as sales trends, debt risk predictions, and inventory forecasting.

## 3. Technology Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React, TypeScript, Vite | Building the interactive user interface and managing client-side state. |
| **UI/Styling** | Tailwind CSS, Shadcn UI | Rapid UI development with utility-first CSS and accessible component primitives. |
| **Data Visualization** | Recharts | Rendering charts and graphs for the analytics dashboard. |
| **Backend Framework** | Flask (Python) | Developing the RESTful API and handling business logic. |
| **Database (Production)** | PostgreSQL | Robust, scalable relational database management. |
| **Database (Development)**| SQLite | Lightweight database for local development and testing. |
| **ORM** | SQLAlchemy | Database interaction and schema management. |
| **Authentication** | Flask-JWT-Extended | Secure, token-based user authentication and authorization. |
| **AI Integration** | Ollama (Llama 3) / OpenAI | Powering the AI Business Assistant for data analysis and insights. |
| **Deployment (Frontend)** | Vercel | Hosting the React application with global CDN distribution. |
| **Deployment (Backend)** | Render | Hosting the Flask API and managing server infrastructure. |
| **Deployment (Database)** | Neon | Serverless PostgreSQL hosting. |

## 4. Security and Authentication
Security is a critical aspect of the TokBiz platform, particularly concerning user data and financial records.

*   **Authentication:** The system utilizes JSON Web Tokens (JWT) via `Flask-JWT-Extended` for secure, stateless authentication. Upon successful login, users receive an access token that must be included in the Authorization header of subsequent API requests.
*   **Role-Based Access Control (RBAC):** The platform supports different user roles (e.g., Owner, Staff) to restrict access to sensitive features and data. Owners have full administrative privileges, while Staff members have limited access tailored to their operational needs.
*   **Data Protection:** Passwords are securely hashed before being stored in the database. All communication between the frontend and backend occurs over HTTPS to encrypt data in transit.

## 5. API Design Principles
The backend exposes a RESTful API that adheres to standard HTTP methods and status codes.

*   **Endpoints:** API endpoints are logically structured around core resources (e.g., `/api/users`, `/api/businesses`, `/api/products`, `/api/sales`, `/api/debtors`).
*   **Data Format:** All API requests and responses utilize JSON format.
*   **Error Handling:** The API returns standardized error responses with appropriate HTTP status codes (e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error) and descriptive error messages to facilitate debugging and frontend error handling.

## 6. AI Integration Details
The AI Business Assistant is integrated into the backend architecture. When a user requests insights or when the system performs periodic analysis, the backend aggregates relevant data from the PostgreSQL database and constructs a prompt. This prompt is then sent to the configured LLM (Ollama or OpenAI). The LLM processes the data and returns structured insights, which the backend then formats and delivers to the frontend for display.

Key AI functions include:
*   **Sales Analysis:** Identifying best-selling products and revenue trends.
*   **Debt Risk Prediction:** Flagging high-risk debtors based on payment history and outstanding balances.
*   **Inventory Forecasting:** Predicting stock depletion and suggesting restock quantities.
*   **Business Health Score:** Calculating an overall health metric based on combined sales, debt, and inventory data.
