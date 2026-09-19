import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchIndex, type WorkflowMeta } from "@/lib/workflows";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AI Workflow Hub — 2000+ Free n8n Automation Workflows" },
      {
        name: "description",
        content:
          "Browse, search and copy 2000+ ready-to-import n8n automation workflows. AI agents, email, e-commerce, CRM, scraping and more.",
      },
      { property: "og:title", content: "AI Workflow Hub — 2000+ Free n8n Automation Workflows" },
      {
        property: "og:description",
        content:
          "Search 2000+ ready-to-import n8n automation workflows — AI agents, email, e-commerce, CRM, scraping and more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const PAGE_SIZE = 12;

const COMPLEXITY_LABEL: Record<string, string> = {
  simple: "Simple",
  medium: "Medium",
  complex: "Complex",
};

const TRIGGER_LABEL: Record<string, string> = {
  manual: "Manual",
  scheduled: "Scheduled",
  triggered: "Triggered",
  webhook: "Webhook",
};

const TRIGGER_ICON: Record<string, string> = {
  manual: "🖐",
  scheduled: "⏰",
  triggered: "⚡",
  webhook: "🔗",
};

function Index() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["workflow-index"],
    queryFn: fetchIndex,
    staleTime: Infinity,
  });

  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const [complexity, setComplexity] = useState("");
  const [trigger, setTrigger] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.items.filter((w) => {
      if (cat && w.cat !== cat) return false;
      if (complexity && w.complexity !== complexity) return false;
      if (trigger && w.triggerType !== trigger) return false;
      if (!q) return true;
      return (
        w.name.toLowerCase().includes(q) ||
        w.services.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [data, query, cat, complexity, trigger]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function reset<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                🤖 AI Workflow Hub
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
                {data ? data.total.toLocaleString() : "2000"}+ free n8n AI automation workflows.
                Discover, copy and use them in your own projects.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-muted-foreground">
                <span>✅ Completely Free</span>
                <span>🚀 Ready to Import</span>
                <span>🤖 AI Powered</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2 text-sm">
              <Link
                to="/guide"
                className="rounded-lg border border-border px-3 py-1.5 font-medium transition-colors hover:border-ring hover:text-primary"
              >
                📘 Guide
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat icon="📊" value={data?.total} label="Total Workflows" tone="blue" />
          <Stat icon="🤖" value={data?.aiCount} label="AI Workflows" tone="green" />
          <Stat icon="🔗" value={data?.totalNodes} label="Total Nodes" tone="purple" />
          <Stat icon="🔌" value={data?.integrationCount} label="Integrations" tone="orange" />
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Field label="🔍 Search">
              <input
                value={query}
                onChange={(e) => reset(setQuery)(e.target.value)}
                placeholder="Search workflow, integration..."
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
              />
            </Field>
            <Field label="📂 Category">
              <Select value={cat} onChange={reset(setCat)}>
                <option value="">All Categories</option>
                {data?.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({c.count})
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="📊 Complexity">
              <Select value={complexity} onChange={reset(setComplexity)}>
                <option value="">All Levels</option>
                <option value="simple">Simple</option>
                <option value="medium">Medium</option>
                <option value="complex">Complex</option>
              </Select>
            </Field>
            <Field label="⚡ Trigger">
              <Select value={trigger} onChange={reset(setTrigger)}>
                <option value="">All Types</option>
                <option value="manual">Manual</option>
                <option value="scheduled">Scheduled</option>
                <option value="triggered">Triggered</option>
                <option value="webhook">Webhook</option>
              </Select>
            </Field>
          </div>
        </div>

        {/* Results */}
        {isLoading && <GridSkeleton />}

        {isError && (
          <p className="py-20 text-center text-sm text-muted-foreground">
            Couldn’t load the workflow library. Refresh the page to try again.
          </p>
        )}

        {data && (
          <>
            <p className="mt-8 text-sm text-muted-foreground">
              {filtered.length.toLocaleString()} workflows found (page {current} / {pageCount})
            </p>

            {filtered.length === 0 ? (
              <p className="py-20 text-center text-sm text-muted-foreground">
                No workflows match these filters. Try a service name like gmail, slack or stripe.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((w) => (
                  <WorkflowCard
                    key={w.file}
                    w={w}
                    catLabel={data.categories.find((c) => c.id === w.cat)?.label ?? w.cat}
                  />

                ))}
              </div>
            )}

            {pageCount > 1 && (
              <Pagination page={current} pageCount={pageCount} onChange={setPage} />
            )}
          </>
        )}
      </main>

    </div>
  );
}

const TONES: Record<string, string> = {
  blue: "bg-blue-50 border-blue-100 text-blue-600",
  green: "bg-emerald-50 border-emerald-100 text-emerald-600",
  purple: "bg-purple-50 border-purple-100 text-purple-600",
  orange: "bg-orange-50 border-orange-100 text-orange-600",
};

function Stat({
  icon,
  value,
  label,
  tone,
}: {
  icon: string;
  value: number | undefined;
  label: string;
  tone: string;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-5 ${TONES[tone]}`}>
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-2xl font-bold leading-tight">
          {value === undefined ? "—" : value.toLocaleString()}
        </p>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring"
    >
      {children}
    </select>
  );
}

function WorkflowCard({ w, catLabel }: { w: WorkflowMeta; catLabel: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <span>{w.ai ? "🤖" : "📁"}</span>
          <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
            {COMPLEXITY_LABEL[w.complexity]}
          </span>
        </span>
        {w.active && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
            ✅ Active
          </span>
        )}
      </div>

      <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight">{w.name}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span>
          {TRIGGER_ICON[w.triggerType]} {TRIGGER_LABEL[w.triggerType]}
        </span>
        <span>{w.nodes} nodes</span>
      </div>

      {w.services.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {w.services.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground"
            >
              {s}
            </span>
          ))}
          {w.serviceCount > 4 && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              +{w.serviceCount - 4} more
            </span>
          )}
        </div>
      )}

      <p className="mt-4 text-xs font-medium text-muted-foreground">{catLabel}</p>

      <Link
        to="/workflows/$id"
        params={{ id: w.id }}
        className="mt-4 block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >

        📋 View details &amp; copy
      </Link>
    </div>
  );
}

function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
}) {
  const pages: number[] = [];
  const start = Math.max(1, Math.min(page - 2, pageCount - 4));
  for (let i = start; i < start + 5 && i <= pageCount; i++) pages.push(i);

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <PageBtn disabled={page === 1} onClick={() => onChange(page - 1)}>
        ← Prev
      </PageBtn>
      {start > 1 && <span className="px-1 text-muted-foreground">…</span>}
      {pages.map((p) => (
        <PageBtn key={p} active={p === page} onClick={() => onChange(p)}>
          {p}
        </PageBtn>
      ))}
      {start + 5 <= pageCount && <span className="px-1 text-muted-foreground">…</span>}
      <PageBtn disabled={page === pageCount} onClick={() => onChange(page + 1)}>
        Next →
      </PageBtn>
    </div>
  );
}

function PageBtn({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={
        "min-w-10 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-40 " +
        (active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-ring hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}

function GridSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-xl border border-border bg-card" />
      ))}
    </div>
  );
}
