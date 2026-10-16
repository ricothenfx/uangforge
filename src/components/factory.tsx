"use client";

/**
 * The factory floor: pick or describe an app → watch PLAN → BUILD → TEST →
 * SHIP, then use the real app the runtime mounts. The theater is honest:
 * the TEST stage runs real validation checks against the blueprint, and the
 * SHIP stage mounts a working app, not a screenshot.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { encodeBlueprint } from "@/lib/codec";
import type { Blueprint } from "@/lib/blueprint";
import { normalizeSamples } from "@/lib/blueprint";
import { seedApp } from "@/lib/seed";
import { CURATED } from "@/lib/curated";
import { storageKeyOf, RuntimeApp } from "./runtime-app";
import { useI18n } from "@/lib/i18n/provider";

type Phase = "pick" | "plan" | "build" | "test" | "ship";
type Check = { label: string; run: (bp: Blueprint) => boolean };

const PLAN_LINES = (bp: Blueprint): string[] => [
  `app        ${bp.appName}`,
  `goal       ${bp.tagline}`,
  ...bp.entities.map((e) => `entity     ${e.name} (${e.namePlural}) — ${e.fields.map((f) => `${f.name}:${f.type}`).join(", ")}${e.samples?.length ? ` +${e.samples.length} sample rows` : ""}`),
  ...bp.views.map((v) => `view       ${v.entity} as ${v.type}`),
  ...bp.dashboard.map((d) => `metric     ${d.label} = ${d.agg}(${d.entity}${d.field ? "." + d.field : ""})`),
  ...(bp.workflow ? [`workflow   ${bp.workflow.name}: ${bp.workflow.fromStatus} → ${bp.workflow.toStatus}${bp.workflow.requiresApproval ? " (human approval)" : ""}`] : []),
];

/** JSON view of the blueprint; long sample lists are truncated for display. */
function blueprintJsonLines(bp: Blueprint): string[] {
  const trimmed: Blueprint = {
    ...bp,
    prompt: undefined,
    entities: bp.entities.map((e) => {
      const s = e.samples ?? [];
      if (s.length <= 2) return e;
      return {
        ...e,
        samples: [...s.slice(0, 2), { truncated: `… +${s.length - 2} more sample rows` }] as typeof e.samples,
      };
    }),
  };
  return JSON.stringify(trimmed, null, 2).split("\n");
}

