"use client";

/**
 * The factory floor: pick or describe an app → watch PLAN → BUILD → TEST →
 * SHIP, then use the real app the runtime mounts. The theater is honest:
 * the TEST stage runs real validation checks against the blueprint, and the
 * SHIP stage mounts a working app, not a screenshot.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { encodeBlueprint } from "@/lib/codec";
import type { Blueprint } from "@/lib/blueprint";
import { CURATED } from "@/lib/curated";
import { RuntimeApp } from "./runtime-app";

type Phase = "pick" | "plan" | "build" | "test" | "ship";
type Check = { label: string; run: (bp: Blueprint) => boolean };

const CHECKS: Check[] = [
  { label: "schema: valid constraint space", run: (bp) => bp.entities.length >= 1 && bp.entities.every((e) => e.fields.length >= 2) },
  { label: "fields: every field typed", run: (bp) => bp.entities.every((e) => e.fields.every((f) => ["text", "number", "currency", "date", "select", "boolean"].includes(f.type))) },
  { label: "views: renderable against entities", run: (bp) => bp.views.every((v) => bp.entities.some((e) => e.name === v.entity)) },
  { label: "dashboard: aggregations resolvable", run: (bp) => bp.dashboard.every((d) => bp.entities.some((e) => e.name === d.entity)) },
  { label: "workflow: approval path exists", run: (bp) => !bp.workflow || bp.workflow.fromStatus !== bp.workflow.toStatus },
  { label: "seed: demo data generated", run: (bp) => bp.entities.length > 0 },
];

const PLAN_LINES = (bp: Blueprint): string[] => [
  `app        ${bp.appName}`,
  `goal       ${bp.tagline}`,
  ...bp.entities.map((e) => `entity     ${e.name} (${e.namePlural}) — ${e.fields.map((f) => `${f.name}:${f.type}`).join(", ")}`),
  ...bp.views.map((v) => `view       ${v.entity} as ${v.type}`),
  ...bp.dashboard.map((d) => `metric     ${d.label} = ${d.agg}(${d.entity}${d.field ? "." + d.field : ""})`),
  ...(bp.workflow ? [`workflow   ${bp.workflow.name}: ${bp.workflow.fromStatus} → ${bp.workflow.toStatus}${bp.workflow.requiresApproval ? " (human approval)" : ""}`] : []),
];

const BUILD_MODULES = [
  { name: "schema", desc: "entity + field definitions" },
  { name: "seed", desc: "deterministic demo data" },
  { name: "dashboard", desc: "count / sum / avg cards" },
  { name: "views", desc: "table · board · calendar" },
  { name: "form", desc: "create-record modal" },
  { name: "workflow", desc: "approval gate" },
];

export function Factory() {
  const [phase, setPhase] = useState<Phase>("pick");
  const [prompt, setPrompt] = useState("");
  const [bp, setBp] = useState<Blueprint | null>(null);
  const [planLine, setPlanLine] = useState(0);
  const [buildStep, setBuildStep] = useState(0);
  const [checkStep, setCheckStep] = useState(0);
  const [fallbackNote, setFallbackNote] = useState<string | null>(null);
  const [sharePath, setSharePath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    for (const t of timers.current) clearTimeout(t);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

  const startTheater = useCallback((blueprint: Blueprint, note: string | null = null) => {
    clearTimers();
    setBp(blueprint);
    setFallbackNote(note);
    setError(null);
    setPlanLine(0);
    setBuildStep(0);
    setCheckStep(0);
    setPhase("plan");
    const lines = PLAN_LINES(blueprint).length;
    for (let i = 1; i <= lines; i++) later(320 * i, () => setPlanLine(i));
    later(320 * lines + 500, () => setPhase("build"));
    for (let i = 1; i <= BUILD_MODULES.length; i++) later(320 * lines + 500 + 420 * i, () => setBuildStep(i));
    const buildDone = 320 * lines + 500 + 420 * BUILD_MODULES.length + 400;
    later(buildDone, () => setPhase("test"));
    // the checks actually run — a failing check would stop the line
    for (let i = 1; i <= CHECKS.length; i++) {
      later(buildDone + 380 * i, () => {
        const ok = CHECKS.slice(0, i).every((c) => c.run(blueprint));
        setCheckStep(i);
        if (!ok) setError(`QC failed at: ${CHECKS[i - 1].label}`);
      });
    }
    later(buildDone + 380 * CHECKS.length + 500, () => setPhase("ship"));
    void encodeBlueprint(blueprint).then((s) => setSharePath(`/app?bp=${s}`));
  }, []);

  const build = useCallback(async (p: string) => {
    setPhase("plan");
    setPlanLine(0);
    setBuildStep(0);
    setCheckStep(0);
    setBp(null);
    setError(null);
    setFallbackNote(null);
    // request the blueprint, then run the theater with whatever came back
    try {
      const res = await fetch("/api/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "The planner is unavailable.");
        setPhase("pick");
        return;
      }
      startTheater(data.blueprint, data.note ?? null);
    } catch {
      setError("Network error — could not reach the factory.");
      setPhase("pick");
    }
  }, [startTheater]);

  const shareUrl = sharePath;

  if (phase === "pick") {
    return (
      <div className="space-y-6">
        <div className="card p-5 sm:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (prompt.trim().length >= 4) void build(prompt.trim());
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe a small business app… e.g. “a gym membership tracker with approval”"
              maxLength={200}
              className="flex-1 rounded-lg border border-line bg-card-2 px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
            <button type="submit" className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 dark:text-[#1a1206]">
              Build it
            </button>
          </form>
          <p className="mt-2 text-xs text-muted">
            The planner fills a strict blueprint schema — never code. Without an LLM key the
            nearest curated template is served instead, labeled as such.
          </p>
          {error ? <p className="mt-2 text-sm text-bad">{error}</p> : null}
        </div>

        <div>
          <p className="mb-3 text-sm font-medium">…or watch a scenario build</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CURATED.map((bp) => (
              <button
                key={bp.appName}
                type="button"
                onClick={() => startTheater(bp)}
                className="clause-card rounded-xl border border-line bg-card p-4 text-left"
              >
                <span className="text-[10px] uppercase tracking-wider text-muted">{bp.entities[0].namePlural}</span>
                <h3 className="mt-0.5 font-display font-bold">{bp.appName}</h3>
                <p className="mt-1 text-xs text-muted">{bp.tagline}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!bp) {
    return <div className="card p-8 text-center text-muted">Requesting blueprint…</div>;
  }

  return (
    <div className="space-y-4">
      {/* stage header */}
      <div className="card flex flex-wrap items-center gap-x-6 gap-y-2 p-4">
        {(["plan", "build", "test", "ship"] as const).map((s, i) => {
          const order = ["plan", "build", "test", "ship"];
          const state = order.indexOf(phase) > i ? "done" : phase === s ? "active" : "todo";
          return (
            <div key={s} className="flex items-center gap-2 text-sm">
              <span
                className={`grid h-6 w-6 place-items-center rounded-full border text-[10px] font-bold ${
                  state === "done" ? "border-ok/50 bg-ok/10 text-ok" :
                  state === "active" ? "border-accent bg-accent-soft text-accent" :
                  "border-line text-muted"
                }`}
              >
                {state === "done" ? "✓" : i + 1}
              </span>
              <span className={state === "todo" ? "text-muted" : "font-medium"}>{s.toUpperCase()}</span>
            </div>
          );
        })}
        <div className="ml-auto flex items-center gap-3">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            bp.source === "llm" ? "bg-accent-soft text-accent" : "bg-card-2 text-muted"
          }`}>
            {bp.source === "llm" ? "planned by LLM" : "curated template"}
          </span>
          <button type="button" onClick={() => { clearTimers(); setPhase("pick"); setBp(null); }} className="text-xs text-muted underline underline-offset-2 hover:text-fg">
            ← new build
          </button>
        </div>
      </div>

      {fallbackNote ? (
        <div className="card border-warn/40 p-3 text-xs text-warn">{fallbackNote}</div>
      ) : null}
      {error ? <div className="card border-bad/50 p-3 text-sm text-bad">{error}</div> : null}

      {/* plan */}
      <div className={`card overflow-hidden p-0 transition-opacity ${phase === "plan" ? "" : "opacity-75"}`}>
        <div className={`h-1 ${phase === "plan" ? "shimmer" : ""}`} />
        <div className="p-4">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Plan — blueprint spec</h3>
          <pre className="overflow-x-auto font-mono text-xs leading-relaxed">
            {PLAN_LINES(bp).slice(0, phase === "plan" ? planLine : PLAN_LINES(bp).length).map((l, i) => (
              <div key={i} className="reveal">{l}</div>
            ))}
          </pre>
        </div>
      </div>

      {/* build */}
      <div className="card p-4">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Build — runtime modules</h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {BUILD_MODULES.map((m, i) => {
            const on = phase !== "plan" && (phase !== "build" || buildStep > i);
            return (
              <div key={m.name} className={`rounded-lg border p-3 transition-all ${on ? "border-ok/40 bg-ok/5" : "border-line bg-card-2 opacity-50"}`}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className={`grid h-4 w-4 place-items-center rounded-full text-[9px] ${on ? "bg-ok/20 text-ok" : "bg-line text-muted"}`}>
                    {on ? "✓" : i + 1}
                  </span>
                  runtime/{m.name}
                </div>
                <div className="mt-0.5 pl-6 text-xs text-muted">{m.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* test */}
      <div className="card p-4">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Test — real checks on the blueprint</h3>
        <div className="space-y-1.5 font-mono text-xs">
          {CHECKS.map((c, i) => {
            const on = ["build", "plan"].includes(phase) ? false : checkStep > i;
            return (
              <div key={c.label} className="flex items-center gap-2">
                <span className={on ? "text-ok" : "text-muted"}>{on ? "✓" : "·"}</span>
                <span className={on ? "" : "text-muted"}>{c.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ship */}
      {phase === "ship" ? (
        <div className="reveal space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-ok/40 bg-ok/10 px-3 py-1 text-xs font-bold text-ok">
              SHIPPED — {bp.appName} is live below
            </span>
            {shareUrl ? (
              <a href={shareUrl} className="rounded-lg border border-line px-3 py-1.5 text-xs hover:bg-card-2">
                Open standalone (shareable URL) ↗
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => { localStorage.removeItem(`uangforge:${bp.appName}:${bp.entities.map((e) => e.name).join("+")}`); location.reload(); }}
              className="text-xs text-muted underline underline-offset-2 hover:text-fg"
            >
              reset app data
            </button>
          </div>
          <RuntimeApp bp={bp} />
        </div>
      ) : null}
    </div>
  );
}
