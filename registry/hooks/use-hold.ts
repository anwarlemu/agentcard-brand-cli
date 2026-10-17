"use client";

import { type KeyboardEvent, type PointerEvent, useEffect, useRef, useState } from "react";

/** Confirm once per uninterrupted hold. Releasing, losing focus or hiding the page cancels it. */
export function useHold(durationMs: number, onConfirm: () => void, disabled = false) {
  const [isHolding, setHolding] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const active = useRef(false);
  const callback = useRef(onConfirm);
  useEffect(() => { callback.current = onConfirm; }, [onConfirm]);

  function cancel() {
    clearTimeout(timeout.current);
    active.current = false;
    setHolding(false);
  }

  useEffect(() => {
    const reset = () => cancel();
    const visibility = () => { if (document.hidden) reset(); };
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      clearTimeout(timeout.current);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => { if (disabled) cancel(); }, [disabled]);

  function start(event: PointerEvent | KeyboardEvent) {
    if (disabled || active.current || event.defaultPrevented) return;
    active.current = true;
    setHolding(true);
    timeout.current = setTimeout(() => {
      timeout.current = undefined;
      setHolding(false);
      // Keep active until release, preventing repeated keydown from confirming twice.
      callback.current();
    }, Math.max(0, durationMs));
  }

  const handlers = {
    onPointerDown: (event: PointerEvent) => { if (event.button === 0) start(event); },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onKeyDown: (event: KeyboardEvent) => {
      if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
        start(event);
        event.preventDefault();
      }
    },
    onKeyUp: (event: KeyboardEvent) => { if (event.key === "Enter" || event.key === " ") cancel(); },
    onBlur: cancel,
  };
  return { isHolding, handlers };
}
