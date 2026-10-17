"use client";

import { useEffect } from "react";

/** Report the example's height without giving its frame access to the docs document. */
export function PreviewHeight() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-preview-root]");
    if (!root || window.parent === window) return;
    const observer = new ResizeObserver(() => {
      window.parent.postMessage({ type: "agentcard:preview-height", height: root.getBoundingClientRect().height }, window.location.origin);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);
  return null;
}
