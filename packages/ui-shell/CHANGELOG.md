# @iot-platform-saf/ui-shell

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
