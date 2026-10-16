"use client";

/**
 * The deterministic app runtime — the machine the factory builds ON.
 * It renders any blueprint: dashboard, table/board/calendar views, a create
 * form, and an approval workflow with a real human-in-the-loop confirm.
 * State persists in localStorage under a blueprint-specific key.
 */
import { useMemo, useState, useSyncExternalStore } from "react";
import type { Blueprint, Entity, Field } from "@/lib/blueprint";
import type { RecordData } from "@/lib/seed";
import { statusFieldOf } from "@/lib/blueprint";
import { seedApp, type AppData } from "@/lib/seed";

function formatValue(f: Field, v: RecordData[string]): string {
  if (v === null || v === undefined || v === "") return "—";
  if (f.type === "currency") return "$" + Number(v).toLocaleString("en-US");
  return String(v);
}

function storageKey(bp: Blueprint): string {
  return `uangforge:${bp.appName}:${bp.entities.map((e) => e.name).join("+")}`;
}

function createAppStore(bp: Blueprint) {
  const key = storageKey(bp);
  let current: AppData | null = null;
  const listeners = new Set<() => void>();
  return {
    subscribe(cb: () => void) {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    get(): AppData | null {
      if (current === null) {
        try {
          const saved = localStorage.getItem(key);
          current = saved ? (JSON.parse(saved) as AppData) : seedApp(bp);
        } catch {
          current = seedApp(bp);
        }
      }
      return current;
    },
    serverSnapshot(): AppData | null {
      return null;
    },
    set(next: AppData) {
      current = next;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* private mode — in-memory only */
      }
      for (const l of listeners) l();
    },
  };
}

