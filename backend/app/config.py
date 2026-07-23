import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "NegoSphere"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # LLM Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini") # gemini | openai | auto | mock
    
    # Database Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./negosphere.db")
    
    # Web Scraping Settings
    ENABLE_LIVE_SCRAPING: bool = os.getenv("ENABLE_LIVE_SCRAPING", "true").lower() == "true"
    SCRAPE_TIMEOUT: int = 5
    
    class Config:
        case_sensitive = True

settings = Settings()
