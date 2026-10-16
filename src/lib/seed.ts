/**
 * Deterministic seed data generation — same blueprint in, same demo data out.
 * The workflow's fromStatus is intentionally present in the seed so the
 * approval flow is immediately try-able in every built app.
 */
import type { Blueprint, Entity, Field } from "./blueprint";
import { statusFieldOf } from "./blueprint";

export type RecordData = Record<string, string | number | boolean>;
export type EntityData = Record<string, RecordData[]>;
export type AppData = Record<string, RecordData[]>;

function seedValue(f: Field, e: Entity, i: number, fromStatus?: string): RecordData[string] {
  if (f.name === e.statusField) {
    const values = e.statusValues ?? f.options ?? ["open"];
    if (i === 0 && fromStatus) return fromStatus;
    return values[i % values.length];
  }
  switch (f.type) {
    case "number":
      return 1 + ((i * 7) % 9);
    case "currency":
      return 15 + ((i * 37) % 90);
    case "date":
      return `2026-10-${String(5 + ((i * 3) % 26)).padStart(2, "0")}`;
    case "boolean":
      return i % 2 === 0;
    case "select":
      return (f.options ?? ["a", "b"])[i % (f.options?.length ?? 2)];
    default:
      return f.name === "name" ? `${capitalize(e.name)} sample ${i + 1}` : `${f.name} sample ${i + 1}`;
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function seedEntity(e: Entity, fromStatus?: string, count = 4): RecordData[] {
  return Array.from({ length: count }, (_, i) => {
    const r: RecordData = {};
    for (const f of e.fields) r[f.name] = seedValue(f, e, i, i === 0 ? fromStatus : undefined);
    return r;
  });
}

/** Seed every entity so the shipped app is alive on first open. */
export function seedApp(bp: Blueprint): AppData {
  const wf = bp.workflow;
  const data: AppData = {};
  for (const e of bp.entities) {
    const sf = statusFieldOf(e);
    const fromStatus = wf && wf.entity === e.name ? wf.fromStatus : sf?.values[0];
    data[e.name] = seedEntity(e, fromStatus);
  }
  return data;
}
