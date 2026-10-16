# UangForge — watch the AI Factory build

**Live: [uangforge.vercel.app](https://uangforge.vercel.app)** — curated scenarios work with zero configuration.

Describe a small business app, watch it get **planned, built, tested and shipped** in front of
you — then actually use the result. Every finished app lives inside a shareable URL.

> The third piece of a showcase for [uang.ai](https://uang.ai) ("The AI Factory"), alongside
> [UangLite](https://uanglite.ricothen.com) (an agent operating a real ERP) and
> [UangCounsel](https://uangcounsel.vercel.app) (AI contract review with receipts).
> UangForge demonstrates the delivery loop itself. Portfolio build — not affiliated with or
> endorsed by uang.ai.

## The honesty architecture

“Watch AI build an app” demos usually cheat — a video, a simulation, or generated code that
only sometimes compiles. UangForge takes the boring-but-real route:

1. **Plan** — the planner LLM fills a strict JSON **blueprint schema** inside a fixed
   constraint space (≤2 entities, 2–7 typed fields, table/board/calendar views,
   count/sum/avg metrics, one approval workflow). It never writes code — arbitrary output
   is impossible by construction. Output is validated with zod; a failed attempt gets one
   repair retry, then a **labeled curated fallback** — never a fabricated result.
2. **Build** — a deterministic React runtime interprets every blueprint: schema, seed data,
   dashboard, views, create-form, approval gate.
3. **Test** — the theater's checks are *real*: they execute actual validations against the
   blueprint (schema bounds, typed fields, renderable views, resolvable aggregations, sane
   workflow). A failing check stops the line.
4. **Ship** — the app runs live on the page, persists to your browser (localStorage), and
   the whole blueprint compresses into the URL (`/app?bp=…`) — no database, nothing stored.

Generation strategy verified in a spike: **8/8 prompts produced schema-valid blueprints on
the first try** with `gpt-4o-mini`, before hardening (workflow sanity rules, repair retry,
curated fallback).

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · AI SDK (any
OpenAI-compatible endpoint) · zod · Vitest · Playwright. **No database** — the app lives in
the URL, records live in your browser.

## Develop

```bash
pnpm install
pnpm dev              # http://localhost:3000
pnpm test             # unit tests (schema, codec round-trip, seed determinism)
pnpm test:e2e         # Playwright: full build theater → working app → approval flow
pnpm lint && pnpm typecheck && pnpm build
```

Optional env (`.env.local`, see `.env.example`):

```
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=sk-...
LLM_MODEL=gpt-4o-mini
```

Without a key, the curated library powers the whole experience (labeled "curated template");
with a key, blueprints are planned from any description (labeled "planned by LLM").

## Limits (stated, not hidden)

The runtime's vocabulary is the constraint space above. Prompts outside it get the nearest
curated template. Records are per-browser. The calendar view renders October 2026 to match
the seeded sample data.
