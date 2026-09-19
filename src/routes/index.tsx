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
    ],
  }),
});

const PAGE_SIZE = 48;

function Index() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["workflow-index"],
    queryFn: fetchIndex,
    staleTime: Infinity,
  });

  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.items.filter((w) => {
      if (cat && w.cat !== cat) return false;
      if (!q) return true;
      return w.name.toLowerCase().includes(q);
    });
  }, [data, query, cat]);

  const shown = filtered.slice(0, visible);
  const aiCount = data ? data.items.filter((w) => w.ai).length : 0;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-grid" aria-hidden />
        <div className="absolute inset-0 glow-primary" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 pt-10 pb-16">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-medium text-primary-foreground">
                n8
              </span>
              <span className="text-sm font-semibold tracking-tight">AI Workflow Hub</span>
            </div>
            <nav className="flex items-center justify-end gap-5 text-sm text-muted-foreground">
              <Link to="/guide" className="transition-colors hover:text-foreground">
                Guide
              </Link>
              <a
                href="/AI-Workflow-Hub-2000.zip"
                download
                className="transition-colors hover:text-foreground"
              >
                Download all ⤓
              </a>
              <a
                href="https://n8n.io"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                What is n8n? →
              </a>
            </nav>
          </nav>

          <div className="mt-16 max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              {data ? `${data.total} workflows` : "Loading library"}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Free n8n workflows,
              <br />
              <span className="text-primary">ready to import.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              A curated library of {data ? data.total.toLocaleString() : "2,000"}+ automation
              workflows — {aiCount.toLocaleString()}+ of them AI-powered. Find one, copy the JSON,
              import it into your n8n dashboard in seconds.
            </p>
          </div>

          {/* Search */}
          <div className="mt-10 max-w-2xl">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 shadow-lg shadow-black/20 focus-within:border-ring">
              <svg
                className="size-5 shrink-0 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                />
              </svg>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisible(PAGE_SIZE);
                }}
                placeholder="Search workflows — try “gmail”, “stripe”, “telegram”…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="shrink-0 font-mono text-xs text-muted-foreground hover:text-foreground"
                >
                  clear
                </button>
              )}
            </div>
          </div>

          {/* Category chips */}
          {data && (
            <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
              <Chip active={cat === null} onClick={() => setCat(null)} count={data.total}>
                All
              </Chip>
              {data.categories.map((c) => (
                <Chip
                  key={c.id}
                  active={cat === c.id}
                  count={c.count}
                  onClick={() => {
                    setCat(cat === c.id ? null : c.id);
                    setVisible(PAGE_SIZE);
                  }}
                >
                  {c.label}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Grid */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        {isLoading && <GridSkeleton />}

        {isError && (
          <p className="py-20 text-center text-sm text-muted-foreground">
            Couldn’t load the workflow library. Refresh the page to try again.
          </p>
        )}

        {data && (
          <>
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {cat ? data.categories.find((c) => c.id === cat)?.label : "All workflows"}
              </h2>
              <p className="font-mono text-xs text-muted-foreground">
                {filtered.length.toLocaleString()} result{filtered.length === 1 ? "" : "s"}
              </p>
            </div>

            {filtered.length === 0 ? (
              <p className="py-20 text-center text-sm text-muted-foreground">
                No workflows match “{query}”. Try a service name like gmail, slack or stripe.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((w) => (
                  <WorkflowCard key={w.id + w.file} w={w} />
                ))}
              </div>
            )}

            {visible < filtered.length && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
                >
                  Load more ({(filtered.length - visible).toLocaleString()} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-xs text-muted-foreground sm:flex-row">
          <p className="font-mono">AI Workflow Hub — free for personal & commercial use</p>
          <p>Import via your n8n dashboard: Ctrl/Cmd + I → paste JSON</p>
        </div>
      </footer>
    </div>
  );
}

function Chip({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " +
        (active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-ring hover:text-foreground")
      }
    >
      {children}
      <span className={active ? "font-mono opacity-80" : "font-mono opacity-60"}>{count}</span>
    </button>
  );
}

function WorkflowCard({ w }: { w: WorkflowMeta }) {
  return (
    <Link
      to="/workflows/$id"
      params={{ id: w.id }}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug tracking-tight group-hover:text-primary">
          {w.name}
        </h3>
        {w.ai && (
          <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-accent-foreground">
            AI
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 pt-1 font-mono text-[11px] text-muted-foreground">
        <span className="rounded-md bg-muted px-1.5 py-0.5">{w.nodes} nodes</span>
        {w.triggers.slice(0, 2).map((t) => (
          <span key={t} className="rounded-md bg-muted px-1.5 py-0.5">
            {t}
          </span>
        ))}
      </div>
      <p className="mt-auto pt-4 font-mono text-[11px] text-primary opacity-0 transition-opacity group-hover:opacity-100">
        View & copy JSON →
      </p>
    </Link>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-xl bg-card" />
      ))}
    </div>
  );
}
