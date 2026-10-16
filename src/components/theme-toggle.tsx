"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";

export function ThemeToggle() {
  const { dict: d } = useI18n();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("uangforge-theme", next ? "dark" : "light");
    } catch {
      /* private mode */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? d.themeToggle.ariaLight : d.themeToggle.ariaDark}
      title={dark ? "Light mode" : "Dark mode"}
      className="relative h-9 w-9 rounded-lg border border-line bg-card hover:bg-card-2 transition-colors grid place-items-center"
    >
      {/* scales-of-justice lamp: gavel by day, lantern by night */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {dark ? (
          <>
            <path d="M9 4h6l1 4H8l1-4Z" />
            <path d="M12 8v9" />
            <path d="M8 21h8" />
            <path d="M10 17h4" />
          </>
        ) : (
          <>
            <path d="m14 13-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0-.83-.83-.83-2.17 0-3L11 10" />
            <path d="m16 16 6-6" />
            <path d="m8 8 6-6" />
            <path d="m9 7 8 8" />
            <path d="m21 11-8-8" />
          </>
        )}
      </svg>
      <span className="sr-only">{d.themeToggle.srOnly}</span>
    </button>
  );
}
