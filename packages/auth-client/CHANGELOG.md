# @iot-platform/auth-client

## 1.1.0

### Minor Changes

- Add README documentation for all packages.

  - `auth-client`: document new `User`, `UserRole`, `Account` type exports in TypeScript section
  - `ui-shell`: full setup guide covering peer deps, design tokens import, component wrappers, layout wiring, and complete API reference for all components, hooks, types, and utilities
  - `design-tokens`: setup guide and complete token reference tables for layout, brand colours, semantic surfaces, text, borders, chart palette, and callouts

## 1.0.0

### Major Changes

- Consolidate shared-types and nav-config into ui-shell and auth-client.

  **Breaking changes:**

  - `@iot-platform-saf/shared-types` and `@iot-platform-saf/nav-config` are deleted. Migrate imports as follows:

    ```diff
    - import type { User, UserRole, Account } from "@iot-platform-saf/shared-types";
    + import type { User, UserRole, Account } from "@iot-platform-saf/auth-client";
    // or from "@iot-platform-saf/ui-shell" if you don't use auth-client

    - import { drawerCategories, type NavLinkType } from "@iot-platform-saf/nav-config";
    + import { drawerCategories, type NavLinkType } from "@iot-platform-saf/ui-shell";
    ```

  - `ui-shell` no longer requires `@iot-platform-saf/shared-types` or `@iot-platform-saf/nav-config` as peer dependencies — remove them from your `package.json`.

  **New exports from `@iot-platform-saf/ui-shell`:**

  - Types: `Account`, `UserRole`, `User`, `AppId`, `ServiceStatus`, `ApiResponse`, `ApiError`
  - Nav config: `NavLinkType`, `DrawerServiceItem`, `DrawerCategory`, `DrawerManagementItem`, `drawerCategories`, `drawerPlatformNavItems`

  **New exports from `@iot-platform-saf/auth-client`:**

  - Types: `Account`, `UserRole`, `User`

## 0.3.1

### Patch Changes

- docs: update READMEs to reflect Organization → Account rename
- Updated dependencies
  - @iot-platform-saf/shared-types@0.3.1

## 0.3.0

### Minor Changes

- Replace Organization with Account on the platform User type

  **Breaking change:** `Organization` interface and `User.organization` field are removed.

  - `Account { id: string; name: string; displayName: string }` is now the platform identity type
  - `User.account: Account` replaces `User.organization: Organization`
  - `auth-client` JWT decoder now reads the `account` claim (tokens must be re-issued)

  **Migration:** Replace all `user.organization.name` → `user.account.displayName` and `user.organization.id` → `user.account.id`.

### Patch Changes

- Updated dependencies
  - @iot-platform-saf/shared-types@0.3.0

## 0.2.1

### Patch Changes

- Add comprehensive README with step-by-step setup guide, full API reference, and architecture diagram.
- Updated dependencies
  - @iot-platform-saf/shared-types@0.2.1

## 0.2.0

### Minor Changes

- Initial release — shared types, auth client, and shell UI components

### Patch Changes

- Updated dependencies
  - @iot-platform/shared-types@0.2.0
