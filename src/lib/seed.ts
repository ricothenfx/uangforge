/**
 * Deterministic seed data — same blueprint in, same demo data out (dates are
 * relative to today so the calendar is always alive). Field values are chosen
 * from realistic pools keyed off field/entity names, so a coffee-shop build
 * gets coffee products and people names, not "sample 1..4".
 *
 * When the blueprint carries LLM `samples` (validated by normalizeSamples),
 * they are merged in front of the generated rows — domain-true data first,
 * generated top-up behind, first row always try-able in the approval flow.
 */
import type { Blueprint, Entity, Field, RecordData } from "./blueprint";
import { normalizeSamples, statusFieldOf } from "./blueprint";

export type { RecordData } from "./blueprint";
export type EntityData = RecordData[];
export type AppData = Record<string, RecordData[]>;

const MAIN_ROWS = 16;
const SECONDARY_ROWS = 10;
const MIN_GENERATED = 4;
const MAX_ROWS = 24;

const PEOPLE = [
  "Andi Pratama", "Budi Santoso", "Maya Kusuma", "Rina Wijaya", "Dimas Anggara", "Sarah Chen",
  "David Okafor", "Emily Carter", "Luis Fernandez", "Aisha Rahman", "Kenji Tanaka", "Nadia Putri",
  "Marco Rossi", "Fatima Zahra", "Peter Novak", "Grace Lim",
];

const ORGS = [
  "Nusantara Coffee Co.", "Bluebird Logistics", "Sinar Abadi Supplies", "Kopi Klasik Roastery",
  "Mercury Design Studio", "PT Sumber Rejeki", "Atlas Freight", "Bunga Rampai Events",
  "Citra Nusantara Retail", "Helios Energy", "Terra Verde Farms", "Orion Software",
];

const CAFE_ITEMS = [
  "Espresso Beans 1kg", "Oat Milk 1L", "Cold Brew Concentrate", "Matcha Powder 200g",
  "Cocoa Powder 500g", "Paper Cups 50pk", "Vanilla Syrup 750ml", "Green Tea 100g",
  "Almond Milk 1L", "Butter Cookies 300g",
];

const SAAS_ITEMS = [
  "Figma", "Notion", "Google Workspace", "Slack", "Zoom", "Adobe CC", "Dropbox", "GitHub",
  "Canva", "QuickBooks",
];

const GENERIC_ITEMS = [
  "Printer paper A4", "Whiteboard markers", "USB-C cables", "Desk lamp", "Office chairs",
  "Water dispenser", "Laptop stand", "Notebook pack", "Label rolls", "Cleaning supplies",
];

const BUG_TITLES = [
  "Login page crashes on submit", "Dashboard loads slowly", "Export CSV fails on Safari",
  "Duplicate email notifications", "Password reset link expired", "Mobile layout misaligned",
  "Search returns stale results", "Upload stalls over 10 MB", "Dark mode contrast issue",
  "API returns 500 on empty cart",
];

const GENERIC_TITLES = [
  "Q1 inventory audit", "Update vendor contract", "Prepare monthly report",
  "Onboard new team member", "Renew software license", "Customer follow-up call",
  "Quarterly budget review", "Website content refresh", "Team training session",
  "Equipment maintenance check",
];

const PLACES = [
  "Jl. Sudirman No. 12, Jakarta", "Jl. Gatot Subroto 45, Bandung", "Slot A-12 · Basement 1",
  "Jl. Malioboro 88, Yogyakarta", "Jl. Diponegoro 3, Surabaya", "Slot C-04 · Level 2",
  "Jl. Thamrin 21, Jakarta", "Jl. Ahmad Yani 7, Semarang",
];

const DEPARTMENTS = ["Operations", "Finance", "Marketing", "Engineering", "People", "Support", "Logistics", "Sales"];

function has(name: string, words: string[]): boolean {
  const n = name.toLowerCase();
  return words.some((w) => n.includes(w));
}

function personAt(i: number): string {
  return PEOPLE[(i * 5) % PEOPLE.length];
}

function orgAt(i: number): string {
  return ORGS[(i * 7) % ORGS.length];
}