export function Factory() {
  const { dict: d } = useI18n();
  const [phase, setPhase] = useState<Phase>("pick");
  const [prompt, setPrompt] = useState("");
  const [bp, setBp] = useState<Blueprint | null>(null);
  const [planLine, setPlanLine] = useState(0);
  const [buildStep, setBuildStep] = useState(0);
  const [checkStep, setCheckStep] = useState(0);
  const [fallbackNote, setFallbackNote] = useState<string | null>(null);
  const [sharePath, setSharePath] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const CHECKS: Check[] = useMemo(() => [
    { label: d.factory.checks[0], run: (bp) => bp.entities.length >= 1 && bp.entities.every((e) => e.fields.length >= 2) },
    { label: d.factory.checks[1], run: (bp) => bp.entities.every((e) => e.fields.every((f) => ["text", "number", "currency", "date", "select", "boolean"].includes(f.type))) },
    { label: d.factory.checks[2], run: (bp) => bp.views.every((v) => bp.entities.some((e) => e.name === v.entity)) },
    { label: d.factory.checks[3], run: (bp) => bp.dashboard.every((dd) => bp.entities.some((e) => e.name === dd.entity)) },
    { label: d.factory.checks[4], run: (bp) => !bp.workflow || bp.workflow.fromStatus !== bp.workflow.toStatus },
    { label: d.factory.checks[5], run: (bp) => bp.entities.every((e) => !e.samples?.length || normalizeSamples(e).length > 0) },
    { label: d.factory.checks[6], run: (bp) => Object.values(seedApp(bp)).every((r) => r.length >= 8) },
  ], [d]);

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
    for (let i = 1; i <= d.factory.modules.length; i++) later(320 * lines + 500 + 420 * i, () => setBuildStep(i));
    const buildDone = 320 * lines + 500 + 420 * d.factory.modules.length + 400;
    later(buildDone, () => setPhase("test"));
    // the checks actually run — a failing check would stop the line
    for (let i = 1; i <= CHECKS.length; i++) {
      later(buildDone + 380 * i, () => {
        const ok = CHECKS.slice(0, i).every((c) => c.run(blueprint));
        setCheckStep(i);
        if (!ok) setError(d.factory.qcFailed.replace("{check}", CHECKS[i - 1].label));
      });
    }
    later(buildDone + 380 * CHECKS.length + 500, () => setPhase("ship"));
    void encodeBlueprint(blueprint).then((s) => setSharePath(`/app?bp=${s}`));
  }, [CHECKS, d]);

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
        setError(data.error ?? d.factory.plannerUnavailable);
        setPhase("pick");
        return;
      }
      startTheater(data.blueprint, data.note ?? null);
    } catch {
      setError(d.factory.networkError);
      setPhase("pick");
    }
  }, [startTheater, d]);

  const shareUrl = sharePath;
  const jsonLines = useMemo(() => (bp ? blueprintJsonLines(bp) : []), [bp]);
  const planTotal = bp ? PLAN_LINES(bp).length : 1;
  const jsonShown = phase === "plan" ? Math.min(jsonLines.length, Math.ceil((planLine / Math.max(1, planTotal)) * jsonLines.length)) : jsonLines.length;

  const remix = () => {
    const seed = bp?.prompt || (bp ? `${bp.appName} — ${bp.tagline}` : "");
    setPrompt(seed.slice(0, 200));
    clearTimers();
    setPhase("pick");
    setBp(null);
  };

  const copyLink = async () => {
    if (!sharePath) return;
    try {
      await navigator.clipboard.writeText(`${location.origin}${sharePath}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

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
              placeholder={d.factory.placeholder}
              maxLength={200}
              className="flex-1 rounded-lg border border-line bg-card-2 px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
            <button type="submit" className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 dark:text-[#1a1206]">
              {d.factory.buildBtn}
            </button>
          </form>
          <p className="mt-2 text-xs text-muted">{d.factory.note}</p>
          {error ? <p className="mt-2 text-sm text-bad">{error}</p> : null}
        </div>

        <div>
          <p className="mb-3 text-sm font-medium">{d.factory.orScenario}</p>
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
    return <div className="card p-8 text-center text-muted">{d.factory.requesting}</div>;
  }

  const STAGES = ["plan", "build", "test", "ship"] as const;

  return (
    <div className="space-y-4">
      {/* stage header */}
      <div className="card flex flex-wrap items-center gap-x-6 gap-y-2 p-4">
        {STAGES.map((s, i) => {
          const state = STAGES.indexOf(phase as (typeof STAGES)[number]) > i ? "done" : phase === s ? "active" : "todo";
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
              <span className={state === "todo" ? "text-muted" : "font-medium"}>{d.factory.stages[s]}</span>
            </div>
          );
        })}
        <div className="ml-auto flex items-center gap-3">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            bp.source === "llm" ? "bg-accent-soft text-accent" : "bg-card-2 text-muted"
          }`}>
            {bp.source === "llm" ? d.factory.plannedByLlm : d.factory.curatedTemplate}
          </span>
          <button type="button" onClick={() => { clearTimers(); setPhase("pick"); setBp(null); }} className="text-xs text-muted underline underline-offset-2 hover:text-fg">
            {d.factory.newBuild}
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
        <div className="grid gap-4 p-4 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{d.factory.planSpec}</h3>
            <pre className="overflow-x-auto font-mono text-xs leading-relaxed">
              {PLAN_LINES(bp).slice(0, phase === "plan" ? planLine : PLAN_LINES(bp).length).map((l, i) => (
                <div key={i} className="reveal">{l}</div>
              ))}
            </pre>
          </div>
          <div className="min-w-0">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{d.factory.blueprintJson}</h3>
            <pre className="max-h-72 overflow-x-auto font-mono text-[11px] leading-relaxed text-muted">
              {jsonLines.slice(0, jsonShown).map((l, i) => (
                <div key={i} className={`reveal ${i === 0 ? "text-fg" : ""}`}>{l}</div>
              ))}
              {jsonShown < jsonLines.length ? <div className="text-muted">…</div> : null}
            </pre>
          </div>
        </div>
      </div>

      {/* build */}
      <div className="card p-4">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">{d.factory.buildModulesTitle}</h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {["schema", "seed", "dashboard", "views", "form", "workflow"].map((m, i) => {
            const on = phase !== "plan" && (phase !== "build" || buildStep > i);
            return (
              <div key={m} className={`rounded-lg border p-3 transition-all ${on ? "border-ok/40 bg-ok/5" : "border-line bg-card-2 opacity-50"}`}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className={`grid h-4 w-4 place-items-center rounded-full text-[9px] ${on ? "bg-ok/20 text-ok" : "bg-line text-muted"}`}>
                    {on ? "✓" : i + 1}
                  </span>
                  runtime/{m}
                </div>
                <div className="mt-0.5 pl-6 text-xs text-muted">{d.factory.modules[i].desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* test */}
      <div className="card p-4">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">{d.factory.testTitle}</h3>
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
              {d.factory.shipped.replace("{name}", bp.appName)}
            </span>
            {shareUrl ? (
              <a href={shareUrl} className="rounded-lg border border-line px-3 py-1.5 text-xs hover:bg-card-2">
                {d.factory.openStandalone}
              </a>
            ) : null}
            {shareUrl ? (
              <button type="button" onClick={() => void copyLink()} className="rounded-lg border border-line px-3 py-1.5 text-xs hover:bg-card-2">
                {copied ? d.factory.copied : d.factory.copyLink}
              </button>
            ) : null}
            <button type="button" onClick={remix} className="rounded-lg border border-accent/40 bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent hover:opacity-90">
              {d.factory.remix}
            </button>
            <button
              type="button"
              onClick={() => { localStorage.removeItem(storageKeyOf(bp)); location.reload(); }}
              className="text-xs text-muted underline underline-offset-2 hover:text-fg"
            >
              {d.factory.resetData}
            </button>
          </div>
          <RuntimeApp bp={bp} />
        </div>
      ) : null}
    </div>
  );
}
