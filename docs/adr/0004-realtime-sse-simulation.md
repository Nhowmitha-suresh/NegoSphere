# ADR 0004: Real-time SSE Streaming for AI Battle Showdown

## Status
Accepted

## Context
Returning multi-turn AI negotiation simulation results in a single monolithic JSON payload forces users to wait idly without visual feedback, reducing engagement during live demonstrations.

## Decision
We implemented **Server-Sent Events (SSE)** via FastAPI's `StreamingResponse` at `/api/simulate/stream` to stream negotiation turns in real time as structured JSON events (`event: turn`).

## Consequences
### Positive
- Live animated typing & battle progression in the frontend (`ShowdownArena.jsx`).
- Lightweight HTTP protocol overhead compared to full duplex WebSockets.
