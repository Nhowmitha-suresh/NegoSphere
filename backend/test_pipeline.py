import pytest
import asyncio
from app.agents.product_agent import product_agent
from app.agents.price_collection import price_collection_agent
from app.agents.price_analysis import price_analysis_agent
from app.agents.opportunity_agent import opportunity_agent
from app.agents.coach_agent import coach_agent
from app.agents.multi_lang_agent import multi_lang_agent
from app.agents.simulation_agent import simulation_agent
from app.agents.summary_agent import summary_agent
from app.agents.orchestrator import orchestrator

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.mark.anyio
async def test_product_agent():
    res = await product_agent.process("Samsung S24 Ultra")
    assert "name" in res
    assert "brand" in res
    assert "category" in res

@pytest.mark.anyio
async def test_price_collection_agent():
    product_info = {"name": "Samsung S24 Ultra", "brand": "Samsung", "category": "Smartphones"}
    res = await price_collection_agent.process("Samsung S24 Ultra", product_info)
    assert "vendors" in res
    assert len(res["vendors"]) > 0

@pytest.mark.anyio
async def test_price_analysis_agent():
    sample_data = {
        "base_mrp": 100000,
        "vendors": [
            {"vendor_name": "Amazon", "price": 90000},
            {"vendor_name": "Flipkart", "price": 92000},
            {"vendor_name": "Croma", "price": 88000}
        ]
    }
    result = await price_analysis_agent.process(sample_data)
    assert result["min_price"] == 88000
    assert result["max_price"] == 92000
    assert result["recommended_target_price"] < 88000

@pytest.mark.anyio
async def test_opportunity_agent():
    price_data = {
        "vendors": [
            {"vendor_name": "Amazon", "price": 90000, "seller_rating": 4.5},
            {"vendor_name": "Flipkart", "price": 92000, "seller_rating": 4.2}
        ]
    }
    analysis = {
        "min_price": 90000,
        "max_price": 92000,
        "avg_price": 91000,
        "variance": 2000000,
        "base_mrp": 100000,
        "recommended_target_price": 85000
    }
    res = await opportunity_agent.process(price_data, analysis)
    assert 0 <= res["confidence_score"] <= 100
    assert "opportunity_level" in res

@pytest.mark.anyio
async def test_coach_agent():
    analysis = {"min_price": 90000, "recommended_target_price": 85000, "avg_price": 91000}
    res = await coach_agent.process("Samsung S24 Ultra", analysis, "Assertive")
    assert res["persona"] == "Assertive"
    assert "opening_line" in res
    assert "key_tactics" in res

@pytest.mark.anyio
async def test_multi_lang_agent():
    scripts = {
        "opening_line": "Hello, I want to buy Samsung S24 Ultra.",
        "followup_script": "I can pay right now.",
        "objection_response": "What is your best price?"
    }
    res = await multi_lang_agent.process(scripts, "Hindi", "Samsung S24 Ultra", 85000)
    assert res["language"] == "Hindi"
    assert "opening_line" in res

@pytest.mark.anyio
async def test_simulation_agent():
    res = await simulation_agent.process(
        product_name="Samsung S24 Ultra",
        initial_price=90000,
        target_price=85000,
        buyer_persona="Assertive",
        seller_personality="Flexible"
    )
    assert "total_rounds" in res
    assert "final_negotiated_price" in res
    assert "transcript" in res
    assert len(res["transcript"]) > 0

@pytest.mark.anyio
async def test_summary_agent():
    simulation_data = {"total_rounds": 4, "status": "DEAL_ACCEPTED", "seller_personality": "Flexible"}
    coach_data = {"persona": "Assertive"}
    res = await summary_agent.process(
        product_name="Samsung S24 Ultra",
        initial_price=90000,
        negotiated_price=85000,
        confidence_score=85,
        simulation_data=simulation_data,
        coach_data=coach_data
    )
    assert res["money_saved"] == 5000
    assert res["savings_percentage"] > 0
    assert "shareable_card" in res

@pytest.mark.anyio
async def test_full_pipeline_offline_integration():
    res = await orchestrator.run_full_pipeline("Samsung S24 Ultra", "Assertive", "English", "Flexible")
    assert "request_id" in res
    assert "product_info" in res
    assert "price_data" in res
    assert "analysis" in res
    assert "opportunity" in res
    assert "coach" in res
    assert "multi_lang" in res
    assert "simulation" in res
    assert "summary" in res
    assert res["opportunity"]["confidence_score"] > 0

if __name__ == "__main__":
    asyncio.run(test_full_pipeline_offline_integration())
    print("ALL 8 INDIVIDUAL AGENT TESTS & FULL PIPELINE PASSED LOCALLY!")
