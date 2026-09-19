import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { buildDetail, fetchIndex, fetchWorkflowFile, shortNodeType } from "@/lib/workflows";

export const Route = createFileRoute("/workflows/$id")({
  component: WorkflowDetailPage,
  head: () => ({
    meta: [
      { title: "Workflow — AI Workflow Hub" },
      {
        name: "description",
        content: "View and copy this ready-to-import n8n workflow JSON from AI Workflow Hub.",
      },
      { property: "og:title", content: "Workflow — AI Workflow Hub" },
      {
        property: "og:description",
        content: "View and copy this ready-to-import n8n workflow JSON from AI Workflow Hub.",
      },
    ],
  }),
});

function WorkflowDetailPage() {
  const { id } = Route.useParams();

  const indexQuery = useQuery({
    queryKey: ["workflow-index"],
    queryFn: fetchIndex,
    staleTime: Infinity,
  });

  const meta = indexQuery.data?.items.find((w) => w.id === id);

  const fileQuery = useQuery({
    queryKey: ["workflow-file", meta?.file],
    queryFn: () => fetchWorkflowFile(meta!.file),
    enabled: !!meta,
    staleTime: Infinity,
  });

  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const detail = meta && fileQuery.data ? buildDetail(meta, fileQuery.data) : null;

  const copyJson = async () => {
    if (!meta) return;
    try {
      const raw = await fetchWorkflowFile(meta.file);
      await navigator.clipboard.writeText(JSON.stringify(raw, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  if (indexQuery.isLoading) {
    return (
      <Shell>
        <div className="h-40 animate-pulse rounded-xl bg-card" />
      </Shell>
    );
  }

  if (!meta) {
    return (
      <Shell>
        <div className="py-20 text-center">
          <h1 className="text-xl font-semibold">Workflow not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This workflow may have been removed from the library.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            ← Back to all workflows
          </Link>
        </div>
      </Shell>
    );
  }

  const catLabel = indexQuery.data?.categories.find((c) => c.id === meta.cat)?.label;

  return (
    <Shell>
      <Link
        to="/"
        className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        ← All workflows
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            {catLabel && (
              <span className="rounded-full border border-border bg-card px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                {catLabel}
              </span>
            )}
            {meta.ai && (
              <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider text-accent-foreground">
                AI-powered
              </span>
            )}
          </div>
          <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {meta.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <span className="rounded-md bg-muted px-1.5 py-0.5">{meta.nodes} nodes</span>
            {meta.triggers.map((t) => (
              <span key={t} className="rounded-md bg-muted px-1.5 py-0.5">
                trigger: {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={copyJson}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {copied ? "✓ Copied to clipboard" : "Copy JSON"}
          </button>
          <a
            href={`/workflows/${meta.file}`}
            download={meta.file}
            className="rounded-lg border border-border bg-card px-6 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Download .json
          </a>
        </div>
      </div>

      {/* Import steps */}
      <section className="mt-10 rounded-xl border border-border bg-card p-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          How to import into n8n
        </h2>
        <ol className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          {[
            "Click “Copy JSON” above.",
            "Open your n8n dashboard and press Ctrl/Cmd + I (or Import from clipboard).",
            "Paste the workflow JSON and confirm the import.",
            "Configure credentials, then activate the workflow.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-[11px] text-foreground">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Raw JSON viewer */}
      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Workflow JSON
          </h2>
          {fileQuery.data && (
            <button
              onClick={() => setShowJson((s) => !s)}
              className="font-mono text-[11px] text-primary hover:underline"
            >
              {showJson ? "Hide JSON ↑" : "Show full JSON ↓"}
            </button>
          )}
        </div>
        {fileQuery.isLoading && (
          <div className="mt-4 h-24 animate-pulse rounded-xl bg-card" />
        )}
        {fileQuery.data && showJson && (
          <pre className="mt-3 max-h-[600px] overflow-auto rounded-xl border border-border bg-card p-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {JSON.stringify(fileQuery.data, null, 2)}
          </pre>
        )}
        {fileQuery.data && !showJson && (
          <p className="mt-3 rounded-xl border border-border bg-card px-4 py-3 font-mono text-[11px] text-muted-foreground">
            The complete workflow JSON — exactly as distributed — is ready to copy or download
            above.
          </p>
        )}
      </section>

      {/* Nodes */}
      <section className="mt-8 pb-16">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Nodes in this workflow
        </h2>
        {fileQuery.isLoading && (
          <div className="mt-4 h-24 animate-pulse rounded-xl bg-card" />
        )}
        {detail && (
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {detail.nodesList.map((n, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-2.5"
              >
                <span className="truncate text-sm">{n.name}</span>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                  {shortNodeType(n.type)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-medium text-primary-foreground">
              n8
            </span>
            <span className="text-sm font-semibold tracking-tight">AI Workflow Hub</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-muted-foreground">
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
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-5xl px-6">
          <p className="font-mono text-xs text-muted-foreground">
            AI Workflow Hub — free for personal & commercial use
          </p>
        </div>
      </footer>
    </div>
  );
}
