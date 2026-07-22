from fastapi import APIRouter, Query, Response
from app.agents.orchestrator import orchestrator

router = APIRouter(prefix="/report", tags=["Report"])

@router.get("/pipeline")
async def run_full_pipeline(
    query: str = Query(...),
    persona: str = Query("Assertive"),
    language: str = Query("English"),
    seller_personality: str = Query("Flexible")
):
    """Executes the complete 8-agent end-to-end pipeline in one call."""
    res = await orchestrator.run_full_pipeline(query, persona, language, seller_personality)
    return {"status": "success", "data": res}
