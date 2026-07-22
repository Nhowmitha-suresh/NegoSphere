import logging
from typing import Dict, Any, List
from app.services.llm_service import llm_service

logger = logging.getLogger("negosphere.agent.coach")

PERSONA_TEMPLATES = {
    "Assertive": {
        "title": "Assertive & Data-Backed",
        "description": "Direct, leverage market benchmarks, firm on numbers.",
        "opening": "I'm looking to buy the {product_name} today. I've verified that competing vendors have this listed for ₹{min_price:,}. Can you match ₹{target_price:,} for an immediate sale?",
        "followup": "I am ready to complete payment right now if we can lock in ₹{target_price:,}. Otherwise, I will proceed with the lower competitor offer.",
        "objection_handler": "I appreciate your position, but at ₹{seller_price:,}, your offer is higher than market median. If you can meet me at ₹{target_price:,}, we can finalize this instantly.",
        "tactics": [
            "State competitor prices explicitly to anchor expectations.",
            "Offer immediate cash or instant UPI/card payment as leverage.",
            "Set a clear decision deadline."
        ]
    },
    "Diplomatic": {
        "title": "Diplomatic & Relationship-Focused",
        "description": "Polite, value-seeking, creates win-win atmosphere.",
        "opening": "Hi there! I really love the {product_name} and prefer buying from your store. Would you be open to offering a small courtesy discount towards ₹{target_price:,}?",
        "followup": "Thank you for the response! Is there any room for flexibility if I also write a 5-star seller review or buy an accessory alongside?",
        "objection_handler": "I understand margins can be tight. What's the best price you could comfortably manage for a happy returning customer?",
        "tactics": [
            "Express genuine interest in buying from their store.",
            "Suggest non-monetary value exchanges (reviews, referrals).",
            "Keep the tone friendly and collaborative."
        ]
    },
    "Budget Conscious": {
        "title": "Budget Conscious",
        "description": "Fixed cap, price-sensitive, cost-driven.",
        "opening": "Hello! I'm on a strict fixed budget for the {product_name} capped at ₹{target_price:,}. Is there any chance we could make this price work?",
        "followup": "My ceiling is firm at ₹{target_price:,}. If we can't hit that, could you throw in free shipping or a protective case to fit my budget?",
        "objection_handler": "I really want this item, but ₹{target_price:,} is literally my hard limit today. Let me know if any promotional discount applies.",
        "tactics": [
            "Establish a hard price ceiling early.",
            "Ask for waived shipping, warranty extension, or free accessories if price is fixed.",
            "Be willing to pause and consider before agreeing."
        ]
    },
    "Premium Buyer": {
        "title": "Premium Buyer",
        "description": "High intent, service-focused, value-add negotiation.",
        "opening": "Greetings. I'm finalizing my purchase of the {product_name}. If you can offer a competitive rate of ₹{target_price:,}, I will finalize immediately without delay.",
        "followup": "I value seamless delivery and premium support. Can you include extended warranty or complimentary express delivery at ₹{target_price:,}?",
        "objection_handler": "Time is important for me. Let's settle at ₹{target_price:,} with priority dispatch and we're done.",
        "tactics": [
            "Leverage speed of transaction as key currency.",
            "Negotiate premium perks (extended warranty, white-glove shipping).",
            "Maintain an authoritative, decisive tone."
        ]
    },
    "Student": {
        "title": "Student / Scholar",
        "description": "Budget constraints, educational leverage, seeking student perks.",
        "opening": "Hi! As a student purchasing the {product_name} for academic work, my budget is tight. Could you offer a student discount down to ₹{target_price:,}?",
        "followup": "I can present my valid student ID immediately. Would ₹{target_price:,} be feasible for scholar purchases?",
        "objection_handler": "Every rupee counts for my studies. If ₹{target_price:,} isn't possible, can you offer student cashback or free educational bundle add-ons?",
        "tactics": [
            "Mention academic use case to trigger scholar discounts.",
            "Ask for student financing or waived processing fees.",
            "Request essential accessory bundles."
        ]
    },
    "Corporate Buyer": {
        "title": "Corporate / Business Procurement",
        "description": "B2B leverage, GST invoice, future volume potential.",
        "opening": "Good day. We are sourcing the {product_name} for corporate deployment with full GST invoicing. We require a unit price of ₹{target_price:,}.",
        "followup": "This initial order is a test run for our department. Satisfactory pricing at ₹{target_price:,} will lead to follow-on quarterly procurement.",
        "objection_handler": "Our procurement policy mandates approval under ₹{target_price:,}. Can we adjust the line item pricing or credit terms accordingly?",
        "tactics": [
            "Leverage potential future repeat business volume.",
            "Inquire about GST input credit tax savings.",
            "Focus on formal B2B invoice terms."
        ]
    }
}

class NegotiationCoachAgent:
    """
    Agent 5: Negotiation Coach Agent
    Responsibility: Generates customized negotiation strategies, scripts, opening lines,
    counter-offer responses, and tactical leverage points tailored to user selected persona.
    """
    async def process(self, product_name: str, analysis: Dict[str, Any], persona: str = "Assertive") -> Dict[str, Any]:
        target_persona = PERSONA_TEMPLATES.get(persona, PERSONA_TEMPLATES["Assertive"])
        
        min_p = int(analysis.get("min_price", 10000))
        target_p = int(analysis.get("recommended_target_price", min_p * 0.94))
        avg_p = int(analysis.get("avg_price", min_p))

        # Try LLM personalized refinement if key available
        prompt = f"""
        Act as an elite Negotiation Coach.
        Product: {product_name}
        Min Market Price: ₹{min_p:,}
        Target Negotiated Price: ₹{target_p:,}
        Persona Style: {persona}

        Generate tailored JSON:
        - opening_line: Strong opening message to seller
        - followup_script: Negotiation follow up tactic
        - objection_response: Response when seller says price is too low
        - key_tactics: Array of 3 strategic advice points
        """
        system_instruction = "You are a master Negotiation Strategy Coach. Provide actionable, high-conversion negotiation scripts."

        llm_json = await llm_service.generate_json(prompt, system_instruction)
        if isinstance(llm_json, dict) and "opening_line" in llm_json:
            return {
                "persona": persona,
                "title": target_persona["title"],
                "description": target_persona["description"],
                "opening_line": llm_json.get("opening_line"),
                "followup_script": llm_json.get("followup_script"),
                "objection_response": llm_json.get("objection_response"),
                "key_tactics": llm_json.get("key_tactics", target_persona["tactics"])
            }

        # Fallback to rich structured templates
        return {
            "persona": persona,
            "title": target_persona["title"],
            "description": target_persona["description"],
            "opening_line": target_persona["opening"].format(product_name=product_name, min_price=min_p, target_price=target_p),
            "followup_script": target_persona["followup"].format(product_name=product_name, target_price=target_p),
            "objection_response": target_persona["objection_handler"].format(product_name=product_name, seller_price=min_p, target_price=target_p),
            "key_tactics": target_persona["tactics"]
        }

coach_agent = NegotiationCoachAgent()
