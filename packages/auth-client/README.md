# @iot-platform-saf/auth-client

Auth utilities for the Safaricom IoT Unified Platform. Provides server-side JWT verification, a client-side `AuthProvider` with session polling and idle timeout, and a route handler factory for the `/api/auth/session` endpoint.

> **Architecture note:** The shell (`iot-unified-platform`) owns authentication — it creates and signs JWTs. Child apps only **verify** tokens. This package never creates a JWT.

---

## Requirements

| Peer dependency | Version |
|---|---|
| `next` | `>= 16` |
| `react` | `>= 19` |
| `zustand` | `>= 5` |
| `react-idle-timer` | `>= 5` |

Install peer dependencies if not already present:

```bash
pnpm add next react react-dom zustand react-idle-timer
```

---

## Installation

```bash
pnpm add @iot-platform-saf/auth-client
```

---

## Environment Variables

Add these to `.env.local` in your app. **Values must match the shell exactly.**

```env
# Secret used to sign and verify JWTs — must match the shell's AUTH_SECRET
AUTH_SECRET=your-secret-here

# Name of the session cookie set by the shell (default: iot-platform-session)
NEXT_PUBLIC_AUTH_COOKIE_NAME=iot-platform-session

# Base URL of the shell app (used for cross-app redirects)
NEXT_PUBLIC_SHELL_URL=http://localhost:3000
```

---

## Step-by-Step Setup

### 1. Configure the auth client

Create `lib/auth-client.ts` — call `createAuthClient()` once with your app's session URL. Export the three items it returns so the rest of the app can import from a single place.

```ts
// lib/auth-client.ts
import { createAuthClient } from "@iot-platform-saf/auth-client";

export const { AuthProvider, useAuth, useAuthStore } = createAuthClient({
  sessionUrl: "/sim-platform/api/auth/session", // your app's basePath + /api/auth/session
  logoutUrl: "/api/auth/logout",                // always the shell's logout route
});
```

### 2. Re-export server utilities

Create `lib/auth.ts` — thin re-export so server code never imports directly from the package path:

```ts
// lib/auth.ts
export {
  verifySessionToken,
  getSessionCookieName,
  getShellLoginUrl,
  createSessionRoute,
} from "@iot-platform-saf/auth-client/server";
```

### 3. Re-export hooks

Create `hooks/use-auth.ts` — lets feature code import from a consistent local path:

```ts
// hooks/use-auth.ts
export { useAuth, useAuthStore } from "@/lib/auth-client";
```

### 4. Create the session route

Create `app/api/auth/session/route.ts` — this is the endpoint `AuthProvider` polls on mount:

```ts
// app/api/auth/session/route.ts
import { createSessionRoute } from "@/lib/auth";

export const GET = createSessionRoute();
```

`createSessionRoute()` reads `AUTH_SECRET` and `NEXT_PUBLIC_AUTH_COOKIE_NAME` at request time, verifies the shell cookie, and returns `{ user }` or `{ user: null }` with status `401`.

### 5. Create the AuthProvider wrapper

Create `providers/auth-provider.tsx` — a thin wrapper that passes your app's expiry dialog into the package's `AuthProvider`:

```tsx
// providers/auth-provider.tsx
"use client";

import { AuthProvider as PkgAuthProvider } from "@/lib/auth-client";
import { SessionExpiryDialog } from "@/components/common/dialogs/session-expiry-dialog";
import type { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <PkgAuthProvider
      renderExpiryWarning={({ secondsRemaining, onStaySignedIn, onSignOut }) => (
        <SessionExpiryDialog
          open
          secondsRemaining={secondsRemaining}
          onStaySignedIn={onStaySignedIn}
          onSignOut={onSignOut}
        />
      )}
    >
      {children}
    </PkgAuthProvider>
  );
}
```

To disable the idle timeout on a specific layout (e.g. a public page):

```tsx
<PkgAuthProvider idleTimeout={false}>{children}</PkgAuthProvider>
```

### 6. Wire up in the app layout

```tsx
// app/(app)/layout.tsx
import { AuthProvider } from "@/providers/auth-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {/* AppNavbar, AppSidebar, main, AppFooter */}
      {children}
    </AuthProvider>
  );
}
```

---

## API Reference

### Client entry point — `@iot-platform-saf/auth-client`

#### `createAuthClient(config?)`

Factory function. Call once per app in `lib/auth-client.ts`.

```ts
const { AuthProvider, useAuth, useAuthStore } = createAuthClient({
  sessionUrl?: string,  // default: "/api/auth/session"
  logoutUrl?: string,   // default: "/api/auth/logout"
});
```

Returns three items scoped to this client instance (not global singletons):

| Export | Type | Description |
|---|---|---|
| `AuthProvider` | React component | Fetches session on mount, polls every 30 min, drives idle timeout |
| `useAuth` | Hook | Returns `{ user, isAuthenticated, setUser, logout }` |
| `useAuthStore` | Zustand store | Direct store access — use for `authLoading` in navbar skeleton |

---

