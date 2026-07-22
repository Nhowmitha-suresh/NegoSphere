import logging
from typing import Dict, Any
from app.services.scraper_service import scraper_service

logger = logging.getLogger("negosphere.agent.price_collection")

class PriceCollectionAgent:
    """
    Agent 2: Price Collection Agent
    Responsibility: Collects live prices from ethical multi-vendor sources or seamlessly
    switches to fallback dataset for 100% demo uptime.
    """
    async def process(self, query: str, product_info: Dict[str, Any]) -> Dict[str, Any]:
        scraped_result = await scraper_service.collect_prices(query)
        data = scraped_result.get("data", {})
        
        return {
            "query": query,
            "source": scraped_result.get("source", "Hybrid Scraper"),
            "product_name": data.get("name", product_info.get("name", query)),
            "brand": data.get("brand", product_info.get("brand", "")),
            "category": data.get("category", product_info.get("category", "")),
            "variant": data.get("variant", product_info.get("variant", "")),
            "specs": data.get("specs", {}),
            "base_mrp": data.get("base_mrp", 0),
            "vendors": data.get("vendors", []),
            "history_90d": data.get("history_90d", [])
        }

price_collection_agent = PriceCollectionAgent()
