"use client";

import { useCallback, useEffect } from "react";

export function useCommandPalette(onOpenChange: (open: boolean) => void) {
  const toggle = useCallback(
    () => onOpenChange(true),
    [onOpenChange]
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);
}
