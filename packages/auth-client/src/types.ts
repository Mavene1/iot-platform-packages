import type { ReactNode } from "react";
import type { User } from "@mavene/shared-types";

// ── Store ─────────────────────────────────────────────────────────────────────

export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  /** True while AuthProvider is resolving the initial session fetch — prevents flicker */
  authLoading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setAuthLoading: (loading: boolean) => void;
}

// ── Config ────────────────────────────────────────────────────────────────────

export interface AuthClientConfig {
  /**
   * URL of the GET session endpoint.
   * Shell: "/api/auth/session"
   * Child app: "/{basePath}/api/auth/session"  (e.g. "/sim-platform/api/auth/session")
   * @default "/api/auth/session"
   */
  sessionUrl?: string;
  /**
   * URL of the POST logout endpoint — always the shell's route.
   * @default "/api/auth/logout"
   */
  logoutUrl?: string;
}

// ── Components ────────────────────────────────────────────────────────────────

export interface ExpiryWarningProps {
  secondsRemaining: number;
  onStaySignedIn: () => void;
  onSignOut: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
  /** Set to false on public layouts where idle detection is unwanted. @default true */
  idleTimeout?: boolean;
  /**
   * Render the expiry warning UI when the idle countdown begins.
   * The component is responsible for its own open/close — it is mounted whenever
   * the warning is active and unmounted when the session is extended or expired.
   *
   * @example
   * renderExpiryWarning={({ secondsRemaining, onStaySignedIn, onSignOut }) => (
   *   <SessionExpiryDialog
   *     open
   *     secondsRemaining={secondsRemaining}
   *     onStaySignedIn={onStaySignedIn}
   *     onSignOut={onSignOut}
   *   />
   * )}
   */
  renderExpiryWarning?: (props: ExpiryWarningProps) => ReactNode;
}

// ── Idle ──────────────────────────────────────────────────────────────────────

export interface UseIdleTimeoutOptions {
  timeoutMs?: number;
  warningBeforeMs?: number;
  enabled?: boolean;
  onExpire: () => void;
}

export interface UseIdleTimeoutResult {
  isWarning: boolean;
  secondsRemaining: number;
  extendSession: () => void;
}
