"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../utils/cn";
import { DynamicIcon } from "../utils/icons";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../primitives/tooltip";
import type { NavSection, NavItem } from "../types/sidebar";

const STORAGE_KEY = "iot-platform-sidebar-collapsed";

export interface AppSidebarProps {
  navSections: NavSection[];
  navBottom: NavItem[];
  serviceIcon: string;
  serviceName: string;
  serviceSubtitle?: string;
}

export function AppSidebar({
  navSections,
  navBottom,
  serviceIcon,
  serviceName,
  serviceSubtitle,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const hasToggled = useRef(false);

  // Read persisted state before first paint to prevent FOUC
  useLayoutEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const collapsed = stored === "true";
    if (collapsed) setIsCollapsed(true);
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? "56px" : "240px"
    );
    setReady(true);
  }, []);

  // Sync CSS variable whenever collapsed state changes
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isCollapsed ? "56px" : "240px"
    );
  }, [isCollapsed]);

  function handleToggle() {
    hasToggled.current = true;
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-[var(--navbar-height)] z-30 hidden h-[calc(100vh-var(--navbar-height)-var(--footer-height))] flex-col border-r border-[var(--border-light)] bg-white lg:flex",
          isCollapsed ? "w-14" : "w-[240px]",
          hasToggled.current && "transition-all duration-200",
          ready ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Service header */}
        <div
          className={cn(
            "relative flex shrink-0 overflow-hidden border-b border-[var(--green-800)]",
            "bg-gradient-to-br from-[var(--green-700)] to-[var(--green-600)]",
            isCollapsed ? "justify-center px-0 py-4" : "items-start gap-3 px-4 py-4"
          )}
        >
          {/* Grid texture overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 19px,white 19px,white 20px),repeating-linear-gradient(90deg,transparent,transparent 19px,white 19px,white 20px)",
            }}
          />
          <div
            className={cn(
              "relative flex shrink-0 items-center justify-center rounded-xl",
              "bg-white/15 ring-1 ring-white/20 backdrop-blur-sm",
              isCollapsed ? "h-9 w-9" : "h-10 w-10"
            )}
          >
            <DynamicIcon name={serviceIcon} className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="relative min-w-0 pt-0.5">
              <p className="truncate text-sm font-bold leading-tight text-white">{serviceName}</p>
              {serviceSubtitle && (
                <p className="mt-0.5 truncate text-[10px] font-medium tracking-wide text-white/65">
                  {serviceSubtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {navSections.map((section) => (
            <div key={section.heading} className="mb-4">
              {!isCollapsed && (
                <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-tertiary">
                  {section.heading}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(item.href + "/");
                  const isCrossZone = item.linkType === "cross-zone";
                  const linkClass = cn(
                    "relative flex cursor-pointer items-center rounded-lg py-2.5 text-sm font-medium transition-colors",
                    isCollapsed ? "mx-auto w-10 justify-center px-0" : "gap-3 px-3",
                    isActive
                      ? "bg-[var(--green-50)] text-[var(--green-700)]"
                      : "text-secondary hover:bg-[var(--surface-secondary)] hover:text-primary"
                  );
                  const linkContent = (
                    <>
                      {isActive && !isCollapsed && (
                        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-[var(--green-500)]" />
                      )}
                      <DynamicIcon
                        name={item.icon}
                        className={cn("h-4 w-4 shrink-0", isActive ? "text-[var(--green-600)]" : "text-tertiary")}
                      />
                      {!isCollapsed && item.label}
                    </>
                  );
                  const linkEl = isCrossZone ? (
                    <a key={item.label} href={item.href} className={linkClass}>{linkContent}</a>
                  ) : (
                    <Link key={item.label} href={item.href} className={linkClass}>{linkContent}</Link>
                  );

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.label}>
                        <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    );
                  }
                  return linkEl;
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="shrink-0 border-t border-[var(--border-light)] px-2 py-2">
          <div className="space-y-0.5">
            {navBottom.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const isCrossZone = item.linkType === "cross-zone";
              const linkClass = cn(
                "relative flex cursor-pointer items-center rounded-lg py-2.5 text-sm font-medium transition-colors",
                isCollapsed ? "mx-auto w-10 justify-center px-0" : "gap-3 px-3",
                isActive
                  ? "bg-[var(--green-50)] text-[var(--green-700)]"
                  : "text-secondary hover:bg-[var(--surface-secondary)] hover:text-primary"
              );
              const linkContent = (
                <>
                  {isActive && !isCollapsed && (
                    <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-[var(--green-500)]" />
                  )}
                  <DynamicIcon
                    name={item.icon}
                    className={cn("h-4 w-4 shrink-0", isActive ? "text-[var(--green-600)]" : "text-tertiary")}
                  />
                  {!isCollapsed && item.label}
                </>
              );
              const linkEl = isCrossZone ? (
                <a key={item.label} href={item.href} className={linkClass}>{linkContent}</a>
              ) : (
                <Link key={item.label} href={item.href} className={linkClass}>{linkContent}</Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }
              return linkEl;
            })}
          </div>

          {/* Collapse toggle */}
          <button
            onClick={handleToggle}
            className={cn(
              "mt-2 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-[var(--surface-secondary)] hover:text-foreground",
              isCollapsed && "justify-center px-0"
            )}
          >
            {isCollapsed ? (
              <DynamicIcon name="PanelLeftOpen" className="h-4 w-4" />
            ) : (
              <>
                <DynamicIcon name="PanelLeftClose" className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
