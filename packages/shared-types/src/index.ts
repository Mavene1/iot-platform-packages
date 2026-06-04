// ── User & Auth ──────────────────────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
}

export type UserRole = "admin" | "editor" | "viewer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization: Organization;
  avatarUrl?: string;
  phoneNumber?: string;
  loginTime?: string;
  emailVerified?: boolean;
}

// ── Platform ─────────────────────────────────────────────────────────────────

export type AppId =
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

export type ServiceStatus = "active" | "coming-soon" | "beta" | "maintenance";

// ── API ───────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}
