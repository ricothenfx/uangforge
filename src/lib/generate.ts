/**
 * LLM blueprint generation — the factory's "planning agent".
 *
 * Honesty by construction: the model fills a strict JSON shape inside a fixed
 * constraint space (field/view/aggregate types, ≤2 entities, approval
 * workflow required). Nothing it says can become arbitrary code — a
 * deterministic runtime interprets the blueprint. Invalid output gets one
 * repair retry, then the caller falls back to the curated library.
 *
 * Strategy verified in the feasibility spike: openai-compatible endpoints
 * often run without hard schema enforcement, so the exact JSON shape is
 * spelled out in the prompt, validated with zod (lenient normalization),
 * and repaired once on failure. 8/8 valid first-try in the spike.
 */
import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { AGGREGATIONS, FIELD_TYPES, VIEW_TYPES, BlueprintSchema, type Blueprint } from "./blueprint";

export function llmConfigured(): boolean {
  return Boolean(process.env.LLM_BASE_URL && process.env.LLM_API_KEY && process.env.LLM_MODEL);
}

function model() {
  const provider = createOpenAICompatible({
    name: "provider",
    baseURL: process.env.LLM_BASE_URL!,
    apiKey: process.env.LLM_API_KEY!,
  });
  return provider(process.env.LLM_MODEL!);
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error("llm timeout")), ms))]);
}

const SHAPE = `{"appName":"Leave Tracker","tagline":"Track time-off requests with approval","entities":[{"name":"request","namePlural":"requests","fields":[{"name":"employee","type":"text","required":true},{"name":"type","type":"select","required":true,"options":["annual","sick","unpaid"]},{"name":"days","type":"number","required":true},{"name":"status","type":"select","required":true,"options":["pending","approved","rejected"]}],"statusField":"status","statusValues":["pending","approved","rejected"]}],"views":[{"entity":"request","type":"table"},{"entity":"request","type":"board"}],"dashboard":[{"label":"Pending requests","entity":"request","field":"status","agg":"count"},{"label":"Total days requested","entity":"request","field":"days","agg":"sum"}],"workflow":{"name":"Approve leave","entity":"request","fromStatus":"pending","toStatus":"approved","requiresApproval":true}}`;

function buildPrompt(userPrompt: string, isRepair: boolean, lastRaw?: string): string {
  return (
    `You design small business apps for a factory that builds them automatically. ` +
    `Respond ONLY with minified JSON exactly matching this shape:\n${SHAPE}\n\n` +
    `STRICT RULES:\n` +
    `- field.type must be one of: ${FIELD_TYPES.join(" | ")} (select fields need "options")\n` +
    `- view.type must be one of: ${VIEW_TYPES.join(" | ")}\n` +
    `- dashboard.agg must be one of: ${AGGREGATIONS.join(" | ")}\n` +
    `- max 2 entities, 2-7 fields each; every entity name/view/dashboard/workflow must reference existing entity names\n` +
    `- the main entity needs a select "status" field plus matching "statusField"/"statusValues"\n` +
    `- include exactly one approval-style workflow: fromStatus and toStatus MUST be different values from statusValues\n` +
    `- tagline max 90 chars, plain text\n` +
    (isRepair
      ? `\nYour previous output violated the rules. Fix it. Respond ONLY with corrected minified JSON.\n\nINVALID PREVIOUS OUTPUT:\n${(lastRaw ?? "").slice(0, 1200)}\n\n`
      : `\nBuild this app: ${userPrompt}\n`)
  );
}

export async function generateBlueprint(userPrompt: string): Promise<Blueprint | null> {
  if (!llmConfigured()) return null;
  let lastRaw = "";
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { text } = await withTimeout(
        generateText({
          model: model(),
          maxOutputTokens: 1400,
          prompt: buildPrompt(userPrompt, attempt > 1, lastRaw),
        }),
        30_000,
      );
      lastRaw = text;
      const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      const parsed = BlueprintSchema.safeParse(JSON.parse(cleaned));
      if (parsed.success) {
        return { ...parsed.data, source: "llm", prompt: userPrompt.slice(0, 200) };
      }
    } catch {
      // retry once, then fall back to curated
    }
  }
  return null;
}
