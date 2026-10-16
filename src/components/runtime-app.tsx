"use client";

/**
 * The deterministic app runtime — the machine the factory builds ON.
 * It renders any blueprint: dashboard with live status breakdown, searchable
 * and sortable table, drag-and-drop board, navigable calendar, create/edit
 * form, delete with undo, and an approval workflow with a real
 * human-in-the-loop confirm. State persists in localStorage.
 */
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Blueprint, Entity, Field, RecordData } from "@/lib/blueprint";
import { statusFieldOf } from "@/lib/blueprint";
import { seedApp, type AppData } from "@/lib/seed";

function formatValue(f: Field, v: RecordData[string]): string {
  if (v === null || v === undefined || v === "") return "—";
  if (f.type === "currency") return "$" + Number(v).toLocaleString("en-US");
  return String(v);
}

export function storageKeyOf(bp: Blueprint): string {
  return `uangforge:v2:${bp.appName}:${bp.entities.map((e) => e.name).join("+")}`;
}

function createAppStore(bp: Blueprint) {
  const key = storageKeyOf(bp);
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

type Toast = { msg: string; undo?: () => void };

const SEGMENT_COLORS = ["bg-ok", "bg-accent", "bg-warn", "bg-bad", "bg-muted"];

export function RuntimeApp({ bp }: { bp: Blueprint }) {
  const store = useMemo(() => createAppStore(bp), [bp]);
  const data = useSyncExternalStore(store.subscribe, store.get, store.serverSnapshot);
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState<{ mode: "create" } | { mode: "edit"; index: number } | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [pendingApprove, setPendingApprove] = useState<{ entity: string; index: number } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (t: Toast) => {
    setToast(t);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), t.undo ? 5000 : 2200);
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

  // dashboard extras: status breakdown + numeric mini bars for the lead entity
  const leadEntity = useMemo(() => bp.entities.find((e) => statusFieldOf(e)) ?? bp.entities[0], [bp]);
  const breakdown = useMemo(() => {
    const sf = statusFieldOf(leadEntity);
    if (!data || !sf) return null;
    const rows = data[leadEntity.name] ?? [];
    return sf.values.map((v, i) => {
      const n = rows.filter((r) => r[sf.field] === v).length;
      return { value: v, n, color: SEGMENT_COLORS[i % SEGMENT_COLORS.length] };
    });
  }, [leadEntity, data]);
  const miniBars = useMemo(() => {
    if (!data) return null;
    const f = leadEntity.fields.find((x) => x.type === "number" || x.type === "currency");
    if (!f) return null;
    const rows = (data[leadEntity.name] ?? []).slice(0, 8);
    const vals = rows.map((r) => Number(r[f.name]) || 0);
    const max = Math.max(...vals, 1);
    return { f, rows: rows.map((r, i) => ({ label: String(r[leadEntity.fields[0].name] ?? `#${i + 1}`), v: vals[i], pct: Math.round((vals[i] / max) * 100) })) };
  }, [leadEntity, data]);

  const activeView = bp.views[tab] ?? bp.views[0];
  const viewEntity = bp.entities.find((e) => e.name === activeView.entity) ?? bp.entities[0];
  const sf = statusFieldOf(viewEntity);
  const wf = bp.workflow && bp.workflow.entity === viewEntity.name ? bp.workflow : undefined;

  const tableRows = useMemo(() => {
    const all = data?.[viewEntity.name] ?? [];
    const rows = all.map((r, i) => ({ r, i }));
    const q = query.trim().toLowerCase();
    const filtered = rows.filter(({ r }) => {
      if (sf && statusFilter !== "all" && r[sf.field] !== statusFilter) return false;
      if (!q) return true;
      return viewEntity.fields.some((f) => String(r[f.name] ?? "").toLowerCase().includes(q));
    });
    if (sort) {
      const fld = viewEntity.fields.find((f) => f.name === sort.key);
      const numeric = fld?.type === "number" || fld?.type === "currency";
      filtered.sort((a, b) => {
        const av = a.r[sort.key];
        const bv = b.r[sort.key];
        const c = numeric ? Number(av) - Number(bv) : String(av ?? "").localeCompare(String(bv ?? ""), undefined, { sensitivity: "base" });
        return c * sort.dir;
      });
    }
    return filtered;
  }, [data, viewEntity, query, statusFilter, sort, sf]);

  if (!data) {
    return <div className="card p-8 text-center text-muted">Booting runtime…</div>;
  }

  const createRecord = (e: Entity, record: RecordData) => {
    const prev = data ?? {};
    store.set({ ...prev, [e.name]: [...(prev[e.name] ?? []), record] });
    setForm(null);
    showToast({ msg: `${e.name} created` });
  };

  const updateRecord = (e: Entity, index: number, record: RecordData) => {
    const rows = [...(data?.[e.name] ?? [])];
    rows[index] = record;
    store.set({ ...(data ?? {}), [e.name]: rows });
    setForm(null);
    showToast({ msg: `${e.name} updated` });
  };

  const deleteRecord = (entityName: string, index: number) => {
    const snapshot = data;
    const rows = [...(data?.[entityName] ?? [])];
    const [removed] = rows.splice(index, 1);
    store.set({ ...(data ?? {}), [entityName]: rows });
    showToast({
      msg: `${removed[leadEntity.fields[0].name] ?? entityName} deleted`,
      undo: () => {
        if (snapshot) store.set(snapshot);
        setToast(null);
      },
    });
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
    showToast({ msg: `${wf.name} ${approve ? "approved" : "rejected"}` });
  };

  const moveCard = (entityName: string, index: number, col: string) => {
    const e = bp.entities.find((x) => x.name === entityName)!;
    const sf = statusFieldOf(e);
    if (!sf) return;
    const rows = [...(data?.[entityName] ?? [])];
    const row = { ...rows[index] };
    if (row[sf.field] === col) return;
    row[sf.field] = col;
    rows.splice(index, 1);
    rows.push(row);
    store.set({ ...(data ?? {}), [entityName]: rows });
    showToast({ msg: `moved to ${col}` });
  };

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

      {breakdown || miniBars ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {breakdown ? (
            <div className="card p-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{leadEntity.name} · status breakdown</div>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-card-2">
                {breakdown.map((s) =>
                  s.n > 0 ? <div key={s.value} className={`${s.color} h-full`} style={{ width: `${(s.n / Math.max(1, breakdown.reduce((a, b) => a + b.n, 0))) * 100}%` }} title={`${s.value}: ${s.n}`} /> : null,
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                {breakdown.map((s) => (
                  <span key={s.value} className="flex items-center gap-1.5">
                    <span className={`inline-block h-2 w-2 rounded-full ${s.color}`} />
                    {s.value} · {s.n}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {miniBars ? (
            <div className="card p-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{leadEntity.name} · {miniBars.f.name}</div>
              <div className="space-y-1.5">
                {miniBars.rows.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-28 truncate text-muted" title={r.label}>{r.label}</span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-card-2">
                      <span className={`${miniBars.f.type === "currency" ? "bg-accent" : "bg-ok"} block h-full rounded-full`} style={{ width: `${r.pct}%` }} />
                    </span>
                    <span className="w-14 text-right font-medium">{formatValue(miniBars.f, r.v)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

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
          onClick={() => setForm({ mode: "create" })}
          className="ml-auto rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90 dark:text-[#1a1206]"
        >
          + New {viewEntity.name}
        </button>
      </div>

      {activeView.type === "table" ? (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${viewEntity.namePlural}…`}
              className="w-56 rounded-lg border border-line bg-card-2 px-3 py-1.5 text-sm outline-none focus:border-accent"
            />
            {sf ? (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-line bg-card-2 px-3 py-1.5 text-sm"
                aria-label={`Filter ${viewEntity.name} by status`}
              >
                <option value="all">all statuses</option>
                {sf.values.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            ) : null}
            <span className="ml-auto text-xs text-muted">{tableRows.length} of {(data[viewEntity.name] ?? []).length} rows</span>
          </div>
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wider text-muted">
                  {viewEntity.fields.map((f) => (
                    <th key={f.name} className="px-4 py-3 font-medium">
                      <button
                        type="button"
                        onClick={() => setSort((s) => (s && s.key === f.name ? { key: f.name, dir: s.dir === 1 ? -1 : 1 } : { key: f.name, dir: 1 }))}
                        className="inline-flex items-center gap-1 hover:text-fg"
                      >
                        {f.name}
                        <span className="text-[9px]">{sort?.key === f.name ? (sort.dir === 1 ? "▲" : "▼") : "↕"}</span>
                      </button>
                    </th>
                  ))}
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {tableRows.map(({ r, i }) => {
                  const status = sf ? String(r[sf.field]) : null;
                  const canDecide = Boolean(wf && sf && status === wf.fromStatus);
                  return (
                    <tr
                      key={i}
                      className="cursor-pointer border-b border-line last:border-0 hover:bg-card-2"
                      onClick={() => setForm({ mode: "edit", index: i })}
                    >
                      {viewEntity.fields.map((f) => (
                        <td key={f.name} className="px-4 py-3">
                          {f.name === viewEntity.statusField && sf ? (
                            <span className="pill">{status}</span>
                          ) : (
                            formatValue(f, r[f.name])
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        {canDecide ? (
                          <span className="whitespace-nowrap">
                            <button type="button" className="rounded-md border border-ok/40 bg-ok/10 px-2.5 py-1 text-xs text-ok" onClick={() => setPendingApprove({ entity: viewEntity.name, index: i })}>
                              {wf!.name}
                            </button>
                            {wf!.requiresApproval ? (
                              <button type="button" aria-label="Reject row" className="ml-1.5 rounded-md border border-bad/40 bg-bad/10 px-2.5 py-1 text-xs text-bad" onClick={() => decide(viewEntity.name, i, false)}>
                                ✕
                              </button>
                            ) : null}
                          </span>
                        ) : null}
                        <span className="ml-1.5 inline-flex gap-1.5">
                          <button type="button" aria-label={`Edit ${viewEntity.name} row`} className="rounded-md border border-line px-2 py-1 text-xs text-muted hover:text-fg" onClick={() => setForm({ mode: "edit", index: i })}>
                            Edit
                          </button>
                          <button type="button" aria-label={`Delete ${viewEntity.name} row`} className="rounded-md border border-bad/40 bg-bad/10 px-2 py-1 text-xs text-bad" onClick={() => deleteRecord(viewEntity.name, i)}>
                            Delete
                          </button>
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {tableRows.length === 0 ? (
                  <tr><td colSpan={viewEntity.fields.length + 1} className="px-4 py-8 text-center text-muted">No {viewEntity.namePlural} match.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeView.type === "board" ? (
        <BoardView entity={viewEntity} rows={data[viewEntity.name] ?? []} onMove={(i, col) => moveCard(viewEntity.name, i, col)} />
      ) : (
        <CalendarView entity={viewEntity} rows={data[viewEntity.name] ?? []} />
      )}

      {form ? (
        <RecordForm
          entity={viewEntity}
          title={form.mode === "create" ? `New ${viewEntity.name}` : `Edit ${viewEntity.name}`}
          initial={form.mode === "edit" ? data[viewEntity.name]?.[form.index] : undefined}
          onCancel={() => setForm(null)}
          onSave={(r) => (form.mode === "edit" ? updateRecord(viewEntity, form.index, r) : createRecord(viewEntity, r))}
        />
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
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-ok/40 bg-card px-4 py-2 text-sm text-ok shadow-lg">
          {toast.msg}
          {toast.undo ? (
            <button type="button" className="font-semibold underline underline-offset-2" onClick={toast.undo}>
              Undo
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function BoardView({ entity, rows, onMove }: { entity: Entity; rows: RecordData[]; onMove: (index: number, col: string) => void }) {
  const sf = statusFieldOf(entity);
  const cols = sf?.values ?? ["open", "done"];
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(180px, 1fr))` }}>
      {cols.map((col) => {
        const inCol = rows.map((r, i) => ({ r, i })).filter((x) => sf && String(x.r[sf.field]) === col);
        return (
          <div
            key={col}
            className={`card rounded-xl border p-3 transition-colors ${overCol === col ? "border-accent bg-accent-soft" : "border-line"}`}
            onDragOver={(e) => {
              e.preventDefault();
              setOverCol(col);
            }}
            onDragLeave={() => setOverCol((c) => (c === col ? null : c))}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIdx !== null) onMove(dragIdx, col);
              setDragIdx(null);
              setOverCol(null);
            }}
          >
            <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
              {col} <span className="opacity-60">({inCol.length})</span>
            </h3>
            {inCol.map(({ r, i }) => (
              <div
                key={i}
                draggable
                onDragStart={() => setDragIdx(i)}
                onDragEnd={() => {
                  setDragIdx(null);
                  setOverCol(null);
                }}
                className={`mb-2 rounded-lg border border-line bg-card-2 p-2.5 text-sm transition-opacity ${dragIdx === i ? "opacity-40" : ""} cursor-grab active:cursor-grabbing`}
                title="Drag to another column to change status"
              >
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

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function CalendarView({ entity, rows }: { entity: Entity; rows: RecordData[] }) {
  const dateField = entity.fields.find((f) => f.type === "date")?.name;
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const first = new Date(ym.y, ym.m, 1).getDay();
  const days = new Date(ym.y, ym.m + 1, 0).getDate();
  const label = new Date(ym.y, ym.m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const shift = (delta: number) => setYm(({ y, m }) => {
    const d = new Date(y, m + delta, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const byDate = new Map<string, string[]>();
  if (dateField) {
    for (const r of rows) {
      const d = String(r[dateField] ?? "").slice(0, 10);
      if (d) byDate.set(d, [...(byDate.get(d) ?? []), formatValue(entity.fields[0], r[entity.fields[0].name])]);
    }
  }
  return (
    <div className="card p-3">
      <div className="mb-2 flex items-center gap-2">
        <div className="text-sm font-medium">{label}</div>
        <div className="ml-auto flex gap-1">
          <button type="button" aria-label="Previous month" onClick={() => shift(-1)} className="rounded-md border border-line px-2 py-0.5 text-xs text-muted hover:text-fg">
            ←
          </button>
          <button type="button" aria-label="Current month" onClick={() => setYm({ y: now.getFullYear(), m: now.getMonth() })} className="rounded-md border border-line px-2 py-0.5 text-xs text-muted hover:text-fg">
            today
          </button>
          <button type="button" aria-label="Next month" onClick={() => shift(1)} className="rounded-md border border-line px-2 py-0.5 text-xs text-muted hover:text-fg">
            →
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="pb-1 text-center text-[10px] uppercase tracking-wider text-muted">{d}</div>
        ))}
        {Array.from({ length: first }).map((_, i) => <div key={`x${i}`} />)}
        {Array.from({ length: days }, (_, i) => {
          const ds = `${ym.y}-${pad2(ym.m + 1)}-${pad2(i + 1)}`;
          const evs = byDate.get(ds) ?? [];
          const isToday = ym.y === now.getFullYear() && ym.m === now.getMonth() && i + 1 === now.getDate();
          return (
            <div key={ds} className={`min-h-16 rounded-md border p-1 text-[10px] ${isToday ? "border-accent" : "border-line"} text-muted`}>
              {i + 1}
              {evs.map((ev, j) => (
                <div key={j} className="mt-0.5 truncate rounded bg-accent-soft px-1 py-0.5 text-fg" title={ev}>{ev}</div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecordForm({ entity, title, initial, onSave, onCancel }: {
  entity: Entity;
  title: string;
  initial?: RecordData;
  onSave: (r: RecordData) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<RecordData>(initial ?? {});
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
        <h3 className="font-display text-lg font-bold">{title}</h3>
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
            Save {entity.name}
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
