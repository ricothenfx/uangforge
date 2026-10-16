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

export const EntitySchema = z
  .object({
    name: z.string().min(2).max(30),
    namePlural: z.string().min(2).max(30),
    fields: z.array(FieldSchema).min(2).max(7),
    statusField: z.string().max(24).optional(),
    statusValues: z.array(z.string().min(1).max(24)).min(2).max(5).optional(),
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
