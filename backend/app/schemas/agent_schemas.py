from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

# --- Agent 1: Product Agent ---
class ProductAgentInput(BaseModel):
    query: str = Field(..., description="User search query, product URL, or title")

class ProductAgentOutput(BaseModel):
    name: str
    category: str
    brand: str
    variant: str
    search_tags: List[str]
    base_mrp: float

# --- Agent 2: Price Collection Agent ---
class VendorPrice(BaseModel):
    vendor_name: str
    price: float
    url: Optional[str] = None
    in_stock: bool = True
    shipping_cost: float = 0.0

class PriceCollectionInput(BaseModel):
    query: str
    product_info: Optional[Dict[str, Any]] = None

class PriceCollectionOutput(BaseModel):
    product_name: str
    base_mrp: float
    vendors: List[VendorPrice]

# --- Agent 3: Price Analysis Agent ---
class PriceAnalysisInput(BaseModel):
    base_mrp: float
    vendors: List[VendorPrice]

class PriceAnalysisOutput(BaseModel):
    min_price: float
    max_price: float
    avg_price: float
    median_price: float
    variance: float
    std_dev: float
    recommended_target_price: float
    market_spread_pct: float
    price_density: List[Dict[str, Any]] = []

# --- Agent 4: Negotiation Opportunity Agent ---
class OpportunityAgentInput(BaseModel):
    price_data: Dict[str, Any]
    analysis: Dict[str, Any]

class OpportunityAgentOutput(BaseModel):
    confidence_score: int = Field(..., ge=0, le=100)
    opportunity_level: str
    deal_score_factors: Dict[str, float]
    savings_potential: float
    recommended_tactic: str
    negotiation_margin_pct: float

# --- Agent 5: Coach Agent ---
class CoachAgentInput(BaseModel):
    product_name: str
    analysis: Dict[str, Any]
    persona: str = "Assertive"

class CoachAgentOutput(BaseModel):
    persona: str
    opening_anchor: str
    counter_offer_script: str
    walkaway_script: str
    key_leverage_points: List[str]
    psychological_tactics: List[str]

# --- Agent 6: Multi-Language Agent ---
class MultiLangInput(BaseModel):
    scripts: Dict[str, Any]
    target_language: str = "English"
    product_name: str
    target_price: float

class MultiLangOutput(BaseModel):
    target_language: str
    adapted_scripts: Dict[str, str]
    cultural_notes: List[str]

# --- Agent 7: Simulation Agent ---
class SimulationInput(BaseModel):
    product_name: str
    initial_price: float
    target_price: float
    buyer_persona: str = "Assertive"
    seller_personality: str = "Flexible"

class TurnMessage(BaseModel):
    round: int
    speaker: str
    message: str
    offered_price: float

class SimulationOutput(BaseModel):
    simulation_id: str
    total_rounds: int
    final_negotiated_price: float
    buyer_persona: str
    seller_personality: str
    transcript: List[TurnMessage]
    status: str

# --- Agent 8: Summary Agent ---
class SummaryInput(BaseModel):
    product_name: str
    initial_price: float
    negotiated_price: float
    confidence_score: int
    simulation_data: Dict[str, Any]
    coach_data: Dict[str, Any]

class SummaryOutput(BaseModel):
    product_name: str
    initial_price: float
    negotiated_price: float
    money_saved: float
    savings_percentage: float
    confidence_score: int
    deal_rating: str
    future_strategy_tips: List[str]
    shareable_card: Dict[str, Any]
    simulation_summary: Dict[str, Any]

# --- Pipeline Master Schemas ---
class PipelineRequest(BaseModel):
    query: str
    persona: str = "Assertive"
    language: str = "English"
    seller_personality: str = "Flexible"

class PipelineResponse(BaseModel):
    request_id: str
    query: str
    product_info: Dict[str, Any]
    price_data: Dict[str, Any]
    analysis: Dict[str, Any]
    opportunity: Dict[str, Any]
    coach: Dict[str, Any]
    multi_lang: Dict[str, Any]
    simulation: Dict[str, Any]
    summary: Dict[str, Any]
