import { describe, expect, it } from "vitest";
import { encodeBlueprint, decodeBlueprint } from "@/lib/codec";
import { CURATED } from "@/lib/curated";
import type { Blueprint } from "@/lib/blueprint";

const bp: Blueprint = { ...CURATED[0] };

describe("blueprint codec", () => {
  it("round-trips a blueprint through a URL-safe string", async () => {
    const enc = await encodeBlueprint(bp);
    expect(enc).toMatch(/^[A-Za-z0-9_-]+$/);
    const dec = await decodeBlueprint(enc);
    expect(dec).toEqual({ ...bp, prompt: undefined });
  });

  it("round-trips every curated blueprint", async () => {
    for (const b of CURATED) {
      const dec = await decodeBlueprint(await encodeBlueprint(b));
      expect(dec?.appName).toBe(b.appName);
    }
  });

  it("produces a URL of shareable length (< 2000 chars)", async () => {
    const enc = await encodeBlueprint(CURATED[0]);
    expect(enc.length).toBeLessThan(2000);
  });

  it("returns null for garbage input", async () => {
    expect(await decodeBlueprint("not-a-blueprint!!!")).toBeNull();
    expect(await decodeBlueprint("")).toBeNull();
  });

  it("returns null for a structurally invalid payload", async () => {
    const bad = await encodeBlueprint({ ...bp, entities: [] } as unknown as Blueprint);
    // entities: [] violates min(1) on decode
    expect(await decodeBlueprint(bad)).toBeNull();
  });
});
