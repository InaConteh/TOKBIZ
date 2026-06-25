# AI Implementation

This document describes the AI assistant implementation for TokBiz.

## AI Goals

- Provide sales insights and recommendations.
- Analyze debtor risk and collection strategy.
- Forecast inventory needs.
- Compute an overall business health score.

## Backend AI Routes

Implemented in `backend/app/routes/ai.py`:

- `POST /api/ai/sales-insights`
- `POST /api/ai/debt-risks`
- `POST /api/ai/inventory-forecast`
- `POST /api/ai/health-score`

## Data Aggregation

The backend aggregates data for the current authenticated user's businesses:
- Sales and sales items
- Products and inventory levels
- Debtors and payment status
- Business metadata

This data is used to construct prompts for the AI model.

## LLM Integration

- Uses the `openai` Python library.
- `OPENAI_API_KEY` environment variable is required.
- `OPENAI_MODEL` environment variable can be used to override the default model.

### Prompt Design

- For sales insights, it summarizes total and recent sales, plus top products.
- For debt risk, it summarizes outstanding debtor accounts and asks for risk recommendations.
- For inventory forecast, it summarizes product stock and recent demand.
- For health score, it summarizes revenue, debt, and inventory values.

## Response Handling

- The backend returns the raw AI text under keys like `insights`, `risks`, `forecast`, and `health_score`.
- The frontend renders the result in a user-facing card.

## Frontend AI Page

Implemented in `frontend/src/pages/AI.tsx`:
- Buttons to choose the AI analysis type.
- A single action button to invoke the analysis.
- A results panel to display the AI output.

## Notes

- If `OPENAI_API_KEY` is not configured, the backend returns the prompt text instead of a live AI response.
- The AI routes are protected by `@jwt_required()`.
- This implementation is extensible to additional providers like Ollama or other local LLMs.
