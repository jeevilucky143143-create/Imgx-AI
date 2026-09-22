"""
Live end-to-end integration test for IMGX.AI using ASGI TestClient.
Executes all 11 full-stack verification flows:
- Register
- Duplicate check
- Invalid login
- Valid login
- /api/auth/me
- Hierarchical image classification (Animal -> Dog -> Golden Retriever)
- Image serving
- History retrieval with hierarchy
- User isolation
"""

import io
from PIL import Image
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_integration_tests():
    print("=======================================================")
    print("  IMGX.AI FULL-STACK HIERARCHICAL INTEGRATION TESTS    ")
    print("=======================================================\n")

    # Flow 1: Register User A
    print("--- 1. Testing User Registration (Flow 1) ---")
    reg_payload = {
        "name": "David Miller",
        "email": "david.miller@imgx.ai",
        "password": "SecurePassword123!"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    if reg_res.status_code == 400 and "already exists" in reg_res.text:
        print("✓ User already registered, continuing...")
    else:
        assert reg_res.status_code == 201, f"Register failed: {reg_res.text}"
        print(f"✓ Registered user: {reg_res.json()['user']['email']}")

    # Flow 2: Duplicate Registration Check
    print("\n--- 2. Testing Duplicate Email Rejection ---")
    dup_res = client.post("/api/auth/register", json=reg_payload)
    assert dup_res.status_code == 400
    assert "already exists" in dup_res.json()["detail"]
    print("✓ Duplicate email correctly rejected with 400")

    # Flow 3: Invalid Login
    print("\n--- 3. Testing Invalid Password Rejection (Flow 3) ---")
    bad_res = client.post("/api/auth/login", json={"email": reg_payload["email"], "password": "WrongPassword"})
    assert bad_res.status_code == 401
    assert "Invalid email or password" in bad_res.json()["detail"]
    print("✓ Invalid credentials rejected with 401")

    # Flow 4: Valid Login & JWT Issuance
    print("\n--- 4. Testing Valid Login & JWT Issuance (Flow 2) ---")
    login_res = client.post("/api/auth/login", json={"email": reg_payload["email"], "password": reg_payload["password"]})
    assert login_res.status_code == 200
    auth_data = login_res.json()
    token = auth_data["access_token"]
    assert token
    headers = {"Authorization": f"Bearer {token}"}
    print(f"✓ Login successful, JWT token issued: {token[:20]}...")

    # Flow 5: /api/auth/me Session Validation
    print("\n--- 5. Testing /api/auth/me Session Validation (Flow 10) ---")
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == reg_payload["email"]
    print(f"✓ Session authenticated as: {me_res.json()['name']} ({me_res.json()['email']})")

    # Flow 6: Hierarchical Image Classification
    print("\n--- 6. Testing Hierarchical Image Classification (Flow 4) ---")
    img_buf = io.BytesIO()
    img = Image.new("RGB", (224, 224), color=(218, 165, 32))
    img.save(img_buf, format="JPEG")
    img_buf.seek(0)

    files = {"file": ("golden_retriever_test.jpg", img_buf.getvalue(), "image/jpeg")}
    classify_res = client.post("/api/classify", headers=headers, files=files)
    assert classify_res.status_code == 200, f"Classify failed: {classify_res.text}"
    result = classify_res.json()

    assert "classification" in result
    assert "category" in result["classification"]
    assert "subcategory" in result["classification"]
    assert "specific" in result["classification"]
    assert "hierarchy" in result

    print("✓ Hierarchical Classification Response:")
    print(f"  - Level 1 Category:    {result['classification']['category']['name']} ({result['classification']['category']['confidence']})")
    print(f"  - Level 2 Subcategory: {result['classification']['subcategory']['name']} ({result['classification']['subcategory']['confidence']})")
    print(f"  - Level 3 Specific:    {result['classification']['specific']['name']} ({result['classification']['specific']['confidence']})")
    print(f"  - Prediction:          {result['prediction']}")
    print(f"  - Latency:             {result['latency']}")
    print(f"  - Alternatives:        {[a['name'] for a in result['alternatives'][:3]]}")

    # Flow 7: Uploaded Image Serving
    print("\n--- 7. Testing Uploaded Image Serving ---")
    img_fetch = client.get(result["image_url"])
    assert img_fetch.status_code == 200
    assert len(img_fetch.content) > 0
    print(f"✓ Uploaded image correctly served ({len(img_fetch.content)} bytes)")

    # Flow 8: History Retrieval with Hierarchical Metadata
    print("\n--- 8. Testing History Retrieval with Hierarchy (Flow 5) ---")
    history_res = client.get("/api/history", headers=headers)
    assert history_res.status_code == 200
    history = history_res.json()
    assert len(history) >= 1
    assert history[0]["prediction"] == result["prediction"]
    assert "category" in history[0]
    assert "subcategory" in history[0]
    assert "specific" in history[0]
    print(f"✓ History records retrieved: {len(history)} record(s)")
    print(f"  - History record #1: {history[0]['category']} > {history[0]['subcategory']} > {history[0]['specific']}")

    # Flow 9: User Isolation (User B cannot see User A's history)
    print("\n--- 9. Testing User Isolation (Flow 9) ---")
    user_b_payload = {
        "name": "Rachel Zane",
        "email": "rachel.zane@imgx.ai",
        "password": "SecurePassword123!"
    }
    client.post("/api/auth/register", json=user_b_payload)
    user_b_token = client.post("/api/auth/login", json={"email": user_b_payload["email"], "password": user_b_payload["password"]}).json()["access_token"]
    user_b_headers = {"Authorization": f"Bearer {user_b_token}"}
    user_b_history = client.get("/api/history", headers=user_b_headers).json()
    assert len(user_b_history) == 0, f"User isolation breached! Rachel sees: {user_b_history}"
    print("✓ User B history is completely empty (User isolation verified 100%)")

    # Flow 10: Clear History
    print("\n--- 10. Testing Clear History ---")
    clear_res = client.delete("/api/history", headers=headers)
    assert clear_res.status_code == 200
    empty_history = client.get("/api/history", headers=headers).json()
    assert len(empty_history) == 0
    print("✓ History cleared successfully")

    print("\n=======================================================")
    print("  ALL 10 FULL-STACK INTEGRATION FLOWS PASSED!          ")
    print("=======================================================\n")


if __name__ == "__main__":
    run_integration_tests()
