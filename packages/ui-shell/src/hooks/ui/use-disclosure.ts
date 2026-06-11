"use client";

import { useState, useCallback } from "react";

export interface DisclosureState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
  setOpen: (v: boolean) => void;
}

export function useDisclosure(initial = false): DisclosureState {
  const [isOpen, setIsOpen] = useState(initial);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const setOpen = useCallback((v: boolean) => setIsOpen(v), []);

  return { isOpen, onOpen, onClose, toggle, setOpen };
}
