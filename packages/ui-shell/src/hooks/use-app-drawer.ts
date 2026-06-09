"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { drawerCategories, type NavLinkType } from "@iot-platform-saf/nav-config";

export function useAppDrawer(onOpenChange: (open: boolean) => void) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [flyoutAnchorY, setFlyoutAnchorY] = useState(100);

  const handleCategoryClick = useCallback(
    (catId: string, e: MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setFlyoutAnchorY(rect.top);
      setOpenCategory((prev) => (prev === catId ? null : catId));
    },
    []
  );

  // Child apps always navigate cross-zone — the drawer only contains shell
  // routes (/dashboard, /services) and other child app routes, never routes
  // that belong to the consuming app itself. linkType is accepted for API
  // compatibility but always results in a full cross-app navigation.
  const handleNavigate = useCallback(
    (href: string, _linkType?: NavLinkType) => {
      setOpenCategory(null);
      setSearch("");
      onOpenChange(false);
      window.location.href = href;
    },
    [onOpenChange]
  );

  const handleOpenChange = useCallback(
    (val: boolean) => {
      onOpenChange(val);
      if (!val) {
        setSearch("");
        setOpenCategory(null);
      }
    },
    [onOpenChange]
  );

  const isSearching = search.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const q = search.toLowerCase();
    return drawerCategories.flatMap((cat) =>
      cat.items
        .filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            (item.description?.toLowerCase().includes(q) ?? false)
        )
        .map((item) => ({ ...item, categoryId: cat.id, categoryIcon: cat.icon }))
    );
  }, [search, isSearching]);

  const openCategoryData = openCategory
    ? drawerCategories.find((c) => c.id === openCategory)
    : null;

  return {
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
  };
}
