import pytest
from fastapi.testclient import TestClient
from app.services.auth_service import create_access_token

@pytest.fixture
def auth_headers(client: TestClient):
    # Register a test user and get token
    user_data = {
        "email": "nutrition@example.com",
        "username": "nutritionuser",
        "password": "testpass123",
        "fitness_goal": "maintenance"
    }
    client.post("/api/register", json=user_data)
    
    login_response = client.post("/api/login", data={
        "username": user_data["email"],
        "password": user_data["password"]
    })
    token = login_response.json()["access_token"]
    
    return {"Authorization": f"Bearer {token}"}

def test_create_meal(client: TestClient, auth_headers):
    meal_data = {
        "description": "Test meal",
        "meal_type": "lunch",
        "calories": 500,
        "protein": 30,
        "carbs": 50,
        "fat": 20
    }
    
    response = client.post(
        "/api/meals",
        json=meal_data,
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["description"] == meal_data["description"]
    assert data["calories"] == meal_data["calories"]

def test_get_meals(client: TestClient, auth_headers):
    # First create a meal
    meal_data = {
        "description": "Test meal",
        "meal_type": "lunch",
        "calories": 500,
        "protein": 30,
        "carbs": 50,
        "fat": 20
    }
    client.post("/api/meals", json=meal_data, headers=auth_headers)
    
    # Then get meals
    response = client.get("/api/meals", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["description"] == meal_data["description"]

def test_nutrition_goals(client: TestClient, auth_headers):
    goals_data = {
        "calories": 2500,
        "protein": 180,
        "carbs": 300,
        "fat": 80
    }
    
    # Update goals
    response = client.put(
        "/api/nutrition-goals",
        json=goals_data,
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["calories"] == goals_data["calories"]
    
    # Get goals
    response = client.get("/api/nutrition-goals", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["calories"] == goals_data["calories"]