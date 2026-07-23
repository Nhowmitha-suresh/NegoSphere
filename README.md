# NegoSphere 🚀
> **An intelligent negotiation platform that leverages 8 autonomous AI agents to analyze prices, estimate fair market value, simulate AI-vs-AI negotiations, and maximize savings.**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React Vite](https://img.shields.io/badge/Frontend-React_18_%7C_Vite-61DAFB.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/UI-Glassmorphism_Tailwind-38B2AC.svg)](https://tailwindcss.com/)
[![Multi-Agent Architecture](https://img.shields.io/badge/AI-8_Autonomous_Agents-8A2BE2.svg)](#-multi-agent-system-architecture)

---

## 🌟 Project Motivation & Problem Statement

Many consumers and procurement officers hesitate during price negotiations because they lack key market data:
* **Is the listed retail price fair?**
* **How much negotiation margin actually exists?**
* **What exact wording and tone should be used to close the deal?**
* **Will the seller accept, counter, or walk away?**

**NegoSphere** solves this by combining multi-vendor web data collection, statistical price dispersion modeling, 0–100 opportunity confidence scoring, 6 persona-matched strategy coaching, 6-language natural script adaptation, and an automated **Agent-vs-Agent Showdown Battle Arena**.

---

## 🤖 Multi-Agent System Architecture

The platform operates via an **Asynchronous Central Orchestrator** managing 8 specialized AI agents working in sequence:

```
[ User Search Input ]
        │
        ▼
┌─────────────────────────┐
│ 1. Product Agent        │ ── Extract Taxonomy (Brand, Category, Variant, Search Tags)
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│ 2. Scraper Agent        │ ── Hybrid Data Collection (Ethical Web Scraping + Fallback Dataset)
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│ 3. Price Analysis Agent │ ── Compute Min, Max, Avg, Median, Variance, Target Offer, PDF Density
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│ 4. Opportunity Agent    │ ── 0-100 Confidence Score & Multi-Factor Margin Breakdown
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│ 5. Coach Agent          │ ── Strategy Scripts for 6 Personas (Assertive, Diplomatic, Student, etc.)
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│ 6. Multi-Lang Agent     │ ── Natural Adaptation across 6 Regional Languages (EN, HI, TA, TE, KN, ML)
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│ 7. Showdown Agent       │ ── Autonomous Agent-vs-Agent Battle Arena (Buyer AI vs 5 Seller Personalities)
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│ 8. Summary Agent        │ ── Generate Executive Victory Card, Savings Analytics & PDF Export
└─────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (Custom Dark Mode & Glassmorphism System)
- **Animations:** Framer Motion & Lucide Icons
- **Charts:** Recharts (Area Trend Charts, Vertical Bar Comparisons, Distribution Curves)
- **API Client:** Axios

### Backend
- **Framework:** FastAPI (Python 3.11)
- **Database:** SQLite (Default for zero-config demo) / PostgreSQL (via async SQLAlchemy)
- **Caching & Queue:** Redis
- **Scraping Engine:** BeautifulSoup4 + Requests + Playwright support
- **LLM Engine:** Dual-Engine Architecture (Google Gemini 1.5 Flash / OpenAI GPT-4o with automatic offline heuristic fallback)

### Deployment & Infra
- **Containers:** Docker & Docker Compose

---

## 🌐 Hybrid Scraping Strategy & Responsible Data Collection

1. **Ethical Web Compliance:** The scraper respects `robots.txt`, domain rate limits, and site Terms of Service.
2. **Fallback Dataset Guarantee:** If a vendor website blocks automated access, triggers CAPTCHAs, or times out, the engine seamlessly switches to a curated multi-vendor dataset without throwing errors.
3. **100% Demo Reliability:** Guarantees zero downtime during live interview presentations or offline evaluations.

---

## 🎬 Live Battle Arena Demo Preview

> **Watch Buyer AI negotiate live against Seller AI personalities turn-by-turn with Server-Sent Events (SSE) streaming.**

![NegoSphere Demo Preview](https://via.placeholder.com/1200x600/0B0F19/6366F1?text=NegoSphere+AI-vs-AI+Battle+Arena+Demo+Preview)
*(Placeholder: Replace with actual `demo.gif` or Loom video walkthrough)*

---

## 📐 Architecture Decision Records (ADRs)

Key engineering design decisions are formally documented in [`/docs/adr/`](file:///c:/Users/Lenovo/Desktop/NegoSphere/docs/adr/):

- [ADR 0001: Multi-Agent Pipeline Architecture](file:///c:/Users/Lenovo/Desktop/NegoSphere/docs/adr/0001-multi-agent-pipeline-architecture.md) — Why 8 specialized agents instead of a single prompt.
- [ADR 0002: Dual-LLM Engine with Offline Fallback](file:///c:/Users/Lenovo/Desktop/NegoSphere/docs/adr/0002-dual-llm-with-offline-fallback.md) — Resilient AI architecture supporting Gemini 1.5 Flash, GPT-4o, and zero-downtime offline fallback.
- [ADR 0003: Ethical Web Scraping & Fallback Data Architecture](file:///c:/Users/Lenovo/Desktop/NegoSphere/docs/adr/0003-hybrid-ethical-web-scraping.md) — Responsible data collection, rate limiting, and fallback dataset reliability.
- [ADR 0004: Real-time SSE Simulation Streaming](file:///c:/Users/Lenovo/Desktop/NegoSphere/docs/adr/0004-realtime-sse-simulation.md) — Streaming turn-by-turn AI showdown dialogue over Server-Sent Events.

---

## 💼 Technical Portfolio Interview Deep Dives

When discussing NegoSphere in technical software engineering interviews, highlight these core architectural principles:

1. **Multi-Agent Orchestration & Separation of Concerns:**
   - Rather than relying on a monolithic prompt, complex reasoning is broken down into 8 single-responsibility agents. Each agent enforces a strict Pydantic input/output contract, enabling isolated unit testing.
2. **Resilient AI System Design (Dual LLM + Offline Fallback):**
   - Implements graceful degradation so network dropouts or API rate limits never crash the application. Offline heuristic engines guarantee 100% evaluation uptime.
3. **Data Engineering & Quantitative Statistical Modeling:**
   - Combines qualitative LLM strategy with quantitative statistics (variance, standard deviation, Gaussian PDF curves) to compute 0–100 confidence scores.
4. **Responsible Scraping & Legal Risk Boundaries:**
   - Articulates clear boundaries (`robots.txt`, rate limits, fallback datasets) to ensure compliance and zero downtime.
5. **Full-Stack Glassmorphism UX:**
   - Modern enterprise visual standards with interactive Recharts visualizers, live SSE battle arenas, and print-ready PDF export reporting.

---

## 📌 Known Limitations & Product Roadmap

### Current Scope & Limitations
- **Offline Fallback Default**: When live scraping is throttled or API keys are unconfigured, pricing metrics draw from curated Indian bazaar benchmarks.
- **Single-turn Real-time Streaming**: SSE streaming animates preset turn dialogues; multi-agent interactive user injection is planned.

### Planned Roadmap
- [ ] **Voice Input / Speech Synthesis**: Real-time voice coaching playback using Web Speech API.
- [ ] **User Authentication & JWT**: Saved user profiles and shareable custom negotiation URLs.
- [ ] **Chrome Browser Extension**: One-click URL & price extraction directly from e-commerce product pages into NegoSphere.

---

## 🚀 Quickstart Guide

### Option 1: Run Locally (Fastest)

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/Mac:
# source venv/bin/activate

pip install -r requirements.txt
python -m app.main
```
*Backend server will start at `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.*

#### 2. Frontend Setup (In a new terminal)
```bash
cd frontend
npm install
npm run dev
```
*Frontend will open at `http://localhost:3000`.*

---

### Option 2: Run with Docker Compose

```bash
docker-compose up --build
```
*Services launched:*
- **Frontend UI:** `http://localhost:3000`
- **FastAPI Backend:** `http://localhost:8000`
- **PostgreSQL Database:** `localhost:5432`
- **Redis Cache:** `localhost:6379`

---

## 🧪 Testing the Pipeline

Run the automated agent test suite:
```bash
cd backend
pytest test_pipeline.py -v
```

---

## 📜 License & Portfolio Usage
Created for technical portfolio demonstrations and enterprise AI software engineering showcases.
