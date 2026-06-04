import type { ReactNode } from "react";
import type { User } from "@iot-platform/shared-types";

export type { User };

// ── Navigation data shapes ────────────────────────────────────────────────────

export interface DrawerServiceItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
}

export interface DrawerCategory {
  id: string;
  label: string;
  icon: string;
  items: DrawerServiceItem[];
}

export interface DrawerNavItem {
  label: string;
  href: string;
  icon: string;
}

/**
 * Bundle all nav data into a single object.
 * Import from your app's config/drawer-nav.ts and pass once to AppNavbar.
 *
 * @example
 * import { drawerCategories, drawerPlatformNavItems, drawerAccountItems, drawerAdminItems } from "@/config/drawer-nav";
 * const nav: NavConfig = { categories: drawerCategories, platformNav: drawerPlatformNavItems, accountItems: drawerAccountItems, adminItems: drawerAdminItems };
 */
export interface NavConfig {
  categories: DrawerCategory[];
  platformNav: DrawerNavItem[];
  /** Account nav items — pass only from the shell. Child apps omit this. */
  accountItems?: DrawerNavItem[];
  /** Admin nav items — pass only from the shell. Child apps omit this. */
  adminItems?: DrawerNavItem[];
}

// ── Component props ───────────────────────────────────────────────────────────

export interface AppNavbarProps {
  nav: NavConfig;
  /** Current app identity — shows a breadcrumb pill beside the logo */
  service?: { name: string; icon?: ReactNode };
  /** Path to the logo image served from the app's /public. @default "/images/saf-logo.png" */
  logoSrc?: string;
  /** Width of the logo image in px. @default 120 */
  logoWidth?: number;
  /** Height of the logo image in px. @default 26 */
  logoHeight?: number;
  /** URL the logo navigates to. @default "/dashboard" */
  logoDest?: string;
  /** Unread notification count — shows red dot when > 0. @default 0 */
  notificationCount?: number;
  /** Authenticated user — null while loading or unauthenticated */
  user?: User | null;
  /** True while the initial session fetch is in flight */
  authLoading?: boolean;
  /** Called when the "Sign In" button is clicked */
  onSignIn?: () => void;
  /** Called when the user chooses "Sign Out" from the user menu */
  onLogout?: () => void;
  /**
   * Navigation handler for all hrefs in the drawer and command palette.
   * Shell: pass `router.push` for smooth SPA navigation on internal paths,
   *        with a `CHILD_APP_PREFIXES` guard for cross-app links.
   * Child apps: omit (defaults to `window.location.href`).
   */
  onNavigate?: (href: string) => void;
}

export interface AppDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nav: NavConfig;
  /** @see AppNavbarProps.onNavigate */
  onNavigate?: (href: string) => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nav: NavConfig;
  /** @see AppNavbarProps.onNavigate */
  onNavigate?: (href: string) => void;
}

export interface AppFooterProps {
  /** @default "99.99%" */
  serviceLevel?: string;
  /** @default "AFRICA-EAST-1 (NBO)" */
  region?: string;
  /** @default "/privacy" */
  privacyUrl?: string;
  /** @default "/terms" */
  termsUrl?: string;
}
