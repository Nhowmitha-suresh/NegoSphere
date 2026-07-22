import logging
from typing import Dict, Any

logger = logging.getLogger("negosphere.agent.opportunity")

class NegotiationOpportunityAgent:
    """
    Agent 4: Negotiation Opportunity Agent
    Responsibility: Evaluates negotiation potential and generates a 0-100 Confidence Score
    based on price variance, seller ratings, category margins, competition density, and price trends.
    """
    async def process(self, price_data: Dict[str, Any], analysis: Dict[str, Any]) -> Dict[str, Any]:
        min_price = analysis.get("min_price", 0)
        max_price = analysis.get("max_price", 0)
        avg_price = analysis.get("avg_price", 0)
        variance = analysis.get("variance", 0)
        base_mrp = analysis.get("base_mrp", max_price)
        vendors = price_data.get("vendors", [])

        # 1. Price Spread Factor (Higher spread = Higher opportunity)
        price_spread_pct = ((max_price - min_price) / avg_price) * 100 if avg_price > 0 else 0
        spread_score = min(35, price_spread_pct * 2.5)

        # 2. MRP Discount Headroom Factor
        mrp_headroom_pct = ((base_mrp - min_price) / base_mrp) * 100 if base_mrp > 0 else 0
        mrp_score = min(25, mrp_headroom_pct * 1.5)

        # 3. Competition & Vendor Density Factor
        vendor_count = len(vendors)
        density_score = min(20, vendor_count * 4.0)

        # 4. Seller Rating & Stock Headroom
        avg_rating = sum(v.get("seller_rating", 4.0) for v in vendors) / vendor_count if vendor_count > 0 else 4.0
        rating_score = 10 if avg_rating < 4.6 else 5

        # 5. Base Baseline
        base_score = 10

        total_confidence = round(min(98, max(45, spread_score + mrp_score + density_score + rating_score + base_score)))

        # Qualitative assessment label & detailed breakdown
        if total_confidence >= 85:
            opportunity_level = "Excellent"
            recommendation = "High price dispersion between sellers and strong retail margin headroom indicate prime conditions for significant discounts."
        elif total_confidence >= 70:
            opportunity_level = "Strong"
            recommendation = "Good negotiation potential. Competitive vendor pricing allows price matching and small bulk/payment perks."
        elif total_confidence >= 55:
            opportunity_level = "Moderate"
            recommendation = "Moderate headroom available. Focus on warranty add-ons, free shipping, or corporate card cashback."
        else:
            opportunity_level = "Conservative"
            recommendation = "Tight seller margins. Direct cash discount may be small; negotiate accessory bundles instead."

        explanation_factors = [
            {
                "factor": "Price Variance & Spread",
                "impact": "High" if price_spread_pct > 8 else "Moderate",
                "detail": f"Price gap of {round(price_spread_pct, 1)}% between lowest (₹{min_price:,}) and highest (₹{max_price:,}) vendor."
            },
            {
                "factor": "Vendor Competition",
                "impact": "High" if vendor_count >= 4 else "Standard",
                "detail": f"{vendor_count} competing retail vendors identified with active stock."
            },
            {
                "factor": "Retail Margin Headroom",
                "impact": "High" if mrp_headroom_pct > 10 else "Moderate",
                "detail": f"Current market best is {round(mrp_headroom_pct, 1)}% below original list MRP."
            }
        ]

        return {
            "confidence_score": total_confidence,
            "opportunity_level": opportunity_level,
            "recommendation": recommendation,
            "explanation_factors": explanation_factors,
            "potential_savings_est": round(analysis.get("avg_price", 0) - analysis.get("recommended_target_price", 0), 2)
        }

opportunity_agent = NegotiationOpportunityAgent()
