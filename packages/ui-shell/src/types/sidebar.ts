export interface NavItem {
  label: string;
  href: string;
  icon: string;
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
