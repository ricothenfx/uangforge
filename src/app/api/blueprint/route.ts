import { NextResponse } from "next/server";
import { z } from "zod";
import { generateBlueprint, llmConfigured } from "@/lib/generate";
import { getCuratedByPrompt, CURATED, defaultCurated } from "@/lib/curated";

export const runtime = "nodejs";
export const maxDuration = 60;

const BodySchema = z.object({
  prompt: z.string().min(4).max(200),
});

// naive per-IP rate limit (demo-grade)
const hits = new Map<string, { n: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || rec.reset < now) {
    hits.set(ip, { n: 1, reset: now + WINDOW_MS });
    return false;
  }
  rec.n += 1;
  return rec.n > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many builds from this address — try again in a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Describe the app in 4-200 characters." }, { status: 400 });
  }

  const prompt = parsed.data.prompt;

  // No LLM configured → nearest curated template (labeled as such), never a failure.
  if (!llmConfigured()) {
    const curated = getCuratedByPrompt(prompt) ?? defaultCurated();
    return NextResponse.json({
      blueprint: curated,
      curatedFallback: true,
      note: "No LLM endpoint configured — served the nearest curated template. Configure LLM_* to plan from any description.",
    });
  }

  const blueprint = await generateBlueprint(prompt);
  if (blueprint) {
    return NextResponse.json({ blueprint, curatedFallback: false });
  }

  const curated = getCuratedByPrompt(prompt) ?? defaultCurated();
  return NextResponse.json({
    blueprint: curated,
    curatedFallback: true,
    note: "The planner could not produce a valid blueprint for that description (twice) — served the nearest curated template instead. Nothing fake was shipped.",
  });
}

export async function GET() {
  // scenario list for the picker
  return NextResponse.json({
    scenarios: CURATED.map((bp) => ({ appName: bp.appName, tagline: bp.tagline, prompt: bp.prompt })),
  });
}
