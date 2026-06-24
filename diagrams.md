# TokBiz Diagrams

## 1. Data Flow Diagram (Level 1)
```mermaid
graph TD
    User((User: Owner/Staff))
    Auth[Authentication Process]
    BizMgmt[Business Management]
    InvMgmt[Inventory Management]
    SalesMgmt[Sales Management]
    DebtMgmt[Debt Management]
    AI_Engine[AI Analysis Engine]
    DB[(PostgreSQL Database)]

    User -->|Login Credentials| Auth
    Auth -->|Auth Token| User
    Auth <-->|Verify User| DB

    User -->|Business Details| BizMgmt
    BizMgmt <-->|Store/Retrieve| DB

    User -->|Product Info| InvMgmt
    InvMgmt <-->|Stock Levels| DB

    User -->|Transaction Data| SalesMgmt
    SalesMgmt -->|Update Stock| InvMgmt
    SalesMgmt <-->|Sales Records| DB

    User -->|Customer Debt Info| DebtMgmt
    DebtMgmt <-->|Debt Records| DB

    DB -->|Raw Data| AI_Engine
    AI_Engine -->|Insights/Forecasting| User
```

## 2. Entity Relationship Diagram (ERD)
```mermaid
erDiagram
    USER ||--o{ BUSINESS : owns
    BUSINESS ||--o{ PRODUCT : has
    BUSINESS ||--o{ SALE : records
    BUSINESS ||--o{ DEBTOR : tracks
    SALE ||--o{ PRODUCT : includes

    USER {
        int id PK
        string name
        string email
        string password
        string role
    }

    BUSINESS {
        int id PK
        int owner_id FK
        string name
        string category
        string location
    }

    PRODUCT {
        int id PK
        int business_id FK
        string name
        float price
        int quantity
    }

    SALE {
        int id PK
        int business_id FK
        float total_amount
        datetime date
    }

    DEBTOR {
        int id PK
        int business_id FK
        string customer_name
        float amount_owed
        date due_date
        string status
    }
```

## 3. Use Case Diagram
```mermaid
usecaseDiagram
    actor "Business Owner" as Owner
    actor "Staff" as Staff

    package "TokBiz Platform" {
        usecase "Login/Authenticate" as UC1
        usecase "Manage Business Profile" as UC2
        usecase "Manage Inventory" as UC3
        usecase "Record Sales" as UC4
        usecase "Track Customer Debts" as UC5
        usecase "View Analytics Dashboard" as UC6
        usecase "Get AI Business Insights" as UC7
    }

    Owner --> UC1
    Owner --> UC2
    Owner --> UC3
    Owner --> UC4
    Owner --> UC5
    Owner --> UC6
    Owner --> UC7

    Staff --> UC1
    Staff --> UC3
    Staff --> UC4
    Staff --> UC5
```
