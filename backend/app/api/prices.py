from fastapi import APIRouter, Query
from app.agents.price_collection import price_collection_agent
from app.agents.product_agent import product_agent

router = APIRouter(prefix="/prices", tags=["Prices"])

@router.get("/collect")
async def collect_prices(query: str = Query(..., description="Product query")):
    product_info = await product_agent.process(query)
    price_data = await price_collection_agent.process(query, product_info)
    return {"status": "success", "data": price_data}
