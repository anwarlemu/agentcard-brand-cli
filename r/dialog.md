# Dialog
Modal dialog with a title bar, focus trap and close control.

Install: npx agentcard-ds add dialog
Requires: theme, window, surface, utils
Packages: @radix-ui/react-dialog, lucide-react
Exports: Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, WindowClose
Client boundary: yes
Reference: Extension from agentcard-website src/app/globals.css (.v7-windowbar); src/components/v7/window-mark.tsx


## Usage
Use for a short form or confirmation. Provide a title and description. Set name for the title bar and size for wider content. Connect form submission and validation to the application.
- Avoid: Dialogs for long reading
- Avoid: A dialog opened from another dialog
- Avoid: Blurring the page behind
- Avoid: Sliding in from an edge (use a sheet)


## Examples
Example components: npx agentcard-ds add dialog button field input
[Site](https://agentcard-ds.vercel.app/preview/dialog/Site) | [Open](https://agentcard-ds.vercel.app/preview/dialog/Open)

examples/dialog.tsx

```tsx
"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function NewCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [created, setCreated] = useState("");
  const formId = useId();
  return <div className="grid gap-3">
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button>New card</Button></DialogTrigger>
      <DialogContent name="card.new">
        <DialogHeader>
          <DialogTitle>Give an agent a card</DialogTitle>
          <DialogDescription>Name the card and set the most it can spend at one checkout. You can change both later.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form id={formId} className="grid gap-4" onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            setCreated(`${String(data.get("name")).trim()} created with a $${Number(data.get("limit")).toFixed(2)} purchase limit.`);
            setOpen(false);
          }}>
            <Field label="Card name" required><Input name="name" defaultValue="Travel agent" pattern=".*\S.*" /></Field>
            <Field label="Per purchase limit" required help="Amount in USD."><Input name="limit" type="number" min="0.01" step="0.01" defaultValue="250" /></Field>
          </form>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
          <Button type="submit" form={formId}>Create card</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <p role="status" className="text-body-sm text-fg-muted empty:hidden">{created}</p>
  </div>;
}
export function Site() { return <NewCard />; }
export function Open() { return <div className="h-130"><NewCard defaultOpen /></div>; }

```

## Source

components/ui/dialog.tsx

```tsx
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { WindowBar } from "@/components/ui/window";
import { usePortalContainer } from "@/lib/surface";
import { cn } from "@/lib/utils";

// A dialog is one of the brand's windows: white, a 16 percent ink hairline, 12px corners, the 32px sky title bar with
// its arrow and a file-like name (`name`), and a close mark where the [*] sits. It floats centered over a 40 percent
// ink scrim, popping in from scale 0.97 with a fade (200ms ease-out; a modal stays centered, so it scales from its own
// middle). Reduced motion keeps the fade. Radix adds the focus trap, scroll lock and Escape.
function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  const container = usePortalContainer();
  return <DialogPrimitive.Portal data-slot="dialog-portal" container={container} {...props} />;
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return <DialogPrimitive.Overlay data-slot="dialog-overlay" className={cn("fixed inset-0 z-50 animate-fade-in motion-reduce:animate-none bg-scrim", className)} {...props} />;
}

/** The close mark in a window bar, in the bar's own color. */
function WindowClose({ className }: { className?: string }) {
  return (
    <DialogPrimitive.Close
      aria-label="Close"
      className={cn(
        "-mr-1.5 grid size-7 shrink-0 place-items-center rounded-sm opacity-60 outline-none transition-[opacity,background-color] duration-150 ease-out hover:bg-wash-selected hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-solid focus-visible:outline-focus-ring [&_svg]:size-3.5",
        className,
      )}
    >
      <X strokeWidth={1.5} />
    </DialogPrimitive.Close>
  );
}

const WIDTHS = { md: "max-w-lg", lg: "max-w-3xl", xl: "max-w-5xl", "2xl": "max-w-6xl" } as const;

function DialogContent({
  className,
  children,
  size = "md",
  name = "dialog",
  tone,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  size?: keyof typeof WIDTHS;
  /** The title bar's label, file-like: `card.new`, `agent.pause`. */
  name?: React.ReactNode;
  /** The bar's color: sky (the default) or blue for the one that matters. */
  tone?: React.ComponentProps<typeof WindowBar>["tone"];
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-1/2 animate-pop-in motion-reduce:animate-none flex-col overflow-hidden rounded-card border border-hairline bg-surface text-fg shadow-code outline-none [animation-duration:var(--ds-duration-base)]",
          WIDTHS[size],
          className,
        )}
        {...props}
      >
        <WindowBar name={name} tone={tone} actions={showCloseButton ? <WindowClose /> : undefined} />
        <div className="relative min-h-0 flex-1 overflow-y-auto">{children}</div>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-2 px-6 pt-6", className)} {...props} />;
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-body" className={cn("px-6 pt-5 pb-6 text-body text-fg", className)} {...props} />;
}

function DialogFooter({ className, divider = true, ...props }: React.ComponentProps<"div"> & { divider?: boolean }) {
  return <div data-slot="dialog-footer" className={cn("flex flex-wrap items-center justify-end gap-3 px-6", divider ? "border-t border-line py-4" : "pb-6", className)} {...props} />;
}

// 24px display at 500, tracked tight, like a card's title.
function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("font-display text-h3 leading-display font-medium tracking-tight text-fg", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn("text-body-sm leading-relaxed text-fg-muted", className)} {...props} />;
}

export { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, WindowClose };

```
