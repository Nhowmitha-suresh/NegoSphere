import pytest
import asyncio
from app.agents.orchestrator import orchestrator
from app.agents.price_analysis import price_analysis_agent

@pytest.mark.asyncio
async def test_price_analysis():
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

@pytest.mark.asyncio
async def test_full_pipeline():
    res = await orchestrator.run_full_pipeline("Samsung S24 Ultra", "Assertive", "English", "Flexible")
    assert "product_info" in res
    assert "price_data" in res
    assert "analysis" in res
    assert "opportunity" in res
    assert "coach" in res
    assert "multi_lang" in res
    assert "simulation" in res
    assert "summary" in res
    assert res["opportunity"]["confidence_score"] > 50

if __name__ == "__main__":
    asyncio.run(test_full_pipeline())
    print("ALL AGENT TESTS PASSED LOCALLY!")
