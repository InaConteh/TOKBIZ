from unittest.mock import patch

def test_sales_insights(client, auth_header):
    with patch("app.services.ai_service.AiService.get_response") as mock_ai:
        mock_ai.return_value = "Mocked sales insights"
        response = client.post("/api/ai/sales-insights", headers=auth_header)
        assert response.status_code == 200
        assert response.get_json()["insights"] == "Mocked sales insights"
        mock_ai.assert_called_once()

def test_debt_risks(client, auth_header):
    with patch("app.services.ai_service.AiService.get_response") as mock_ai:
        mock_ai.return_value = "Mocked debt risks"
        response = client.post("/api/ai/debt-risks", headers=auth_header)
        assert response.status_code == 200
        # If no debtors, it returns a message directly without calling AI usually,
        # but my refactor might have changed that if I didn't keep the "if not debtors" check.
        # Let's check the code: it has "if not debtors: return ..."
        assert "risks" in response.get_json()

def test_inventory_forecast(client, auth_header):
    with patch("app.services.ai_service.AiService.get_response") as mock_ai:
        mock_ai.return_value = "Mocked inventory forecast"
        response = client.post("/api/ai/inventory-forecast", headers=auth_header)
        assert response.status_code == 200
        # If no products, returns early.
        assert "forecast" in response.get_json()

def test_health_score(client, auth_header):
    with patch("app.services.ai_service.AiService.get_response") as mock_ai:
        mock_ai.return_value = "Mocked health score"
        response = client.post("/api/ai/health-score", headers=auth_header)
        assert response.status_code == 200
        assert response.get_json()["health_score"] == "Mocked health score"
