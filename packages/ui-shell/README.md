# @iot-platform-saf/ui-shell

Shared chrome components for the Safaricom IoT Unified Platform. Provides `AppNavbar`, `AppSidebar`, `AppDrawer`, `AppFooter`, and `CommandPalette` — the full layout shell — along with platform-wide types and nav config.

---

## Requirements

| Peer dependency | Version |
|---|---|
| `next` | `>= 16` |
| `react` | `>= 19` |
| `radix-ui` | `>= 1.5` |
| `class-variance-authority` | `>= 0.7` |
| `cmdk` | `>= 1.0` |
| `lucide-react` | `>= 1.0` |

Install peer dependencies if not already present:

```bash
pnpm add next react react-dom radix-ui class-variance-authority cmdk lucide-react
```

---

## Installation

```bash
pnpm add @iot-platform-saf/ui-shell
```

---

## Step-by-Step Setup

### 1. Import design tokens

The shell components depend on CSS custom properties defined in `@iot-platform-saf/design-tokens`. Import that package's CSS file at the top of your app's global stylesheet **before** any Tailwind layers:

```css
/* app/globals.css */
@import "@iot-platform-saf/design-tokens";

@import "tailwindcss";
/* rest of your global styles */
```

See the [design-tokens README](../design-tokens/README.md) for full details.

### 2. Re-export layout components

Create thin wrappers in your app's `components/layout/` folder. This decouples feature code from the package path and gives you a place to apply app-specific defaults.

```tsx
// components/layout/app-footer.tsx
export { AppFooter } from "@iot-platform-saf/ui-shell";
```

```tsx
// components/layout/app-drawer.tsx
export { AppDrawer } from "@iot-platform-saf/ui-shell";
```

```tsx
// components/layout/command-palette.tsx
export { CommandPalette } from "@iot-platform-saf/ui-shell";
```

### 3. Create the AppNavbar wrapper

`AppNavbar` needs `user`, `authLoading`, and `onLogout` — wire those in from your auth client:

```tsx
// components/layout/app-navbar.tsx
"use client";

import { AppNavbar as PkgAppNavbar } from "@iot-platform-saf/ui-shell";
import { useAuth, useAuthStore } from "@/lib/auth-client";

export function AppNavbar() {
  const { user, logout } = useAuth();
  const authLoading = useAuthStore((s) => s.authLoading);

  return (
    <PkgAppNavbar
      logoSrc="/your-app/images/saf-logo.png"
      user={user}
      authLoading={authLoading}
      onLogout={logout}
    />
  );
}
```

### 4. Create the AppSidebar wrapper

`AppSidebar` requires `navSections`, `navBottom`, `serviceIcon`, and `serviceName`. Define your app's nav structure once and pass it in:

```tsx
// components/layout/app-sidebar.tsx
"use client";

import { AppSidebar as PkgAppSidebar } from "@iot-platform-saf/ui-shell";
import type { NavSection, NavItem } from "@iot-platform-saf/ui-shell";

const navSections: NavSection[] = [
  {
    heading: "Overview",
    items: [
      { label: "Dashboard", href: "/your-app/dashboard", icon: "LayoutDashboard" },
      { label: "Assets",    href: "/your-app/assets",    icon: "Package" },
    ],
  },
  {
    heading: "Management",
    items: [
      { label: "Settings", href: "/your-app/settings", icon: "Settings" },
    ],
  },
];

const navBottom: NavItem[] = [
  { label: "Help", href: "/your-app/help", icon: "HelpCircle" },
];

export function AppSidebar() {
  return (
    <PkgAppSidebar
      navSections={navSections}
      navBottom={navBottom}
      serviceIcon="Package"
      serviceName="AssetHub"
      serviceSubtitle="Asset Management"
    />
  );
}
```

