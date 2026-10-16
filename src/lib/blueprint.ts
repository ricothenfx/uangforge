/**
 * The blueprint constraint space — the honest core of UangForge.
 * The LLM never writes code. It fills this schema; a deterministic runtime
 * builds the app. Everything outside the schema is impossible by construction.
 */
import { z } from "zod";

export const FIELD_TYPES = ["text", "number", "currency", "date", "select", "boolean"] as const;
export const VIEW_TYPES = ["table", "board", "calendar"] as const;
export const AGGREGATIONS = ["count", "sum", "avg"] as const;

export const FieldSchema = z.object({
  name: z.string().min(2).max(24),
  type: z.enum(FIELD_TYPES),
  required: z.boolean().default(true),
  options: z.array(z.string().min(1).max(24)).max(6).optional(),
});

export type RecordData = Record<string, string | number | boolean>;

export const EntitySchema = z
  .object({
    name: z.string().min(2).max(30),
    namePlural: z.string().min(2).max(30),
    fields: z.array(FieldSchema).min(2).max(7),
    statusField: z.string().max(24).optional(),
    statusValues: z.array(z.string().min(1).max(24)).min(2).max(5).optional(),
    // realistic example records — the LLM fills these, normalization trims them
    samples: z.array(z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))).max(24).optional(),
  })
  .superRefine((e, ctx) => {
    if (e.statusField) {
      const f = e.fields.find((f) => f.name === e.statusField);
      if (!f || f.type !== "select") {
        ctx.addIssue({ code: "custom", message: "statusField must point to a select field" });
      }
      if (e.statusValues && f?.options && !e.statusValues.every((v) => f.options!.includes(v))) {
        ctx.addIssue({ code: "custom", message: "statusValues must match the status field options" });
      }
    }
  });

export const ViewSchema = z.object({
  entity: z.string().min(2).max(30),
  type: z.enum(VIEW_TYPES),
});

export const DashboardSchema = z.object({
  label: z.string().min(2).max(40),
  entity: z.string().min(2).max(30),
  field: z.string().max(24).optional(),
  agg: z.enum(AGGREGATIONS),
});

export const WorkflowSchema = z.object({
  name: z.string().min(2).max(40),
  entity: z.string().min(2).max(30),
  fromStatus: z.string().min(1).max(24),
  toStatus: z.string().min(1).max(24),
  requiresApproval: z.boolean().default(true),
});

export const BlueprintSchema = z
  .object({
    appName: z.string().min(2).max(40),
    tagline: z.string().min(5).max(90),
    prompt: z.string().max(200).optional(),
    source: z.enum(["curated", "llm"]).default("curated"),
    entities: z.array(EntitySchema).min(1).max(2),
    views: z.array(ViewSchema).min(1).max(3),
    dashboard: z.array(DashboardSchema).min(2).max(4),
    workflow: WorkflowSchema.optional(),
  })
  .superRefine((bp, ctx) => {
    const names = new Set(bp.entities.map((e) => e.name));
    for (const v of bp.views) {
      if (!names.has(v.entity)) {
        ctx.addIssue({ code: "custom", message: `view references unknown entity "${v.entity}"`, path: ["views"] });
      }
    }
    for (const d of bp.dashboard) {
      if (!names.has(d.entity)) {
        ctx.addIssue({ code: "custom", message: `dashboard card references unknown entity "${d.entity}"`, path: ["dashboard"] });
      }
    }
    if (bp.workflow) {
      const e = bp.entities.find((x) => x.name === bp.workflow!.entity);
      if (!e) {
        ctx.addIssue({ code: "custom", message: `workflow references unknown entity "${bp.workflow.entity}"`, path: ["workflow"] });
      } else if (bp.workflow.fromStatus === bp.workflow.toStatus) {
        ctx.addIssue({ code: "custom", message: "workflow fromStatus and toStatus must differ", path: ["workflow"] });
      } else if (e.statusValues && (!e.statusValues.includes(bp.workflow.fromStatus) || !e.statusValues.includes(bp.workflow.toStatus))) {
        ctx.addIssue({ code: "custom", message: "workflow statuses must exist in the entity statusValues", path: ["workflow"] });
      }
    }
  });

export type Field = z.infer<typeof FieldSchema>;
export type Entity = z.infer<typeof EntitySchema>;
export type View = z.infer<typeof ViewSchema>;
export type DashboardCard = z.infer<typeof DashboardSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;
export type Blueprint = z.infer<typeof BlueprintSchema>;

/** Which entity/field each view needs to be renderable (real test criteria). */
export function viewEntity(bp: Blueprint, v: View): Entity | undefined {
  return bp.entities.find((e) => e.name === v.entity);
}

export function statusFieldOf(e: Entity): { field: string; values: string[] } | null {
  if (!e.statusField) return null;
  const f = e.fields.find((x) => x.name === e.statusField);
  if (!f) return null;
  const values = e.statusValues ?? f.options ?? [];
  return values.length ? { field: e.statusField, values } : null;
}

/** Max sample rows that survive normalization (schema allows 24; we keep 20). */
export const SAMPLES_CAP = 20;

function coerceValue(f: Field, v: unknown): RecordData[string] | undefined {
  if (f.type === "number" || f.type === "currency") {
    const n = typeof v === "number" ? v : typeof v === "string" ? Number(v.trim()) : NaN;
    return Number.isFinite(n) ? n : undefined;
  }
  if (f.type === "boolean") {
    if (typeof v === "boolean") return v;
    if (v === "true") return true;
    if (v === "false") return false;
    return undefined;
  }
  if (f.type === "select") {
    const s = String(v);
    return (f.options ?? []).includes(s) ? s : undefined;
  }
  if (f.type === "date") {
    const s = String(v);
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : undefined;
  }
  const s = String(v).trim();
  return s.length ? s.slice(0, 80) : undefined;
}

/**
 * Lenient normalization for LLM sample rows: unknown keys and type-mismatched
 * values are dropped (never trusted), rows with no valid field remain dropped.
 * What survives is type-safe and merges cleanly with generated seed rows.
 */
export function normalizeSamples(e: Entity): RecordData[] {
  const byName = new Map(e.fields.map((f) => [f.name, f]));
  const out: RecordData[] = [];
  for (const raw of e.samples ?? []) {
    if (!raw || typeof raw !== "object") continue;
    const row: RecordData = {};
    let used = 0;
    for (const [k, v] of Object.entries(raw)) {
      const f = byName.get(k);
      if (!f) continue;
      const c = coerceValue(f, v);
      if (c === undefined) continue;
      row[k] = c;
      used += 1;
    }
    if (used > 0) out.push(row);
    if (out.length >= SAMPLES_CAP) break;
  }
  return out;
}
