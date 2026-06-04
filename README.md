# IoT Platform Packages

A pnpm monorepo containing reusable frontend and shared packages for the IoT Unified Platform.

## Packages

- `@iot-platform/auth-client`
  - Auth utilities for the IoT platform
  - Includes server-side JWT verification, client `AuthProvider`, and route handler factory
- `@iot-platform/shared-types`
  - Shared TypeScript types used across packages
- `@iot-platform/ui-shell`
  - Shared UI shell components for the IoT platform
  - Includes `AppNavbar`, `AppDrawer`, `AppFooter`, `CommandPalette`, and shell utilities

## Workspace setup

This repository uses `pnpm` and requires Node 20+.

### Install dependencies

```bash
pnpm install
```

### Local development

Run all package dev scripts in parallel:

```bash
pnpm dev
```

### Build

Build all packages:

```bash
pnpm build
```

### Type-check

Run type checking for all packages:

```bash
pnpm type-check
```

### Release

This repository uses Changesets for version management and publishing.

```bash
pnpm version
pnpm release
```

## Package development

Each package defines its own build, dev, and type-check scripts in `packages/*/package.json`.

- `packages/auth-client`
- `packages/shared-types`
- `packages/ui-shell`

## Notes

- The repository is private at the root level (`private: true`).
- Packages are configured for public publishing with `publishConfig.access: public`.
- `@iot-platform/shared-types` is a dependency of both `auth-client` and `ui-shell`.
