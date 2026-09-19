import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "node:crypto";

type PortalSession = { unlocked?: boolean; email?: string };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "donkm-portal",
    maxAge: 60 * 60 * 24 * 7,
    // Preview renders inside a cross-site iframe, so the session cookie needs
    // SameSite=None; Secure to be sent at all (localhost counts as secure).
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const,
      path: "/",
    },


  };
}

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export const signIn = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const email = process.env["PORTAL_EMAIL"];
    const password = process.env["PORTAL_PASSWORD"];
    if (!email || !password) throw new Error("Portal credentials are not configured");

    const ok =
      matches(data.email.trim().toLowerCase(), email.trim().toLowerCase()) &&
      matches(data.password, password);
    if (!ok) return { ok: false as const };

    const session = await useSession<PortalSession>(sessionConfig());
    await session.update({ unlocked: true, email: email.trim().toLowerCase() });
    return { ok: true as const };
  });

export const signOut = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<PortalSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const getSessionState = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<PortalSession>(sessionConfig());
  return {
    unlocked: session.data.unlocked === true,
    email: session.data.email ?? null,
  };
});

// Plain helper (not a server fn): a redirect thrown across the RPC boundary
// surfaces as "Error: [object Response]". Throw it locally in beforeLoad instead.
export async function requirePortalAccess() {
  const state = await getSessionState();
  if (!state.unlocked) throw redirect({ to: "/login" });
  return { email: state.email };
}

