import logging
from typing import Dict, Any, List
from app.services.llm_service import llm_service

logger = logging.getLogger("negosphere.agent.simulation")

SELLER_PERSONALITIES = {
    "Flexible": {
        "flexibility": 0.08, # up to 8% discount
        "willingness_to_compromise": 0.8,
        "style": "Easygoing retail seller, open to reasonable discounts for fast sales."
    },
    "Friendly": {
        "flexibility": 0.06,
        "willingness_to_compromise": 0.85,
        "style": "Warm customer-centric store owner, eager to build goodwill."
    },
    "Strict": {
        "flexibility": 0.02, # max 2% discount
        "willingness_to_compromise": 0.3,
        "style": "Firm corporate vendor with strict minimum price controls."
    },
    "Bargaining Expert": {
        "flexibility": 0.07,
        "willingness_to_compromise": 0.6,
        "style": "Veteran negotiator who counters step-by-step and asks for trade-offs."
    },
    "Luxury": {
        "flexibility": 0.01,
        "willingness_to_compromise": 0.2,
        "style": "Premium brand seller who emphasizes exclusivity over price cuts."
    }
}

class SellerSimulationAgent:
    """
    Agent 7: Seller Simulation Agent (Agent-vs-Agent Showdown Engine)
    Responsibility: Simulates multi-turn automated dialogue between Buyer AI Agent and Seller AI Agent.
    Runs until: DEAL_ACCEPTED, COUNTER_OFFER_ACCEPTED, or NEGOTIATION_FAILED.
    Requires 0 human input during execution!
    """
    async def process(
        self,
        product_name: str,
        initial_price: float,
        target_price: float,
        buyer_persona: str = "Assertive",
        seller_personality: str = "Flexible",
        max_rounds: int = 5
    ) -> Dict[str, Any]:
        seller_profile = SELLER_PERSONALITIES.get(seller_personality, SELLER_PERSONALITIES["Flexible"])
        max_discount_allowed = initial_price * seller_profile["flexibility"]
        floor_price = initial_price - max_discount_allowed

        transcript: List[Dict[str, Any]] = []
        current_seller_ask = initial_price
        current_buyer_bid = target_price
        status = "IN_PROGRESS"
        final_price = initial_price

        # Step 1: Buyer Opening
        round_num = 1
        buyer_msg = f"Hello! I am interested in buying the {product_name}. Market research shows competitor rates around ₹{int(target_price):,}. Can you offer ₹{int(target_price):,} for an immediate cash purchase?"
        transcript.append({
            "round": round_num,
            "speaker": "Buyer AI",
            "persona": buyer_persona,
            "message": buyer_msg,
            "offered_price": target_price
        })

        # Round loops
        while round_num <= max_rounds and status == "IN_PROGRESS":
            round_num += 1
            
            # Seller evaluation turn
            if current_buyer_bid >= floor_price:
                # Seller accepts!
                status = "DEAL_ACCEPTED"
                final_price = current_buyer_bid
                seller_msg = f"Deal accepted! ₹{int(current_buyer_bid):,} is acceptable for an immediate purchase today. Thank you for your business!"
                transcript.append({
                    "round": round_num - 1,
                    "speaker": "Seller AI",
                    "personality": seller_personality,
                    "message": seller_msg,
                    "offered_price": current_buyer_bid
                })
                break
            else:
                # Seller counters
                if seller_personality == "Strict":
                    counter_price = round(initial_price * 0.98, 2)
                    seller_msg = f"We have strict MAP pricing rules on {product_name}. Best I can do as a courtesy is ₹{int(counter_price):,}."
                elif seller_personality == "Bargaining Expert":
                    gap = current_seller_ask - current_buyer_bid
                    counter_price = round(current_seller_ask - (gap * 0.45), 2)
                    seller_msg = f"₹{int(current_buyer_bid):,} is too low for this model. How about we meet in the middle at ₹{int(counter_price):,}?"
                elif seller_personality == "Friendly":
                    counter_price = round(floor_price * 1.01, 2)
                    seller_msg = f"I'd love to help you out! I can lower it to ₹{int(counter_price):,} if you can write us a quick review."
                elif seller_personality == "Luxury":
                    counter_price = round(initial_price * 0.99, 2)
                    seller_msg = f"Our products include premium warranty and certified support. I can offer ₹{int(counter_price):,} with complimentary priority shipping."
                else: # Flexible
                    counter_price = round(floor_price, 2)
                    seller_msg = f"I can lower the price to ₹{int(counter_price):,} if we seal the deal right now."

                current_seller_ask = counter_price
                transcript.append({
                    "round": round_num - 1,
                    "speaker": "Seller AI",
                    "personality": seller_personality,
                    "message": seller_msg,
                    "offered_price": counter_price
                })

                # Check if buyer accepts seller's counter
                if current_seller_ask <= (target_price * 1.05) or round_num >= max_rounds:
                    if current_seller_ask <= (initial_price * 0.96):
                        status = "COUNTER_OFFER_ACCEPTED"
                        final_price = current_seller_ask
                        transcript.append({
                            "round": round_num,
                            "speaker": "Buyer AI",
                            "persona": buyer_persona,
                            "message": f"Agreed! ₹{int(current_seller_ask):,} works for me. Let me finalize the payment.",
                            "offered_price": current_seller_ask
                        })
                        break
                    else:
                        status = "NEGOTIATION_FAILED"
                        final_price = initial_price
                        transcript.append({
                            "round": round_num,
                            "speaker": "Buyer AI",
                            "persona": buyer_persona,
                            "message": f"Unfortunately ₹{int(current_seller_ask):,} is above my target budget. I will have to explore competing vendors.",
                            "offered_price": current_buyer_bid
                        })
                        break
                else:
                    # Buyer raises bid slightly
                    current_buyer_bid = round(current_buyer_bid + (current_seller_ask - current_buyer_bid) * 0.4, 2)
                    transcript.append({
                        "round": round_num,
                        "speaker": "Buyer AI",
                        "persona": buyer_persona,
                        "message": f"I can stretch my offer up to ₹{int(current_buyer_bid):,}. Can we finalize at this price?",
                        "offered_price": current_buyer_bid
                    })

        total_saved = max(0.0, round(initial_price - final_price, 2))
        savings_pct = round((total_saved / initial_price) * 100, 2) if initial_price > 0 else 0.0

        return {
            "status": status,
            "initial_price": initial_price,
            "target_price": target_price,
            "final_negotiated_price": final_price,
            "money_saved": total_saved,
            "savings_percentage": savings_pct,
            "seller_personality": seller_personality,
            "buyer_persona": buyer_persona,
            "total_rounds": len(transcript),
            "transcript": transcript
        }

simulation_agent = SellerSimulationAgent()
