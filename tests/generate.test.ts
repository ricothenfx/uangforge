import { describe, expect, it } from "vitest";
import { generateBlueprint } from "@/lib/generate";

describe("generateBlueprint", () => {
  it("returns null (not a throw) when no LLM is configured", async () => {
    // tests run without LLM_* env vars
    const r = await generateBlueprint("a gym membership tracker");
    expect(r).toBeNull();
  });
});
