import io
import sys
import os
from PIL import Image
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
from database import Base, engine


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


def create_test_image():
    file = io.BytesIO()
    image = Image.new("RGB", (100, 100), color=(139, 92, 246))
    image.save(file, format="JPEG")
    file.seek(0)
    return file


def test_register_success(client):
    response = client.post(
        "/api/auth/register",
        json={"name": "Alice Tester", "email": "alice@test.com", "password": "password123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert "user" in data
    assert data["user"]["email"] == "alice@test.com"
    assert data["user"]["name"] == "Alice Tester"


def test_register_duplicate_email(client):
    client.post(
        "/api/auth/register",
        json={"name": "Alice Tester", "email": "alice@test.com", "password": "password123"}
    )
    response = client.post(
        "/api/auth/register",
        json={"name": "Alice Two", "email": "alice@test.com", "password": "different_pwd"}
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_login_success(client):
    client.post(
        "/api/auth/register",
        json={"name": "Bob Tester", "email": "bob@test.com", "password": "secretpassword"}
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "bob@test.com", "password": "secretpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "bob@test.com"


def test_login_invalid_password(client):
    client.post(
        "/api/auth/register",
        json={"name": "Bob Tester", "email": "bob@test.com", "password": "secretpassword"}
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "bob@test.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]


def test_get_me(client):
    client.post(
        "/api/auth/register",
        json={"name": "Charlie", "email": "charlie@test.com", "password": "password123"}
    )
    login_res = client.post(
        "/api/auth/login",
        json={"email": "charlie@test.com", "password": "password123"}
    )
    token = login_res.json()["access_token"]

    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "charlie@test.com"


def test_classify_and_history_isolation(client):
    # Register User A and User B
    client.post("/api/auth/register", json={"name": "User A", "email": "usera@test.com", "password": "password123"})
    client.post("/api/auth/register", json={"name": "User B", "email": "userb@test.com", "password": "password123"})

    token_a = client.post("/api/auth/login", json={"email": "usera@test.com", "password": "password123"}).json()["access_token"]
    token_b = client.post("/api/auth/login", json={"email": "userb@test.com", "password": "password123"}).json()["access_token"]

    # User A classifies an image
    img_file = create_test_image()
    classify_res = client.post(
        "/api/classify",
        headers={"Authorization": f"Bearer {token_a}"},
        files={"file": ("test_pic.jpg", img_file, "image/jpeg")}
    )
    assert classify_res.status_code == 200
    res_data = classify_res.json()
    assert "prediction" in res_data
    assert "confidence" in res_data
    assert "top_predictions" in res_data
    assert len(res_data["top_predictions"]) > 0

    # User A history has 1 record
    history_a = client.get("/api/history", headers={"Authorization": f"Bearer {token_a}"})
    assert history_a.status_code == 200
    assert len(history_a.json()) == 1
    assert history_a.json()[0]["prediction"] == res_data["prediction"]

    # User B history must be EMPTY (User isolation guaranteed)
    history_b = client.get("/api/history", headers={"Authorization": f"Bearer {token_b}"})
    assert history_b.status_code == 200
    assert len(history_b.json()) == 0


def test_invalid_image_upload(client):
    client.post("/api/auth/register", json={"name": "User C", "email": "userc@test.com", "password": "password123"})
    token = client.post("/api/auth/login", json={"email": "userc@test.com", "password": "password123"}).json()["access_token"]

    # Upload invalid file (e.g. text disguised as jpg)
    bad_file = io.BytesIO(b"NOT_A_REAL_IMAGE_FILE")
    response = client.post(
        "/api/classify",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("fake.jpg", bad_file, "image/jpeg")}
    )
    assert response.status_code == 400
    assert "Please upload a valid image" in response.json()["detail"]
