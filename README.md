# Mini Trade Console (SvelteKit + CoinCap WS + Tailwind)

A tiny SvelteKit app to refresh: CSR/SSR boundaries, **WebSocket** streaming (CoinCap), order POST flow, optimistic updates, and derived P&L — styled with Tailwind.

## Run

- Node 20+
- `npm i`
- `npm run dev`
- `npm run test`

## External Feed

- WebSocket: `wss://ws.coincap.io/prices?assets=bitcoin,ethereum,litecoin`
- UI symbols: ES/NQ/CL → mapped to CoinCap assets: bitcoin/ethereum/litecoin (demo only; you’ll narrate why)

## What it does (after TODOs are filled)

- Connects CoinCap WS (client-only), updates **prices** and **lastPrices** stores.
- Submits mock orders via `/api/order` and displays round-trip **latency**.
- Tracks **positions** and derives naive **P&L** from prices × qty (baseline 100).

## A11y & Perf

- Proper labels; status via `aria-live="polite"`.
- Store updates are batched; no prop drilling.

## Tests (minimal)

- `stores.pnl.test.ts` — P&L derivation.
- `order.ticket.test.ts` — button disabled + status/latency (mocked fetch).

## Stretch ideas (describe only)

- Risk checks, copy trade fan-out, reconnect/backoff, small SVG sparklines.

## Notes

- Keep implementation inside the 4-hour box. Narrate SSR safety (`onMount` for WS), typed adapters, and optimistic updates.
