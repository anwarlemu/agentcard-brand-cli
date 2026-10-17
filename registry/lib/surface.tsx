"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// A ground: white (the default page), paper (the warm page behind white sections) or blue (the hero, a panel, the
// footer). Blue sets white text and sky labels for everything inside, and dialogs, menus and tooltips opened inside a
// Surface render inside it too, so they keep its ground.
const PortalContainer = React.createContext<HTMLElement | null>(null);

const GROUNDS = {
  white: "bg-surface text-fg",
  paper: "bg-paper text-fg",
  blue: "bg-brand text-on-brand",
} as const;

export function Surface({ ground = "white", className, children, ...props }: React.ComponentProps<"div"> & { ground?: keyof typeof GROUNDS }) {
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);
  return (
    <div ref={setElement} data-ground={ground} className={cn(GROUNDS[ground], className)} {...props}>
      <PortalContainer.Provider value={element}>{children}</PortalContainer.Provider>
    </div>
  );
}

/** Where overlays render: the nearest Surface, else the page body. */
export function usePortalContainer() {
  return React.useContext(PortalContainer) ?? undefined;
}
