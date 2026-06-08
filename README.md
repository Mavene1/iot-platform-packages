# IoT Platform Packages

A pnpm monorepo containing shared logic packages for the IoT Unified Platform child apps.

## Philosophy: Logic Only

These packages provide **shared logic and types** — no UI components. UI chrome (AppNavbar, AppDrawer, AppFooter, CommandPalette) lives as locally-owned source files in each child app, copied from the sim-platform reference implementation.

This is the correct architecture for Tailwind CSS v4 micro-frontends: Tailwind generates CSS by scanning project files, and `node_modules` is gitignored. UI components in published packages would not be scanned, causing missing styles. See `../iot-unified-platform/docs/npm-packages.md` for the full architectural rationale.

## Active Packages

### `@iot-platform-saf/shared-types`

Pure TypeScript types shared across all apps. Zero runtime, zero dependencies.

```ts
import type { User, Account, UserRole, AppId } from "@iot-platform-saf/shared-types";
```

### `@iot-platform-saf/auth-client`

Auth logic for child apps: session verification, React AuthProvider, and client hooks.

**Client (React components):**
```ts
import { createAuthClient } from "@iot-platform-saf/auth-client";

export const { AuthProvider, useAuth, useAuthStore } = createAuthClient({
  sessionUrl: "/my-app/api/auth/session",
  logoutUrl: "/api/auth/logout",
});
```

**Server (API routes, Server Components):**
```ts
import { verifySessionToken, getSessionCookieName } from "@iot-platform-saf/auth-client/server";
```

## Retired Package

### ~~`@iot-platform-saf/ui-shell`~~ (retired at v0.2.0)

This package shipped AppNavbar, AppDrawer, AppFooter, and CommandPalette as an npm package. It was retired because:

1. **Tailwind v4 scanning**: Each child app has its own build pipeline. `node_modules` is gitignored and never scanned by Tailwind — utility classes inside a published package are never generated in the consuming app's CSS output.
2. **MUI vs Tailwind**: CSS-in-JS libraries (MUI, Emotion) inject styles at runtime and work correctly in published packages. Utility-first CSS (Tailwind v4) does not — it requires build-time file scanning.
3. **Flexibility**: Child app teams need to own their chrome to customise service-specific colours, sidebar structure, and layout.

**Replacement pattern:** Copy `components/layout/` from sim-platform into your child app. Tailwind scans the copied files natively. Changes to platform chrome are communicated as sim-platform diffs and applied manually. See `../iot-unified-platform/docs/shared-code-protocol.md`.

## Workspace Setup

This repository uses `pnpm` and requires Node 20+.

```bash
pnpm install       # install all dependencies
pnpm build         # build all packages
pnpm dev           # watch all packages
pnpm type-check    # type-check all packages
```

## Release

```bash
pnpm version       # bump versions via Changesets
pnpm release       # publish to registry
```

## Notes

- Root is `private: true`; individual packages publish with `publishConfig.access: public`
- `@iot-platform-saf/shared-types` is a dependency of `auth-client`
- Registry: JFrog Artifactory (`@iot-platform-saf` scope)
