import json
import asyncio
from fastapi import APIRouter, Query, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.db.models import NegotiationSession
from app.agents.simulation_agent import simulation_agent
from app.agents.product_agent import product_agent
from app.agents.price_collection import price_collection_agent
from app.agents.price_analysis import price_analysis_agent

router = APIRouter(prefix="/simulate", tags=["Simulate"])

@router.get("/")
async def run_simulation(
    query: str = Query(...),
    buyer_persona: str = Query("Assertive"),
    seller_personality: str = Query("Flexible"),
    db: AsyncSession = Depends(get_db)
):
    product_info = await product_agent.process(query)
    price_data = await price_collection_agent.process(query, product_info)
    analysis = await price_analysis_agent.process(price_data)

    product_title = price_data.get("product_name", query)
    initial_price = analysis.get("min_price", 10000)
    target_price = analysis.get("recommended_target_price", initial_price * 0.94)

    simulation_res = await simulation_agent.process(
        product_name=product_title,
        initial_price=initial_price,
        target_price=target_price,
        buyer_persona=buyer_persona,
        seller_personality=seller_personality
    )

    # Store in SQLite database
    db_session = NegotiationSession(
        product_name=product_title,
        initial_price=initial_price,
        target_price=target_price,
        negotiated_price=simulation_res.get("final_negotiated_price"),
        savings_amount=simulation_res.get("money_saved"),
        savings_percentage=simulation_res.get("savings_percentage"),
        confidence_score=90,
        style_persona=buyer_persona,
        seller_personality=seller_personality,
        status=simulation_res.get("status"),
        transcript=simulation_res.get("transcript")
    )
    db.add(db_session)
    await db.commit()

    return {"status": "success", "data": simulation_res}

@router.get("/stream")
async def stream_simulation(
    query: str = Query(...),
    buyer_persona: str = Query("Assertive"),
    seller_personality: str = Query("Flexible")
):
    """
    Streams AI-vs-AI negotiation battle arena dialogue turn-by-turn via Server-Sent Events (SSE).
    """
    product_info = await product_agent.process(query)
    price_data = await price_collection_agent.process(query, product_info)
    analysis = await price_analysis_agent.process(price_data)

    product_title = price_data.get("product_name", query)
    initial_price = analysis.get("min_price", 10000)
    target_price = analysis.get("recommended_target_price", initial_price * 0.94)

    sim_result = await simulation_agent.process(
        product_name=product_title,
        initial_price=initial_price,
        target_price=target_price,
        buyer_persona=buyer_persona,
        seller_personality=seller_personality
    )

    async def event_generator():
        yield f"data: {json.dumps({'event': 'start', 'product_name': product_title, 'initial_price': initial_price, 'target_price': target_price})}\n\n"
        await asyncio.sleep(0.4)

        for turn in sim_result.get("transcript", []):
            yield f"data: {json.dumps({'event': 'turn', 'turn': turn})}\n\n"
            await asyncio.sleep(0.8)

        yield f"data: {json.dumps({'event': 'complete', 'summary': sim_result})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

