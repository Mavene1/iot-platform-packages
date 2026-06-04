import { useState } from "react";
import Image from "next/image";
import { Tooltip, Separator, DropdownMenu } from "radix-ui";
import { cn } from "./utils";
import { DynamicIcon } from "./icons";
import { Button } from "./button";
import { AppDrawer } from "./app-drawer";
import { CommandPalette } from "./command-palette";
import type { AppNavbarProps, User } from "./types";

// ── User initials ─────────────────────────────────────────────────────────────

function getInitials(user: User): string {
  return user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ── AppNavbar ─────────────────────────────────────────────────────────────────

export function AppNavbar({
  nav,
  service,
  logoSrc = "/images/saf-logo.png",
  logoWidth = 120,
  logoHeight = 26,
  logoDest = "/dashboard",
  notificationCount = 0,
  user,
  authLoading = false,
  onSignIn,
  onLogout,
  onNavigate,
}: AppNavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  const isAuthenticated = !!user;

  function navigate(href: string) {
    if (onNavigate) {
      onNavigate(href);
    } else {
      window.location.href = href;
    }
  }

  return (
    <Tooltip.Provider delayDuration={300}>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[var(--border-light)] bg-white">
        <div className="mx-auto flex h-14 items-center gap-4 px-4 sm:px-6">

          {/* ── Hamburger + Logo ──────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open services menu"
            >
              <DynamicIcon name="Menu" className="h-5 w-5" />
            </Button>
            <a
              href={logoDest}
              onClick={(e) => {
                e.preventDefault();
                navigate(logoDest ?? "/dashboard");
              }}
              className="flex shrink-0 cursor-pointer items-center gap-2"
            >
              <div className="hidden sm:block leading-tight">
                <Image
                  src={logoSrc}
                  alt="Safaricom Logo"
                  width={logoWidth}
                  height={logoHeight}
                  priority
                />
              </div>
            </a>
          </div>

          {/* ── Service breadcrumb pill ───────────────────────────────────── */}
          {service && (
            <>
              <Separator.Root
                orientation="vertical"
                className="h-5 w-px bg-[var(--border-light)]"
              />
              <div className="flex items-center gap-1.5">
                {service.icon && (
                  <span className="text-[var(--green-500)]">{service.icon}</span>
                )}
                <span className="text-sm font-semibold text-[var(--green-600)]">
                  {service.name}
                </span>
              </div>
            </>
          )}

          <div className="flex-1" />

          {/* ── Icon action buttons ───────────────────────────────────────── */}
          <div className="flex items-center gap-0.5">
            {[
              { icon: "Home",    label: "Home",    href: "/"          },
              { icon: "Monitor", label: "Console", href: "/dashboard" },
              { icon: "HelpCircle", label: "Help", href: "/support"   },
            ].map(({ icon, label, href }) => (
              <Tooltip.Root key={label}>
                <Tooltip.Trigger asChild>
                  <a
                    href={href}
                    onClick={(e) => { e.preventDefault(); navigate(href); }}
                    aria-label={label}
                    className={cn(
                      "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors",
                      "hover:bg-[var(--surface-secondary)] hover:text-foreground",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--green-500)]",
                    )}
                  >
                    <DynamicIcon name={icon} className="h-4 w-4" />
                  </a>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    className="z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md animate-in fade-in-0 zoom-in-95"
                    sideOffset={5}
                  >
                    {label}
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCmdOpen(true)}
                  aria-label="Search (⌘K)"
                >
                  <DynamicIcon name="Search" className="h-4 w-4" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  className="z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md animate-in fade-in-0 zoom-in-95"
                  sideOffset={5}
                >
                  Search ⌘K
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            {/* Notifications */}
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <a
                  href="/notifications"
                  onClick={(e) => { e.preventDefault(); navigate("/notifications"); }}
                  aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ""}`}
                  className={cn(
                    "relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors",
                    "hover:bg-[var(--surface-secondary)] hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--green-500)]",
                  )}
                >
                  <DynamicIcon name="Bell" className="h-4 w-4" />
                  {notificationCount > 0 && (
                    <span
                      aria-hidden
                      className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
                    />
                  )}
                </a>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  className="z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md animate-in fade-in-0 zoom-in-95"
                  sideOffset={5}
                >
                  Notifications
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          {/* ── User / Sign In ────────────────────────────────────────────── */}
          <div className="border-l border-[var(--border-light)] pl-4 sm:w-[186px]">
            {authLoading ? (
              <div className="flex items-center gap-2 rounded-lg p-1 pr-2">
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-[var(--border-light)]" />
                <div className="hidden flex-col gap-1 sm:flex">
                  <div className="h-2.5 w-20 animate-pulse rounded bg-[var(--border-light)]" />
                  <div className="h-2 w-14 animate-pulse rounded bg-[var(--border-light)]" />
                </div>
              </div>
            ) : isAuthenticated && user ? (
              <DropdownMenu.Root modal={false}>
                <DropdownMenu.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="auto"
                    className="flex w-full items-center gap-2 rounded-lg p-1 pr-2"
                    aria-label="Open user menu"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--green-100)] text-xs font-bold text-[var(--green-700)]">
                      {getInitials(user)}
                    </div>
                    <div className="hidden text-left leading-tight sm:block">
                      <p className="text-xs font-semibold text-foreground">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {user.organization.name}
                      </p>
                    </div>
                    <DynamicIcon
                      name="ChevronDown"
                      className="hidden h-3 w-3 text-muted-foreground sm:block"
                    />
                  </Button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content
                  align="end"
                  className="z-50 min-w-[200px] overflow-hidden rounded-md border border-[var(--border-light)] bg-background p-1 shadow-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenu.Separator className="my-1 h-px bg-[var(--border-light)]" />
                  {[
                    { label: "My Profile", href: "/profile",  icon: "User"     },
                    { label: "Settings",   href: "/settings", icon: "Settings" },
                  ].map(({ label, href, icon }) => (
                    <DropdownMenu.Item
                      key={href}
                      onSelect={() => navigate(href)}
                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-[var(--surface-secondary)] focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <DynamicIcon name={icon} className="mr-2 h-4 w-4" />
                      {label}
                    </DropdownMenu.Item>
                  ))}
                  <DropdownMenu.Separator className="my-1 h-px bg-[var(--border-light)]" />
                  <DropdownMenu.Item
                    onSelect={onLogout}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-red-600 outline-none transition-colors focus:bg-red-50 focus:text-red-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <DynamicIcon name="LogOut" className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            ) : (
              <Button
                onClick={onSignIn}
                className="h-10 w-full rounded-lg px-4 text-sm font-semibold"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <AppDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        nav={nav}
        onNavigate={onNavigate}
      />
      <CommandPalette
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        nav={nav}
        onNavigate={onNavigate}
      />
    </Tooltip.Provider>
  );
}
