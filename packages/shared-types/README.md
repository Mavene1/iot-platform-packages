# @iot-platform-saf/shared-types

Shared TypeScript types for the Safaricom IoT Unified Platform. Used by the shell, all child apps, and the `@iot-platform-saf/auth-client` package to ensure a single consistent shape for users, organisations, API responses, and platform identifiers.

---

## Installation

```bash
pnpm add @iot-platform-saf/shared-types
```

No peer dependencies. No runtime code — this package is types only.

---

## Usage

```ts
import type { User, Organization, UserRole, AppId, ApiResponse, ApiError } from "@iot-platform-saf/shared-types";
```

In child apps, re-export from your local `types/index.ts` rather than importing from the package directly across every file:

```ts
// types/index.ts
export type { User, Organization, UserRole, AppId, ApiResponse, ApiError } from "@iot-platform-saf/shared-types";

// App-specific types go below
export interface Account { ... }
```

---

## Type Reference

### `User`

The authenticated user decoded from the `iot-platform-session` JWT. Populated by `AuthProvider` on mount.

```ts
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization: Organization;
  avatarUrl?: string;
  phoneNumber?: string;
  loginTime?: string;       // ISO 8601 timestamp
  emailVerified?: boolean;
}
```

**Example:**
```ts
const user: User = {
  id: "usr_01",
  email: "alice@safaricom.co.ke",
  name: "Alice Wanjiku",
  role: "admin",
  organization: { id: "org_01", name: "Safaricom PLC" },
  emailVerified: true,
};
```

---

### `Organization`

Embedded in `User`. Represents the tenant the user belongs to.

```ts
interface Organization {
  id: string;
  name: string;
}
```

---

### `UserRole`

The three permission tiers across the platform.

```ts
type UserRole = "admin" | "editor" | "viewer";
```

| Role | Typical capabilities |
|---|---|
| `admin` | Full access — create, update, delete, manage users |
| `editor` | Read + write access to resources; cannot manage users |
| `viewer` | Read-only access |

**Example — role gate:**
```ts
function canEdit(user: User): boolean {
  return user.role === "admin" || user.role === "editor";
}
```

---

### `AppId`

Union of all registered child application identifiers.

```ts
type AppId =
  | "dashboard"
  | "assethub"
  | "sim-platform"
  | "sms-gateway"
  | "dedicated-internet"
  | "cloud-connect"
  | "smart-water"
  | "asset-manager"
  | "iot-gateway"
  | "smart-grid"
  | "compute"
  | "storage"
  | "cloud-firewall";
```

Used in navigation config, service tiles, and permission checks to identify which app a user is navigating to or acting on.

---

### `ServiceStatus`

Lifecycle status of a platform service.

```ts
type ServiceStatus = "active" | "coming-soon" | "beta" | "maintenance";
```

| Status | Meaning |
|---|---|
| `active` | Fully available |
| `coming-soon` | Not yet released — UI shows a disabled tile |
| `beta` | Available but not fully stable |
| `maintenance` | Temporarily unavailable |

---

### `ApiResponse<T>`

Standard envelope for all successful API responses.

```ts
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

**Example:**
```ts
const response: ApiResponse<User[]> = {
  data: [...users],
  success: true,
  message: "Fetched 12 users",
};
```

---

### `ApiError`

Standard shape for API error responses.

```ts
interface ApiError {
  code: string;
  message: string;
  status: number;
}
```

**Example:**
```ts
const error: ApiError = {
  code: "UNAUTHORIZED",
  message: "Session expired. Please log in again.",
  status: 401,
};
```

---

## Versioning

This package is versioned together with `@iot-platform-saf/auth-client`. Both are published from the [`iot-platform-packages`](../../README.md) monorepo. When `User` or any auth-related type changes shape, a new version of both packages is released simultaneously — updating one without the other will cause a type mismatch.
