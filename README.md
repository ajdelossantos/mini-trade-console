# Mini Trade Console (SvelteKit + Coinbase WS + Tailwind v4)

A tiny, production-ish SvelteKit app to prep for a live-coding interview.  
It demonstrates: **client-only realtime** (Coinbase Exchange WebSocket), **order ticket** with mocked fills, **positions & derived P&L**, **latency badge**, and basic **a11y/perf** habits.

---

## What’s inside

- **Realtime Watchlist** — Subscribes to Coinbase **ticker** channel for 3 products and streams last price + Δ since previous tick.
- **Order Ticket (mocked)** — Post `{ sym, side, qty }` to a local server route that simulates a 200–500 ms fill; UI updates **optimistically**.
- **Positions & P&L** — Naive derived P&L per symbol from positions × (price − 100 baseline).
- **Latency Badge** — Displays last order round-trip latency in ms.
- **A11y & Perf** — Labels, `aria-live`, cleanup of WS, and light-touch Tailwind.

> This is a **refresher** slice, not a brokerage. No real orders are sent—prices are read-only public market data; orders are mocked server-side.

---

## Stack

- **SvelteKit** (TypeScript) — routing, server endpoints, SSR/CSR boundaries
- **Tailwind CSS v4** — utility classes via PostCSS plugin
- **Coinbase Exchange WebSocket** — public market data (`ticker` channel)
- **Vitest + @testing-library/svelte** — two high-ROI tests

---

## Quickstart

```bash
# Node 20+ recommended
npm i

# dev
npm run dev

# tests
npm run test
```
