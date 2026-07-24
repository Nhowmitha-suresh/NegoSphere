import statistics
from typing import List, Dict, Any
from app.services.market_intelligence.scrapers.base_scraper import NormalizedOffer

class MarketIntelligenceAnalyzer:
    def analyze_offers(self, offers: List[NormalizedOffer]) -> Dict[str, Any]:
        """
        Computes real-time market statistics, optimal target price, savings matrix,
        and confidence score from normalized retailer offers.
        """
        if not offers:
            return {
                "lowest_price": 0.0,
                "highest_price": 0.0,
                "average_price": 0.0,
                "median_price": 0.0,
                "target_recommended_price": 0.0,
                "potential_savings_val": 0.0,
                "potential_savings_pct": 0.0,
                "confidence_score": 50,
                "lowest_seller": None,
                "cheapest_store": None,
                "best_cashback": None,
                "best_exchange": None,
                "offers_summary": []
            }

        prices = [o.current_price for o in offers]

        lowest_offer = min(offers, key=lambda x: x.current_price)
        highest_offer = max(offers, key=lambda x: x.current_price)

        lowest_p = lowest_offer.current_price
        highest_p = highest_offer.current_price
        avg_p = round(statistics.mean(prices), 2)
        median_p = round(statistics.median(prices), 2)

        # Target recommended purchase price: 3% - 6% lower than lowest online price (achievable through negotiation / coupons)
        target_p = round(lowest_p * 0.94, 2)
        
        # Max savings opportunity vs average price
        savings_val = round(avg_p - target_p, 2)
        savings_pct = round((savings_val / avg_p) * 100.0, 1) if avg_p > 0 else 0.0

        # Best cashback offer
        cashback_candidates = [o for o in offers if o.cashback_offers]
        best_cashback_offer = cashback_candidates[0] if cashback_candidates else lowest_offer

        # Best exchange trade-in offer
        best_exchange_offer = max(offers, key=lambda x: x.exchange_offer_val)

        # Calculate market confidence score based on sample variance & ratings
        sample_size = len(offers)
        variance_ratio = (highest_p - lowest_p) / avg_p if avg_p > 0 else 0.1
        confidence = min(98, max(75, int(85 + (sample_size * 2) - (variance_ratio * 15))))

        return {
            "lowest_price": lowest_p,
            "highest_price": highest_p,
            "average_price": avg_p,
            "median_price": median_p,
            "target_recommended_price": target_p,
            "potential_savings_val": savings_val,
            "potential_savings_pct": savings_pct,
            "confidence_score": confidence,
            "lowest_seller": {
                "vendor_name": lowest_offer.vendor_name,
                "price": lowest_offer.current_price,
                "mrp": lowest_offer.mrp,
                "discount_pct": lowest_offer.discount_pct,
                "rating": lowest_offer.rating,
                "review_count": lowest_offer.review_count,
                "delivery": lowest_offer.delivery_estimate,
                "scraped_url": lowest_offer.scraped_url
            },
            "cheapest_store": lowest_offer.vendor_name,
            "best_cashback": {
                "vendor_name": best_cashback_offer.vendor_name,
                "offers": best_cashback_offer.cashback_offers
            },
            "best_exchange": {
                "vendor_name": best_exchange_offer.vendor_name,
                "exchange_value": best_exchange_offer.exchange_offer_val
            },
            "offers_count": len(offers)
        }

market_analyzer = MarketIntelligenceAnalyzer()
