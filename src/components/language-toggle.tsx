"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocaleAction } from "@/lib/i18n/action";
import { LOCALES, LOCALES_META, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, dict } = useI18n();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const select = (next: Locale) => {
    setOpen(false);
    if (next === locale || pending) return;
    startTransition(async () => {
      await setLocaleAction(next);
      router.refresh();
    });
  };

  return (
    <div ref={rootRef} className={`no-print relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={dict.common.chooseLanguage}
        aria-haspopup="menu"
        aria-expanded={open}
        title={dict.common.chooseLanguage}
        className="relative h-9 w-9 rounded-lg border border-line bg-card hover:bg-card-2 transition-colors grid place-items-center disabled:opacity-50"
        disabled={pending}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14.5 14.5 0 0 1 0 18a14.5 14.5 0 0 1 0-18" />
        </svg>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-lg border border-line bg-card py-1 shadow-lg"
        >
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitem"
              onClick={() => select(l)}
              className={`flex w-full items-center px-3 py-1.5 text-left text-xs text-muted hover:bg-card-2 hover:text-fg transition-colors ${
                l === locale ? "font-semibold text-accent" : ""
              }`}
            >
              {LOCALES_META[l].native}
              {l === locale ? <span className="ml-auto text-accent">✓</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
