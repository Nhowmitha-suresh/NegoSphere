from fastapi import APIRouter, Query
from app.agents.product_agent import product_agent
from app.agents.price_collection import price_collection_agent
from app.agents.price_analysis import price_analysis_agent
from app.agents.opportunity_agent import opportunity_agent

router = APIRouter(prefix="/analyze", tags=["Analysis"])

@router.get("/")
async def analyze_product(query: str = Query(..., description="Product search query")):
    product_info = await product_agent.process(query)
    price_data = await price_collection_agent.process(query, product_info)
    analysis = await price_analysis_agent.process(price_data)
    opportunity = await opportunity_agent.process(price_data, analysis)

    return {
        "status": "success",
        "data": {
            "product": price_data.get("product_name", query),
            "price_data": price_data,
            "stats": analysis,
            "opportunity": opportunity
        }
    }
