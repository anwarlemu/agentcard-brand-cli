"use client";

import * as React from "react";

import { Collapse } from "@/components/ui/collapse";
import { cn } from "@/lib/utils";

// shadcn's Collapsible in the brand's own disclosure (collapse.tsx, as the plan details and the guides' panels open):
// the content grows from nothing to its height and back over 300ms ease-out with a fade, so what sits below glides
// rather than jumps, and stays mounted but inert while shut. The trigger carries aria-expanded and aria-controls.
// Reduced motion opens and closes at once.
type CollapsibleContextValue = { open: boolean; setOpen: (open: boolean) => void; contentId: string; disabled?: boolean };
const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);
function useCollapsible() {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx) throw new Error("Collapsible parts must be used within <Collapsible />");
  return ctx;
}

function Collapsible({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; disabled?: boolean }) {
  const [inner, setInner] = React.useState(defaultOpen);
  const open = openProp ?? inner;
  const contentId = React.useId();
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInner(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );
  return (
    <CollapsibleContext.Provider value={{ open, setOpen, contentId, disabled }}>
      <div data-slot="collapsible" data-state={open ? "open" : "closed"} data-disabled={disabled ? "" : undefined} className={className} {...props} />
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({ onClick, asChild = false, children, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { open, setOpen, contentId, disabled } = useCollapsible();
  const shared = {
    "data-slot": "collapsible-trigger",
    "data-state": open ? "open" : "closed",
    "aria-expanded": open,
    "aria-controls": contentId,
    disabled: disabled || props.disabled,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) setOpen(!open);
    },
  };
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(child, { ...props, ...shared, onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      (child.props.onClick as ((e: React.MouseEvent<HTMLButtonElement>) => void) | undefined)?.(event);
      shared.onClick(event);
    } });
  }
  return (
    <button type="button" {...props} {...shared}>
      {children}
    </button>
  );
}

function CollapsibleContent({ className, children }: { className?: string; children?: React.ReactNode }) {
  const { open, contentId } = useCollapsible();
  return (
    <Collapse open={open} id={contentId} className={cn(className)}>
      <div data-slot="collapsible-content" data-state={open ? "open" : "closed"}>
        {children}
      </div>
    </Collapse>
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
