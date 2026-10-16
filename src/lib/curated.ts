import curatedJson from "./curated.json";
import type { Blueprint } from "./blueprint";

export const CURATED = curatedJson as unknown as Blueprint[];

export function getCuratedByPrompt(prompt: string): Blueprint | undefined {
  const p = prompt.toLowerCase();
  return CURATED.find((bp) => bp.prompt && p && (p.includes(bp.appName.toLowerCase()) || wordsOverlap(p, bp.prompt)));
}

/** crude but free: ≥2 shared content words → treat as a match */
function wordsOverlap(a: string, b: string): boolean {
  const STOP = new Set(["an", "a", "app", "to", "for", "with", "the", "and", "of", "your", "my", "track", "tracker"]);
  const aw = a.split(/[^a-z]+/).filter((w) => w.length > 2 && !STOP.has(w)).map(stem);
  const bw = new Set(b.toLowerCase().split(/[^a-z]+/).map(stem));
  let hits = 0;
  for (const w of aw) if (bw.has(w)) hits++;
  return hits >= 2;
}

/** tiny suffix stem so "bugs"~"bug" and "statuses"~"status" still match */
function stem(w: string): string {
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 4 && w.endsWith("es")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s")) return w.slice(0, -1);
  return w;
}

/** the default showcase scenario */
export function defaultCurated(): Blueprint {
  return CURATED[0];
}
