import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line py-10 text-sm text-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="font-display font-bold text-fg">UangForge</span>
          <Link href="/qa" className="hover:text-fg transition-colors">Q&A</Link>
          <a href="https://uanglite.ricothen.com" className="hover:text-fg transition-colors" rel="noopener noreferrer">UangLite</a>
          <a href="https://uangcounsel.vercel.app" className="hover:text-fg transition-colors" rel="noopener noreferrer">UangCounsel</a>
        </div>
        <p>
          Portfolio build by Rico. Apps are built from a constrained blueprint schema — the runtime is deterministic, the results are real.
          Not affiliated with or endorsed by uang.ai.
        </p>
      </div>
    </footer>
  );
}
