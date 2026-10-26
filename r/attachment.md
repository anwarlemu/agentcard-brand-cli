# Attachment
A file on a small white key: a sky tile with a blue glyph, the name in the display face and its size or status below; dashed while waiting, red when it failed.

Install: npx agentcard-ds add attachment
Requires: theme, button, utils
Packages: @radix-ui/react-slot, class-variance-authority
Exports: Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentMedia, AttachmentTitle, AttachmentTrigger
Client boundary: not required by this entry file
Reference: Extrapolated from Agentcard: the white key (agentcard-website .v7-btn), the window bar's sky and blue (.v7-windowbar) and the guides' light bevel


## Usage
Use for files attached to a message, a purchase or a form: receipts, invoices, exports. Set state (idle, uploading, processing, error, done) and say what is happening in AttachmentDescription. Add AttachmentTrigger to open the file, AttachmentAction for remove, retry or download, and AttachmentGroup for a row that scrolls.
- Avoid: Colored file tiles per type
- Avoid: Progress shown by color alone
- Avoid: Rounded photos
- Avoid: More than two actions on one file


## Examples
Example components: npx agentcard-ds add attachment
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/attachment/Site) | [States](https://agentcard-ds.vercel.app/preview/attachment/States) | [Vertical](https://agentcard-ds.vercel.app/preview/attachment/Vertical) | [Sizes](https://agentcard-ds.vercel.app/preview/attachment/Sizes)

examples/attachment.tsx

```tsx
"use client";

import * as React from "react";
import { Download, FileSpreadsheet, FileText, Image as ImageIcon, Receipt, RotateCw, X } from "lucide-react";

import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentMedia, AttachmentTitle, AttachmentTrigger } from "@/components/ui/attachment";

// A card drawn in the brand's blue and sky, as a stand-in for a photo of a receipt.
const CARD_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#CCDBFF"/><rect x="18" y="34" width="84" height="54" rx="6" fill="#0000FF"/><rect x="28" y="46" width="16" height="12" rx="2" fill="#FFFFFF"/></svg>')}`;

export function Site() {
  const [files, setFiles] = React.useState([
    { name: "receipt-amazon-oct-14.pdf", size: "248 KB", icon: Receipt },
    { name: "travel-spend-q3.csv", size: "1.2 MB", icon: FileSpreadsheet },
    { name: "card-policy.txt", size: "3 KB", icon: FileText },
  ]);
  return (
    <AttachmentGroup className="max-w-full">
      {files.map(({ name, size, icon: Icon }) => (
        <Attachment key={name}>
          <AttachmentTrigger aria-label={`Open ${name}`} />
          <AttachmentMedia>
            <Icon strokeWidth={1.5} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{name}</AttachmentTitle>
            <AttachmentDescription>{size}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label={`Remove ${name}`} onClick={() => setFiles((all) => all.filter((f) => f.name !== name))}>
              <X />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </AttachmentGroup>
  );
}

export function States() {
  return (
    <div className="flex flex-wrap items-start gap-3">
      <Attachment state="idle">
        <AttachmentMedia>
          <FileText strokeWidth={1.5} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>expense-policy.pdf</AttachmentTitle>
          <AttachmentDescription>Waiting</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment state="uploading">
        <AttachmentMedia>
          <Receipt strokeWidth={1.5} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>hotel-invoice.pdf</AttachmentTitle>
          <AttachmentDescription>62% of 4.8 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment state="error">
        <AttachmentMedia>
          <FileSpreadsheet strokeWidth={1.5} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>all-transactions.csv</AttachmentTitle>
          <AttachmentDescription>Larger than 25 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Retry all-transactions.csv">
            <RotateCw />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  );
}

export function Vertical() {
  return (
    <div className="flex flex-wrap items-start gap-3">
      <Attachment orientation="vertical">
        <AttachmentMedia variant="image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CARD_IMAGE} alt="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>card-photo.png</AttachmentTitle>
          <AttachmentDescription>94 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Download card-photo.png">
            <Download />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="vertical" state="processing">
        <AttachmentMedia>
          <ImageIcon strokeWidth={1.5} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>receipt-scan.png</AttachmentTitle>
          <AttachmentDescription>Reading the total</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(["default", "sm", "xs"] as const).map((size) => (
        <Attachment key={size} size={size}>
          <AttachmentMedia>
            <Receipt strokeWidth={1.5} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>receipt.pdf</AttachmentTitle>
            <AttachmentDescription>248 KB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ))}
    </div>
  );
}

```

## Source

components/ui/attachment.tsx

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// A file attached to a message or a purchase (a receipt, an invoice), drawn from the brand's small white keys and the
// window bar's marks (agentcard.sh): white on the 16 percent ink hairline with 8px corners and the guides' light bevel.
// The file sits in a sky tile with a blue glyph, as an avatar's initials do; its name is the display face at 500,
// tracked tight; its size or status the 12px display face at 68 percent ink. A file still waiting has a dashed 35
// percent edge; one uploading or processing fades its name to the muted ink until it is done; one that failed takes
// the red edge and a red line. Opening a file (AttachmentTrigger) washes the card 4 percent ink.
const attachmentVariants = cva(
  "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-control border border-hairline bg-surface text-fg shadow-guide transition-[background-color,border-color] duration-150 ease-out has-[>[data-slot=attachment-trigger]]:hover:bg-wash-hover has-[>[data-slot=attachment-trigger]:focus-visible]:outline-2 has-[>[data-slot=attachment-trigger]:focus-visible]:outline-offset-2 has-[>[data-slot=attachment-trigger]:focus-visible]:outline-solid has-[>[data-slot=attachment-trigger]:focus-visible]:outline-focus-ring data-[state=error]:border-danger data-[state=idle]:border-dashed data-[state=idle]:border-line-strong data-[state=idle]:shadow-none motion-reduce:transition-none",
  {
    variants: {
      size: {
        default: "gap-3 text-body-sm has-data-[slot=attachment-content]:px-3 has-data-[slot=attachment-content]:py-2.5 has-data-[slot=attachment-media]:p-2.5",
        sm: "gap-2.5 text-body-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2",
        xs: "gap-2 rounded-sm text-caption has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
      },
      orientation: {
        horizontal: "min-w-48 items-center",
        vertical: "w-28 flex-col has-data-[slot=attachment-content]:w-36",
      },
    },
    defaultVariants: { size: "default", orientation: "horizontal" },
  },
);

type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done";

function Attachment({ className, state = "done", size = "default", orientation = "horizontal", ...props }: React.ComponentProps<"div"> & VariantProps<typeof attachmentVariants> & { state?: AttachmentState }) {
  return <div data-slot="attachment" data-state={state} data-size={size} data-orientation={orientation} aria-busy={state === "uploading" || state === "processing" || undefined} className={cn(attachmentVariants({ size, orientation }), className)} {...props} />;
}

const attachmentMediaVariants = cva(
  "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-window-bar text-window-bar-fg group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-chip group-data-[state=error]/attachment:bg-subtle group-data-[state=error]/attachment:text-danger [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4.5 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        icon: "",
        // A photo or a scan shows itself; it stays faint until it has uploaded.
        image: "bg-subtle opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
      },
    },
    defaultVariants: { variant: "icon" },
  },
);

function AttachmentMedia({ className, variant = "icon", ...props }: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  return <div data-slot="attachment-media" data-variant={variant} className={cn(attachmentMediaVariants({ variant }), className)} {...props} />;
}

function AttachmentContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="attachment-content" className={cn("max-w-full min-w-0 flex-1 leading-snug group-data-[orientation=vertical]/attachment:px-1 group-data-[orientation=vertical]/attachment:pb-1", className)} {...props} />;
}

function AttachmentTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={cn("block max-w-full min-w-0 truncate font-display font-medium tracking-tight text-fg transition-colors duration-150 ease-out group-data-[state=processing]/attachment:text-fg-muted group-data-[state=uploading]/attachment:text-fg-muted motion-reduce:transition-none", className)}
      {...props}
    />
  );
}

function AttachmentDescription({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="attachment-description" className={cn("mt-0.5 block max-w-full min-w-0 truncate font-display text-caption leading-snug text-fg-muted tabular-nums group-data-[state=error]/attachment:text-danger", className)} {...props} />;
}

function AttachmentActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="attachment-actions" className={cn("relative z-20 flex shrink-0 items-center gap-0.5 group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3.5 group-data-[orientation=vertical]/attachment:right-3.5", className)} {...props} />;
}

/** A row action on the attachment (remove, retry, download): the quiet key, 28px. */
function AttachmentAction({ className, variant, size = "icon", ...props }: React.ComponentProps<typeof Button>) {
  return <Button data-slot="attachment-action" variant={variant ?? "ghost"} size={size} className={cn("size-7 group-data-[orientation=vertical]/attachment:border-hairline group-data-[orientation=vertical]/attachment:bg-surface group-data-[orientation=vertical]/attachment:shadow-key", className)} {...props} />;
}

/** Makes the whole card open the file: a button (or a link with asChild) stretched over it. */
function AttachmentTrigger({ className, asChild = false, type, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="attachment-trigger" type={asChild ? undefined : (type ?? "button")} className={cn("absolute inset-0 z-10 cursor-pointer rounded-control outline-none", className)} {...props} />;
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn("flex min-w-0 snap-x snap-mandatory scroll-px-1 gap-3 overflow-x-auto overscroll-x-contain p-1 [scrollbar-width:none] *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start", className)}
      {...props}
    />
  );
}

export { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentMedia, AttachmentTitle, AttachmentTrigger };

```