`serviceIcon` accepts any [Lucide](https://lucide.dev/icons/) icon name.

### 5. Wire everything into the app layout

```tsx
// app/(app)/layout.tsx
import { AppNavbar }      from "@/components/layout/app-navbar";
import { AppSidebar }     from "@/components/layout/app-sidebar";
import { AppFooter }      from "@/components/layout/app-footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNavbar />
      <AppSidebar />
      <main className="pl-[var(--sidebar-width)] pt-[var(--navbar-height)] pb-[var(--footer-height)]">
        {children}
      </main>
      <AppFooter />
    </>
  );
}
```

The layout tokens (`--navbar-height`, `--sidebar-width`, `--footer-height`) come from `@iot-platform-saf/design-tokens`.

---

## API Reference

### Components

#### `AppNavbar`

Top navigation bar with logo, app drawer trigger, command palette trigger, notification badge, and user dropdown.

| Prop | Type | Default | Description |
|---|---|---|---|
| `logoSrc` | `string` | — | Absolute path to the logo image (e.g. `"/assethub/images/saf-logo.png"`) |
| `logoWidth` | `number` | `120` | Logo width in px |
| `logoHeight` | `number` | `26` | Logo height in px |
| `logoAlt` | `string` | `"Safaricom Logo"` | Logo alt text |
| `user` | `AppNavbarUser \| null` | `undefined` | Current user — `{ name, email, account: { displayName } }` |
| `authLoading` | `boolean` | `false` | Shows a skeleton while the session is resolving |
| `onLogout` | `() => void` | `undefined` | Called when the user clicks Sign Out |
| `notificationCount` | `number` | `0` | Badge count on the notifications icon |

`AppNavbar` internally renders `AppDrawer` and `CommandPalette` — you do **not** need to mount those separately.

---

#### `AppSidebar`

Collapsible icon-rail sidebar. Persists collapsed state to `localStorage`.

| Prop | Type | Description |
|---|---|---|
| `navSections` | `NavSection[]` | Grouped nav items rendered in the main area |
| `navBottom` | `NavItem[]` | Items pinned to the bottom of the rail |
| `serviceIcon` | `string` | Lucide icon name shown as the service badge |
| `serviceName` | `string` | Service display name (shown expanded) |
| `serviceSubtitle` | `string` | Optional subtitle below the service name |

---

#### `AppDrawer`

Full-screen service navigation drawer. Renders `drawerCategories` and `drawerPlatformNavItems` from the built-in nav config. No props required.

```tsx
import { AppDrawer } from "@iot-platform-saf/ui-shell";
// <AppDrawer /> — already mounted inside AppNavbar; only use standalone if building a custom navbar
```

---

#### `AppFooter`

Fixed bottom bar showing platform SLA, region, and policy links. No props.

---

#### `CommandPalette`

`⌘K` / `Ctrl+K` command palette. Searches all services from `drawerCategories`.

| Prop | Type | Description |
|---|---|---|
| `open` | `boolean` | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | Open state setter |

Already mounted and wired inside `AppNavbar`. Only use standalone if building a custom navbar.

---

### Hooks

#### `useAppDrawer(onOpenChange)`

Drives `AppDrawer` — filters categories and items by search query, handles flyout positioning. Used internally; exposed for custom drawer implementations.

#### `useCommandPalette(onOpenChange)`

Registers the `⌘K` / `Ctrl+K` keyboard shortcut. Used internally by `CommandPalette`.

---

### Nav config

The platform-wide drawer navigation is the source of truth for service links across all apps. Import these instead of duplicating the list in each app.

```ts
import {
  drawerCategories,        // DrawerCategory[] — Connectivity, Utilities, Infrastructure
  drawerPlatformNavItems,  // DrawerManagementItem[] — Dashboard, Service Catalog
} from "@iot-platform-saf/ui-shell";
```

Do **not** edit these values in your app. Update them in [packages/ui-shell/src/config/nav.ts](src/config/nav.ts) and publish a new version.

---

### Platform types

All shared platform types are exported from this package. Use them in UI components, stores, and feature code.

```ts
import type {
  // User & auth
  User,
  UserRole,
  Account,
  // Platform
  AppId,
  ServiceStatus,
  // API
  ApiResponse,
  ApiError,
  // UI shell
  NavItem,
  NavSection,
  AppNavbarUser,
  // Nav config
  NavLinkType,
  DrawerServiceItem,
  DrawerCategory,
  DrawerManagementItem,
} from "@iot-platform-saf/ui-shell";
```

| Type | Description |
|---|---|
| `User` | Authenticated user — `id`, `email`, `name`, `role`, `account` |
| `UserRole` | `"admin" \| "editor" \| "viewer"` |
| `Account` | Organisation — `id`, `name`, `displayName` |
| `AppId` | Union of all platform app slugs |
| `ServiceStatus` | `"active" \| "coming-soon" \| "beta" \| "maintenance"` |
| `ApiResponse<T>` | `{ data: T; success: boolean; message?: string }` |
| `ApiError` | `{ code: string; message: string; status: number }` |
| `NavItem` | Sidebar nav item — `{ label, href, icon }` |
| `NavSection` | Grouped sidebar items — `{ heading, items: NavItem[] }` |
| `AppNavbarUser` | Minimal user shape for `AppNavbar` |
| `NavLinkType` | `"in-app" \| "cross-zone"` — drives `<Link>` vs `<a>` |
| `DrawerServiceItem` | Service card in the drawer |
| `DrawerCategory` | Group of `DrawerServiceItem`s |
| `DrawerManagementItem` | Management link in the drawer bottom bar |

---

### Utilities

`cn` and `DynamicIcon` are exported so consuming apps don't need a separate install:

```ts
import { cn }                         from "@iot-platform-saf/ui-shell";
import { DynamicIcon, getIcon }       from "@iot-platform-saf/ui-shell";
import type { DynamicIconProps }      from "@iot-platform-saf/ui-shell";
```

#### `cn(...inputs)`

Merges Tailwind classes with `clsx` + `tailwind-merge`. Identical to the shadcn/ui `cn` helper.

#### `DynamicIcon`

Renders any Lucide icon by string name. Used internally by all shell components.

```tsx
<DynamicIcon name="Package" className="h-4 w-4 text-primary" />
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — | Lucide icon name (PascalCase) |
| `size` | `number` | `16` | Icon size in px |
| `className` | `string` | — | Additional classes |

#### `getIcon(name)`

Returns the Lucide icon component for a given name. Returns `null` if not found.

```ts
const Icon = getIcon("Package"); // LucideIcon | null
```
