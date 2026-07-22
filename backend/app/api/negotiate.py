from fastapi import APIRouter, Query
from app.agents.coach_agent import coach_agent
from app.agents.multi_lang_agent import multi_lang_agent
from app.agents.product_agent import product_agent
from app.agents.price_collection import price_collection_agent
from app.agents.price_analysis import price_analysis_agent

router = APIRouter(prefix="/negotiate", tags=["Negotiate"])

@router.get("/")
async def generate_negotiation(
    query: str = Query(...),
    persona: str = Query("Assertive", description="Budget Conscious | Diplomatic | Assertive | Premium Buyer | Student | Corporate Buyer"),
    language: str = Query("English", description="English | Hindi | Tamil | Telugu | Kannada | Malayalam")
):
    product_info = await product_agent.process(query)
    price_data = await price_collection_agent.process(query, product_info)
    analysis = await price_analysis_agent.process(price_data)

    product_title = price_data.get("product_name", query)
    coach_res = await coach_agent.process(product_title, analysis, persona)
    multi_lang_res = await multi_lang_agent.process(
        scripts=coach_res,
        target_language=language,
        product_name=product_title,
        target_price=analysis.get("recommended_target_price", 0)
    )

    return {
        "status": "success",
        "data": {
            "coach": coach_res,
            "multi_lang": multi_lang_res
        }
    }
