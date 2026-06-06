import { jwtVerify, type JWTPayload } from "jose";
import type { User, UserRole, Account } from "@iot-platform-saf/shared-types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("[@iot-platform/auth-client] AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

function getCookieName(): string {
  return process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME ?? "iot-platform-session";
}

function payloadToUser(payload: JWTPayload): User {
  return {
    id: payload.sub as string,
    email: payload.email as string,
    name: payload.name as string,
    role: payload.role as UserRole,
    account: payload.account as Account,
    avatarUrl: payload.avatarUrl as string | undefined,
    phoneNumber: payload.phoneNumber as string | undefined,
    loginTime: payload.loginTime as string | undefined,
    emailVerified: payload.emailVerified as boolean | undefined,
  };
}

// ── Exports ───────────────────────────────────────────────────────────────────

/**
 * Verify an iot-platform-session JWT and return the decoded User.
 * Returns null for expired, malformed, or unsigned tokens.
 *
 * The secret is read from AUTH_SECRET at call time — do not cache the result
 * across requests.
 */
export async function verifySessionToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payloadToUser(payload);
  } catch {
    return null;
  }
}

/** Returns the session cookie name configured via NEXT_PUBLIC_AUTH_COOKIE_NAME. */
export function getSessionCookieName(): string {
  return getCookieName();
}

/**
 * Build the shell login URL, optionally preserving the current path as the
 * post-login redirect destination.
 *
 * @example
 * redirect(getShellLoginUrl(request.nextUrl.pathname));
 */
export function getShellLoginUrl(redirectPath?: string): string {
  if (!redirectPath) return "/login";
  return `/login?redirect=${encodeURIComponent(redirectPath)}`;
}

/**
 * Factory for the GET /api/auth/session route handler.
 * Drop this into app/api/auth/session/route.ts — no other configuration needed.
 *
 * Reads AUTH_SECRET and NEXT_PUBLIC_AUTH_COOKIE_NAME from environment at
 * request time. Both vars must be set in the consuming app's .env.
 *
 * @example
 * // app/api/auth/session/route.ts
 * import { createSessionRoute } from "@iot-platform/auth-client/server";
 * export const GET = createSessionRoute();
 */
export function createSessionRoute() {
  return async function GET() {
    // Imported inline so the factory itself can be used outside Next.js without
    // the module-level import pulling in next/headers at require time.
    const { NextResponse } = await import("next/server");
    const { cookies } = await import("next/headers");

    const cookieStore = await cookies();
    const token = cookieStore.get(getCookieName())?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await verifySessionToken(token);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  };
}
