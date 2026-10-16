"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const LINKS = [
  { href: "/#factory", label: "Factory" },
  { href: "/#how", label: "How it works" },
  { href: "/app", label: "Open app" },
  { href: "/qa", label: "Q&A" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2 font-display text-[15px] font-bold tracking-tight">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 21h18" />
            <path d="M5 21V11l5 3v-3l5 3V7l4 2.5V21" />
            
            
          </svg>
          UangForge
        </Link>
        <nav className="ml-auto hidden items-center gap-5 text-sm text-muted sm:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-fg transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto sm:ml-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
