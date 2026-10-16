/**
 * Blueprint URL codec — a built app lives entirely in its URL.
 * deflate-raw + base64url, the same pattern as UangFactory's blueprints:
 * no database, no server state, shareable links survive forever.
 */
import { deflateRaw, inflateRaw } from "node:zlib";
import { promisify } from "node:util";
import type { Blueprint } from "./blueprint";
import { BlueprintSchema } from "./blueprint";

const deflate = promisify(deflateRaw) as (b: Buffer) => Promise<Buffer>;
const inflate = promisify(inflateRaw) as (b: Buffer) => Promise<Buffer>;

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function unb64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export async function encodeBlueprint(bp: Blueprint): Promise<string> {
  const json = JSON.stringify({ ...bp, prompt: undefined });
  return b64url(await deflate(Buffer.from(json, "utf8")));
}

export async function decodeBlueprint(encoded: string): Promise<Blueprint | null> {
  try {
    const json = (await inflate(unb64url(encoded))).toString("utf8");
    const parsed = BlueprintSchema.safeParse(JSON.parse(json));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** Only share what a stranger needs — strip the prompt, keep provenance. */
export async function encodeShareable(bp: Blueprint): Promise<string> {
  return encodeBlueprint({ ...bp, prompt: undefined });
}
