from typing import Dict, Any, List, Optional
from datetime import datetime
from app.core.logging import logger
from app.services.market_intelligence.scrapers.live_scraper_engine import live_scraper
from app.services.market_intelligence.analyzers.market_analyzer import market_analyzer
from app.services.market_intelligence.cache.market_cache import market_cache
from app.services.market_intelligence.ai.ai_intelligence_feeder import ai_feeder

class RealTimeMarketIntelligenceEngine:
    async def get_market_intelligence(self, query: str, force_refresh: bool = False) -> Dict[str, Any]:
        """
        Retrieves real-time market intelligence for query.
        Uses 15-minute TTL cache unless force_refresh is True.
        """
        query_clean = query.strip()
        
        if not force_refresh:
            cached = market_cache.get(query_clean)
            if cached:
                return cached

        logger.info(f"🚀 [MARKET ENGINE] Ingesting real-time market data for query: '{query_clean}' (force_refresh={force_refresh})")
        
        # Step 1: Execute scrapers
        offers, scraper_report = await live_scraper.search_all_sources(query_clean)

        # Step 2: Compute statistical metrics
        metrics = market_analyzer.analyze_offers(offers)

        timestamp_now = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

        result = {
            "query": query_clean,
            "timestamp": timestamp_now,
            "metrics": metrics,
            "offers": [o.model_dump() for o in offers],
            "scraper_report": scraper_report
        }

        # Step 3: Store in cache
        market_cache.set(query_clean, result)

        return result

    async def get_ai_negotiation_payload(
        self,
        query: str,
        persona: str = "Assertive",
        language: str = "English",
        force_refresh: bool = False
    ) -> Dict[str, Any]:
        """
        Fetches live market intelligence and prepares full payload for 8-agent negotiation pipeline.
        """
        intel = await self.get_market_intelligence(query, force_refresh=force_refresh)
        
        # Convert dict back to NormalizedOffer objects for feeder
        from app.services.market_intelligence.scrapers.base_scraper import NormalizedOffer
        offers_objs = [NormalizedOffer(**o) for o in intel["offers"]]

        ai_ctx = ai_feeder.prepare_ai_context(
            query=query,
            offers=offers_objs,
            metrics=intel["metrics"],
            persona=persona,
            language=language
        )

        return {
            "market_intelligence": intel,
            "ai_context": ai_ctx
        }

market_engine = RealTimeMarketIntelligenceEngine()
