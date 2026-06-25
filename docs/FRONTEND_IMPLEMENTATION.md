# Frontend Implementation

This document describes the frontend implementation details for TokBiz.

## Frontend Structure

- `frontend/src/main.tsx` — React app bootstrap.
- `frontend/src/App.tsx` — routing configuration.
- `frontend/src/services/api.ts` — Axios client and API wrappers.
- `frontend/src/pages/` — page components.
- `frontend/src/types/index.ts` — shared TypeScript models.

## Pages

### Home
- Public landing page.
- Provides links to login, register, and AI insights.

### Login
- Captures email and password.
- Calls `api.login()` and stores `access_token` in `localStorage`.
- Redirects to `/dashboard` on success.

### Register
- Captures name, email, and password.
- Calls `api.register()` and stores `access_token` in `localStorage`.
- Redirects to `/dashboard` on success.

### Dashboard
- Loads analytics summary via `api.getAnalyticsSummary()`.
- Displays total sales, revenue, debt, and inventory value.
- Includes a link to the AI insights page.

### AI
- Provides buttons for Sales Insights, Debt Risk, Inventory Forecast, and Health Score.
- Calls backend AI endpoints through the API client.
- Displays the returned AI text output.

## API Client

`frontend/src/services/api.ts`:
- Sets base URL from `VITE_API_BASE_URL` or default `http://localhost:5000/api`.
- Injects `Authorization: Bearer <token>` header if `access_token` exists.
- Handles 401 responses by clearing token and redirecting to `/login`.
- Implements wrapper methods for auth, business, product, sales, debtor, analytics, and AI endpoints.

## Types

Shared type definitions in `frontend/src/types/index.ts` include:
- `User`
- `Business`
- `Product`
- `Sale`
- `SaleItem`
- `Debtor`
- `Payment`
- `LoginRequest`, `LoginResponse`, `RegisterRequest`
- `AnalyticsSummary`
- Generic `ApiResponse<T>` and `ApiError`

## Styling

- Uses Tailwind-style utility classes for layout and components.
- Global styles are loaded from `frontend/src/styles/index.css`.

## Notes

- The frontend is built with React Router v6.
- The app can be run with `npm run dev` from `frontend/`.
- AI page uses direct dynamic method selection to map user choices to backend endpoints.
