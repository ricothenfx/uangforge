import Link from "next/link";
import { getDictionary } from "@/lib/i18n/server";

export default async function NotFound() {
  const d = await getDictionary();
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="font-display text-6xl font-bold text-accent">404</p>
        <p className="mt-3 text-muted">{d.notFound.line}</p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-fg">
          {d.notFound.back}
        </Link>
      </div>
    </main>
  );
}
