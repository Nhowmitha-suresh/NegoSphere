# ADR 0001: Multi-Agent Pipeline Architecture (8 Specialized Agents)

## Status
Accepted

## Context
When building an AI-powered negotiation intelligence platform, a single monolithic LLM prompt struggles with token limits, complex multi-step reasoning (taxonomy extraction -> web scraping -> statistical modeling -> strategy generation -> battle simulation -> summary generation), and deterministic data manipulation (calculating standard deviation, percentiles, and variance).

## Decision
We adopted a modular **8-Agent Pipeline Architecture** managed by an asynchronous Central Orchestrator:

1. **Product Agent**: Extract product taxonomy, brand, category, search keywords.
2. **Price Collection Agent**: Ethical hybrid scraping + fallback multi-vendor dataset.
3. **Price Analysis Agent**: Statistical modeling (min, max, mean, median, variance, std dev, normal density curve).
4. **Opportunity Agent**: Multi-factor 0–100 confidence score calculation.
5. **Coach Agent**: Persona-matched negotiation scripts & strategic leverage points.
6. **Multi-Language Agent**: Culturally fluent regional script adaptation across 6 languages.
7. **Simulation Agent**: Autonomous Agent-vs-Agent Showdown battle arena (Buyer AI vs Seller AI).
8. **Summary Agent**: Executive victory card & PDF report export synthesis.

## Consequences
### Positive
- **Single Responsibility & Testability**: Each agent has a strict Pydantic input/output contract, allowing isolated unit testing.
- **Graceful Degradation**: If one non-critical agent fails (e.g. multi-lang script adaptation), the pipeline falls back gracefully without crashing.
- **Deterministic Math**: Statistical computations are executed natively in Python (`statistics`, `math`), avoiding LLM math errors.

### Negative
- Higher pipeline latency compared to single-step completions (mitigated by async agent execution & streaming).
