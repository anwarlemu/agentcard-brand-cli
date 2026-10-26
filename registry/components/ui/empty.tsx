import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { WindowBar } from "@/components/ui/window";
import { cn } from "@/lib/utils";

// shadcn's Empty in the look of the brand's empty state: a quiet window with a 16 percent ink hairline, 12px corners and
// no drop, the 32px sky bar labeled like a file (`name`: cards.list, search.results; null drops it), over a centered
// body on the pale ground. The media is a small white key (`icon`: 40px, the key's bevel, a blue glyph); the title the
// 20px display face at 500, tracked tight; the description 14px Inter at 68 percent ink; then at most one action.
// Nothing moves.
function Empty({ className, name = "empty", tone, children, ...props }: React.ComponentProps<"div"> & { name?: React.ReactNode | null; tone?: React.ComponentProps<typeof WindowBar>["tone"] }) {
  return (
    <div data-slot="empty" className={cn("flex min-w-0 flex-col overflow-hidden rounded-card border border-hairline bg-surface text-fg", className)} {...props}>
      {name !== null && <WindowBar name={name} tone={tone} />}
      <div data-slot="empty-body" className="flex flex-1 flex-col items-center justify-center gap-5 bg-subtle px-6 py-12 text-center text-balance md:py-16">
        {children}
      </div>
    </div>
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-header" className={cn("flex max-w-sm flex-col items-center gap-3", className)} {...props} />;
}

const emptyMediaVariants = cva("flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0", {
  variants: {
    variant: {
      default: "bg-transparent",
      icon: "mb-1 size-10 rounded-control border border-hairline bg-surface text-fg-brand shadow-key [&_svg:not([class*='size-'])]:size-4.5",
    },
  },
  defaultVariants: { variant: "default" },
});

function EmptyMedia({ className, variant = "default", ...props }: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return <div data-slot="empty-media" data-variant={variant} aria-hidden={variant === "icon" || undefined} className={cn(emptyMediaVariants({ variant }), className)} {...props} />;
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-title" className={cn("font-display text-h4 leading-snug font-medium tracking-tight text-fg", className)} {...props} />;
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="empty-description" className={cn("max-w-sm text-body-sm leading-relaxed text-pretty text-fg-muted [&>a]:text-fg-brand [&>a]:underline [&>a]:underline-offset-4", className)} {...props} />;
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-content" className={cn("flex w-full max-w-sm min-w-0 flex-col items-center gap-3 text-body-sm text-balance", className)} {...props} />;
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle };
