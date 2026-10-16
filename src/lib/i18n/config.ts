export const LOCALES = ["en", "id", "zh", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "uangforge-locale";

export const LOCALES_META: Record<
  Locale,
  { native: string; bcp47: string }
> = {
  en: { native: "English", bcp47: "en" },
  id: { native: "Bahasa Indonesia", bcp47: "id-ID" },
  zh: { native: "中文（简体）", bcp47: "zh-CN" },
  es: { native: "Español", bcp47: "es-ES" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Pick the best locale from an Accept-Language header.
 * Visitors without an explicit choice get the site in their browser language.
 */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const parts = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";q=");
      const q = params.length ? Number.parseFloat(params[0]) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isNaN(q) ? 0 : q };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of parts) {
    if (isLocale(tag)) return tag;
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}
