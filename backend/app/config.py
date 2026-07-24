import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    PROJECT_NAME: str = "NegoSphere"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Security & Auth Settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "negosphere_super_secret_jwt_key_2026_prod")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "30"))
    
    # LLM & AI Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini") # gemini | openai | anthropic | auto
    
    # Google Maps Platform Settings
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", os.getenv("VITE_GOOGLE_MAPS_API_KEY", ""))
    
    # OAuth Settings
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID", "")
    GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET", "")
    
    # Database & Cache Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./negosphere.db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Real Email Provider Settings (Resend / SendGrid / SMTP / Mailgun / Gmail)
    RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "")
    SENDGRID_API_KEY: str = os.getenv("SENDGRID_API_KEY", "")
    SMTP_HOST: str = os.getenv("SMTP_HOST", os.getenv("EMAIL_HOST", "smtp.gmail.com"))
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", os.getenv("EMAIL_PORT", "587")))
    SMTP_USER: str = os.getenv("SMTP_USER", os.getenv("EMAIL_USER", os.getenv("GMAIL_USER", "nhowmi05@gmail.com")))
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", os.getenv("EMAIL_PASSWORD", os.getenv("GMAIL_APP_PASSWORD", "vqubcpulobacpkos")))
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", os.getenv("FROM_EMAIL", os.getenv("SMTP_FROM", "NegoSphere Security <nhowmi05@gmail.com>")))

    
    # Web Scraping & Location Settings
    ENABLE_LIVE_SCRAPING: bool = os.getenv("ENABLE_LIVE_SCRAPING", "true").lower() == "true"
    SCRAPE_TIMEOUT: int = 8

    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()


