<<<<<<< HEAD
# AI Negotiator Showdown 🚀
> **Enterprise-Grade Multi-Agent Negotiation Intelligence & Battle Simulation Platform**

[![Deloitte Tech Focus](https://img.shields.io/badge/Deloitte_Interview-Ready-blue.svg)](#deloitte-interview-talking-points)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React Vite](https://img.shields.io/badge/Frontend-React_18_%7C_Vite-61DAFB.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/UI-Glassmorphism_Tailwind-38B2AC.svg)](https://tailwindcss.com/)
[![Multi-Agent Architecture](https://img.shields.io/badge/AI-8_Autonomous_Agents-8A2BE2.svg)](#multi-agent-architecture)

---

## 🌟 Project Motivation & Problem Statement

Many consumers and procurement officers hesitate during price negotiations because they lack key market data:
* **Is the listed retail price fair?**
* **How much negotiation margin actually exists?**
* **What exact wording and tone should be used to close the deal?**
* **Will the seller accept, counter, or walk away?**

**AI Negotiator Showdown** solves this by combining multi-vendor web data collection, statistical price dispersion modeling, 0–100 opportunity confidence scoring, 6 persona-matched strategy coaching, 6-language natural script adaptation, and an automated **Agent-vs-Agent Showdown Battle Arena**.

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

## 💼 Deloitte Interview Talking Points & Deep Dives

When discussing this project with recruiters and technical interviewers at Deloitte or top tech firms, highlight the following engineering decisions:

1. **Multi-Agent Orchestration & Separation of Concerns:**
   - Rather than relying on a single prompt, the system breaks down complex reasoning into discrete agents. Each agent has a focused contract, making the codebase testable and modular.
2. **Resilient AI System Design (Dual LLM + Offline Fallback):**
   - The platform never crashes due to API key rate limits or network dropouts. It implements graceful degradation using heuristic mock engines.
3. **Data Engineering & Statistical Modeling:**
   - Demonstrates quantitative metrics (standard deviation, variance, percentiles) and normal density curves to inform AI decision-making.
4. **Responsible Scraping & Legal Risk Management:**
   - Articulates clear understanding of data collection boundaries (`robots.txt`, rate limiting, fallback datasets).
5. **Full-Stack Glassmorphism UX:**
   - Modern enterprise visual standards with interactive visualizers, battle arenas, and print-ready PDF reporting.

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
=======
# NegoSphere
An intelligent negotiation platform that leverages multiple AI agents to analyze prices, estimate fair market value, simulate negotiations, and maximize user savings.
>>>>>>> d38118bf93578c52c62e8174ec5c8ea20f38e295
