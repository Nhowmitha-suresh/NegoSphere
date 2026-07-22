import logging
from typing import Dict, Any

logger = logging.getLogger("negosphere.agent.summary")

class SummaryAgent:
    """
    Agent 8: Summary Agent
    Responsibility: Synthesizes initial price, negotiated price, money saved, % saved,
    confidence score, negotiation transcript, future strategy tips, and generates a shareable card schema.
    """
    async def process(
        self,
        product_name: str,
        initial_price: float,
        negotiated_price: float,
        confidence_score: int,
        simulation_data: Dict[str, Any],
        coach_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        money_saved = max(0.0, round(initial_price - negotiated_price, 2))
        savings_pct = round((money_saved / initial_price) * 100, 2) if initial_price > 0 else 0.0

        status = simulation_data.get("status", "DEAL_ACCEPTED")
        deal_rating = "S Tier Deal" if savings_pct >= 10 else ("A Tier Deal" if savings_pct >= 5 else "Solid Win")

        future_strategy_tips = [
            f"Use the negotiated baseline of ₹{int(negotiated_price):,} when approaching local offline store managers for instant price matching.",
            "Ask for payment gateway discounts (HDFC/ICICI/SBI card instant 10% cashback) to lower final out-of-pocket cost further.",
            "If buying accessories (case, screen protector, extended warranty), bundle them into the transaction for zero extra cost."
        ]

        shareable_card = {
            "title": "AI Negotiator Showdown Victory Card",
            "product_name": product_name,
            "initial_price": initial_price,
            "negotiated_price": negotiated_price,
            "money_saved": money_saved,
            "savings_percentage": savings_pct,
            "confidence_score": confidence_score,
            "deal_rating": deal_rating,
            "buyer_persona": coach_data.get("persona", "Assertive"),
            "status": status,
            "timestamp_formatted": "Just now"
        }

        return {
            "product_name": product_name,
            "initial_price": initial_price,
            "negotiated_price": negotiated_price,
            "money_saved": money_saved,
            "savings_percentage": savings_pct,
            "confidence_score": confidence_score,
            "deal_rating": deal_rating,
            "future_strategy_tips": future_strategy_tips,
            "shareable_card": shareable_card,
            "simulation_summary": {
                "total_rounds": simulation_data.get("total_rounds", 0),
                "status": status,
                "seller_personality": simulation_data.get("seller_personality", "Flexible")
            }
        }

summary_agent = SummaryAgent()
