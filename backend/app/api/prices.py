from fastapi import APIRouter, Query
from app.services.market_intelligence.engine import market_engine

router = APIRouter(prefix="/prices", tags=["Prices & Real-Time Market Intelligence"])

@router.get("/collect")
async def collect_prices(
    query: str = Query(..., description="Product query"),
    force_refresh: bool = Query(False, description="Bypass cache and force live scrape refresh")
):
    """Collects real-time live market offers and normalized price intelligence."""
    intel = await market_engine.get_market_intelligence(query, force_refresh=force_refresh)
    return {"status": "success", "data": intel}

@router.get("/live-intelligence")
async def get_live_market_intelligence(
    query: str = Query(..., description="Product query"),
    force_refresh: bool = Query(False, description="Force live data refresh")
):
    """
    Returns real-time market intelligence analysis including lowest seller, best cashback,
    trade-in exchange, price distribution, and scraper source status.
    """
    intel = await market_engine.get_market_intelligence(query, force_refresh=force_refresh)
    return {"status": "success", "data": intel}
