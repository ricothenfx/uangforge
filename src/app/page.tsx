import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Factory } from "@/components/factory";

export const metadata: Metadata = {
  title: "Watch the AI Factory build",
  description:
    "Describe a small business app, watch the factory plan, build, test and ship it — then use the working result. Every build is shareable by URL.",
};

const HOW = [
  {
    n: "01",
    t: "Plan — the blueprint, not code",
    d: "The planner LLM fills a strict JSON schema inside a fixed constraint space: entity types, field types, views, metrics, one approval workflow. It never writes code — arbitrary output is impossible by construction.",
  },
  {
    n: "02",
    t: "Build — a deterministic runtime",
    d: "The same machine interprets every blueprint: schema, seed data, dashboard cards, table/board/calendar views, a create form, an approval gate. Verified modules, no surprises.",
  },
  {
    n: "03",
    t: "Test — real checks, real QC",
    d: "The test stage executes actual validations against the blueprint: schema bounds, typed fields, renderable views, resolvable aggregations, a sane workflow. A failing check stops the line.",
  },
  {
    n: "04",
    t: "Ship — a working app + a URL",
    d: "The finished app runs live on the page, persists to your browser, and lives in a shareable URL — the whole blueprint is compressed into the link. No database, nothing stored.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        <section className="relative overflow-hidden pb-12 pt-16 text-center sm:pt-24">
          <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative">
            <span className="inline-block rounded-full border border-line bg-card px-3 py-1 text-xs text-muted">
              UangForge — the third factory proof
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
              Don&apos;t read about the AI Factory.
              <span className="text-accent"> Run it.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
              Describe a small business app and watch it get planned, built, tested and shipped
              in front of you — then actually use it. The LLM fills a constrained blueprint;
              a deterministic runtime builds the app. <em>That</em> is how you build software with AI
              and keep it honest.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              <span>① describe or pick a scenario</span>
              <span>② watch plan → build → test → ship</span>
              <span>③ the app is real — go on, click it</span>
            </div>
          </div>
        </section>

        <section id="factory">
          <Factory />
        </section>

        <section id="how" className="pt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Why this is honest</h2>
          <p className="mt-2 max-w-2xl text-muted">
            “Watch AI build an app” demos usually cheat — a video, a simulation, or code that
            only sometimes compiles. UangForge takes the boring-but-real route:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {HOW.map((s) => (
              <div key={s.n} className="card p-5">
                <span className="font-display text-xs font-bold text-accent">{s.n}</span>
                <h3 className="mt-1 font-display font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 card p-5">
            <h3 className="font-display font-bold">The constraint space</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              The runtime can build: up to 2 entities with 2–7 typed fields (text, number,
              currency, date, select, boolean), table/board/calendar views, count/sum/avg
              dashboard cards, and one approval workflow with a human confirm. That&apos;s the
              whole vocabulary — which is exactly why every build works. Inside the limits,
              the results are genuinely useful trackers; outside them, the factory says no
              instead of pretending.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
