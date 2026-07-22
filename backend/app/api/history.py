from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.db.database import get_db
from app.db.models import NegotiationSession, SavedProduct

router = APIRouter(prefix="/history", tags=["History"])

@router.get("/")
async def get_negotiation_history(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(NegotiationSession).order_by(NegotiationSession.created_at.desc()).limit(20))
    sessions = result.scalars().all()
    return {"status": "success", "data": sessions}

@router.get("/saved")
async def get_saved_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SavedProduct).order_by(SavedProduct.created_at.desc()))
    items = result.scalars().all()
    return {"status": "success", "data": items}
