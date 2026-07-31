"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogFocusOptions {
  /** Pause the focus trap while a higher-priority child dialog (e.g. alertdialog) is open. */
  suspended?: boolean;
  /** Fallback element to receive focus when the original trigger is body / disconnected / not focusable. */
  fallbackFocusRef?: RefObject<HTMLElement | null>;
}

function isUsableFocusTarget(element: HTMLElement | null): element is HTMLElement {
  if (!element) return false;
  if (element === document.body || element === document.documentElement) return false;
  if (!element.isConnected) return false;
  return element.matches(FOCUSABLE_SELECTOR) || element.hasAttribute("tabindex");
}

export function useDialogFocus(open: boolean, onClose: () => void, options?: DialogFocusOptions) {
  const suspended = options?.suspended ?? false;
  const fallbackFocusRef = options?.fallbackFocusRef;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    const fallbackElement = fallbackFocusRef?.current ?? null;
    const container = containerRef.current;
    let raf = 0;
    if (container) {
      raf = requestAnimationFrame(() => {
        const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        (focusable[0] ?? container).focus();
      });
    }
    return () => {
      cancelAnimationFrame(raf);
      if (isUsableFocusTarget(triggerRef.current)) {
        triggerRef.current.focus();
      } else {
        fallbackElement?.focus();
      }
    };
  }, [open, fallbackFocusRef]);

  useEffect(() => {
    if (!open || suspended) return;
    const container = containerRef.current;
    if (!container) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    container.addEventListener("keydown", onKeyDown);
    return () => container.removeEventListener("keydown", onKeyDown);
  }, [open, suspended, onClose]);

  return containerRef;
}