#### `AuthProvider` props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | App content |
| `idleTimeout` | `boolean` | `true` | Set to `false` to disable idle detection on public layouts |
| `renderExpiryWarning` | `(props) => ReactNode` | — | Render the expiry warning UI; receives `secondsRemaining`, `onStaySignedIn`, `onSignOut` |

**What AuthProvider does on mount:**
1. Fetches `sessionUrl` to populate the Zustand store
2. Sets `authLoading: true` while fetching, `false` when done
3. Polls `sessionUrl` every 30 minutes (while a user is logged in) to detect expired 8-hour JWTs
4. Starts the idle timer — calls `onExpire` after 15 minutes of inactivity (warns at 13 minutes)

---

#### `useAuth()`

```ts
const { user, isAuthenticated, setUser, logout } = useAuth();
```

| Return | Type | Description |
|---|---|---|
| `user` | `User \| null` | Current user from the Zustand store |
| `isAuthenticated` | `boolean` | `true` when user is non-null |
| `setUser` | `(user: User \| null) => void` | Update the store (e.g. after a profile edit) |
| `logout` | `() => Promise<void>` | POSTs to `logoutUrl`, clears the store, redirects to `/` |

---

#### `useAuthStore`

Zustand store — use directly only when you need `authLoading` (e.g. the navbar loading skeleton):

```ts
const authLoading = useAuthStore((s) => s.authLoading);
```

| Field | Type | Description |
|---|---|---|
| `user` | `User \| null` | Current user |
| `isAuthenticated` | `boolean` | Derived from user |
| `authLoading` | `boolean` | `true` while the initial session fetch is in flight |
| `setUser` | action | — |
| `clearUser` | action | Resets user + isAuthenticated |
| `setAuthLoading` | action | — |

---

#### `useIdleTimeout(options)`

Used internally by `AuthProvider`. Exposed for advanced use cases.

```ts
const { isWarning, secondsRemaining, extendSession } = useIdleTimeout({
  timeoutMs?: number,        // default: 15 minutes
  warningBeforeMs?: number,  // default: 2 minutes
  enabled?: boolean,         // default: true
  onExpire: () => void,      // called when the idle timer expires
});
```

Cross-tab sync is enabled via `react-idle-timer`'s BroadcastChannel (name: `"iot-platform-idle"`). Activity in any open tab resets every tab's timer.

---

### Server entry point — `@iot-platform-saf/auth-client/server`

Import from the `/server` subpath in Server Components and Route Handlers. Never import this in client components.

#### `verifySessionToken(token)`

```ts
const user: User | null = await verifySessionToken(token);
```

Verifies the `iot-platform-session` JWT using `AUTH_SECRET`. Returns the decoded `User` or `null` for expired, malformed, or unsigned tokens.

#### `getSessionCookieName()`

```ts
const name: string = getSessionCookieName();
// returns process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME ?? "iot-platform-session"
```

#### `getShellLoginUrl(redirectPath?)`

```ts
getShellLoginUrl("/sim-platform/billing");
// returns "/login?redirect=%2Fsim-platform%2Fbilling"

getShellLoginUrl();
// returns "/login"
```

Build a redirect-aware login URL. Use in `middleware.ts` or server error boundaries.

#### `createSessionRoute()`

```ts
// app/api/auth/session/route.ts
import { createSessionRoute } from "@/lib/auth";
export const GET = createSessionRoute();
```

Factory for the GET `/api/auth/session` route handler. Reads `AUTH_SECRET` and `NEXT_PUBLIC_AUTH_COOKIE_NAME` at request time. Returns:
- `200 { user: User }` — valid session
- `401 { user: null }` — missing or invalid cookie

---

## How the Pieces Fit Together

```
shell proxy
  → validates iot-platform-session cookie
  → forwards request to child app

child app (on page load)
  AuthProvider mounts
    → GET /{basePath}/api/auth/session          (sessionUrl)
        ↓
      createSessionRoute() reads cookie
        → verifySessionToken(token)             (AUTH_SECRET)
        → returns { user }
        ↓
      AuthProvider.setUser(user)
      AuthProvider.setAuthLoading(false)
        ↓
      Page renders with real user data

every 30 min (background poll)
  → same flow, detects expired 8-hour JWTs

after 15 min idle
  → renderExpiryWarning fires (2-min countdown)
  → on expire: POST /api/auth/logout → redirect /login
```

---

## TypeScript

All exports are fully typed. Import types directly from the package:

```ts
import type {
  // Platform domain types
  User,
  UserRole,
  Account,
  // Auth types
  AuthClientConfig,
  AuthProviderProps,
  AuthStore,
  ExpiryWarningProps,
  UseIdleTimeoutOptions,
  UseIdleTimeoutResult,
} from "@iot-platform-saf/auth-client";
```

### Platform types

`@iot-platform-saf/auth-client` owns the core user and account types used across the platform. Import them from here whenever you need them in auth-related code; for UI code import from `@iot-platform-saf/ui-shell` instead.

| Type | Description |
|---|---|
| `User` | Authenticated user — `id`, `email`, `name`, `role`, `account`, and optional profile fields |
| `UserRole` | `"admin" \| "editor" \| "viewer"` |
| `Account` | Organisation account — `id`, `name`, `displayName` |
