import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { AppClient } from "@/components/app-client";
import { decodeBlueprint } from "@/lib/codec";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDictionary();
  return {
    title: d.meta.titleApp,
    description: d.meta.descriptionApp,
    robots: { index: false },
  };
}

export default async function AppPage({ searchParams }: { searchParams: Promise<{ bp?: string }> }) {
  const { bp: encoded } = await searchParams;
  const decoded = encoded ? await decodeBlueprint(encoded) : null;
  const bp = decoded ?? null;
  const d = await getDictionary();

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-10 pt-10">
        {bp ? (
          <>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight">{bp.appName}</h1>
                <p className="text-sm text-muted">{bp.tagline}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  bp.source === "llm" ? "bg-accent-soft text-accent" : "bg-card-2 text-muted"
                }`}>
                  {bp.source === "llm" ? d.factory.plannedByLlm : d.factory.curatedTemplate}
                </span>
                <span className="rounded-full border border-ok/40 bg-ok/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ok">
                  {d.appPage.livesInUrl}
                </span>
                <Link href="/" className="text-xs text-muted underline underline-offset-2 hover:text-fg">
                  {d.appPage.buildYourOwn}
                </Link>
              </div>
            </div>
            <AppClient bp={bp} />
            <p className="mt-6 text-xs text-muted">{d.appPage.persistenceNote}</p>
          </>
        ) : (
          <div className="card mx-auto max-w-lg p-8 text-center">
            <h1 className="font-display text-xl font-bold">{d.appPage.noBuildTitle}</h1>
            <p className="mt-2 text-sm text-muted">
              {d.appPage.noBuildBodyA}
              <code className="rounded bg-card-2 px-1">/app?bp=…</code>
              {d.appPage.noBuildBodyB}
            </p>
            <Link href="/" className="mt-5 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white dark:text-[#1a1206]">
              {d.appPage.goFactory}
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