function textValue(f: Field, e: Entity, i: number): string {
  const fn = f.name.toLowerCase();
  const en = `${e.name} ${e.namePlural}`.toLowerCase();
  if (has(fn, ["title", "task", "subject", "summary", "description", "issue", "report"])) {
    const pool = has(en, ["bug", "defect", "issue", "incident"]) ? BUG_TITLES : GENERIC_TITLES;
    return pool[(i * 3) % pool.length];
  }
  if (has(fn, ["location", "address", "slot", "room", "property", "venue"])) return PLACES[(i * 5) % PLACES.length];
  if (has(fn, ["email"])) {
    const p = personAt(i).toLowerCase().replace(/[^a-z]+/g, ".");
    return `${p}@example.com`;
  }
  if (has(fn, ["phone", "whatsapp", "wa", "tel", "mobile"])) {
    const digits = String(810000000 + ((i * 7333) % 99999999)).slice(0, 9);
    return `+62 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  if (has(fn, ["department", "category", "team", "division", "group"])) return DEPARTMENTS[i % DEPARTMENTS.length];
  if (has(fn, ["client", "customer", "supplier", "vendor", "company", "partner", "agency", "contact"])) return orgAt(i);
  if (has(fn, ["employee", "participant", "member", "reporter", "tenant", "guest", "owner", "person", "driver", "attendee", "user", "staff"])) return personAt(i);
  if (has(fn, ["name"])) {
    if (has(en, ["product", "item", "inventory", "supply", "stock"])) {
      const pool = has(en, ["coffee", "cafe", "bean", "menu", "food", "drink"]) ? CAFE_ITEMS : GENERIC_ITEMS;
      return pool[(i * 3) % pool.length];
    }
    if (has(en, ["subscription", "license", "software", "tool", "service"])) return SAAS_ITEMS[(i * 3) % SAAS_ITEMS.length];
    if (has(en, ["supplier", "client", "customer", "vendor", "company"])) return orgAt(i);
    return personAt(i);
  }
  const label = f.name.charAt(0).toUpperCase() + f.name.slice(1);
  return `${label} ${i + 1}`;
}

function numberValue(f: Field, i: number): number {
  const n = f.name.toLowerCase();
  if (has(n, ["day", "duration"])) return 1 + ((i * 3) % 12);
  if (has(n, ["qty", "quantity", "stock", "count", "level", "units"])) return 4 + ((i * 17) % 110);
  if (has(n, ["rating", "score", "stars"])) return 3 + (i % 3);
  if (has(n, ["hour"])) return 1 + ((i * 2) % 8);
  if (has(n, ["age"])) return 19 + ((i * 11) % 46);
  if (has(n, ["percent", "progress"])) return 5 + ((i * 13) % 90);
  return 1 + ((i * 7) % 97);
}

function currencyValue(f: Field, i: number): number {
  const n = f.name.toLowerCase();
  if (has(n, ["price", "unit"])) return 2 + ((i * 7) % 58);
  if (has(n, ["cost", "amount", "rent", "fee", "payment", "salary", "budget", "total", "income"])) return 25 + ((i * 37) % 420);
  return 8 + ((i * 29) % 300);
}

/** Date spread ±12 days around today — the calendar view is always populated. */
function dateValue(i: number): string {
  const d = new Date();
  d.setDate(d.getDate() + (((i * 5) % 25) - 12));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function seedValue(f: Field, e: Entity, i: number): RecordData[string] {
  if (f.name === e.statusField) {
    const values = e.statusValues ?? f.options ?? ["open"];
    return values[i % values.length];
  }
  switch (f.type) {
    case "number":
      return numberValue(f, i);
    case "currency":
      return currencyValue(f, i);
    case "date":
      return dateValue(i);
    case "boolean":
      return i % 2 === 0;
    case "select":
      return (f.options ?? ["a", "b"])[i % (f.options?.length ?? 2)];
    default:
      return textValue(f, e, i);
  }
}

export function seedEntity(e: Entity, fromStatus?: string, count = SECONDARY_ROWS): RecordData[] {
  return Array.from({ length: count }, (_, i) => {
    const r: RecordData = {};
    for (const f of e.fields) r[f.name] = seedValue(f, e, i);
    if (fromStatus && i === 0 && e.statusField) r[e.statusField] = fromStatus;
    return r;
  });
}

/** Fill sample-row gaps with generated values so every field renders. */
function fillRow(e: Entity, row: RecordData, i: number): RecordData {
  const out: RecordData = { ...row };
  for (const f of e.fields) {
    if (!(f.name in out) || out[f.name] === undefined || out[f.name] === null || out[f.name] === "") {
      out[f.name] = seedValue(f, e, i);
    }
  }
  return out;
}

/** Seed every entity so the shipped app is alive on first open. */
export function seedApp(bp: Blueprint): AppData {
  const wf = bp.workflow;
  const data: AppData = {};
  for (const e of bp.entities) {
    const sf = statusFieldOf(e);
    const fromStatus = wf && wf.entity === e.name ? wf.fromStatus : sf?.values[0];
    const samples = normalizeSamples(e).map((r, i) => fillRow(e, r, i));
    const isMain = (wf && wf.entity === e.name) || e === bp.entities[0];
    const target = isMain ? MAIN_ROWS : SECONDARY_ROWS;
    const generated = seedEntity(e, undefined, Math.max(MIN_GENERATED, target - samples.length));
    const rows = [...samples, ...generated].slice(0, MAX_ROWS);
    if (sf && fromStatus) {
      const k = rows.findIndex((r) => r[sf.field] === fromStatus);
      if (k > 0) rows.unshift(...rows.splice(k, 1));
      else if (k === -1) rows[0] = { ...rows[0], [sf.field]: fromStatus };
    }
    data[e.name] = rows;
  }
  return data;
}
