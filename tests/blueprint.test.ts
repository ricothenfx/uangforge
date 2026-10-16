import { describe, expect, it } from "vitest";
import { BlueprintSchema, type Blueprint } from "@/lib/blueprint";
import { seedApp } from "@/lib/seed";
import { CURATED } from "@/lib/curated";
import curatedJson from "@/lib/curated.json";

const validBp = (): Blueprint => ({
  appName: "Leave Tracker",
  tagline: "Track time-off requests with approval",
  source: "curated",
  entities: [
    {
      name: "request",
      namePlural: "requests",
      fields: [
        { name: "employee", type: "text", required: true },
        { name: "days", type: "number", required: true },
        { name: "status", type: "select", required: true, options: ["pending", "approved"] },
      ],
      statusField: "status",
      statusValues: ["pending", "approved"],
    },
  ],
  views: [{ entity: "request", type: "table" }],
  dashboard: [
    { label: "Pending", entity: "request", field: "status", agg: "count" },
    { label: "Total days", entity: "request", field: "days", agg: "sum" },
  ],
  workflow: { name: "Approve leave", entity: "request", fromStatus: "pending", toStatus: "approved", requiresApproval: true },
});

describe("BlueprintSchema", () => {
  it("accepts a valid blueprint", () => {
    expect(BlueprintSchema.safeParse(validBp()).success).toBe(true);
  });

  it("rejects a workflow with identical from/to statuses", () => {
    const bp = validBp();
    bp.workflow = { ...bp.workflow!, fromStatus: "pending", toStatus: "pending" };
    expect(BlueprintSchema.safeParse(bp).success).toBe(false);
  });

  it("rejects a workflow with statuses missing from statusValues", () => {
    const bp = validBp();
    bp.workflow = { ...bp.workflow!, toStatus: "vanished" };
    expect(BlueprintSchema.safeParse(bp).success).toBe(false);
  });

  it("rejects views referencing unknown entities", () => {
    const bp = validBp();
    bp.views = [{ entity: "ghost", type: "table" }];
    expect(BlueprintSchema.safeParse(bp).success).toBe(false);
  });

  it("rejects dashboard cards referencing unknown entities", () => {
    const bp = validBp();
    bp.dashboard = [{ label: "X", entity: "ghost", agg: "count" }];
    expect(BlueprintSchema.safeParse(bp).success).toBe(false);
  });

  it("rejects a statusField that is not a select", () => {
    const bp = validBp();
    bp.entities[0].statusField = "days";
    expect(BlueprintSchema.safeParse(bp).success).toBe(false);
  });

  it("rejects unknown field types", () => {
    const bp = validBp();
    (bp.entities[0].fields[0] as unknown as { type: string }).type = "quantum";
    expect(BlueprintSchema.safeParse(bp).success).toBe(false);
  });
});

describe("curated library", () => {
  it("ships at least 5 valid scenarios", () => {
    expect(CURATED.length).toBeGreaterThanOrEqual(5);
    for (const bp of curatedJson) {
      expect(BlueprintSchema.safeParse(bp).success, (bp as Blueprint).appName).toBe(true);
    }
  });

  it("every curated workflow is approval-sane", () => {
    for (const bp of CURATED) {
      if (bp.workflow) expect(bp.workflow.fromStatus).not.toBe(bp.workflow.toStatus);
    }
  });

  it("matches prompts to scenarios", () => {
    expect(CURATED.find((bp) => bp.appName === "Leave Tracker")).toBeTruthy();
  });
});

describe("seedApp", () => {
  it("generates records for every entity", () => {
    const data = seedApp(validBp());
    expect(Object.keys(data)).toEqual(["request"]);
    expect(data.request.length).toBeGreaterThanOrEqual(3);
  });

  it("puts the workflow fromStatus in the first record so approval is try-able", () => {
    const bp = validBp();
    const data = seedApp(bp);
    expect(data.request[0]["status"]).toBe(bp.workflow!.fromStatus);
  });

  it("is deterministic", () => {
    expect(seedApp(validBp())).toEqual(seedApp(validBp()));
  });

  it("spreads statuses across records", () => {
    const data = seedApp(validBp());
    const statuses = data.request.map((r) => r["status"]);
    expect(new Set(statuses).size).toBeGreaterThan(1);
  });
});
