import logging
from typing import Dict, Any
from app.services.llm_service import llm_service

logger = logging.getLogger("negosphere.agent.product")

class ProductAgent:
    """
    Agent 1: Product Understanding Agent
    Responsibility: Parses user raw search text into structured product attributes
    (Brand, Category, Model, Variant, Storage, Keywords, Specs).
    """
    async def process(self, query: str) -> Dict[str, Any]:
        prompt = f"""
        Extract detailed product parameters from the user's search query: "{query}".
        Return JSON with fields:
        - name: Full normalized product title
        - brand: Brand name (e.g. Samsung, Apple, Sony)
        - category: Product category (e.g. Smartphones, Laptops, Audio, Consoles, Cars)
        - variant: Specs or color/storage (e.g. 256GB / Titanium Gray)
        - keywords: list of search keywords for scraping
        """
        system_instruction = "You are a Product Taxonomy AI Agent. Extract brand, model, category, variant, and search keywords accurately."

        llm_res = await llm_service.generate_json(prompt, system_instruction)
        
        # Check if LLM returned structured response
        if isinstance(llm_res, dict) and "brand" in llm_res and "category" in llm_res:
            return llm_res

        # Rule-based fallback extraction if LLM is offline
        words = query.strip().split()
        brand = words[0].capitalize() if words else "Generic"
        
        category = "Electronics"
        q_lower = query.lower()
        if any(w in q_lower for w in ["phone", "s24", "iphone", "galaxy", "pixel", "mobile"]):
            category = "Smartphones"
        elif any(w in q_lower for w in ["macbook", "laptop", "thinkpad", "dell", "hp", "asus"]):
            category = "Laptops"
        elif any(w in q_lower for w in ["headphone", "earbuds", "xm5", "airpods", "audio"]):
            category = "Audio & Headphones"
        elif any(w in q_lower for w in ["ps5", "playstation", "xbox", "nintendo", "console"]):
            category = "Gaming Consoles"

        return {
            "name": query.strip().title(),
            "brand": brand,
            "category": category,
            "variant": "Standard Edition",
            "keywords": [query.strip(), f"{brand} {category}"]
        }

product_agent = ProductAgent()
