"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { useI18n } from "@/lib/i18n/provider";

export function Nav() {
  const { dict: d } = useI18n();
  const LINKS = [
    { href: "/#factory", label: d.nav.factory },
    { href: "/#how", label: d.nav.how },
    { href: "/app", label: d.nav.openApp },
    { href: "/qa", label: d.nav.qa },
  ];

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
        <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
