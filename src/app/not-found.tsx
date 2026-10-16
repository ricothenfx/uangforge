import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="font-display text-6xl font-bold text-accent">404</p>
        <p className="mt-3 text-muted">This page is not in the contract.</p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-fg">
          Back to the factory
        </Link>
      </div>
    </main>
  );
}
