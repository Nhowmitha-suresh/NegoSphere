from typing import Dict, List, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class NormalizedOffer(BaseModel):
    id: str
    vendor_name: str
    vendor_logo: Optional[str] = None
    product_title: str
    current_price: float
    mrp: float
    discount_pct: float = 0.0
    currency: str = "INR"
    in_stock: bool = True
    stock_status: str = "In Stock"
    rating: float = 4.5
    review_count: int = 0
    delivery_estimate: str = "2-3 Days"
    coupons: List[str] = Field(default_factory=list)
    cashback_offers: List[str] = Field(default_factory=list)
    bank_emi_offers: List[str] = Field(default_factory=list)
    exchange_offer_val: float = 0.0
    scraped_url: str
    source_type: str = "Live Web" # Live Web | Official API | Hybrid
    last_updated: str = Field(default_factory=lambda: datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"))

class BaseScraper:
    name: str = "Base Scraper"
    
    async def fetch_offers(self, query: str) -> List[NormalizedOffer]:
        raise NotImplementedError
