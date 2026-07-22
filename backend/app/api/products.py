from fastapi import APIRouter, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from app.db.database import get_db
from app.agents.product_agent import product_agent

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/parse")
async def parse_product(query: str = Query(..., description="Raw search query e.g. Samsung S24 Ultra")):
    result = await product_agent.process(query)
    return {"status": "success", "data": result}
