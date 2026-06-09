import type { NavLinkType } from "../config/nav";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  /** Drives <Link> (in-app, default) vs <a> (cross-zone — bypasses basePath). */
  linkType?: NavLinkType;
}

export interface NavSection {
  heading: string;
  items: NavItem[];
}

export interface AppNavbarUser {
  name: string;
  email: string;
  account: { displayName: string };
}
