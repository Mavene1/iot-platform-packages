import type { UserRole } from "../types/shared-types";

// ── Link type ─────────────────────────────────────────────────────────────────

/**
 * Drives how a nav item is rendered and navigated:
 * - "in-app"     → Next.js <Link> / router.push — same deployed Next.js app
 * - "cross-zone" → <a> / window.location.href   — separate deployed app/zone
 *
 * Components use this field at render time so the <a> vs <Link> decision
 * is encoded in data, not in string-prefix rules or developer memory.
 */
export type NavLinkType = "in-app" | "cross-zone";

// ── Item shapes ───────────────────────────────────────────────────────────────

export interface DrawerServiceItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  /** Drives <Link> (in-app) vs <a> / window.location.href (cross-zone). */
  linkType: NavLinkType;
  /** Optional RBAC guard — roles that may see this item. Omit = visible to all. */
  permissions?: UserRole[];
}

export interface DrawerCategory {
  id: string;
  label: string;
  icon: string;
  items: DrawerServiceItem[];
}

export interface DrawerManagementItem {
  label: string;
  href: string;
  icon: string;
  /** Drives <Link> (in-app) vs <a> / window.location.href (cross-zone). */
  linkType: NavLinkType;
  /** Optional RBAC guard — roles that may see this item. Omit = visible to all. */
  permissions?: UserRole[];
}

// ── Shared nav data ───────────────────────────────────────────────────────────
//
// SOURCE OF TRUTH for drawerCategories and drawerPlatformNavItems.
//
// Shell imports these and adds its own drawerAccountItems / drawerAdminItems
// (shell-only; never exported from this package).
//
// Child apps import only drawerCategories + drawerPlatformNavItems — identical
// to the shell. No copy-paste, no sync checklist.

export const drawerCategories: DrawerCategory[] = [
  {
    id: "connectivity",
    label: "Connectivity",
    icon: "Wifi",
    items: [
      { label: "SIM Platform",       href: "/sim-platform/dashboard", icon: "CreditCard",    description: "Manage SIM cards and data plans",  linkType: "cross-zone" },
      { label: "SMS Gateway",        href: "/sms-gateway",            icon: "MessageSquare", description: "Bulk messaging and notifications", linkType: "cross-zone" },
      { label: "Dedicated Internet", href: "/dedicated-internet",     icon: "Globe",         description: "Leased line and fiber access",     linkType: "cross-zone" },
      { label: "Cloud Connect",      href: "/cloud-connect",          icon: "Cloud",         description: "Private cloud networking",         linkType: "cross-zone" },
    ],
  },
  {
    id: "utilities",
    label: "Utilities",
    icon: "Cpu",
    items: [
      { label: "Smart Water", href: "/smart-water",        icon: "Droplets", description: "Water utility management",      linkType: "cross-zone" },
      { label: "Smart Grid",  href: "/smart-grid",         icon: "Zap",      description: "Energy monitoring platform",    linkType: "cross-zone" },
      { label: "AssetHub",    href: "/assethub/dashboard", icon: "Package",  description: "Track and manage field assets", linkType: "cross-zone" },
    ],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    icon: "Server",
    items: [
      { label: "Compute",        href: "/compute",        icon: "Cpu",       description: "Virtual machines and containers", linkType: "cross-zone" },
      { label: "IoT Gateway",    href: "/iot-gateway",    icon: "Radio",     description: "Device onboarding and routing",   linkType: "cross-zone" },
      { label: "Storage",        href: "/storage",        icon: "HardDrive", description: "Object and block storage",         linkType: "cross-zone" },
      { label: "Cloud Firewall", href: "/cloud-firewall", icon: "Shield",    description: "Network security rules",           linkType: "cross-zone" },
    ],
  },
];

export const drawerPlatformNavItems: DrawerManagementItem[] = [
  { label: "Dashboard",       href: "/dashboard", icon: "LayoutDashboard", linkType: "in-app" },
  { label: "Service Catalog", href: "/services",  icon: "Layers",          linkType: "in-app" },
];
