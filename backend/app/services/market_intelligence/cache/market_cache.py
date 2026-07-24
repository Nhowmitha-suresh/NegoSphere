import time
from typing import Dict, Any, Optional
from app.core.logging import logger

class MarketIntelligenceCache:
    def __init__(self, ttl_seconds: int = 900): # 15 minutes TTL
        self.ttl = ttl_seconds
        self._cache: Dict[str, Dict[str, Any]] = {}

    def get(self, query: str) -> Optional[Dict[str, Any]]:
        key = query.lower().strip()
        if key in self._cache:
            entry = self._cache[key]
            if time.time() - entry["timestamp"] < self.ttl:
                logger.info(f"⚡ [MARKET CACHE HIT] Serving cached market intelligence for '{query}'")
                return entry["data"]
            else:
                logger.info(f"⏳ [MARKET CACHE EXPIRED] Evicting stale cache for '{query}'")
                del self._cache[key]
        return None

    def set(self, query: str, data: Dict[str, Any]):
        key = query.lower().strip()
        self._cache[key] = {
            "timestamp": time.time(),
            "data": data
        }
        logger.info(f"💾 [MARKET CACHE SET] Cached live market intelligence for '{query}' (TTL {self.ttl}s)")

    def invalidate(self, query: str):
        key = query.lower().strip()
        if key in self._cache:
            del self._cache[key]
            logger.info(f"🔄 [MARKET CACHE INVALIDATED] Cleared cache for '{query}'")

market_cache = MarketIntelligenceCache()
