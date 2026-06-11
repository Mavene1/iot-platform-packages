"use client";

import Image from "next/image";
import { cn } from "../utils/cn";
import { DynamicIcon } from "../utils/icons";
import { Button } from "../primitives/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../primitives/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "../primitives/dropdown-menu";
import { AppDrawer } from "./app-drawer";
import { CommandPalette } from "./command-palette";
import { useDisclosure } from "../hooks/ui/use-disclosure";
import type { AppNavbarUser } from "../types/sidebar";

export interface AppNavbarProps {
  /** Absolute path to the logo image, e.g. "/assethub/images/saf-logo.png" */
  logoSrc: string;
  logoWidth?: number;
  logoHeight?: number;
  logoAlt?: string;
  user?: AppNavbarUser | null;
  authLoading?: boolean;
  onLogout?: () => void;
  notificationCount?: number;
}

const iconActions = [
  { iconName: "Monitor", label: "Console", href: "/dashboard" },
  { iconName: "HelpCircle", label: "Help", href: "/support" },
] as const;

export function AppNavbar({
  logoSrc,
  logoWidth = 120,
  logoHeight = 26,
  logoAlt = "Safaricom Logo",
  user,
  authLoading = false,
  onLogout,
  notificationCount = 0,
}: AppNavbarProps) {
  const drawer = useDisclosure();
  const cmdPalette = useDisclosure();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <TooltipProvider delayDuration={300}>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-white">
        <div className="mx-auto flex h-14 items-center gap-4 px-4 sm:px-6">
          {/* Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={drawer.onOpen}
              className="rounded-lg p-2 cursor-pointer text-primary transition-colors hover:bg-[var(--surface-secondary)]"
              aria-label="Open services menu"
            >
              <DynamicIcon name="Menu" className="h-5 w-5" />
            </button>
            <a href="/dashboard" className="flex shrink-0 items-center gap-2">
              <div className="hidden sm:block">
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  width={logoWidth}
                  height={logoHeight}
                  priority
                />
              </div>
            </a>
          </div>

          <div className="flex-1" />

          {/* Icon actions */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8 text-muted-foreground cursor-pointer")}
                  aria-label="Go to home page"
                  asChild
                >
                  <a href="/dashboard">
                    <DynamicIcon name="Home" className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Home</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8 text-muted-foreground cursor-pointer")}
                  aria-label="Search (⌘K)"
                  onClick={cmdPalette.onOpen}
                >
                  <DynamicIcon name="Search" className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search ⌘K</TooltipContent>
            </Tooltip>
            {iconActions.map(({ iconName, label, href }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8 text-muted-foreground cursor-pointer")}
                    aria-label={label}
                    asChild
                  >
                    <a href={href}>
                      <DynamicIcon name={iconName} className="h-4 w-4" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("relative h-8 w-8 text-muted-foreground cursor-pointer")}
                  aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ""}`}
                  asChild
                >
                  <a href="/notifications">
                    <DynamicIcon name="Bell" className="h-4 w-4" />
                    {notificationCount > 0 && (
                      <span
                        aria-hidden
                        className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
                      />
                    )}
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </div>

          {/* User */}
          <div className="border-l border-border pl-4 sm:w-[186px]">
            {authLoading ? (
              <div className="flex items-center gap-2 rounded-lg p-1 pr-2">
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-[var(--border-light)]" />
                <div className="hidden flex-col gap-1 sm:flex">
                  <div className="h-2.5 w-20 animate-pulse rounded bg-[var(--border-light)]" />
                  <div className="h-2 w-14 animate-pulse rounded bg-[var(--border-light)]" />
                </div>
              </div>
            ) : (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center cursor-pointer gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-[var(--surface-secondary)] focus:outline-none"
                    aria-label="Open user menu"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--green-100)] text-xs font-bold text-[var(--green-700)]">
                      {initials}
                    </div>
                    <div className="hidden text-left leading-tight sm:block">
                      <p className="text-xs font-semibold text-foreground">{user?.name}</p>
                      <p className="text-[10px] text-muted-foreground">{user?.account.displayName}</p>
                    </div>
                    <DynamicIcon name="ChevronDown" className="hidden h-3 w-3 text-muted-foreground sm:block" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/profile" className="cursor-pointer">
                      <DynamicIcon name="User" className="mr-2 h-4 w-4" />
                      My Profile
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/settings" className="cursor-pointer">
                      <DynamicIcon name="Settings" className="mr-2 h-4 w-4" />
                      Platform Settings
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
                  >
                    <DynamicIcon name="LogOut" className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      <AppDrawer open={drawer.isOpen} onOpenChange={drawer.setOpen} />
      <CommandPalette open={cmdPalette.isOpen} onOpenChange={cmdPalette.setOpen} />
    </TooltipProvider>
  );
}
