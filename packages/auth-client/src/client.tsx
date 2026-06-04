import React, { useCallback, useEffect } from "react";
import { create } from "zustand";
import { useIdleTimeout } from "./idle";
import type {
  AuthClientConfig,
  AuthProviderProps,
  AuthStore,
} from "./types";

const SESSION_POLL_MS = 30 * 60 * 1000;

/**
 * Creates a scoped auth client — a Zustand store instance paired with the
 * React components and hooks that read from it.
 *
 * Call once per app (e.g. in lib/auth-client.ts) and export the results.
 *
 * @example
 * // lib/auth-client.ts
 * import { createAuthClient } from "@iot-platform/auth-client";
 * export const { AuthProvider, useAuth } = createAuthClient({
 *   sessionUrl: "/sim-platform/api/auth/session",
 * });
 */
export function createAuthClient(config: AuthClientConfig = {}) {
  const {
    sessionUrl = "/api/auth/session",
    logoutUrl = "/api/auth/logout",
  } = config;

  // One Zustand store per client instance — not a global singleton.
  const useAuthStore = create<AuthStore>()((set) => ({
    user: null,
    isAuthenticated: false,
    authLoading: true,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    clearUser: () => set({ user: null, isAuthenticated: false }),
    setAuthLoading: (loading) => set({ authLoading: loading }),
  }));

  // ── AuthProvider ───────────────────────────────────────────────────────────

  function AuthProvider({
    children,
    idleTimeout = true,
    renderExpiryWarning,
  }: AuthProviderProps) {
    const { user, setUser, clearUser, setAuthLoading } = useAuthStore();

    // Initial session load on mount
    useEffect(() => {
      let cancelled = false;
      async function load() {
        setAuthLoading(true);
        try {
          const res = await fetch(sessionUrl);
          if (cancelled) return;
          if (res.ok) {
            const data = (await res.json()) as { user: AuthStore["user"] };
            if (data.user) setUser(data.user);
          } else if (res.status === 401) {
            clearUser();
          }
        } catch {
          // network error — leave state unchanged
        } finally {
          if (!cancelled) setAuthLoading(false);
        }
      }
      load();
      return () => { cancelled = true; };
    }, [setUser, clearUser, setAuthLoading]);

    // Background poll every 30 minutes to keep the store in sync with the cookie
    useEffect(() => {
      if (!user) return;
      const id = setInterval(async () => {
        try {
          const res = await fetch(sessionUrl);
          if (res.ok) {
            const data = (await res.json()) as { user: AuthStore["user"] };
            if (data.user) setUser(data.user);
          } else if (res.status === 401) {
            clearUser();
          }
        } catch {
          // network error — leave state unchanged until next poll
        }
      }, SESSION_POLL_MS);
      return () => clearInterval(id);
    }, [user, setUser, clearUser]);

    // On expiry: clear the shell session then redirect to /login so SSO can
    // silently re-authenticate. Uses /login (not "/") so useAuthRedirect fires.
    const handleExpire = useCallback(async () => {
      try {
        await fetch(logoutUrl, { method: "POST" });
      } catch {
        // proceed even if the request fails
      }
      const dest = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/login?redirect=${dest}`;
    }, []);

    const { isWarning, secondsRemaining, extendSession } = useIdleTimeout({
      enabled: !!user && idleTimeout,
      onExpire: handleExpire,
    });

    return (
      <>
        {children}
        {renderExpiryWarning &&
          isWarning &&
          renderExpiryWarning({
            secondsRemaining,
            onStaySignedIn: extendSession,
            onSignOut: handleExpire,
          })}
      </>
    );
  }

  // ── useAuth ────────────────────────────────────────────────────────────────

  function useAuth() {
    const { user, isAuthenticated, setUser, clearUser } = useAuthStore();

    const logout = useCallback(async () => {
      try {
        await fetch(logoutUrl, { method: "POST" });
      } catch {
        // proceed even if the request fails
      }
      clearUser();
      // Hard reload to marketing home — avoids /login (auto-triggers SSO) and
      // /dashboard (user would appear still signed in).
      window.location.href = "/";
    }, [clearUser]);

    return { user, isAuthenticated, setUser, logout };
  }

  return { AuthProvider, useAuth, useAuthStore };
}
