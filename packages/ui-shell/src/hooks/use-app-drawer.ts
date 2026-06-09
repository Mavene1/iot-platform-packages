"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { drawerCategories, type NavLinkType } from "@iot-platform-saf/nav-config";

export function useAppDrawer(onOpenChange: (open: boolean) => void) {
  const pathname = usePathname();
  const router = useRouter();
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

  const handleNavigate = useCallback(
    (href: string, linkType: NavLinkType = "cross-zone") => {
      setOpenCategory(null);
      setSearch("");
      onOpenChange(false);
      if (linkType === "in-app") {
        router.push(href);
      } else {
        window.location.href = href;
      }
    },
    [onOpenChange, router]
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
