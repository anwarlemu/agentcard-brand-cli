# Alert
A note window: the sky, blue or rose bar labeled like a file over a sheet with a glyph, a display title, a muted line and an optional key.

Install: npx agentcard-ds add alert
Requires: theme, window, utils
Packages: class-variance-authority
Exports: Alert, AlertAction, AlertDescription, AlertTitle, alertVariants
Client boundary: not required by this entry file
Reference: Extrapolated from Agentcard: the Banner (agentcard-website src/app/globals.css .v7-guide-note, .v7-guide-cta-title) and the window bar (.v7-windowbar)


## Usage
Use default for a note (a new feature, a fact about a card), brand for an announcement that matters, destructive for a problem the person must act on. Give the bar a file-like name (voice.beta, agent.paused) or pass name={null} for a bare sheet. Lead with a lucide glyph; put one small key in AlertAction. It is shadcn's Alert API in the Banner's look.
- Avoid: More than one alert at a time
- Avoid: Marketing copy in an alert
- Avoid: Bold titles
- Avoid: A filled red or blue sheet


## Examples
Example components: npx agentcard-ds add alert button
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/alert/Site) | [Brand](https://agentcard-ds.vercel.app/preview/alert/Brand) | [Destructive](https://agentcard-ds.vercel.app/preview/alert/Destructive) | [WithoutBar](https://agentcard-ds.vercel.app/preview/alert/WithoutBar)

examples/alert.tsx

```tsx
"use client";

import * as React from "react";
import { CircleAlert, Info, Megaphone } from "lucide-react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function Site() {
  return (
    <Alert name="voice.beta" className="max-w-3xl">
      <Info />
      <AlertTitle>Voice is in beta</AlertTitle>
      <AlertDescription>Your agent can now place orders over the phone. Calls use the same card and limits as online purchases.</AlertDescription>
      <AlertAction>
        <Button size="sm" asChild>
          <a href="https://www.agentcard.sh" target="_blank" rel="noreferrer">
            Try Voice
          </a>
        </Button>
      </AlertAction>
    </Alert>
  );
}

export function Brand() {
  return (
    <Alert variant="brand" name="issuing.news" className="max-w-3xl">
      <Megaphone />
      <AlertTitle>Commercial cards are here</AlertTitle>
      <AlertDescription>Issue a card per agent, each with its own limit and list of merchants.</AlertDescription>
    </Alert>
  );
}

export function Destructive() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="grid max-w-3xl gap-3">
      <Alert variant="destructive" name="agent.paused">
        <CircleAlert />
        <AlertTitle>Travel agent was paused</AlertTitle>
        <AlertDescription>It reached its $2,000 monthly limit on Oct 14.</AlertDescription>
        <AlertAction>
          <Button variant="secondary" size="sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? "Hide details" : "Review"}
          </Button>
        </AlertAction>
      </Alert>
      {open && <p className="text-body-sm text-fg-muted">Purchases are paused until the limit resets on Nov 1, or until you raise it.</p>}
    </div>
  );
}

export function WithoutBar() {
  return (
    <Alert name={null} className="max-w-xl">
      <AlertTitle>Cards are single-use by default</AlertTitle>
      <AlertDescription>Each card closes after its first purchase. Turn on multi-use in the card settings.</AlertDescription>
    </Alert>
  );
}

```

## Source

components/ui/alert.tsx

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { WindowBar } from "@/components/ui/window";
import { cn } from "@/lib/utils";

// shadcn's Alert in the look of the brand's notes (the Banner, from the guides' .v7-guide-note): a small window with
// a 16 percent ink edge, 12px corners and the guides' light bevel, its 32px bar labeled like a file (`name`, or note,
// news and alert by variant; pass null to drop it), over a sheet with 14px on top, 18px at the sides and 16px below.
// `default` is the note (sky bar, sheet washed 22 percent sky), `brand` the notice that matters (blue bar over white),
// `destructive` trouble (the rose tint over white, its title in red). A lucide glyph first lines up with the title;
// the title is the 16px display face at 500, the description 14px Inter at 68 percent ink, an action sits at the right.
const alertVariants = cva("flex flex-col overflow-hidden rounded-card border border-hairline text-fg shadow-guide", {
  variants: {
    variant: {
      default: "bg-note",
      brand: "bg-surface",
      destructive: "bg-surface [&_[data-slot=alert-title]]:text-danger [&_[data-slot=alert-body]>svg]:text-danger",
    },
  },
  defaultVariants: { variant: "default" },
});

const BARS = { default: { tone: "sky", name: "note" }, brand: { tone: "blue", name: "news" }, destructive: { tone: "rose", name: "alert" } } as const;

function Alert({ className, variant, name, children, role, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants> & { name?: React.ReactNode | null }) {
  const bar = BARS[variant ?? "default"];
  return (
    <div data-slot="alert" data-variant={variant ?? "default"} role={role ?? (variant === "destructive" ? "alert" : "status")} className={cn(alertVariants({ variant }), className)} {...props}>
      {name !== null && <WindowBar aria-hidden name={name ?? bar.name} tone={bar.tone} className="[&>span:nth-child(2)]:mr-auto" />}
      <div
        data-slot="alert-body"
        className="group/alert grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 px-4.5 pt-3.5 pb-4 has-[>svg]:grid-cols-[auto_minmax(0,1fr)_auto] [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-fg-brand"
      >
        {children}
      </div>
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-1 min-w-0 font-display text-body leading-snug font-medium [letter-spacing:-0.01em] text-fg group-has-[>svg]/alert:col-start-2", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("col-start-1 min-w-0 text-body-sm [line-height:1.65] text-fg-muted group-has-[>svg]/alert:col-start-2 [&_p]:[line-height:1.65]", className)}
      {...props}
    />
  );
}

/** What sits at the right of an alert: a small key (Review, Try Voice) or a short note. */
function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("col-start-2 row-span-2 row-start-1 flex flex-wrap items-center gap-2 self-center group-has-[>svg]/alert:col-start-3", className)}
      {...props}
    />
  );
}

export { Alert, AlertAction, AlertDescription, AlertTitle, alertVariants };

```
