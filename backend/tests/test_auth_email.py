import pytest
import uuid
import secrets
from datetime import datetime, timedelta
from app.api.auth import hash_code, validate_password_strength
from app.services.email_service import email_service

def test_password_strength_validation():
    # Valid password
    validate_password_strength("NegoSphere2026!")

    # Invalid short password
    with pytest.raises(Exception):
        validate_password_strength("Short1!")

    # Invalid password missing special char
    with pytest.raises(Exception):
        validate_password_strength("NegoSphere2026")

def test_otp_code_hashing():
    code = "749201"
    salt = secrets.token_hex(16)
    
    hash1 = hash_code(code, salt)
    hash2 = hash_code(code, salt)
    hash_wrong = hash_code("000000", salt)

    assert hash1 == hash2
    assert hash1 != hash_wrong

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.mark.anyio
async def test_email_service_fallback():
    # In test environment without SMTP credentials, email_service returns (True, "DEV_FALLBACK")
    success, mode = await email_service.send_verification_otp("test@example.com", "123456", "Test")
    assert success is True
    assert mode in [None, "DEV_FALLBACK"]

