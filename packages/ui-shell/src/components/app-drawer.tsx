"use client";

import { type MouseEvent } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../primitives/sheet";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import { cn } from "../utils/cn";
import { DynamicIcon } from "../utils/icons";
import { drawerCategories, drawerPlatformNavItems, type DrawerServiceItem, type NavLinkType } from "@iot-platform-saf/nav-config";
import { useAppDrawer } from "../hooks/use-app-drawer";

const CATEGORY_STYLES: Record<string, { iconBg: string; iconText: string; activeBg: string; activeText: string }> = {
  connectivity:   { iconBg: "bg-blue-50",   iconText: "text-blue-600",   activeBg: "bg-blue-50",   activeText: "text-blue-700"   },
  utilities:      { iconBg: "bg-amber-50",  iconText: "text-amber-600",  activeBg: "bg-amber-50",  activeText: "text-amber-700"  },
  infrastructure: { iconBg: "bg-purple-50", iconText: "text-purple-600", activeBg: "bg-purple-50", activeText: "text-purple-700" },
};
const DEFAULT_STYLE = { iconBg: "bg-gray-100", iconText: "text-gray-600", activeBg: "bg-gray-50", activeText: "text-gray-700" };

const DRAWER_W = 280;

function ServiceCard({
  item,
  categoryId,
  categoryIcon,
  pathname,
  onNavigate,
}: {
  item: DrawerServiceItem;
  categoryId: string;
  categoryIcon: string;
  pathname: string;
  onNavigate: (href: string, linkType: NavLinkType) => void;
}) {
  const styles = CATEGORY_STYLES[categoryId] ?? DEFAULT_STYLE;
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  return (
    <Button
      variant="ghost"
      onClick={() => onNavigate(item.href, item.linkType)}
      className={cn(
        "group flex h-auto w-full items-start justify-start gap-2.5 rounded-xl border p-3 text-left whitespace-normal transition-all",
        isActive
          ? "border-[var(--green-300)] bg-[var(--green-50)] hover:bg-[var(--green-50)]"
          : "border-[var(--border-light)] hover:border-[var(--green-200)] hover:bg-transparent hover:shadow-sm"
      )}
    >
      <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", styles.iconBg)}>
        <DynamicIcon name={item.icon ?? categoryIcon} className={cn("h-3.5 w-3.5", styles.iconText)} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold leading-tight text-foreground">{item.label}</p>
        {item.description && (
          <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </Button>
  );
}

function CategoryFlyout({
  category,
  pathname,
  onNavigate,
  anchorY,
}: {
  category: (typeof drawerCategories)[number];
  pathname: string;
  onNavigate: (href: string, linkType: NavLinkType) => void;
  anchorY: number;
}) {
  const styles = CATEGORY_STYLES[category.id] ?? DEFAULT_STYLE;
  const estimatedH = Math.min(category.items.length * 88 + 64, 500);
  const top =
    typeof window !== "undefined"
      ? Math.max(56, Math.min(anchorY, window.innerHeight - estimatedH - 16))
      : anchorY;

  return (
    <div
      style={{ position: "fixed", left: DRAWER_W + 8, top, zIndex: 60 }}
      className="animate-in fade-in slide-in-from-left-1 duration-150"
    >
      <div className="w-[420px] overflow-hidden rounded-xl border border-[var(--border-light)] bg-background shadow-2xl">
        <div className={cn("flex items-center gap-2.5 border-b border-[var(--border-light)] px-4 py-3", styles.activeBg)}>
          <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", styles.iconBg)}>
            <DynamicIcon name={category.icon} className={cn("h-4 w-4", styles.iconText)} />
          </div>
          <div>
            <p className={cn("text-sm font-semibold", styles.activeText)}>{category.label}</p>
            <p className="text-[10px] text-muted-foreground">{category.items.length} services</p>
          </div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2">
            {category.items.map((item) => (
              <ServiceCard
                key={item.href}
                item={item}
                categoryId={category.id}
                categoryIcon={category.icon}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface AppDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppDrawer({ open, onOpenChange }: AppDrawerProps) {
  const {
    pathname,
    search,
    setSearch,
    openCategory,
    flyoutAnchorY,
    handleCategoryClick,
    handleNavigate,
    handleOpenChange,
    isSearching,
    searchResults,
    openCategoryData,
  } = useAppDrawer(onOpenChange);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange} modal={false}>
      <SheetContent
        side="left"
        className="flex w-full flex-col gap-0 p-0 [&>button]:hidden sm:w-[280px]"
      >
        <SheetDescription className="sr-only">Navigate to services and portal pages</SheetDescription>

        {/* Header */}
        <SheetHeader className="flex-row items-center justify-between h-14 shrink-0 border-b border-[var(--border-light)] px-5 py-0">
          <SheetTitle className="flex items-center gap-2 text-base font-bold">
            <svg
              className="h-4 w-4 text-[var(--green-500)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            Services
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close drawer"
          >
            <DynamicIcon name="X" className="h-4 w-4" />
          </Button>
        </SheetHeader>

        {/* Platform nav */}
        <div className="shrink-0 flex flex-col gap-0.5 px-3 pt-3 pb-2">
          {drawerPlatformNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Button
                key={item.href}
                variant="ghost"
                onClick={() => handleNavigate(item.href, item.linkType)}
                className={cn(
                  "flex h-auto w-full items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-xs font-medium",
                  isActive
                    ? "bg-[var(--green-50)] text-[var(--green-700)] hover:bg-[var(--green-50)] hover:text-[var(--green-700)]"
                    : "text-muted-foreground hover:bg-[var(--surface-secondary)] hover:text-foreground"
                )}
              >
                <DynamicIcon
                  name={item.icon}
                  className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-[var(--green-600)]" : "")}
                />
                {item.label}
              </Button>
            );
          })}
        </div>

        {/* Search */}
        <div className="shrink-0 border-t border-[var(--border-light)] px-4 pt-3 pb-3">
          <div className="relative">
            <DynamicIcon name="Search" className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="pl-9 text-sm"
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto border-t border-[var(--border-light)]">
          {isSearching ? (
            <div className="px-2 py-3">
              {searchResults.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-muted-foreground">
                    No services match &ldquo;{search}&rdquo;
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {searchResults.map((item) => {
                    const styles = CATEGORY_STYLES[item.categoryId] ?? DEFAULT_STYLE;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Button
                        key={item.href}
                        variant="ghost"
                        onClick={() => handleNavigate(item.href, item.linkType)}
                        className={cn(
                          "flex h-auto w-full items-center justify-start gap-2.5 rounded-lg px-2 py-2 whitespace-normal",
                          isActive
                            ? "bg-[var(--green-50)] text-[var(--green-700)] hover:bg-[var(--green-50)]"
                            : "text-foreground hover:bg-[var(--surface-secondary)]"
                        )}
                      >
                        <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-lg", styles.iconBg)}>
                          <DynamicIcon
                            name={item.icon ?? item.categoryIcon}
                            className={cn("h-3.5 w-3.5", styles.iconText)}
                          />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-xs font-semibold leading-tight">{item.label}</p>
                          {item.description && (
                            <p className="text-[10px] leading-tight text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="px-2 pt-3 pb-2">
              <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                Services
              </p>
              <div className="space-y-0.5">
                {drawerCategories.map((cat) => {
                  const styles = CATEGORY_STYLES[cat.id] ?? DEFAULT_STYLE;
                  const isOpen = openCategory === cat.id;
                  return (
                    <Button
                      key={cat.id}
                      variant="ghost"
                      onClick={(e: MouseEvent<HTMLButtonElement>) => handleCategoryClick(cat.id, e)}
                      className={cn(
                        "flex h-auto w-full items-center justify-start gap-2.5 rounded-lg px-2 py-2 text-xs font-semibold whitespace-normal transition-colors",
                        isOpen
                          ? cn(styles.activeBg, styles.activeText)
                          : "text-muted-foreground hover:bg-[var(--surface-secondary)] hover:text-foreground"
                      )}
                    >
                      <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-lg", styles.iconBg)}>
                        <DynamicIcon name={cat.icon} className={cn("h-3.5 w-3.5", styles.iconText)} />
                      </div>
                      <span className="flex-1 text-left">{cat.label}</span>
                      <DynamicIcon
                        name="ChevronRight"
                        className={cn(
                          "h-3 w-3 shrink-0 transition-transform",
                          isOpen ? "rotate-90" : "opacity-30"
                        )}
                      />
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Category flyout — fixed-positioned inside Sheet DOM tree.
            Stays in Radix DismissableLayer subtree so card clicks don't
            dismiss the sheet. position:fixed lets it visually escape. */}
        {!isSearching && openCategoryData && (
          <CategoryFlyout
            category={openCategoryData}
            pathname={pathname}
            onNavigate={handleNavigate}
            anchorY={flyoutAnchorY}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
