import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=generate_uuid)
    query = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=True)
    category = Column(String, nullable=True)
    variant = Column(String, nullable=True)
    specs = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    price_history = relationship("PriceHistory", back_populates="product", cascade="all, delete-orphan")
    negotiation_sessions = relationship("NegotiationSession", back_populates="product", cascade="all, delete-orphan")

class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, unique=True, nullable=False)
    website = Column(String, nullable=True)
    reliability_rating = Column(Float, default=4.5)
    trust_score = Column(Integer, default=90)

class PriceHistory(Base):
    __tablename__ = "price_histories"

    id = Column(String, primary_key=True, default=generate_uuid)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    vendor_name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    currency = Column(String, default="INR")
    discount_pct = Column(Float, default=0.0)
    seller_rating = Column(Float, default=4.2)
    in_stock = Column(Boolean, default=True)
    scraped_url = Column(String, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="price_history")

class NegotiationSession(Base):
    __tablename__ = "negotiation_sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    product_id = Column(String, ForeignKey("products.id"), nullable=True)
    product_name = Column(String, nullable=False)
    initial_price = Column(Float, nullable=False)
    target_price = Column(Float, nullable=False)
    negotiated_price = Column(Float, nullable=True)
    savings_amount = Column(Float, nullable=True)
    savings_percentage = Column(Float, nullable=True)
    confidence_score = Column(Integer, nullable=False)
    style_persona = Column(String, nullable=False)
    seller_personality = Column(String, default="Flexible")
    language = Column(String, default="English")
    status = Column(String, default="COMPLETED")
    transcript = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="negotiation_sessions")

class SavedProduct(Base):
    __tablename__ = "saved_products"

    id = Column(String, primary_key=True, default=generate_uuid)
    product_name = Column(String, nullable=False)
    brand = Column(String, nullable=True)
    category = Column(String, nullable=True)
    target_price = Column(Float, nullable=False)
    lowest_price = Column(Float, nullable=False)
    confidence_score = Column(Integer, default=85)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    country = Column(String, default="India")
    role = Column(String, default="Enterprise User") # Standard User, Premium, Enterprise User, Administrator
    hashed_password = Column(String, nullable=False)
    is_email_verified = Column(Boolean, default=False)
    is_phone_verified = Column(Boolean, default=False)
    is_mfa_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    connected_accounts = relationship("ConnectedAccount", back_populates="user", cascade="all, delete-orphan")

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    shopping_categories = Column(JSON, nullable=True)
    preferred_retailers = Column(JSON, nullable=True)
    monthly_budget = Column(Float, default=250000.0)
    location = Column(String, default="New Delhi, India")
    currency = Column(String, default="INR")
    language = Column(String, default="English")
    negotiation_style = Column(String, default="Assertive")
    notification_prefs = Column(JSON, nullable=True)
    ai_memory_enabled = Column(Boolean, default=True)

    user = relationship("User", back_populates="profile")

class EmailVerificationToken(Base):
    __tablename__ = "email_verification_tokens"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    email = Column(String, index=True, nullable=False)
    hashed_code = Column(String, nullable=False)
    salt = Column(String, nullable=False)
    attempts_left = Column(Integer, default=5)
    is_used = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class PhoneVerificationToken(Base):
    __tablename__ = "phone_verification_tokens"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    phone_number = Column(String, nullable=False)
    otp_code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    device_name = Column(String, nullable=False)
    browser = Column(String, nullable=False)
    os = Column(String, nullable=False)
    ip_address = Column(String, nullable=False)
    refresh_token = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_trusted = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sessions")

class ConnectedAccount(Base):
    __tablename__ = "connected_accounts"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    provider = Column(String, nullable=False) # Google, Apple, Microsoft, GitHub
    provider_account_id = Column(String, nullable=False)
    access_token = Column(String, nullable=True)
    permissions = Column(JSON, nullable=True) # calendar, maps, drive, gmail
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="connected_accounts")

class SecurityLog(Base):
    __tablename__ = "security_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    event_type = Column(String, nullable=False) # LOGIN_SUCCESS, LOGIN_FAILED, PASSWORD_CHANGE, SESSION_REVOKED
    ip_address = Column(String, nullable=False)
    user_agent = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_email = Column(String, nullable=True)
    rating = Column(Integer, nullable=False)
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
