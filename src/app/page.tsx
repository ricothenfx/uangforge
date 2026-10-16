import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Factory } from "@/components/factory";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDictionary();
  return {
    title: d.meta.titleHome,
    description: d.meta.descriptionHome,
  };
}

export default async function Home() {
  const d = await getDictionary();
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        <section className="relative overflow-hidden pb-12 pt-16 text-center sm:pt-24">
          <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative">
            <span className="inline-block rounded-full border border-line bg-card px-3 py-1 text-xs text-muted">
              {d.hero.badge}
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
              {d.hero.titleA}
              <span className="text-accent">{d.hero.titleAccent}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
              {d.hero.bodyA}
              <em>{d.hero.bodyEm}</em>
              {d.hero.bodyB}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              <span>{d.hero.step1}</span>
              <span>{d.hero.step2}</span>
              <span>{d.hero.step3}</span>
            </div>
          </div>
        </section>

        <section id="factory">
          <Factory />
        </section>

        <section id="how" className="pt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{d.how.title}</h2>
          <p className="mt-2 max-w-2xl text-muted">{d.how.intro}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {d.how.items.map((s, i) => (
              <div key={i} className="card p-5">
                <span className="font-display text-xs font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-1 font-display font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 card p-5">
            <h3 className="font-display font-bold">{d.how.constraintTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{d.how.constraintBody}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
