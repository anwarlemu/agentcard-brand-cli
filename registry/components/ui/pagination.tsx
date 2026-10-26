import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

// Page links drawn as the brand's keys (button.tsx, the v7 bevel): each page a 32px key in the 14px display face, quiet
// (68 percent ink, a faint wash under the pointer) until it is the current page, which is the blue key (a darker blue
// edge, the light line inside the top, the soft drop) with white figures, as the selected tab is. Previous and Next are
// quiet keys with a chevron. A press sinks a key a pixel. Disabled ends fade and take no pointer.
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav role="navigation" aria-label="pagination" data-slot="pagination" className={cn("flex w-full justify-center", className)} {...props} />;
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex flex-row flex-wrap items-center gap-1", className)} {...props} />;
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = { isActive?: boolean; size?: "icon" | "default" } & React.ComponentProps<"a">;

const LINK =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-control border font-display text-body-sm leading-none whitespace-nowrap tabular-nums outline-none transition-[background-color,color,box-shadow,translate] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring active:translate-y-px aria-disabled:pointer-events-none aria-disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:translate-y-0 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0";

function PaginationLink({ className, isActive, size = "icon", ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive || undefined}
      className={cn(
        LINK,
        size === "icon" ? "min-w-8 px-2" : "px-3",
        isActive ? "border-line-brand-edge bg-primary text-on-primary shadow-key-brand active:shadow-pressed" : "border-transparent text-fg-muted hover:bg-wash-pill hover:text-fg",
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({ className, children = "Previous", ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to previous page" size="default" className={cn("pl-2", className)} {...props}>
      <ChevronLeft aria-hidden strokeWidth={1.75} />
      <span>{children}</span>
    </PaginationLink>
  );
}

function PaginationNext({ className, children = "Next", ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to next page" size="default" className={cn("pr-2", className)} {...props}>
      <span>{children}</span>
      <ChevronRight aria-hidden strokeWidth={1.75} />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span aria-hidden data-slot="pagination-ellipsis" className={cn("flex h-8 min-w-8 items-center justify-center text-fg-faint", className)} {...props}>
      <MoreHorizontal strokeWidth={1.5} className="size-3.5" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious };
