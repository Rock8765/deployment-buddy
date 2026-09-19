import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { signIn } from "@/lib/auth.functions";
import logo from "@/assets/donkm-logo.jpg.asset.json";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Client Sign In — Donkm Tech Private Limited" },
      {
        name: "description",
        content:
          "Sign in to the Donkm Tech client portal for B2B n8n workflow JSON API access and the automation blueprint library.",
      },
      { property: "og:title", content: "Client Sign In — Donkm Tech Private Limited" },
      {
        property: "og:description",
        content: "Secure client access to the Donkm Tech B2B n8n workflow JSON library.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function LoginPage() {
  const router = useRouter();
  const login = useServerFn(signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await login({ data: { email, password } });
      if (res.ok) {
        await router.navigate({ to: "/" });
      } else {
        setError("Incorrect email or password.");
      }
    } catch {
      setError("Sign in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <img
            src={logo.url}
            alt="Donkm.Tech"
            className="size-20 rounded-2xl border border-border object-cover shadow-sm"
          />
          <h1 className="mt-5 text-2xl font-bold tracking-tight">Donkm Tech Private Limited</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            B2B API · JSON workflow blueprints built on n8n
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl border border-border bg-card p-7 shadow-sm"
        >
          <h2 className="text-base font-semibold">Client sign in</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Access is limited to authorised Donkm Tech accounts.
          </p>

          <label className="mt-6 block">
            <span className="mb-1.5 block text-sm font-medium text-muted-foreground">Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-medium text-muted-foreground">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring"
            />
          </label>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Donkm Tech Private Limited
        </p>
      </div>
    </div>
  );
}
