import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import settings

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "NegoSphere"

def test_maps_endpoint_when_not_configured(monkeypatch):
    monkeypatch.setattr(settings, "GOOGLE_MAPS_API_KEY", "")
    
    # Test /api/maps/nearby-stores
    resp_stores = client.get("/api/maps/nearby-stores")
    assert resp_stores.status_code == 200
    data_stores = resp_stores.json()
    assert data_stores["status"] == "disabled"
    assert "Google Maps is not configured" in data_stores["message"]

    # Test /api/maps/directions
    resp_dir = client.get("/api/maps/directions?origin_lat=28.5&origin_lng=77.2&dest_lat=28.6&dest_lng=77.3")
    assert resp_dir.status_code == 200
    data_dir = resp_dir.json()
    assert data_dir["status"] == "disabled"
    assert "Google Maps is not configured" in data_dir["message"]

    # Test /api/maps/optimize-shopping-route
    resp_opt = client.post("/api/maps/optimize-shopping-route", json={
        "origin_lat": 28.5,
        "origin_lng": 77.2,
        "destinations": [{"name": "Store 1", "lat": 28.6, "lng": 77.3}]
    })
    assert resp_opt.status_code == 200
    data_opt = resp_opt.json()
    assert data_opt["status"] == "disabled"
    assert "Google Maps is not configured" in data_opt["message"]
