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
    style_persona = Column(String, nullable=False) # Budget, Diplomatic, Assertive, etc.
    seller_personality = Column(String, default="Flexible") # Friendly, Strict, Flexible, Luxury, Bargaining Expert
    language = Column(String, default="English")
    status = Column(String, default="COMPLETED") # DEAL_ACCEPTED, COUNTER_OFFER, FAILED
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
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_email = Column(String, nullable=True)
    rating = Column(Integer, nullable=False)
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
