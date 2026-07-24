import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.database import init_db
from app.api import products, prices, analyze, negotiate, simulate, history, report, auth, maps

from app.core.logging import setup_logging, logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize structured logging & database tables on startup
    setup_logging()
    logger.info("Initializing NegoSphere Backend Service...")
    
    # Startup logging for SMTP configuration (without printing password/secrets)
    smtp_user_masked = f"{settings.SMTP_USER[:3]}***@{settings.SMTP_USER.split('@')[-1]}" if "@" in settings.SMTP_USER else "configured"
    has_smtp_pass = "Configured (16 chars)" if settings.SMTP_PASSWORD else "Not Set"
    logger.info(f"📧 [SMTP STARTUP CONFIG] Host: {settings.SMTP_HOST} | Port: {settings.SMTP_PORT} | User: {smtp_user_masked} | Pass Key: {has_smtp_pass} | From: {settings.EMAIL_FROM}")

    await init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="NegoSphere - Multi-Agent Negotiation Coach & Battle Simulation Platform",
    lifespan=lifespan
)

# Configure CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# High-precision API response time middleware
from fastapi import Request
import time

@app.middleware("http")
async def add_performance_logging_middleware(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time_ms = (time.perf_counter() - start_time) * 1000.0
    response.headers["X-Process-Time-Ms"] = f"{process_time_ms:.2f}"
    
    if request.url.path.startswith("/api/auth") or request.url.path.startswith("/auth"):
        logger.info(f"⚡ [AUTH PERFORMANCE] {request.method} {request.url.path} responded in {process_time_ms:.2f}ms")
    return response


# Primary API Routers (with /api prefix)
app.include_router(products.router, prefix=settings.API_PREFIX)
app.include_router(prices.router, prefix=settings.API_PREFIX)
app.include_router(analyze.router, prefix=settings.API_PREFIX)
app.include_router(negotiate.router, prefix=settings.API_PREFIX)
app.include_router(simulate.router, prefix=settings.API_PREFIX)
app.include_router(history.router, prefix=settings.API_PREFIX)
app.include_router(report.router, prefix=settings.API_PREFIX)
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(maps.router, prefix=settings.API_PREFIX)

# Fallback Root Routers (without prefix) for legacy/direct client compatibility
app.include_router(auth.router)
app.include_router(report.router)
app.include_router(products.router)
app.include_router(prices.router)
app.include_router(analyze.router)
app.include_router(negotiate.router)
app.include_router(simulate.router)
app.include_router(history.router)
app.include_router(maps.router)


@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "Online",
        "docs_url": "/docs",
        "llm_provider": settings.LLM_PROVIDER,
        "live_scraping": settings.ENABLE_LIVE_SCRAPING
    }

@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
