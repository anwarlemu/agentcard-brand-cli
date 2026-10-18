"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva } from "class-variance-authority";

import { useTabGlide } from "@/hooks/use-tab-glide";
import { cn } from "@/lib/utils";

// The brand's tabs (agentcard.sh, .plan-tabs on /pricing and .faq-tabs on /; `sm` is the guides' .v7-guide-tablist): a sunken track (pale, a hairline, 12px
// corners, 4px inset, the inner shadow) of equal 40px tabs in the 14px display face, and one blue key (a darker blue
// edge, the light line inside the top, the soft drop) that glides to the selected tab. Unselected labels are 68 percent
// ink, turning ink with a faint wash under the pointer; the selected label turns white as the key arrives. `plain` drops
// the track for dense rows: quiet labels with a pale wash gliding between them.
type Variant = "default" | "plain";
type Size = "sm" | "md";

// The key, and the same surface on the selected trigger for the first paint before the key lands (or with no glide).
const KEY: Record<Variant, string> = {
  default: "rounded-control border border-line-brand-edge bg-primary shadow-key-brand",
  plain: "rounded-sm bg-wash-pill",
};
const SELF_KEY: Record<Variant, string> = {
  default: "data-[state=active]:border-line-brand-edge data-[state=active]:bg-primary data-[state=active]:shadow-key-brand",
  plain: "data-[state=active]:bg-wash-pill",
};

const tabsTriggerVariants = cva(
  "relative inline-flex items-center justify-center gap-1.5 border border-transparent font-display leading-none whitespace-nowrap outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Only the label and a faint wash answer the pointer, so nothing fades over the key gliding in beneath.
        default:
          "rounded-control text-fg-muted transition-[background-color,color] duration-150 ease-out hover:text-fg data-[state=active]:text-on-primary data-[state=inactive]:hover:bg-wash-pill",
        plain: "rounded-sm text-fg-muted transition-[color] duration-150 ease-out hover:text-fg data-[state=active]:text-fg",
      },
      size: { sm: "", md: "" },
    },
    compoundVariants: [
      { variant: "default", size: "md", className: "h-10 px-4 text-body-sm leading-body" },
      // The guides' tab track (.v7-guide-tablist): 30px keys with 6px corners in the 12px display face.
      { variant: "default", size: "sm", className: "h-7.5 rounded-sm px-3 text-caption" },
      { variant: "plain", size: "md", className: "h-8 px-3 text-body-sm" },
      { variant: "plain", size: "sm", className: "h-7 px-2.5 text-caption" },
    ],
    defaultVariants: { variant: "default", size: "md" },
  },
);

const ActiveValue = React.createContext<string | undefined>(undefined);
const ListState = React.createContext<{ variant: Variant; size: Size; isKeyPlaced: boolean }>({ variant: "default", size: "md", isKeyPlaced: false });

// The active value is mirrored here so the list can move its key in the same render Radix switches tabs, whether the
// value is controlled or not.
function Tabs({ className, value, defaultValue, onValueChange, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const active = value ?? uncontrolled;
  return (
    <ActiveValue.Provider value={active}>
      <TabsPrimitive.Root
        data-slot="tabs"
        value={active}
        onValueChange={(next) => {
          setUncontrolled(next);
          onValueChange?.(next);
        }}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      />
    </ActiveValue.Provider>
  );
}

function TabsList({
  className,
  variant = "default",
  size = "md",
  glide = true,
  pillClassName,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: Variant;
  size?: Size;
  /** Off for lists whose triggers draw their own selected surface. */
  glide?: boolean;
  /** The gliding key's surface, for a list styled its own way. */
  pillClassName?: string;
}) {
  const active = React.useContext(ActiveValue);
  const keyRef = React.useRef<HTMLSpanElement>(null);
  const isPlaced = useTabGlide(keyRef, active ?? "");

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "relative isolate w-fit",
        // Equal columns whatever the labels, as on the brand's page; add w-full to fill the row.
        variant === "default" ? "inline-grid auto-cols-fr grid-flow-col gap-1 rounded-card border border-hairline bg-subtle p-1 shadow-well" : "inline-flex items-center gap-0.5",
        // The small track's corners stay concentric with its 6px keys: 10px.
        variant === "default" && size === "sm" && "rounded-[calc(var(--ds-radius-sm)+var(--ds-space-1))]",
        className,
      )}
      {...props}
    >
      {glide && (
        // The hook measures from the list's outer edge; -1px puts the key back inside the track's border.
        <span ref={keyRef} aria-hidden className={cn("pointer-events-none absolute -z-10", variant === "default" ? "-top-px -left-px" : "top-0 left-0", KEY[variant], variant === "default" && size === "sm" && "rounded-sm", pillClassName, !isPlaced && "invisible")} />
      )}
      <ListState.Provider value={{ variant, size, isKeyPlaced: glide && isPlaced }}>{children}</ListState.Provider>
    </TabsPrimitive.List>
  );
}

function TabsTrigger({ className, value, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { variant, size, isKeyPlaced } = React.useContext(ListState);
  // Until the key lands (or with no key), the selected tab draws the key itself, so the first paint matches.
  return <TabsPrimitive.Trigger data-slot="tabs-trigger" data-tab-id={value} value={value} className={cn(tabsTriggerVariants({ variant, size }), !isKeyPlaced && SELF_KEY[variant], className)} {...props} />;
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsTriggerVariants };
