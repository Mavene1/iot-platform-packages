// Components
export { AppDrawer, type AppDrawerProps } from "./components/app-drawer";
export { AppFooter } from "./components/app-footer";
export { AppNavbar, type AppNavbarProps } from "./components/app-navbar";
export { AppSidebar, type AppSidebarProps } from "./components/app-sidebar";
export { CommandPalette, type CommandPaletteProps } from "./components/command-palette";

// Hooks
export { useAppDrawer } from "./hooks/use-app-drawer";
export { useCommandPalette } from "./hooks/use-command-palette";

// Types
export type { NavItem, NavSection, AppNavbarUser } from "./types/sidebar";

// Utilities (for consuming apps that need cn / DynamicIcon without a separate install)
export { cn } from "./utils/cn";
export { DynamicIcon, getIcon, type DynamicIconProps } from "./utils/icons";

// Shared types (previously @iot-platform-saf/shared-types)
export type {
  Account,
  UserRole,
  User,
  AppId,
  ServiceStatus,
  ApiResponse,
  ApiError,
} from "./types/shared-types";

// Nav config (previously @iot-platform-saf/nav-config)
export type {
  NavLinkType,
  DrawerServiceItem,
  DrawerCategory,
  DrawerManagementItem,
} from "./config/nav";
export { drawerCategories, drawerPlatformNavItems } from "./config/nav";
