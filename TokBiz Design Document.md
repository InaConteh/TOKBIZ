# TokBiz Design Document

## 1. Introduction
This Design Document details the architectural and component-level design of the TokBiz platform. It elaborates on the system's structure, database schema, and the integration of artificial intelligence to provide business intelligence for MSMEs in Sierra Leone.

## 2. System Design
TokBiz is designed as a full-stack web platform with a clear separation of concerns across four distinct layers: Presentation, Application, Data, and Intelligence. This layered architecture promotes modularity, scalability, and ease of maintenance.

### 2.1. Layered Architecture

*   **Presentation Layer:** This layer is responsible for the user interface and user experience. It consumes data from the Application Layer and presents it to the user. Technologies: React, TypeScript, Vite, Tailwind CSS, Shadcn UI, Recharts.
*   **Application Layer:** This layer contains the core business logic, API endpoints, and handles requests from the Presentation Layer. It orchestrates interactions with the Data and Intelligence Layers. Technologies: Flask, SQLAlchemy, Flask-JWT-Extended.
*   **Data Layer:** This layer manages data storage and retrieval. It provides persistent storage for all business-related information. Technologies: PostgreSQL (production), SQLite (development).
*   **Intelligence Layer:** This layer is dedicated to processing business data using AI models to generate insights and support decision-making. Technologies: Ollama (Llama 3) or OpenAI API.

### 2.2. Data Flow

<img src="./dfd.png" alt="Data Flow Diagram" width="700"/>

*   **User Interaction:** Users (Owners/Staff) interact with the Presentation Layer to input data (e.g., product information, sales records) and retrieve information (e.g., dashboard analytics, AI insights).
*   **API Communication:** The Presentation Layer communicates with the Application Layer via RESTful API calls, sending user requests and receiving processed data.
*   **Database Operations:** The Application Layer performs CRUD (Create, Read, Update, Delete) operations on the Data Layer (PostgreSQL) to manage business data.
*   **AI Processing:** The Application Layer sends relevant data to the Intelligence Layer for AI analysis. The Intelligence Layer processes this data and returns insights to the Application Layer, which are then relayed to the Presentation Layer.

## 3. Database Design
The database schema is designed to efficiently store and manage all operational data for MSMEs. The core entities and their relationships are detailed below.

### 3.1. Entity-Relationship Diagram (ERD)

<img src="./erd.png" alt="Entity Relationship Diagram" width="700"/>

### 3.2. Core Entities

*   **Users:** Stores user authentication and profile information. Each user has a unique ID, name, email, and a hashed password. A `role` attribute differentiates between 'Owner' and 'Staff'.
    *   `id` (PK)
    *   `name`
    *   `email`
    *   `password` (hashed)
    *   `role`

*   **Business:** Represents an MSME registered on the platform. Each business is owned by a `User`.
    *   `id` (PK)
    *   `owner_id` (FK to Users.id)
    *   `name`
    *   `category`
    *   `location`

*   **Products:** Stores details of products managed by a `Business`.
    *   `id` (PK)
    *   `business_id` (FK to Business.id)
    *   `name`
    *   `price`
    *   `quantity` (current stock level)

*   **Sales:** Records individual sales transactions for a `Business`.
    *   `id` (PK)
    *   `business_id` (FK to Business.id)
    *   `total_amount`
    *   `date`

*   **Debtors:** Tracks customers who owe money to a `Business` (credit sales).
    *   `id` (PK)
    *   `business_id` (FK to Business.id)
    *   `customer_name`
    *   `amount_owed`
    *   `due_date`
    *   `status` (e.g., 'Outstanding', 'Paid', 'Overdue')

## 4. AI Integration Design
The AI integration is designed to provide proactive and reactive business intelligence, transforming raw data into actionable insights.

### 4.1. AI Layer Functions

*   **Sales Analysis:** The AI analyzes sales data to identify top-performing products, sales trends over time, and potential opportunities for upselling or cross-selling. It can answer queries like 
"Which products are performing best?"
*   **Debt Risk Prediction:** By analyzing payment history, due dates, and outstanding amounts, the AI can flag high-risk debtors and suggest timely follow-ups. It can answer queries like "Who owes me the most money?"
*   **Inventory Forecasting:** The AI predicts stock depletion based on sales velocity and suggests optimal restocking quantities and timings, minimizing stockouts and overstocking. It can answer queries like "What should I restock this week?"
*   **Business Health Score:** A composite score derived from sales, debt, and inventory metrics provides a quick overview of the business's overall health and performance.

### 4.2. AI Workflow
1.  **Data Collection:** The Application Layer gathers relevant data from the PostgreSQL database (e.g., sales records, product quantities, debtor information).
2.  **Prompt Generation:** This data is then formatted into a structured prompt suitable for the chosen LLM.
3.  **LLM Inference:** The prompt is sent to the AI Engine (Ollama or OpenAI API) for processing.
4.  **Insight Extraction:** The LLM generates insights, which are then parsed and validated by the Application Layer.
5.  **Presentation:** The extracted insights are presented to the user through the dashboard or as direct responses from the AI Business Assistant.

## 5. Use Case Design

<img src="./use_case.png" alt="Use Case Diagram" width="700"/>

### 5.1. Key Use Cases

*   **Login/Authenticate:** Users (Owner/Staff) securely log into the platform using their credentials. The system verifies their identity and grants appropriate access based on their role.
*   **Manage Business Profile:** Business Owners can create, view, and update their business's profile information, including category and location.
*   **Manage Inventory:** Users can add new products, update existing product details (name, price, quantity), and receive alerts for low stock levels.
*   **Record Sales:** Staff and Owners can record new sales transactions, which automatically update inventory levels and calculate profit.
*   **Track Customer Debts:** Users can track credit sales, monitor outstanding balances, record payments, and set reminders for due dates.
*   **View Analytics Dashboard:** Owners can access a comprehensive dashboard displaying key business metrics such as total sales, revenue, debt summary, and inventory status through interactive charts.
*   **Get AI Business Insights:** Owners can query the AI Business Assistant for insights into sales performance, debt risk, and inventory recommendations.

## 6. Deployment Strategy
TokBiz utilizes a cloud-native deployment strategy for high availability and scalability.

*   **Frontend:** Deployed on Vercel, leveraging its global CDN for fast content delivery and automatic scaling.
*   **Backend:** Deployed on Render, providing a managed environment for the Flask API with continuous deployment capabilities.
*   **Database:** PostgreSQL database hosted on Neon, offering a serverless and scalable database solution.

This setup ensures that the application can handle varying loads and provides a robust infrastructure for MSMEs.