export function RuntimeApp({ bp }: { bp: Blueprint }) {
  const store = useMemo(() => createAppStore(bp), [bp]);
  const data = useSyncExternalStore(store.subscribe, store.get, store.serverSnapshot);
  const [tab, setTab] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [pendingApprove, setPendingApprove] = useState<{ entity: string; index: number } | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const aggregate = useMemo(() => {
    if (!data) return [];
    return bp.dashboard.map((d) => {
      const rows = data[d.entity] ?? [];
      if (d.agg === "count") return { label: d.label, value: String(rows.length) };
      const ent = bp.entities.find((e) => e.name === d.entity);
      const fld = ent?.fields.find((f) => f.name === d.field);
      const nums = rows.map((r) => Number(r[d.field ?? ""])).filter((n) => !Number.isNaN(n));
      const raw = d.agg === "sum" ? nums.reduce((a, b) => a + b, 0) : nums.length ? nums.reduce((a, b) => a + b) / nums.length : 0;
      const value = fld?.type === "currency" ? "$" + Math.round(raw).toLocaleString("en-US") : String(Math.round(raw * 10) / 10);
      return { label: d.label, value };
    });
  }, [bp, data]);

  if (!data) {
    return <div className="card p-8 text-center text-muted">Booting runtime…</div>;
  }

  const createRecord = (e: Entity, record: RecordData) => {
    const prev = data ?? {};
    store.set({ ...prev, [e.name]: [...(prev[e.name] ?? []), record] });
    setFormOpen(false);
    showToast(`${e.name} created`);
  };

  const decide = (entityName: string, index: number, approve: boolean) => {
    const wf = bp.workflow!;
    const e = bp.entities.find((x) => x.name === entityName)!;
    const sf = statusFieldOf(e);
    if (!sf) return;
    const rows = [...(data?.[entityName] ?? [])];
    const row = { ...rows[index] };
    row[sf.field] = approve ? wf.toStatus : (sf.values.find((v) => v !== wf.fromStatus && v !== wf.toStatus) ?? sf.values[sf.values.length - 1]);
    rows[index] = row;
    store.set({ ...(data ?? {}), [entityName]: rows });
    setPendingApprove(null);
    showToast(`${wf.name} ${approve ? "approved" : "rejected"}`);
  };

  const activeView = bp.views[tab] ?? bp.views[0];
  const viewEntity = bp.entities.find((e) => e.name === activeView.entity) ?? bp.entities[0];
  const sf = statusFieldOf(viewEntity);
  const wf = bp.workflow && bp.workflow.entity === viewEntity.name ? bp.workflow : undefined;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {aggregate.map((c) => (
          <div key={c.label} className="card p-4">
            <div className="font-display text-2xl font-bold tracking-tight">{c.value}</div>
            <div className="mt-0.5 text-xs text-muted">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {bp.views.map((v, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setTab(i)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
              i === tab ? "border-accent bg-accent-soft text-fg" : "border-line bg-card text-muted hover:bg-card-2"
            }`}
          >
            {v.entity} · {v.type}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="ml-auto rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90 dark:text-[#1a1206]"
        >
          + New {viewEntity.name}
        </button>
      </div>

      {activeView.type === "table" ? (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-muted">
                {viewEntity.fields.map((f) => (
                  <th key={f.name} className="px-4 py-3 font-medium">{f.name}</th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(data[viewEntity.name] ?? []).map((row, i) => {
                const status = sf ? String(row[sf.field]) : null;
                const canDecide = wf && sf && status === wf.fromStatus;
                return (
                  <tr key={i} className="border-b border-line last:border-0">
                    {viewEntity.fields.map((f) => (
                      <td key={f.name} className="px-4 py-3">
                        {f.name === viewEntity.statusField && sf ? (
                          <span className="pill">{status}</span>
                        ) : (
                          formatValue(f, row[f.name])
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      {canDecide ? (
                        <span className="whitespace-nowrap">
                          <button type="button" className="rounded-md border border-ok/40 bg-ok/10 px-2.5 py-1 text-xs text-ok" onClick={() => setPendingApprove({ entity: viewEntity.name, index: i })}>
                            {wf!.name}
                          </button>
                          {wf!.requiresApproval ? (
                            <button type="button" className="ml-1.5 rounded-md border border-bad/40 bg-bad/10 px-2.5 py-1 text-xs text-bad" onClick={() => decide(viewEntity.name, i, false)}>
                              ✕
                            </button>
                          ) : null}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
              {(data[viewEntity.name] ?? []).length === 0 ? (
                <tr><td colSpan={viewEntity.fields.length + 1} className="px-4 py-8 text-center text-muted">No {viewEntity.namePlural} yet.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : activeView.type === "board" ? (
        <BoardView entity={viewEntity} rows={data[viewEntity.name] ?? []} />
      ) : (
        <CalendarView entity={viewEntity} rows={data[viewEntity.name] ?? []} />
      )}

      {formOpen ? (
        <RecordForm entity={viewEntity} onCancel={() => setFormOpen(false)} onSave={(r) => createRecord(viewEntity, r)} />
      ) : null}

      {pendingApprove ? (
        <ConfirmDialog
          title={wf!.name}
          body={`Human-in-the-loop check: move this ${pendingApprove.entity} from "${wf!.fromStatus}" to "${wf!.toStatus}"?`}
          confirmLabel="Approve"
          cancelLabel="Cancel"
          onConfirm={() => decide(pendingApprove.entity, pendingApprove.index, true)}
          onCancel={() => setPendingApprove(null)}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-ok/40 bg-card px-4 py-2 text-sm text-ok shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function BoardView({ entity, rows }: { entity: Entity; rows: RecordData[] }) {
  const sf = statusFieldOf(entity);
  const cols = sf?.values ?? ["open", "done"];
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(180px, 1fr))` }}>
      {cols.map((col) => {
        const inCol = rows.map((r, i) => ({ r, i })).filter((x) => sf && String(x.r[sf.field]) === col);
        return (
          <div key={col} className="card p-3">
            <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
              {col} <span className="opacity-60">({inCol.length})</span>
            </h3>
            {inCol.map(({ r, i }) => (
              <div key={i} className="mb-2 rounded-lg border border-line bg-card-2 p-2.5 text-sm">
                <div className="font-medium">{formatValue(entity.fields[0], r[entity.fields[0].name])}</div>
                <div className="mt-0.5 text-xs text-muted">
                  {entity.fields.slice(1, 3).map((f) => `${f.name}: ${formatValue(f, r[f.name])}`).join(" · ")}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function CalendarView({ entity, rows }: { entity: Entity; rows: RecordData[] }) {
  const dateField = entity.fields.find((f) => f.type === "date")?.name;
  const [year, month] = [2026, 9]; // October 2026 — matches the seeded sample data
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const byDate = new Map<string, string[]>();
  if (dateField) {
    for (const r of rows) {
      const d = String(r[dateField] ?? "");
      if (d) byDate.set(d, [...(byDate.get(d) ?? []), formatValue(entity.fields[0], r[entity.fields[0].name])]);
    }
  }
  return (
    <div className="card p-3">
      <div className="mb-2 text-sm font-medium">October 2026</div>
      <div className="grid grid-cols-7 gap-1.5">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="pb-1 text-center text-[10px] uppercase tracking-wider text-muted">{d}</div>
        ))}
        {Array.from({ length: first }).map((_, i) => <div key={`x${i}`} />)}
        {Array.from({ length: days }, (_, i) => {
          const ds = `2026-10-${String(i + 1).padStart(2, "0")}`;
          const evs = byDate.get(ds) ?? [];
          return (
            <div key={ds} className="min-h-16 rounded-md border border-line p-1 text-[10px] text-muted">
              {i + 1}
              {evs.map((ev, j) => (
                <div key={j} className="mt-0.5 truncate rounded bg-accent-soft px-1 py-0.5 text-fg">{ev}</div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecordForm({ entity, onSave, onCancel }: { entity: Entity; onSave: (r: RecordData) => void; onCancel: () => void }) {
  const [values, setValues] = useState<RecordData>({});
  const submit = () => {
    const r: RecordData = {};
    for (const f of entity.fields) {
      const v = values[f.name];
      if (f.type === "number" || f.type === "currency") r[f.name] = Number(v ?? 0);
      else if (f.type === "boolean") r[f.name] = Boolean(v);
      else r[f.name] = String(v ?? (f.type === "select" ? f.options?.[0] ?? "" : ""));
    }
    onSave(r);
  };
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4" onClick={onCancel}>
      <div className="card w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-bold">New {entity.name}</h3>
        <div className="mt-3 space-y-3">
          {entity.fields.map((f) => (
            <label key={f.name} className="block">
              <span className="mb-1 block text-xs text-muted">{f.name}</span>
              {f.type === "select" ? (
                <select
                  className="w-full rounded-lg border border-line bg-card-2 px-3 py-2 text-sm"
                  value={String(values[f.name] ?? f.options?.[0] ?? "")}
                  onChange={(e) => setValues((v: RecordData) => ({ ...v, [f.name]: e.target.value }))}
                >
                  {(f.options ?? []).map((o: string) => <option key={o}>{o}</option>)}
                </select>
              ) : f.type === "boolean" ? (
                <input type="checkbox" checked={Boolean(values[f.name])} onChange={(e) => setValues((v: RecordData) => ({ ...v, [f.name]: e.target.checked }))} />
              ) : (
                <input
                  type={f.type === "number" || f.type === "currency" ? "number" : f.type === "date" ? "date" : "text"}
                  className="w-full rounded-lg border border-line bg-card-2 px-3 py-2 text-sm"
                  value={String(values[f.name] ?? "")}
                  onChange={(e) => setValues((v: RecordData) => ({ ...v, [f.name]: e.target.value }))}
                />
              )}
            </label>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={submit} className="flex-1 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white dark:text-[#1a1206]">
            Create {entity.name}
          </button>
          <button type="button" onClick={onCancel} className="rounded-lg border border-line px-4 py-2 text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ title, body, confirmLabel, cancelLabel, onConfirm, onCancel }: {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4" onClick={onCancel}>
      <div className="card w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-muted">{body}</p>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onConfirm} className="flex-1 rounded-lg border border-ok/40 bg-ok/10 px-4 py-2 text-sm font-semibold text-ok">
            {confirmLabel}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 rounded-lg border border-line px-4 py-2 text-sm">
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
