import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/guide")({
  component: GuidePage,
  head: () => ({
    meta: [
      { title: "How to Use — AI Workflow Hub" },
      {
        name: "description",
        content:
          "Step-by-step guide: copy a workflow JSON, import it into your n8n dashboard, set up credentials and activate your automation.",
      },
      { property: "og:title", content: "How to Use — AI Workflow Hub" },
      {
        property: "og:description",
        content:
          "Step-by-step guide: copy a workflow JSON, import it into your n8n dashboard, set up credentials and activate your automation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function GuidePage() {
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
            <Link to="/" className="transition-colors hover:text-foreground">
              All workflows
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

      <main className="mx-auto max-w-3xl px-6 py-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Guide</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          How to use the workflows
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          AI Workflow Hub is a collection of free n8n AI automation workflows designed to help
          developers, businesses and automation enthusiasts leverage the power of AI. Every
          workflow is ready to import into your self-hosted n8n instance.
        </p>

        <Section title="Step by step">
          <ol className="grid gap-4">
            {[
              {
                t: "Copy the workflow JSON",
                d: "Open any workflow on this site and click the “Copy JSON” button — the complete configuration is copied to your clipboard.",
              },
              {
                t: "Import into n8n",
                d: "Open your n8n dashboard, click “Import” in the top navigation (or press Ctrl/Cmd + I) to open the import dialog.",
              },
              {
                t: "Paste and import",
                d: "Paste the copied JSON into the import dialog and confirm. The workflow appears in your workflows list.",
              },
              {
                t: "Configure credentials",
                d: "Open the imported workflow and configure any required credentials — API keys, service accounts, webhook URLs or trigger settings.",
              },
              {
                t: "Activate and run",
                d: "Click “Activate” to enable the workflow. It now responds to triggers automatically — monitor runs in the execution history.",
              },
            ].map((s, i) => (
              <li key={i} className="flex gap-4 rounded-xl border border-border bg-card p-5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-xs text-foreground">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{s.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Setting up credentials">
          <div className="grid gap-3">
            <Cred
              name="Google Gemini"
              steps={[
                "Visit Google AI Studio (makersuite.google.com/app/apikey).",
                "Create a new API key.",
                "Add it in n8n as “Google Gemini API” credentials.",
              ]}
            />
            <Cred
              name="OpenAI"
              steps={[
                "Visit platform.openai.com/api-keys.",
                "Generate a new API key.",
                "Add it in n8n as “OpenAI API” credentials.",
              ]}
            />
            <Cred
              name="LangChain"
              steps={[
                "Install LangChain in your n8n instance.",
                "Configure model endpoints.",
                "Add API keys as environment variables.",
              ]}
            />
          </div>
        </Section>

        <Section title="What's in the library">
          <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              "AI & machine learning — content generation, data analysis, language processing, predictive analytics",
              "Data processing — ETL, validation, file processing, database operations",
              "Web automation — scraping, forms, social media, e-commerce",
              "Communication — email, Slack, SMS & WhatsApp, CRM",
              "Business process — invoicing, HR, project management, support",
              "Complexity levels: simple, medium and complex — with manual, webhook, schedule and event triggers",
            ].map((c, i) => (
              <li key={i} className="rounded-lg border border-border bg-card px-4 py-3">
                {c}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Troubleshooting">
          <div className="grid gap-3">
            <Cred
              name="Workflow won't import"
              steps={[
                "Check the JSON is valid.",
                "Ensure n8n version compatibility.",
                "Verify all required nodes are available.",
              ]}
            />
            <Cred
              name="Credentials not working"
              steps={[
                "Verify API keys are correct.",
                "Check service account permissions.",
                "Ensure proper credential naming in n8n.",
              ]}
            />
            <Cred
              name="Execution fails"
              steps={[
                "Review execution logs for errors.",
                "Check API rate limits.",
                "Verify service availability.",
              ]}
            />
          </div>
        </Section>

        <Section title="Download everything">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold">Full collection as one archive</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Prefer to grab everything at once? Download the complete library — all workflows as
              individual JSON files, exactly as distributed.
            </p>
            <a
              href="/AI-Workflow-Hub-2000.zip"
              download
              className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Download full collection (.zip) ⤓
            </a>
          </div>
        </Section>

        <Section title="Resources">
          <ul className="grid gap-2 text-sm">
            {[
              { l: "n8n Documentation", h: "https://docs.n8n.io/" },
              { l: "n8n Community forums", h: "https://community.n8n.io/" },
              { l: "What is n8n?", h: "https://n8n.io/" },
            ].map((r) => (
              <li key={r.h}>
                <a
                  href={r.h}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  {r.l} →
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </main>

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Cred({ name, steps }: { name: string; steps: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold">{name}</h3>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
    </div>
  );
}
