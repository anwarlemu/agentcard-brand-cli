"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";

import { Dialog, DialogPortal } from "@/components/ui/dialog";
import { WindowBar } from "@/components/ui/window";
import { cn } from "@/lib/utils";

// The guides' search palette (agentcard-website src/components/v7/guide-search.tsx; src/app/globals.css
// .v7-guide-search-layer, -panel, -field, -results, -group, -keys). A white panel on a 35 percent ink edge with 8px
// corners and no drop, the sky window bar on top (`name`), then the field: a blue search mark and a 54px input in the
// 19px display face over a 2px dotted rule. Groups are headed in the 12px display face in blue, ruled apart by a dotted
// line; a row is a 16px display title over a 12px line at 68 percent ink, the highlighted one on a pale sky wash with a
// blue return mark. The keys row is the sky bar again. The dialog lays it 12vh from the top over the scan-line scrim (ink
// lines every 3px over blue mixed into ink) with a light blur. It opens from the keyboard many times a day, so nothing
// animates: the palette, the highlight and the return mark appear at once.

function SearchMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={cn("size-3.75 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-width:1.5]", className)}>
      <circle cx="7" cy="7" r="4.75" />
      <path d="M10.5 10.5 14 14" />
    </svg>
  );
}

function Command({ className, name, children, ...props }: React.ComponentProps<typeof CommandPrimitive> & { name?: React.ReactNode }) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn("flex max-h-[72vh] w-full flex-col overflow-hidden rounded-control border border-line-strong bg-surface text-fg", className)}
      {...props}
    >
      {name ? <WindowBar aria-hidden name={name} className="[&>span:nth-child(2)]:mr-auto" /> : null}
      {children}
    </CommandPrimitive>
  );
}

function CommandDialog({
  title = "Search",
  description = "Search for a page or an action",
  name = "search",
  className,
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & { title?: string; description?: string; name?: React.ReactNode; className?: string }) {
  return (
    <Dialog {...props}>
      <DialogPortal>
        <DialogPrimitive.Overlay
          data-slot="command-overlay"
          className="fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--ds-color-brand)_22%,color-mix(in_srgb,var(--ds-color-ink)_18%,transparent))] bg-[image:repeating-linear-gradient(0deg,color-mix(in_srgb,var(--ds-color-ink)_10%,transparent)_0_var(--ds-space-px),transparent_var(--ds-space-px)_calc(var(--ds-space-px)*3))] backdrop-blur-[calc(var(--ds-space-px)*3)]"
        />
        <DialogPrimitive.Content data-slot="command-dialog" className="fixed top-[12vh] left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-160 -translate-x-1/2 outline-none">
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">{description}</DialogPrimitive.Description>
          <Command name={name} className={className}>
            {children}
          </Command>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

/** The field: a blue search mark, the 19px display input, and an optional hint at the right (`hint="Esc"`). */
function CommandInput({ className, hint, ...props }: React.ComponentProps<typeof CommandPrimitive.Input> & { hint?: React.ReactNode }) {
  return (
    <div data-slot="command-input-wrapper" className="flex shrink-0 items-center gap-2.5 border-b-2 border-dotted border-line-mid px-4 text-fg-brand">
      <SearchMark />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-13.5 min-w-0 flex-1 bg-transparent font-display text-body-lg text-fg caret-primary outline-none placeholder:text-fg-faint disabled:opacity-50 [&::-webkit-search-cancel-button]:hidden",
          className,
        )}
        {...props}
      />
      {hint ? <kbd className="shrink-0 font-display text-caption text-fg-faint">{hint}</kbd> : null}
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn("min-h-0 flex-1 scroll-py-2 overflow-x-hidden overflow-y-auto px-2 pt-1.5 pb-2 [scrollbar-color:var(--ds-color-border-default)_transparent] [scrollbar-width:thin]", className)}
      {...props}
    />
  );
}

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty data-slot="command-empty" className={cn("px-3.5 py-4.5 font-display text-body-sm text-fg-muted", className)} {...props} />;
}

// A group's heading in the 12px display face in blue; every group after the first visible one is ruled off by a 2px
// dotted line at 16 percent ink.
function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "[&_[cmdk-group-heading]]:px-3.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:font-display [&_[cmdk-group-heading]]:text-caption [&_[cmdk-group-heading]]:leading-body [&_[cmdk-group-heading]]:text-fg-brand [[cmdk-group]:not([hidden])~&]:mt-1.5 [[cmdk-group]:not([hidden])~&]:border-t-2 [[cmdk-group]:not([hidden])~&]:border-dotted [[cmdk-group]:not([hidden])~&]:border-hairline [[cmdk-group]:not([hidden])~&_[cmdk-group-heading]]:pt-3.5",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return <CommandPrimitive.Separator data-slot="command-separator" className={cn("my-1.5 border-t-2 border-dotted border-hairline", className)} {...props} />;
}

/** A row: the title (children) in the 16px display face, an optional `description` under it, the return mark when
 * highlighted. */
function CommandItem({ className, children, description, ...props }: React.ComponentProps<typeof CommandPrimitive.Item> & { description?: React.ReactNode }) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/item relative grid cursor-pointer gap-0.75 rounded-sm py-2.5 pr-10 pl-3.5 text-fg outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40 data-[selected=true]:bg-search-selected",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2.5 font-display text-body leading-body font-medium tracking-[calc(var(--ds-tracking-tight)/2)] [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-fg-brand">{children}</span>
      {description ? <span className="truncate font-display text-caption leading-normal text-fg-muted">{description}</span> : null}
      <span aria-hidden className="absolute top-1/2 right-3.5 -translate-y-1/2 font-display text-body-sm text-fg-brand opacity-0 group-data-[selected=true]/item:opacity-100">
        ↵
      </span>
    </CommandPrimitive.Item>
  );
}

// The keys under the list: the sky bar, blue 10px labels, each key a small white box on a blue edge. Hidden on phones,
// which have no keyboard to hint at.
function CommandFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-footer"
      aria-hidden
      className={cn(
        "flex shrink-0 gap-4.5 border-t border-line-window bg-window-bar px-3.5 py-2 font-display text-micro text-window-bar-fg max-md:hidden [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1 [&_kbd]:min-w-4.5 [&_kbd]:rounded-[calc(var(--ds-radius-control)/2)] [&_kbd]:border [&_kbd]:border-line-window [&_kbd]:bg-surface [&_kbd]:px-1 [&_kbd]:py-px [&_kbd]:text-center [&_kbd]:font-[inherit] [&_kbd]:leading-4",
        className,
      )}
      {...props}
    />
  );
}

export { Command, CommandDialog, CommandEmpty, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator };
