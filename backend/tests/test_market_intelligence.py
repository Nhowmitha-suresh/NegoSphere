import pytest
from app.services.market_intelligence.scrapers.base_scraper import NormalizedOffer
from app.services.market_intelligence.scrapers.live_scraper_engine import live_scraper
from app.services.market_intelligence.analyzers.market_analyzer import market_analyzer
from app.services.market_intelligence.cache.market_cache import market_cache
from app.services.market_intelligence.engine import market_engine

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.mark.anyio
async def test_live_scraper_engine():
    offers, report = await live_scraper.search_all_sources("Sony WH-1000XM5")
    assert isinstance(offers, list)
    assert len(offers) > 0
    assert "sources_contacted" in report
    assert report["sources_contacted"] > 0
    
    # Check normalized offer schema properties
    first_offer = offers[0]
    assert hasattr(first_offer, "vendor_name")
    assert hasattr(first_offer, "current_price")
    assert hasattr(first_offer, "mrp")
    assert hasattr(first_offer, "discount_pct")
    assert first_offer.current_price > 0.0

@pytest.mark.anyio
async def test_market_analyzer_statistics():
    test_offers = [
        NormalizedOffer(
            id="test-1",
            vendor_name="Vendor A",
            product_title="Test Phone",
            current_price=50000.0,
            mrp=60000.0,
            discount_pct=16.6,
            coupons=["₹2000 Off"],
            scraped_url="https://vendorA.com"
        ),
        NormalizedOffer(
            id="test-2",
            vendor_name="Vendor B",
            product_title="Test Phone",
            current_price=45000.0,
            mrp=60000.0,
            discount_pct=25.0,
            coupons=["₹3000 Off"],
            exchange_offer_val=10000.0,
            scraped_url="https://vendorB.com"
        )
    ]
    
    metrics = market_analyzer.analyze_offers(test_offers)
    assert metrics["lowest_price"] == 45000.0
    assert metrics["highest_price"] == 50000.0
    assert metrics["average_price"] == 47500.0
    assert metrics["target_recommended_price"] == round(45000.0 * 0.94, 2)
    assert metrics["cheapest_store"] == "Vendor B"

@pytest.mark.anyio
async def test_market_cache_ttl():
    query = "Test Cache Query"
    dummy_data = {"test": "value"}
    
    # Set cache
    market_cache.set(query, dummy_data)
    
    # Get cache
    cached = market_cache.get(query)
    assert cached == dummy_data
    
    # Invalidate cache
    market_cache.invalidate(query)
    assert market_cache.get(query) is None

@pytest.mark.anyio
async def test_market_engine_integration():
    result = await market_engine.get_market_intelligence("iPhone 15 Pro", force_refresh=True)
    assert "metrics" in result
    assert "offers" in result
    assert "scraper_report" in result
    assert result["metrics"]["lowest_price"] > 0
