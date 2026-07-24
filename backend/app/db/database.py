from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import text
from app.config import settings

# For sqlite in async mode, convert sqlite:// to sqlite+aiosqlite:// if needed
db_url = settings.DATABASE_URL
if db_url.startswith("sqlite://"):
    db_url = db_url.replace("sqlite://", "sqlite+aiosqlite://")

engine = create_async_engine(
    db_url,
    echo=False,
    connect_args={"check_same_thread": False} if "sqlite" in db_url else {}
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def init_db():
    import app.db.models
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
        # Check SQLite table columns and add missing ones dynamically
        if "sqlite" in db_url:
            res = await conn.execute(text("PRAGMA table_info(users)"))
            existing_cols = {row[1] for row in res.fetchall()}
            
            new_columns = [
                ("first_name", "VARCHAR"),
                ("last_name", "VARCHAR"),
                ("country", "VARCHAR DEFAULT 'India'"),
                ("role", "VARCHAR DEFAULT 'Enterprise User'"),
                ("is_email_verified", "BOOLEAN DEFAULT 0"),
                ("is_phone_verified", "BOOLEAN DEFAULT 0"),
                ("is_mfa_enabled", "BOOLEAN DEFAULT 0"),
                ("updated_at", "DATETIME")
            ]
            
            for col_name, col_def in new_columns:
                if col_name not in existing_cols:
                    try:
                        await conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_def}"))
                    except Exception:
                        pass
