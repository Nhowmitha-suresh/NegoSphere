import math
import statistics
import logging
from typing import Dict, Any, List

logger = logging.getLogger("negosphere.agent.price_analysis")

class PriceAnalysisAgent:
    """
    Agent 3: Price Analysis Agent
    Responsibility: Computes statistical metrics across vendors:
    Min, Max, Avg, Median, Variance, StdDev, Fair Market Price,
    Recommended Starting Negotiation Offer, Expected Acceptance Price, Expected Rejection Price.
    """
    async def process(self, price_data: Dict[str, Any]) -> Dict[str, Any]:
        vendors = price_data.get("vendors", [])
        if not vendors:
            return {"error": "No vendor prices available"}

        prices = [v["price"] for v in vendors if "price" in v]
        if not prices:
            return {"error": "Invalid price list"}

        min_price = min(prices)
        max_price = max(prices)
        avg_price = round(statistics.mean(prices), 2)
        median_price = round(statistics.median(prices), 2)
        variance = round(statistics.variance(prices), 2) if len(prices) > 1 else 0.0
        std_dev = round(math.sqrt(variance), 2)

        base_mrp = price_data.get("base_mrp", max_price)
        
        # Calculate target negotiation prices
        # Recommended negotiation entry price (aggressive but realistic)
        recommended_target_price = round(min_price * 0.94, 2)
        
        # Expected acceptable price (likely seller compromise threshold)
        expected_acceptable_price = round(min_price * 0.97, 2)
        
        # Expected rejection price (too low, seller likely declines)
        expected_rejection_price = round(min_price * 0.88, 2)

        # Sort vendors from lowest to highest price
        sorted_vendors = sorted(vendors, key=lambda x: x["price"])
        lowest_vendor = sorted_vendors[0]
        highest_vendor = sorted_vendors[-1]

        # Generate normal distribution curve points for frontend chart
        distribution_points = []
        if std_dev > 0:
            step = (max_price - min_price + 2 * std_dev) / 10
            start = min_price - std_dev
            for i in range(11):
                x = start + i * step
                # Normal PDF formula
                density = (1 / (std_dev * math.sqrt(2 * math.pi))) * math.exp(-0.5 * ((x - avg_price) / std_dev) ** 2)
                distribution_points.append({"price": round(x), "density": round(density * 100000, 4)})

        return {
            "min_price": min_price,
            "max_price": max_price,
            "avg_price": avg_price,
            "median_price": median_price,
            "variance": variance,
            "std_dev": std_dev,
            "base_mrp": base_mrp,
            "recommended_target_price": recommended_target_price,
            "expected_acceptable_price": expected_acceptable_price,
            "expected_rejection_price": expected_rejection_price,
            "lowest_vendor": lowest_vendor,
            "highest_vendor": highest_vendor,
            "sorted_vendors": sorted_vendors,
            "distribution_points": distribution_points,
            "total_vendors_count": len(vendors)
        }

price_analysis_agent = PriceAnalysisAgent()
