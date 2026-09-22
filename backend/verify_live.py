import io
import httpx
from PIL import Image

BASE_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://localhost:5173"

def run_checks():
    print("--- 1. Testing API Docs ---")
    docs_res = httpx.get(f"{BASE_URL}/docs")
    assert docs_res.status_code == 200, f"Docs failed: {docs_res.status_code}"
    print("✓ API docs available at /docs (Status: 200)")

    print("\n--- 2. Testing User Registration (Flow 1) ---")
    reg_payload = {
        "name": "Alex Rivera",
        "email": "alex.rivera@imgx.ai",
        "password": "Password123!"
    }
    reg_res = httpx.post(f"{BASE_URL}/api/auth/register", json=reg_payload)
    if reg_res.status_code == 400 and "already exists" in reg_res.text:
        print("✓ User already registered, proceeding...")
    else:
        assert reg_res.status_code == 201, f"Register failed: {reg_res.text}"
        print(f"✓ Registered: {reg_res.json()['user']['email']}")

    print("\n--- 3. Testing Duplicate Registration Error ---")
    dup_res = httpx.post(f"{BASE_URL}/api/auth/register", json=reg_payload)
    assert dup_res.status_code == 400
    assert "already exists" in dup_res.json()["detail"]
    print("✓ Duplicate email correctly rejected with 400")

    print("\n--- 4. Testing Invalid Login (Flow 3) ---")
    bad_login = httpx.post(f"{BASE_URL}/api/auth/login", json={"email": reg_payload["email"], "password": "wrong"})
    assert bad_login.status_code == 401
    assert "Invalid email or password" in bad_login.json()["detail"]
    print("✓ Invalid credentials correctly rejected with 401")

    print("\n--- 5. Testing Valid Login (Flow 2) ---")
    login_res = httpx.post(f"{BASE_URL}/api/auth/login", json={"email": reg_payload["email"], "password": reg_payload["password"]})
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    auth_data = login_res.json()
    token = auth_data["access_token"]
    assert token
    headers = {"Authorization": f"Bearer {token}"}
    print(f"✓ Login successful, JWT token issued: {token[:20]}...")

    print("\n--- 6. Testing /api/auth/me (Flow 10) ---")
    me_res = httpx.get(f"{BASE_URL}/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == reg_payload["email"]
    print(f"✓ Session authenticated as: {me_res.json()['name']} ({me_res.json()['email']})")

    print("\n--- 7. Testing Image Classification (Flow 4) ---")
    # Generate a synthetic golden-toned test image
    img_buf = io.BytesIO()
    img = Image.new("RGB", (224, 224), color=(218, 165, 32))
    img.save(img_buf, format="JPEG")
    img_buf.seek(0)

    files = {"file": ("golden_test.jpg", img_buf.getvalue(), "image/jpeg")}
    classify_res = httpx.post(f"{BASE_URL}/api/classify", headers=headers, files=files)
    assert classify_res.status_code == 200, f"Classify failed: {classify_res.text}"
    result = classify_res.json()
    assert "classification" in result, "classification field missing"
    assert "category" in result["classification"], "category missing in classification"
    assert "subcategory" in result["classification"], "subcategory missing in classification"
    assert "specific" in result["classification"], "specific missing in classification"
    assert "hierarchy" in result, "hierarchy missing in response"
    print(f"✓ Hierarchical Classification Result:")
    print(f"  - Level 1 (Category):    {result['classification']['category']['name']} ({result['classification']['category']['confidence']})")
    print(f"  - Level 2 (Subcategory): {result['classification']['subcategory']['name']} ({result['classification']['subcategory']['confidence']})")
    print(f"  - Level 3 (Specific):    {result['classification']['specific']['name']} ({result['classification']['specific']['confidence']})")
    print(f"  - Prediction: {result['prediction']}")
    print(f"  - Confidence: {result['confidence']}")
    print(f"  - Latency: {result['latency']}")
    print(f"  - Category: {result['category']}")
    print(f"  - Subcategory: {result.get('subcategory')}")
    print(f"  - Specific: {result.get('specific')}")
    print(f"  - Image URL: {result['image_url']}")
    print(f"  - Top 3 Alternatives: {[a['name'] for a in result['alternatives'][:3]]}")

    print("\n--- 8. Testing Uploaded Image Serving ---")
    fetch_url = result['image_url'] if result['image_url'].startswith("http") else f"{BASE_URL}{result['image_url']}"
    img_fetch = httpx.get(fetch_url)
    assert img_fetch.status_code == 200
    assert len(img_fetch.content) > 0
    print(f"✓ Uploaded image correctly served ({len(img_fetch.content)} bytes)")

    print("\n--- 9. Testing History (Flow 5) ---")
    history_res = httpx.get(f"{BASE_URL}/api/history", headers=headers)
    assert history_res.status_code == 200
    history = history_res.json()
    assert len(history) >= 1
    assert history[0]["prediction"] == result["prediction"]
    assert "category" in history[0]
    assert "subcategory" in history[0]
    assert "specific" in history[0]
    print(f"✓ History records retrieved: {len(history)} record(s) with hierarchical metadata")

    print("\n--- 10. Testing User Isolation (Flow 9) ---")
    # Create second user
    user_b_reg = {
        "name": "Sarah Connor",
        "email": "sarah.connor@imgx.ai",
        "password": "Password123!"
    }
    httpx.post(f"{BASE_URL}/api/auth/register", json=user_b_reg)
    user_b_token = httpx.post(f"{BASE_URL}/api/auth/login", json={"email": user_b_reg["email"], "password": user_b_reg["password"]}).json()["access_token"]
    user_b_headers = {"Authorization": f"Bearer {user_b_token}"}
    user_b_history = httpx.get(f"{BASE_URL}/api/history", headers=user_b_headers).json()
    assert len(user_b_history) == 0, f"User isolation breached! Sarah sees: {user_b_history}"
    print("✓ User B history is completely empty (User isolation verified 100%)")

    print("\n--- 11. Testing Frontend HTTP Serving ---")
    fe_res = httpx.get(FRONTEND_URL)
    assert fe_res.status_code == 200
    assert "imgx.ai" in fe_res.text or "<div id=\"root\">" in fe_res.text
    print("✓ Frontend served on http://localhost:5173 (Status: 200)")

    print("\n==========================================")
    print("ALL 11 LIVE INTEGRATION CHECKS PASSED!")
    print("==========================================")

if __name__ == "__main__":
    run_checks()
