import { cache } from "react";
import { cookies, headers } from "next/headers";
import {
  isLocale,
  LOCALE_COOKIE,
  negotiateLocale,
  type Locale,
} from "./config";
import { dictionaries } from "./registry";

export const getLocale = cache(async (): Promise<Locale> => {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value ?? "";
  if (isLocale(value)) return value;
  const head = await headers();
  return negotiateLocale(head.get("accept-language"));
});

export const getDictionary = cache(async (): Promise<
  (typeof dictionaries)[Locale]
> => dictionaries[await getLocale()]);
