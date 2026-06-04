"use client";

// ── Components ────────────────────────────────────────────────────────────────
export { AppNavbar } from "./app-navbar";
export { AppDrawer } from "./app-drawer";
export { AppFooter } from "./app-footer";
export { CommandPalette } from "./command-palette";

// ── Primitives (re-exported for consumers who need to compose their own chrome) ─
export { Button } from "./button";
export type { ButtonProps } from "./button";
export { DynamicIcon, getIcon } from "./icons";
export type { DynamicIconProps, LucideIcon } from "./icons";

// ── Types ─────────────────────────────────────────────────────────────────────
export type {
  NavConfig,
  DrawerCategory,
  DrawerNavItem,
  DrawerServiceItem,
  AppNavbarProps,
  AppDrawerProps,
  AppFooterProps,
  CommandPaletteProps,
  User,
} from "./types";
