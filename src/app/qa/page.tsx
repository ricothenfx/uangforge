import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Q&A — about this project",
  description:
    "Questions and straight answers about UangForge: what the factory really does, what's AI vs deterministic, honesty rules, privacy, and how it relates to uang.ai.",
};

type Qa = { q: string; a: string };
type Category = { id: string; label: string; items: Qa[] };

const CATEGORIES: Category[] = [
  {
    id: "project",
    label: "The project",
    items: [
      {
        q: "What is UangForge?",
        a: "A portfolio build where you watch software get made: pick or describe a small business app, and the site plans it, builds it, tests it and ships it in front of you — ending in a working app you can use immediately and share by URL. It's the \"watch the factory work\" piece of a three-part showcase for uang.ai (\"The AI Factory\").",
      },
      {
        q: "Why does this exist?",
        a: "Because \"bespoke software built with AI\" is easy to claim and hard to show. UangLite shows an agent operating a real ERP; UangFactory (the website) proves instead of tells; UangForge goes all the way: it demonstrates the delivery loop itself — the thing uang.ai literally names itself after — live, in the browser, in under a minute.",
      },
      {
        q: "Is this affiliated with uang.ai?",
        a: "No. Independent portfolio work by Rico — not affiliated with or endorsed by uang.ai.",
      },
    ],
  },
  {
    id: "real",
    label: "What's AI vs. what's real",
    items: [
      {
        q: "Does the AI really build the app?",
        a: "Here is the honest breakdown: the LLM is the planner — it fills a strict JSON blueprint (entities, fields, views, metrics, workflow) from your description. A deterministic runtime — ordinary, tested React code — builds the actual app from that blueprint. So yes, the app you see is really built and really runs; no, the model doesn't write arbitrary code. That division is the whole point.",
      },
      {
        q: "Why not let the LLM write the code?",
        a: "Because then the demo sometimes works — and a factory that sometimes works is a demo, not a factory. Constraining the model to a schema inside a fixed runtime means every build succeeds, every build is testable, and nothing can be faked. It's also how a lot of real production AI works: model the judgment, engineering the rest.",
      },
      {
        q: "What can the factory actually build?",
        a: "The runtime's full vocabulary: up to 2 entities with 2–7 typed fields, table/board/calendar views, count/sum/avg dashboard cards, seed data, a create-record form, and one approval workflow with a human confirm. Membership trackers, leave approvals, bug triage, inventory reorders — that class of app. The factory refuses what's outside the vocabulary instead of pretending.",
      },
      {
        q: "Is the test stage real?",
        a: "Yes — it's the part most similar demos fake. The checks execute actual validations against your blueprint: schema bounds, every field typed, views resolvable against entities, aggregations resolvable, workflow statuses distinct and present. A failing check stops the line; the fallback is a labeled curated template, never a fabricated result.",
      },
      {
        q: "What if there's no LLM API key configured?",
        a: "You get the nearest match from the curated template library, clearly labeled \"curated template\". With a key, the planner plans from any description and the result is labeled \"planned by LLM\". If the planner fails validation twice, you get the curated fallback plus a note explaining exactly what happened.",
      },
    ],
  },
  {
    id: "privacy",
    label: "Privacy & data",
    items: [
      {
        q: "Where is my data stored?",
        a: "In your browser. Records you create persist in localStorage under a key derived from the app's blueprint. There is no database. The whole built app is encoded inside its URL, so a link can never leak data you entered after opening it.",
      },
      {
        q: "What does the LLM see?",
        a: "Only your prompt (what you typed). No records you create in a built app are ever sent anywhere — they never leave your browser.",
      },
    ],
  },
  {
    id: "stack",
    label: "Stack & meta",
    items: [
      {
        q: "What is it built with?",
        a: "Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · AI SDK with any OpenAI-compatible endpoint · zod for the blueprint schema · a URL codec (deflate + base64url) so apps live in links · Vitest + Playwright for tests. No database by design.",
      },
      {
        q: "How was it verified before being shipped?",
        a: "The generation strategy was spiked first: 8/8 prompts produced schema-valid blueprints on the first try with a small model. Unit tests cover the schema (including workflow sanity rules), the URL codec round-trip, and seed determinism. Playwright end-to-end tests build an app through the real theater, create a record through the real form, run the approval flow, and open a shared URL.",
      },
      {
        q: "Can I run my own instance?",
        a: "Yes — open source. Set LLM_BASE_URL / LLM_API_KEY / LLM_MODEL to any OpenAI-compatible endpoint (including a local one). Without them the curated library still powers the whole experience.",
      },
    ],
  },
];

export default function QaPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-12">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Q&A</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Straight answers about UangForge: what the factory really does, what&apos;s AI versus
          deterministic, and where the honesty guarantees come from.
        </p>
        <div className="mt-10 space-y-10">
          {CATEGORIES.map((cat) => (
            <section key={cat.id}>
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-accent">{cat.label}</h2>
              <div className="mt-3 space-y-3">
                {cat.items.map((item) => (
                  <details key={item.q} className="card group p-4 open:pb-5">
                    <summary className="cursor-pointer list-none font-medium marker:hidden">
                      <span className="mr-2 inline-block text-muted transition-transform group-open:rotate-90">›</span>
                      {item.q}
                    </summary>
                    <p className="mt-3 pl-5 text-sm leading-relaxed text-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-muted">
          Convinced? <Link href="/#factory" className="text-accent underline underline-offset-2">Run a build</Link> and
          check the results yourself.
        </p>
      </main>
      <Footer />
    </>
  );
}
