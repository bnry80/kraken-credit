# Kraken Credit — Margin as a Credit Line (Prototype)

A small, beautiful prototype that reimagines crypto margin as a **credit line**.
The goal isn't to teach how margin works — it's to help someone confidently
answer one question:

> **"Should I use my own cash, or borrow from my credit line to buy more Bitcoin?"**

The experience is consumer-first and transparent: plain language, soft surfaces,
and risk surfaced *before* commitment. No trader dashboards, no charts to
interpret, no jargon.

> Prototype with illustrative data and assumptions — not financial advice.

## The flow

**Step 1 — Configure purchase.** Enter a purchase amount and split it between your
own cash and borrowed credit with a single slider. A clear funding bar shows
exactly what you're buying and how it's funded.

**Step 2 — Understand the consequences.** Three plain-language sections:

- **The cost of borrowing** — what interest costs per day / per month, and that it
  only applies while funds remain borrowed.
- **What happens if Bitcoin falls?** — simple outcome rows (e.g. "If BTC falls 10%,
  you lose about $300"), including the point where the position may be sold.
- **Why use credit?** — the buying-power upside and the trade-offs in exchange.

**Review & commitment.** A calm review dialog restates exactly what you're buying,
how it's funded, and what you're agreeing to — then a single **Buy with Credit**
(or **Buy with Cash**) action, followed by a confirmation.

The whole experience adapts when no credit is drawn: it becomes a reassuring
cash-purchase flow with no borrowing costs or risk.

## Success criteria (from the brief)

A first-time user can answer: how much am I borrowing, what will it cost, what
happens if Bitcoin drops, why use credit instead of cash, and what am I agreeing
to before placing the order.

## Tech stack

- **Vite + React + TypeScript**
- **Tailwind CSS** (custom clean-light fintech theme)
- **Framer Motion** (funding bar, dialog, success transitions)
- **Radix UI** (accessible slider + dialog) and **lucide-react** icons

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

Build a production bundle:

```bash
npm run build
npm run preview  # serves the built site locally
```

## Share a public link

The app is a static SPA, so any static host works. Fastest options:

```bash
# Vercel
npx vercel        # follow prompts, deploys ./dist

# Netlify
npm run build && npx netlify deploy --prod --dir=dist

# GitHub Pages (or any static host): upload the ./dist folder
```

## The model & assumptions

All math lives in [`src/lib/margin.ts`](src/lib/margin.ts). Defaults:

| Assumption | Value |
| --- | --- |
| BTC price | $100,000 (round number for clarity) |
| Credit limit | $5,000 |
| Cash balance | $2,500 |
| Borrow rate | 8.5% APR (accrues daily) |
| Maintenance margin | 20% of position value |

**Liquidation price** is derived from the point where equity falls to the
maintenance-margin requirement:

```
equity = quantity·P − borrowed
liquidate when:  equity = mmr · (quantity·P)
=>  P_liq = borrowed / (quantity · (1 − mmr))
```

A cash-only purchase has no interest and **no liquidation price** — that's the
core trade-off the prototype is designed to make obvious.
