# ADR 0003: Ethical Web Scraping & Fallback Data Architecture

## Status
Accepted

## Context
Scraping live e-commerce websites introduces risks including CAPTCHAs, bot detection, site schema changes, and rate limiting. Relying solely on live web requests causes high latency and fragility.

## Decision
We implemented a **Hybrid Data Collection Strategy** (`app/services/scraper_service.py`):
1. **Robots.txt & Rate Limiting Compliance**: Respect domain scraping rules and enforce request throttling.
2. **Fallback Curated Multi-Vendor Dataset**: When live scraping encounters timeouts, CAPTCHAs, or missing price elements, the engine seamlessly merges curated Indian bazaar & e-commerce pricing benchmarks.

## Consequences
### Positive
- Guaranteed pipeline completion latency (<2 seconds for cached/fallback data).
- Eliminates legal and operational risks of aggressive web scraping.
