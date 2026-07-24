import time
import pytest
import secrets
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def anyio_backend():
    return 'asyncio'

def test_audit_flow_1_new_user_registration_to_dashboard():
    """Flow 1: New user registration -> Receive OTP -> Verify OTP -> Dashboard"""
    test_email = f"audit_new_{secrets.token_hex(4)}@company.com"
    
    # 1. Register
    t0 = time.perf_counter()
    reg_resp = client.post("/api/auth/register", json={
        "first_name": "Audit",
        "last_name": "NewUser",
        "email": test_email,
        "password": "NegoSphere2026!",
        "country": "India",
        "accept_terms": True
    })
    reg_time_ms = (time.perf_counter() - t0) * 1000.0
    
    assert reg_resp.status_code == 200
    reg_data = reg_resp.json()
    assert reg_data["status"] == "success"
    otp_code = reg_data.get("dev_otp_code")
    assert otp_code is not None
    assert reg_time_ms < 2000.0 # Target < 2s

    # 2. Verify OTP
    t1 = time.perf_counter()
    verify_resp = client.post("/api/auth/verify-email-otp", json={
        "email": test_email,
        "otp_code": otp_code
    })
    verify_time_ms = (time.perf_counter() - t1) * 1000.0
    
    assert verify_resp.status_code == 200
    verify_data = verify_resp.json()
    assert verify_data["status"] == "success"
    assert "access_token" in verify_data
    assert verify_data["user"]["is_email_verified"] is True
    assert verify_time_ms < 2000.0 # Target < 2s

def test_audit_flow_2_existing_verified_user_instant_login():
    """Flow 2: Existing verified user -> Login -> Dashboard immediately without OTP"""
    test_email = f"audit_verified_{secrets.token_hex(4)}@company.com"
    
    # Create & verify user
    reg_resp = client.post("/api/auth/register", json={
        "first_name": "Verified",
        "last_name": "User",
        "email": test_email,
        "password": "NegoSphere2026!",
        "country": "India",
        "accept_terms": True
    })
    otp_code = reg_resp.json()["dev_otp_code"]
    client.post("/api/auth/verify-email-otp", json={"email": test_email, "otp_code": otp_code})

    # Now test Login for verified user
    t0 = time.perf_counter()
    login_resp = client.post("/api/auth/login", json={
        "email": test_email,
        "password": "NegoSphere2026!",
        "remember_me": True
    })
    login_time_ms = (time.perf_counter() - t0) * 1000.0

    assert login_resp.status_code == 200
    login_data = login_resp.json()
    assert login_data["status"] == "success"
    assert "access_token" in login_data
    assert login_data["user"]["is_email_verified"] is True
    assert login_time_ms < 1000.0 # Target < 1s

def test_audit_flow_3_and_4_session_restoration_get_me():
    """Flow 3 & 4: Active session restoration (/api/auth/me) across browser refresh / restart"""
    test_email = f"audit_session_{secrets.token_hex(4)}@company.com"
    
    reg_resp = client.post("/api/auth/register", json={
        "first_name": "Session",
        "last_name": "User",
        "email": test_email,
        "password": "NegoSphere2026!",
        "country": "India",
        "accept_terms": True
    })
    otp_code = reg_resp.json()["dev_otp_code"]
    verify_resp = client.post("/api/auth/verify-email-otp", json={"email": test_email, "otp_code": otp_code})
    token = verify_resp.json()["access_token"]

    # Test /me with Bearer token
    t0 = time.perf_counter()
    me_resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    me_time_ms = (time.perf_counter() - t0) * 1000.0

    assert me_resp.status_code == 200
    assert me_resp.json()["status"] == "success"
    assert me_resp.json()["user"]["email"] == test_email
    assert me_time_ms < 500.0

def test_audit_flow_5_protected_route_access_control():
    """Flow 5: Protected route access control (authenticated vs unauthenticated)"""
    # Unauthenticated request -> 401
    unauth_resp = client.get("/api/auth/me")
    assert unauth_resp.status_code == 401

    # Authenticated request -> 200
    test_email = f"audit_protected_{secrets.token_hex(4)}@company.com"
    reg_resp = client.post("/api/auth/register", json={
        "first_name": "Protected",
        "last_name": "User",
        "email": test_email,
        "password": "NegoSphere2026!",
        "country": "India",
        "accept_terms": True
    })
    otp_code = reg_resp.json()["dev_otp_code"]
    verify_resp = client.post("/api/auth/verify-email-otp", json={"email": test_email, "otp_code": otp_code})
    token = verify_resp.json()["access_token"]

    auth_resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert auth_resp.status_code == 200

def test_audit_flow_6_token_refresh():
    """Flow 6: Automatic token refresh using refresh token"""
    test_email = f"audit_refresh_{secrets.token_hex(4)}@company.com"
    reg_resp = client.post("/api/auth/register", json={
        "first_name": "Refresh",
        "last_name": "User",
        "email": test_email,
        "password": "NegoSphere2026!",
        "country": "India",
        "accept_terms": True
    })
    otp_code = reg_resp.json()["dev_otp_code"]
    verify_resp = client.post("/api/auth/verify-email-otp", json={"email": test_email, "otp_code": otp_code})
    refresh_token = verify_resp.json()["refresh_token"]

    t0 = time.perf_counter()
    ref_resp = client.post("/api/auth/refresh", json={"refresh_token": refresh_token})
    ref_time_ms = (time.perf_counter() - t0) * 1000.0

    assert ref_resp.status_code == 200
    ref_data = ref_resp.json()
    assert ref_data["status"] == "success"
    assert "access_token" in ref_data
    assert ref_time_ms < 1000.0

def test_audit_flow_7_invalid_credentials_clear_messages():
    """Flow 7: Invalid email / wrong password error handling"""
    resp = client.post("/api/auth/login", json={
        "email": "nonexistent_email_12399@company.com",
        "password": "WrongPassword123!"
    })
    assert resp.status_code == 400
    assert "Account not found" in resp.json()["detail"]

def test_audit_flow_8_resend_otp():
    """Flow 8: Resending OTP without restarting registration"""
    test_email = f"audit_resend_{secrets.token_hex(4)}@company.com"
    client.post("/api/auth/register", json={
        "first_name": "Resend",
        "last_name": "User",
        "email": test_email,
        "password": "NegoSphere2026!",
        "country": "India",
        "accept_terms": True
    })
    
    # Update created_at in DB to bypass 60s rate limit for test
    from app.db.database import AsyncSessionLocal
    from app.db.models import EmailVerificationToken
    from sqlalchemy import update
    from datetime import datetime, timedelta
    import asyncio

    async def shift_token_time():
        async with AsyncSessionLocal() as session:
            await session.execute(
                update(EmailVerificationToken)
                .where(EmailVerificationToken.email == test_email)
                .values(created_at=datetime.utcnow() - timedelta(seconds=65))
            )
            await session.commit()
    
    asyncio.run(shift_token_time())

    t0 = time.perf_counter()
    resend_resp = client.post("/api/auth/resend-email-otp", json={"email": test_email})
    resend_time_ms = (time.perf_counter() - t0) * 1000.0

    assert resend_resp.status_code == 200
    resend_data = resend_resp.json()
    assert resend_data["status"] == "success"
    assert "dev_otp_code" in resend_data
    assert resend_time_ms < 2000.0

