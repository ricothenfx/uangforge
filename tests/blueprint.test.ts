import { describe, expect, it } from "vitest";
import { BlueprintSchema, normalizeSamples, type Blueprint } from "@/lib/blueprint";
import { seedApp } from "@/lib/seed";
import { CURATED, getCuratedByPrompt } from "@/lib/curated";
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

  it("accepts well-formed LLM samples on an entity", () => {
    const bp = validBp();
    bp.entities[0].samples = [{ employee: "Maya Kusuma", days: 3, status: "pending" }];
    expect(BlueprintSchema.safeParse(bp).success).toBe(true);
  });
});

describe("normalizeSamples", () => {
  it("drops unknown keys, bad select values and wrong types, coerces numeric strings", () => {
    const bp = validBp();
    const [e] = bp.entities;
    e.samples = [
      { employee: "Maya Kusuma", days: "3", status: "pending", hacker: "<script>" }, // days coerced, hacker dropped
      { employee: "Kenji Tanaka", days: "many", status: "vanished" }, // bad value keys dropped
      "not-an-object" as unknown as Record<string, string>,
      { status: "nope" }, // zero valid fields → row dropped
    ];
    const out = normalizeSamples(e);
    expect(out).toEqual([
      { employee: "Maya Kusuma", days: 3, status: "pending" },
      { employee: "Kenji Tanaka" },
    ]);
  });

  it("caps the number of surviving rows", () => {
    const bp = validBp();
    const [e] = bp.entities;
    e.samples = Array.from({ length: 30 }, (_, i) => ({ employee: `Person ${i}` }));
    expect(normalizeSamples(e).length).toBeLessThanOrEqual(20);
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

  it("matches prompts despite plural forms (no LLM needed)", () => {
    expect(getCuratedByPrompt("an app to track bugs and their fix statuses")?.appName).toBe("Bug Tracker");
  });
});

describe("seedApp", () => {
  it("generates a rich table for every entity", () => {
    const data = seedApp(validBp());
    expect(Object.keys(data)).toEqual(["request"]);
    expect(data.request.length).toBeGreaterThanOrEqual(10);
  });

  it("uses realistic pool values, not 'sample N'", () => {
    const data = seedApp(validBp());
    for (const row of data.request) {
      expect(String(row["employee"])).not.toMatch(/sample/i);
    }
  });

  it("puts the workflow fromStatus in the first record so approval is try-able", () => {
    const bp = validBp();
    const data = seedApp(bp);
    expect(data.request[0]["status"]).toBe(bp.workflow!.fromStatus);
  });

  it("is deterministic within a run", () => {
    expect(seedApp(validBp())).toEqual(seedApp(validBp()));
  });

  it("spreads statuses across records", () => {
    const data = seedApp(validBp());
    const statuses = data.request.map((r) => r["status"]);
    expect(new Set(statuses).size).toBeGreaterThan(1);
  });

  it("merges LLM samples in front of generated rows", () => {
    const bp = validBp();
    bp.entities[0].samples = [
      { employee: "Maya Kusuma", type: "annual", days: 3, status: "approved" },
      { employee: "Kenji Tanaka", type: "sick", days: 1, status: "approved" },
    ];
    const data = seedApp(bp);
    const employees = data.request.map((r) => String(r["employee"]));
    expect(employees).toContain("Maya Kusuma");
    expect(employees).toContain("Kenji Tanaka");
    expect(data.request.length).toBeGreaterThanOrEqual(6);
    expect(data.request[0]["status"]).toBe(bp.workflow!.fromStatus);
  });

  it("produces dates near today so the calendar is alive", () => {
    const bp = validBp();
    bp.entities[0].fields.push({ name: "startDate", type: "date", required: true });
    const data = seedApp(bp);
    const today = new Date();
    for (const row of data.request) {
      const d = new Date(String(row["startDate"]));
      expect(Number.isNaN(d.getTime())).toBe(false);
      const diffDays = Math.abs(d.getTime() - today.getTime()) / 86_400_000;
      expect(diffDays).toBeLessThanOrEqual(13);
    }
  });
});
