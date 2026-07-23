# ADR 0002: Dual-LLM Engine with Offline Heuristic Fallback

## Status
Accepted

## Context
Production AI applications frequently suffer from third-party LLM outages, API key rate limits, latency spikes, and missing credentials during local evaluation or live technical demonstrations.

## Decision
We implemented a **Dual-Engine LLM abstraction layer** (`app/services/llm_service.py`) supporting:
- Primary Engine: **Google Gemini 1.5 Flash** (Fast inference, structured JSON mode).
- Secondary Engine: **OpenAI GPT-4o** (High reasoning capacity).
- Seamless **Offline Heuristic Fallback**: Automatic rule-based response generation when API keys are omitted or network requests time out.

## Consequences
### Positive
- **100% Demo Reliability**: The application functions completely offline without throwing runtime errors or requiring API keys.
- **Provider Agnostic**: Easily switch providers via environment variable (`LLM_PROVIDER=gemini | openai | auto | mock`).

### Negative
- Heuristic fallback scripts are static template-driven rather than generative (fully predictable, which is beneficial for automated testing).
