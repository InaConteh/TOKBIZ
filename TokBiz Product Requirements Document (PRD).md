# TokBiz Product Requirements Document (PRD)

## 1. Introduction

This Product Requirements Document (PRD) outlines the features, functionalities, and user experience for TokBiz, an AI-powered business intelligence and trust platform designed for Micro, Small, and Medium Enterprises (MSMEs) in Sierra Leone. The primary goal of TokBiz is to digitize business operations, improve financial tracking, and foster trust within the MSME ecosystem.

## 2. Product Vision

To empower MSMEs in Sierra Leone with a comprehensive, easy-to-use digital platform that transforms manual operations into efficient, data-driven processes, thereby enhancing profitability, reducing risks, and building stronger business relationships.

## 3. Target Audience

*   **Primary Users:** Owners of MSMEs in Sierra Leone (e.g., small shop owners, traders, service providers).
*   **Secondary Users:** Staff members of MSMEs (e.g., sales assistants, inventory managers).

## 4. Problem Statement

MSMEs in Sierra Leone face significant operational challenges due to reliance on manual record-keeping and informal systems. These challenges include:

*   Poor inventory control leading to stockouts or overstocking.
*   Untracked debts and difficulties in managing customer credit, resulting in revenue loss.
*   Lack of visibility into sales performance and overall business health.
*   Absence of structured business data for informed decision-making.
*   Limited tools for forecasting and strategic planning.
*   Weak trust systems between buyers and sellers, hindering business growth.

TokBiz aims to address these issues by providing a centralized digital system with AI-powered decision support.

## 5. Key Features (MVP Scope)

### 5.1. Authentication System

*   **User Registration & Login:** Secure process for new users to sign up and existing users to log in.
*   **Role-Based Access:** Differentiate between 
Owner (full access) and Staff (limited access) roles.
*   **Secure JWT Authentication:** Implementation of JSON Web Tokens for secure session management.

### 5.2. Business Management

*   **Create & Manage Business Profile:** Allow owners to set up and update their business name, category, and location.

### 5.3. Inventory Management

*   **Product Catalog:** Ability to add, edit, and delete products with details like name, price, and quantity.
*   **Stock Tracking:** Real-time tracking of product quantities.
*   **Low Stock Alerts:** Automated notifications when product stock falls below a predefined threshold.

### 5.4. Sales Management

*   **Record Sales Transactions:** Intuitive interface to record daily sales, including products sold and quantities.
*   **Automatic Profit Calculation:** System automatically calculates profit margins for each sale.
*   **Inventory Auto-Update:** Sales transactions automatically decrement product quantities in inventory.
*   **Sales History:** Maintain a searchable history of all sales transactions.

### 5.5. Debt Management

*   **Credit Sales Tracking:** Record and monitor sales made on credit to customers.
*   **Outstanding Balances:** View current outstanding balances for each customer.
*   **Payment History:** Track all payments made against credit sales.
*   **Due Date Reminders:** Automated reminders for upcoming or overdue payments.

### 5.6. Dashboard Analytics

*   **Overview:** A dashboard providing a summary of total sales, revenue, debt, and inventory status.
*   **Performance Charts:** Visual representations of key business metrics over time (e.g., sales trends, revenue growth).

### 5.7. AI Business Assistant

*   **Sales Insights:** Provide AI-driven analysis on best-selling products, sales patterns, and revenue opportunities.
*   **Debt Risk Analysis:** Identify high-risk debtors and suggest strategies for debt recovery.
*   **Inventory Restocking Suggestions:** Offer intelligent recommendations for product restocking based on sales forecasts.
*   **Business Performance Summaries:** Generate concise summaries of overall business health and key performance indicators.

## 6. User Roles & Permissions

| Feature | Business Owner | Staff |
| :--- | :--- | :--- |
| Login/Logout | Yes | Yes |
| Manage Business Profile | Yes | No |
| Manage Inventory | Yes | Yes |
| Record Sales | Yes | Yes |
| Track Customer Debts | Yes | Yes |
| View Analytics Dashboard | Yes | No |
| Get AI Business Insights | Yes | No |

## 7. Technical Requirements

*   **Scalability:** The platform must be able to handle a growing number of MSMEs and transactions.
*   **Security:** All user data and financial information must be protected with industry-standard security measures (e.g., HTTPS, password hashing, JWT).
*   **Performance:** The application should be responsive, with fast loading times and efficient data processing.
*   **Reliability:** High uptime and data integrity are crucial for business operations.
*   **Maintainability:** The codebase should be well-structured, documented, and easy to maintain and extend.
*   **AI Integration:** Seamless integration with chosen LLM providers (Ollama/OpenAI) for intelligent features.

## 8. Future Enhancements (Beyond MVP)

*   **Supplier Management:** Track suppliers and purchase orders.
*   **Expense Tracking:** Record and categorize business expenses.
*   **Multi-currency Support:** For businesses dealing with international transactions.
*   **Mobile Application:** Native mobile apps for iOS and Android for on-the-go management.
*   **Integration with Payment Gateways:** Facilitate digital payments for sales and debt collection.

## 9. Success Metrics

*   **User Adoption:** Number of active MSMEs using the platform.
*   **Transaction Volume:** Total number of sales and debt transactions recorded.
*   **Debt Recovery Rate:** Improvement in the percentage of recovered debts.
*   **Inventory Accuracy:** Reduction in discrepancies between recorded and actual stock levels.
*   **User Satisfaction:** Feedback from MSMEs on the platform's usefulness and ease of use.

## 10. Conclusion

TokBiz is poised to significantly impact MSMEs in Sierra Leone by providing essential digital tools and AI-driven insights. By addressing critical operational challenges, TokBiz will contribute to the growth and formalization of small businesses, fostering a more robust local economy.
