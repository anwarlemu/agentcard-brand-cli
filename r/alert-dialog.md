# Alert Dialog
A confirmation in the brand's window: the sky title bar, a 24px display title, then Cancel and the action over a rule.

Install: npx agentcard-ds add alert-dialog
Requires: theme, button, window, surface, utils
Packages: @radix-ui/react-alert-dialog
Exports: AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger
Client boundary: yes
Reference: Extension from agentcard-website src/app/globals.css (.v7-windowbar), as the dialog


## Usage
Use to confirm an action that cannot be undone or costs money (freezing a card, removing an agent). Give it a title that names the action and a description of the result. Put AlertDialogCancel first and AlertDialogAction last; use variant destructive on the action for removals. Pass name for the title bar and size sm for a short question.
- Avoid: A red-filled key
- Avoid: Closing on an outside click
- Avoid: More than two actions
- Avoid: Long forms (use a dialog)


## Examples
Example components: npx agentcard-ds add alert-dialog button
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/alert-dialog/Site) | [Small](https://agentcard-ds.vercel.app/preview/alert-dialog/Small) | [Open](https://agentcard-ds.vercel.app/preview/alert-dialog/Open)

examples/alert-dialog.tsx

```tsx
"use client";

import { useState } from "react";
import { Snowflake } from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

function RemoveAgent({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [status, setStatus] = useState("");
  return (
    <div className="grid justify-items-center gap-3">
      <AlertDialog defaultOpen={defaultOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="secondary">Remove agent</Button>
        </AlertDialogTrigger>
        <AlertDialogContent name="agent.remove">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Travel agent?</AlertDialogTitle>
            <AlertDialogDescription>Its three cards close at once and any purchase in progress is declined. Past receipts stay in your history.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep agent</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => setStatus("Travel agent removed.")}>
              Remove agent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p role="status" className="text-body-sm text-fg-muted empty:hidden">
        {status}
      </p>
    </div>
  );
}

export function Site() {
  return <RemoveAgent />;
}

export function Small() {
  return (
    <div className="grid justify-items-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>Freeze card</Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm" name="card.freeze">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Snowflake strokeWidth={1.5} />
            </AlertDialogMedia>
            <AlertDialogTitle>Freeze this card?</AlertDialogTitle>
            <AlertDialogDescription>The agent cannot buy with it until you unfreeze it.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Freeze</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function Open() {
  return (
    <div className="h-110">
      <RemoveAgent defaultOpen />
    </div>
  );
}

```

## Source

components/ui/alert-dialog.tsx

```tsx
"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { buttonVariants } from "@/components/ui/button";
import { WindowBar } from "@/components/ui/window";
import { usePortalContainer } from "@/lib/surface";
import { cn } from "@/lib/utils";

// A confirmation drawn as the brand's dialog (dialog.tsx, the brand's window): white, a 16 percent ink hairline, 12px
// corners, the 32px sky title bar with its arrow and a file-like name (`name`, the [*] mark at its right since there is
// no close mark: an alert dialog is answered, not dismissed), over the 40 percent ink scrim. The title is the 24px
// display face at 500; the actions sit at the end over a rule, Cancel as the white key and the action as the blue key
// (`destructive` keeps the key and turns its label red-edged, see AlertDialogAction). It pops in from scale 0.97 with a
// fade from its own middle (200ms ease-out); reduced motion keeps the fade. A click outside does not close it.
function AlertDialog(props: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger(props: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal(props: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" container={usePortalContainer()} {...props} />;
}

function AlertDialogOverlay({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return <AlertDialogPrimitive.Overlay data-slot="alert-dialog-overlay" className={cn("fixed inset-0 z-50 animate-fade-in bg-scrim motion-reduce:animate-none", className)} {...props} />;
}

const SIZES = { default: "max-w-lg", sm: "max-w-sm" } as const;

function AlertDialogContent({
  className,
  children,
  size = "default",
  name = "confirm",
  tone,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: keyof typeof SIZES;
  /** The title bar's label, file-like: `card.freeze`, `agent.remove`. */
  name?: React.ReactNode;
  tone?: React.ComponentProps<typeof WindowBar>["tone"];
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "group/alert-dialog fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-1/2 animate-pop-in flex-col overflow-hidden rounded-card border border-hairline bg-surface text-fg shadow-code outline-none [animation-duration:var(--ds-duration-base)] motion-reduce:animate-none",
          SIZES[size],
          className,
        )}
        {...props}
      >
        <WindowBar name={name} tone={tone} />
        <div className="relative min-h-0 flex-1 overflow-y-auto">{children}</div>
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-header" className={cn("grid gap-2 px-6 pt-6 pb-5 group-data-[size=sm]/alert-dialog:text-center", className)} {...props} />;
}

/** A tile above the title: the icon in a 40px sky square with 8px corners and a blue mark. */
function AlertDialogMedia({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-media" className={cn("mb-1 grid size-10 place-items-center rounded-control bg-sky text-fg-brand group-data-[size=sm]/alert-dialog:mx-auto [&_svg]:size-4.5", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-footer" className={cn("flex flex-col-reverse gap-3 border-t border-line px-6 py-4 sm:flex-row sm:justify-end group-data-[size=sm]/alert-dialog:sm:grid group-data-[size=sm]/alert-dialog:sm:grid-cols-2", className)} {...props} />;
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return <AlertDialogPrimitive.Title data-slot="alert-dialog-title" className={cn("font-display text-h3 leading-display font-medium tracking-tight text-fg", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return <AlertDialogPrimitive.Description data-slot="alert-dialog-description" className={cn("text-body-sm leading-relaxed text-fg-muted", className)} {...props} />;
}

/** The answer: the blue key; `destructive` is the white key with a red label, as the brand never fills a key red. */
function AlertDialogAction({ className, variant = "default", ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Action> & { variant?: "default" | "destructive" }) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      data-variant={variant}
      className={cn(buttonVariants({ variant: variant === "destructive" ? "secondary" : "primary" }), variant === "destructive" && "text-danger hover:text-danger", className)}
      {...props}
    />
  );
}

function AlertDialogCancel({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return <AlertDialogPrimitive.Cancel data-slot="alert-dialog-cancel" className={cn(buttonVariants({ variant: "secondary" }), className)} {...props} />;
}

export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger };

```
