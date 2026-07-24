from typing import Dict, List, Any
from app.services.market_intelligence.scrapers.base_scraper import NormalizedOffer

class AIIntelligenceFeeder:
    def prepare_ai_context(
        self,
        query: str,
        offers: List[NormalizedOffer],
        metrics: Dict[str, Any],
        persona: str = "Assertive",
        language: str = "English"
    ) -> Dict[str, Any]:
        """
        Transforms live market intelligence into optimized AI context fed to the 8-agent negotiation pipeline.
        """
        # Format offer benchmarks for LLM prompt context
        formatted_offers = []
        for o in offers[:5]:
            formatted_offers.append(
                f"- {o.vendor_name}: Current Selling Price = ₹{o.current_price:,.2f} (MRP ₹{o.mrp:,.2f}, Discount {o.discount_pct}%). "
                f"Coupons: {', '.join(o.coupons) if o.coupons else 'None'}. "
                f"Cashback: {', '.join(o.cashback_offers) if o.cashback_offers else 'None'}. "
                f"Trade-in Exchange Estimate: ₹{o.exchange_offer_val:,.2f}."
            )

        context_prompt = (
            f"LIVE REAL-TIME MARKET INTELLIGENCE FOR '{query}':\n"
            f"• Lowest Verified Price: ₹{metrics['lowest_price']:,.2f} ({metrics['lowest_seller']['vendor_name'] if metrics.get('lowest_seller') else 'Market'})\n"
            f"• Highest Price: ₹{metrics['highest_price']:,.2f}\n"
            f"• Average Market Price: ₹{metrics['average_price']:,.2f}\n"
            f"• Recommended Negotiated Target Price: ₹{metrics['target_recommended_price']:,.2f}\n"
            f"• Potential Net Savings Opportunity: ₹{metrics['potential_savings_val']:,.2f} ({metrics['potential_savings_pct']}%)\n"
            f"• Market Intelligence Confidence Score: {metrics['confidence_score']}/100\n\n"
            f"CURRENT RETAILER OFFERS:\n" + "\n".join(formatted_offers)
        )

        return {
            "query": query,
            "persona": persona,
            "language": language,
            "context_prompt": context_prompt,
            "metrics": metrics,
            "offers_data": [o.model_dump() for o in offers]
        }

ai_feeder = AIIntelligenceFeeder()
