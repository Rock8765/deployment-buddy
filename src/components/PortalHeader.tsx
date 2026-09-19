import { Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import logo from "@/assets/donkm-logo.jpg.asset.json";

export function PortalHeader() {
  const router = useRouter();
  const logout = useServerFn(signOutFn);

  async function handleSignOut() {
    await logout({});
    await router.navigate({ to: "/login", replace: true });
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo.url}
            alt="Donkm.Tech"
            className="size-10 rounded-xl border border-border object-cover"
          />
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight">
              Donkm Tech Private Limited
            </span>
            <span className="block text-[11px] text-muted-foreground">
              B2B API · JSON workflows on n8n
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            to="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Library
          </Link>
          <Link
            to="/guide"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Documentation
          </Link>
          <button
            onClick={handleSignOut}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-ring hover:text-primary"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}

import { signOut as signOutFn } from "@/lib/auth.functions";
