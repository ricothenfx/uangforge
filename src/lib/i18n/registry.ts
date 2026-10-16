import type { Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { id } from "./dictionaries/id";
import { zh } from "./dictionaries/zh";
import { es } from "./dictionaries/es";

export const dictionaries: Record<Locale, Dictionary> = { en, id, zh, es };
