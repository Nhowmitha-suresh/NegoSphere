import logging
from typing import Dict, Any, Optional
from app.agents.product_agent import product_agent
from app.agents.price_collection import price_collection_agent
from app.agents.price_analysis import price_analysis_agent
from app.agents.opportunity_agent import opportunity_agent
from app.agents.coach_agent import coach_agent
from app.agents.multi_lang_agent import multi_lang_agent
from app.agents.simulation_agent import simulation_agent
from app.agents.summary_agent import summary_agent

from app.core.logging import logger, generate_request_id, request_id_ctx

class AgentOrchestrator:
    """
    Central Orchestrator Pipeline for NegoSphere.
    Manages the multi-agent workflow:
    User Query -> Agent 1 (Product) -> Agent 2 (Collection) -> Agent 3 (Analysis)
               -> Agent 4 (Opportunity) -> Agent 5 (Coach) -> Agent 6 (Multi-Lang)
               -> Agent 7 (Simulation) -> Agent 8 (Summary)
    """
    async def run_full_pipeline(
        self,
        query: str,
        persona: str = "Assertive",
        language: str = "English",
        seller_personality: str = "Flexible",
        request_id: Optional[str] = None
    ) -> Dict[str, Any]:
        req_id = request_id or generate_request_id()
        request_id_ctx.set(req_id)

        logger.info(f"[req_id={req_id}] Executing NegoSphere 8-agent pipeline for query: '{query}'")

        # Step 1: Product Agent
        try:
            product_info = await product_agent.process(query)
            logger.info(f"[Agent 1 Product] Identified: {product_info.get('name')} ({product_info.get('brand')})")
        except Exception as e:
            logger.error(f"[Agent 1 Product] Error: {e}. Using fallback.")
            product_info = {
                "name": query.strip().title(),
                "brand": "Generic",
                "category": "Electronics",
                "variant": "Standard Edition",
                "keywords": [query.strip()]
            }

        # Step 2: Price Collection Agent
        try:
            price_data = await price_collection_agent.process(query, product_info)
            logger.info(f"[Agent 2 Collection] Retreived {len(price_data.get('vendors', []))} vendor prices")
        except Exception as e:
            logger.error(f"[Agent 2 Collection] Error: {e}. Using fallback.")
            price_data = {
                "query": query,
                "product_name": product_info.get("name", query),
                "base_mrp": 10000.0,
                "vendors": [{"vendor_name": "Retail Store", "price": 9500.0}]
            }

        # Step 3: Price Analysis Agent
        try:
            analysis = await price_analysis_agent.process(price_data)
            logger.info(f"[Agent 3 Analysis] Target price: ₹{analysis.get('recommended_target_price')}")
        except Exception as e:
            logger.error(f"[Agent 3 Analysis] Error: {e}. Using fallback.")
            min_p = price_data["vendors"][0]["price"] if price_data.get("vendors") else 10000.0
            analysis = {
                "min_price": min_p,
                "max_price": min_p * 1.1,
                "avg_price": min_p * 1.05,
                "median_price": min_p * 1.05,
                "variance": 0.0,
                "std_dev": 0.0,
                "recommended_target_price": round(min_p * 0.94, 2),
                "market_spread_pct": 10.0,
                "distribution_points": []
            }

        # Step 4: Negotiation Opportunity Agent
        try:
            opportunity = await opportunity_agent.process(price_data, analysis)
            logger.info(f"[Agent 4 Opportunity] Score: {opportunity.get('confidence_score')}/100")
        except Exception as e:
            logger.error(f"[Agent 4 Opportunity] Error: {e}. Using fallback.")
            opportunity = {
                "confidence_score": 75,
                "opportunity_level": "Strong",
                "recommendation": "Good negotiation potential.",
                "explanation_factors": []
            }

        # Step 5: Negotiation Coach Agent
        product_title = price_data.get("product_name", product_info.get("name", query))
        try:
            coach_data = await coach_agent.process(product_title, analysis, persona)
            logger.info(f"[Agent 5 Coach] Strategy generated for persona: '{persona}'")
        except Exception as e:
            logger.error(f"[Agent 5 Coach] Error: {e}. Using fallback.")
            coach_data = {
                "persona": persona,
                "title": f"{persona} Buyer",
                "description": "Custom strategy",
                "opening_line": f"Hi, I'd like to buy {product_title} for ₹{analysis.get('recommended_target_price')}.",
                "followup_script": "Ready to buy immediately.",
                "objection_response": "Let's meet in the middle.",
                "key_tactics": ["Anchor low", "Offer fast payment"]
            }

        # Step 6: Multi-Language Agent
        try:
            multi_lang_data = await multi_lang_agent.process(
                scripts=coach_data,
                target_language=language,
                product_name=product_title,
                target_price=analysis.get("recommended_target_price", 0)
            )
            logger.info(f"[Agent 6 Multi-Lang] Adapted scripts to language: '{language}'")
        except Exception as e:
            logger.error(f"[Agent 6 Multi-Lang] Error: {e}. Skipping multi-lang adaptation.")
            multi_lang_data = {
                "language": "English",
                "opening_line": coach_data.get("opening_line", ""),
                "followup_script": coach_data.get("followup_script", ""),
                "objection_response": coach_data.get("objection_response", "")
            }

        # Step 7: Seller Simulation Agent (Agent-vs-Agent Showdown)
        initial_price = analysis.get("min_price", 10000.0)
        target_price = analysis.get("recommended_target_price", initial_price * 0.94)
        try:
            simulation_data = await simulation_agent.process(
                product_name=product_title,
                initial_price=initial_price,
                target_price=target_price,
                buyer_persona=persona,
                seller_personality=seller_personality
            )
            logger.info(f"[Agent 7 Simulation] Finished in {simulation_data.get('total_rounds')} rounds.")
        except Exception as e:
            logger.error(f"[Agent 7 Simulation] Error: {e}. Using fallback.")
            simulation_data = {
                "simulation_id": "sim-fallback",
                "total_rounds": 3,
                "final_negotiated_price": target_price,
                "buyer_persona": persona,
                "seller_personality": seller_personality,
                "transcript": [],
                "status": "DEAL_ACCEPTED"
            }

        # Step 8: Summary Agent
        try:
            summary_data = await summary_agent.process(
                product_name=product_title,
                initial_price=initial_price,
                negotiated_price=simulation_data.get("final_negotiated_price", target_price),
                confidence_score=opportunity.get("confidence_score", 85),
                simulation_data=simulation_data,
                coach_data=coach_data
            )
            logger.info(f"[Agent 8 Summary] Executive victory card generated.")
        except Exception as e:
            logger.error(f"[Agent 8 Summary] Error: {e}. Using fallback.")
            summary_data = {
                "product_name": product_title,
                "initial_price": initial_price,
                "negotiated_price": target_price,
                "money_saved": initial_price - target_price,
                "savings_percentage": 6.0,
                "confidence_score": 85,
                "deal_rating": "Solid Win",
                "future_strategy_tips": [],
                "shareable_card": {"title": "NegoSphere Victory Card"},
                "simulation_summary": {}
            }

        return {
            "request_id": req_id,
            "query": query,
            "product_info": product_info,
            "price_data": price_data,
            "analysis": analysis,
            "opportunity": opportunity,
            "coach": coach_data,
            "multi_lang": multi_lang_data,
            "simulation": simulation_data,
            "summary": summary_data
        }

orchestrator = AgentOrchestrator()
