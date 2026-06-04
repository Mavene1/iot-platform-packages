import { useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { cn } from "./utils";
import { DynamicIcon } from "./icons";
import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./sheet";
import { CATEGORY_STYLES, DEFAULT_STYLE, DRAWER_W } from "./constants";
import type { AppDrawerProps, DrawerCategory } from "./types";

// ── SearchInput (inlined — avoids a dep on @iot-platform/common-components) ───

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative flex items-center">
      <DynamicIcon
        name="Search"
        className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search…"}
        className="h-8 w-full rounded-md border border-[var(--border-light)] bg-[var(--surface-secondary)] pl-8 pr-8 text-xs outline-none placeholder:text-muted-foreground focus:border-[var(--green-300)] focus:ring-1 focus:ring-[var(--green-200)]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 cursor-pointer text-muted-foreground hover:text-foreground"
        >
          <DynamicIcon name="X" className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// ── Service card inside category flyout ───────────────────────────────────────

function ServiceCard({
  item,
  categoryId,
  categoryIcon,
  pathname,
  onNavigate,
}: {
  item: DrawerCategory["items"][number];
  categoryId: string;
  categoryIcon: string;
  pathname: string;
  onNavigate: (href: string) => void;
}) {
  const styles = CATEGORY_STYLES[categoryId] ?? DEFAULT_STYLE;
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  return (
    <Button
      variant="ghost"
      onClick={() => onNavigate(item.href)}
      className={cn(
        "group flex h-auto w-full items-start justify-start gap-2.5 rounded-xl border p-3 text-left whitespace-normal transition-all",
        isActive
          ? "border-[var(--green-300)] bg-[var(--green-50)] hover:bg-[var(--green-50)]"
          : "border-[var(--border-light)] hover:border-[var(--green-200)] hover:bg-transparent hover:shadow-sm",
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
          styles.iconBg,
        )}
      >
        <DynamicIcon
          name={item.icon ?? categoryIcon}
          className={cn("h-3.5 w-3.5", styles.iconText)}
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold leading-tight text-foreground">
          {item.label}
        </p>
        {item.description && (
          <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </Button>
  );
}

// ── Category flyout ───────────────────────────────────────────────────────────
// Rendered INSIDE SheetContent's DOM tree (not a portal) so Radix's
// DismissableLayer treats pointer events on the flyout as "inside the sheet".
// position:fixed lets it visually escape the sheet's bounds while keeping it
// in the DOM tree so outside-click dismissal never fires on card clicks.

function CategoryFlyout({
  category,
  pathname,
  onNavigate,
  anchorY,
}: {
  category: DrawerCategory;
  pathname: string;
  onNavigate: (href: string) => void;
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
        <div
          className={cn(
            "flex items-center gap-2.5 border-b border-[var(--border-light)] px-4 py-3",
            styles.activeBg,
          )}
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg",
              styles.iconBg,
            )}
          >
            <DynamicIcon
              name={category.icon}
              className={cn("h-4 w-4", styles.iconText)}
            />
          </div>
          <div>
            <p className={cn("text-sm font-semibold", styles.activeText)}>
              {category.label}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {category.items.length} services
            </p>
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

// ── AppDrawer ─────────────────────────────────────────────────────────────────

export function AppDrawer({
  open,
  onOpenChange,
  nav,
  onNavigate,
}: AppDrawerProps) {
  const pathname = usePathname() ?? "/";
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [flyoutAnchorY, setFlyoutAnchorY] = useState(100);

  const handleCategoryClick = useCallback(
    (catId: string, e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setFlyoutAnchorY(rect.top);
      setOpenCategory((prev) => (prev === catId ? null : catId));
    },
    [],
  );

  const handleNavigate = useCallback(
    (href: string) => {
      setOpenCategory(null);
      setSearch("");
      onOpenChange(false);
      if (onNavigate) {
        onNavigate(href);
      } else {
        window.location.href = href;
      }
    },
    [onOpenChange, onNavigate],
  );

  const handleOpenChange = useCallback(
    (val: boolean) => {
      onOpenChange(val);
      if (!val) {
        setSearch("");
        setOpenCategory(null);
      }
    },
    [onOpenChange],
  );

  const isSearching = search.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const q = search.toLowerCase();
    return nav.categories.flatMap((cat) =>
      cat.items
        .filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            (item.description?.toLowerCase().includes(q) ?? false),
        )
        .map((item) => ({
          ...item,
          categoryId: cat.id,
          categoryIcon: cat.icon,
        })),
    );
  }, [search, isSearching, nav.categories]);

  const openCategoryData = openCategory
    ? nav.categories.find((c) => c.id === openCategory)
    : null;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange} modal={false}>
      <SheetContent
        side="left"
        className="flex w-full flex-col gap-0 p-0 [&>button]:hidden sm:w-[280px]"
      >
        <SheetDescription className="sr-only">
          Navigate to services and portal pages
        </SheetDescription>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <SheetHeader className="flex-row items-center justify-between h-14 shrink-0 border-b border-[var(--border-light)] px-5 py-0 gap-0">
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
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            aria-label="Close drawer"
          >
            <DynamicIcon name="X" className="h-4 w-4" />
          </Button>
        </SheetHeader>

        {/* ── Platform nav ────────────────────────────────────────────────── */}
        <div className="shrink-0 flex flex-col gap-0.5 px-3 pt-3 pb-2">
          {nav.platformNav.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="auto"
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  "flex w-full items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-xs font-medium",
                  isActive
                    ? "bg-[var(--green-50)] text-[var(--green-700)] hover:bg-[var(--green-50)] hover:text-[var(--green-700)]"
                    : "text-muted-foreground hover:bg-[var(--surface-secondary)] hover:text-foreground",
                )}
              >
                <DynamicIcon
                  name={item.icon}
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    isActive ? "text-[var(--green-600)]" : "",
                  )}
                />
                {item.label}
              </Button>
            );
          })}
        </div>

        {/* ── Search ──────────────────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-[var(--border-light)] px-4 pt-3 pb-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search services..."
          />
        </div>

        {/* ── Body ────────────────────────────────────────────────────────── */}
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
                    const styles =
                      CATEGORY_STYLES[item.categoryId] ?? DEFAULT_STYLE;
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                    return (
                      <Button
                        key={item.href}
                        variant="ghost"
                        size="auto"
                        onClick={() => handleNavigate(item.href)}
                        className={cn(
                          "flex w-full items-center justify-start gap-2.5 rounded-lg px-2 py-2 whitespace-normal",
                          isActive
                            ? "bg-[var(--green-50)] text-[var(--green-700)] hover:bg-[var(--green-50)]"
                            : "text-foreground hover:bg-[var(--surface-secondary)]",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
                            styles.iconBg,
                          )}
                        >
                          <DynamicIcon
                            name={item.icon ?? item.categoryIcon}
                            className={cn("h-3.5 w-3.5", styles.iconText)}
                          />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-xs font-semibold leading-tight">
                            {item.label}
                          </p>
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
            <>
              {/* Services */}
              <div className="px-2 pt-3 pb-2">
                <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                  Services
                </p>
                <div className="space-y-0.5">
                  {nav.categories.map((cat) => {
                    const styles = CATEGORY_STYLES[cat.id] ?? DEFAULT_STYLE;
                    const isOpen = openCategory === cat.id;
                    return (
                      <Button
                        key={cat.id}
                        variant="ghost"
                        size="auto"
                        onClick={(e) => handleCategoryClick(cat.id, e)}
                        className={cn(
                          "flex w-full items-center justify-start gap-2.5 rounded-lg px-2 py-2 text-xs font-semibold whitespace-normal transition-colors",
                          isOpen
                            ? cn(styles.activeBg, styles.activeText)
                            : "text-muted-foreground hover:bg-[var(--surface-secondary)] hover:text-foreground",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
                            styles.iconBg,
                          )}
                        >
                          <DynamicIcon
                            name={cat.icon}
                            className={cn("h-3.5 w-3.5", styles.iconText)}
                          />
                        </div>
                        <span className="flex-1 text-left">{cat.label}</span>
                        <DynamicIcon
                          name="ChevronRight"
                          className={cn(
                            "h-3 w-3 shrink-0 transition-transform",
                            isOpen ? "rotate-90" : "opacity-30",
                          )}
                        />
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Account — shell only */}
              {nav.accountItems && nav.accountItems.length > 0 && (
                <div className="border-t border-[var(--border-light)] px-2 pt-3 pb-1">
                  <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                    Account
                  </p>
                  <div className="space-y-0.5">
                    {nav.accountItems.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");
                      return (
                        <Button
                          key={item.href}
                          variant="ghost"
                          size="auto"
                          onClick={() => handleNavigate(item.href)}
                          className={cn(
                            "flex w-full items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-xs font-medium whitespace-normal",
                            isActive
                              ? "bg-[var(--green-50)] text-[var(--green-700)] hover:bg-[var(--green-50)] hover:text-[var(--green-700)]"
                              : "text-muted-foreground hover:bg-[var(--surface-secondary)] hover:text-foreground",
                          )}
                        >
                          <DynamicIcon
                            name={item.icon}
                            className={cn(
                              "h-3.5 w-3.5 shrink-0",
                              isActive ? "text-[var(--green-600)]" : "",
                            )}
                          />
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Administration — shell only */}
              {nav.adminItems && nav.adminItems.length > 0 && (
                <div className="border-t border-[var(--border-light)] px-2 pt-3 pb-4">
                  <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                    Administration
                  </p>
                  <div className="space-y-0.5">
                    {nav.adminItems.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");
                      return (
                        <Button
                          key={item.href}
                          variant="ghost"
                          size="auto"
                          onClick={() => handleNavigate(item.href)}
                          className={cn(
                            "flex w-full items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-xs font-medium whitespace-normal",
                            isActive
                              ? "bg-[var(--green-50)] text-[var(--green-700)] hover:bg-[var(--green-50)] hover:text-[var(--green-700)]"
                              : "text-muted-foreground hover:bg-[var(--surface-secondary)] hover:text-foreground",
                          )}
                        >
                          <DynamicIcon
                            name={item.icon}
                            className={cn(
                              "h-3.5 w-3.5 shrink-0",
                              isActive ? "text-[var(--green-600)]" : "",
                            )}
                          />
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Category flyout — fixed-positioned INSIDE Sheet DOM ─────────────
            Stays in Radix's DismissableLayer subtree so card clicks don't
            dismiss the sheet. position:fixed escapes the visual bounds. */}
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
