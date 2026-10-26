# Breadcrumb
A trail in the 12px display face: muted links, faint chevrons, the current page in ink.

Install: npx agentcard-ds add breadcrumb
Requires: theme, utils
Packages: @radix-ui/react-slot, lucide-react
Exports: Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
Client boundary: not required by this entry file
Reference: Extrapolated from Agentcard (the guides' 12px display labels)


## Usage
Use above a page title in deep sections (Agents, Travel agent, Cards). Keep the trail short; collapse the middle with BreadcrumbEllipsis.
- Avoid: A breadcrumb on top-level pages
- Avoid: Links in the brand blue
- Avoid: Separators other than the chevron or a slash


## Examples
Example components: npx agentcard-ds add breadcrumb dropdown-menu
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/breadcrumb/Site) | [Collapsed](https://agentcard-ds.vercel.app/preview/breadcrumb/Collapsed) | [CustomSeparator](https://agentcard-ds.vercel.app/preview/breadcrumb/CustomSeparator)

examples/breadcrumb.tsx

```tsx
"use client";

import { Slash } from "lucide-react";

import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Site() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#agents">Agents</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#travel-agent">Travel agent</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Cards</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function Collapsed() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#workspace">Workspace</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-chip outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus-ring" aria-label="Show more of the path">
              <BreadcrumbEllipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Agents</DropdownMenuItem>
              <DropdownMenuItem>Travel agent</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#cards">Cards</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Card ending 4242</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function CustomSeparator() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#docs">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash strokeWidth={1.5} />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Spending limits</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

```

## Source

components/ui/breadcrumb.tsx

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

// Where a page sits, as the guides set their trail above a title: the 12px display face, links in 68 percent ink that
// turn ink under the pointer (color only, 150ms ease-out), a faint chevron between them, the current page in ink. It
// wraps on a phone rather than scrolling.
function Breadcrumb(props: React.ComponentProps<"nav">) {
  return <nav aria-label="Breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="breadcrumb-list" className={cn("flex flex-wrap items-center gap-1.5 font-display text-caption leading-snug break-words text-fg-muted sm:gap-2", className)} {...props} />;
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-1.5", className)} {...props} />;
}

function BreadcrumbLink({ asChild, className, ...props }: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("rounded-chip outline-none transition-colors duration-150 ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring motion-reduce:transition-none", className)}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" className={cn("text-fg", className)} {...props} />;
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className={cn("text-fg-faint [&>svg]:size-3", className)} {...props}>
      {children ?? <ChevronRight strokeWidth={1.75} />}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="breadcrumb-ellipsis" role="presentation" aria-hidden="true" className={cn("flex size-6 items-center justify-center [&>svg]:size-3.5", className)} {...props}>
      <MoreHorizontal strokeWidth={1.5} />
      <span className="sr-only">More</span>
    </span>
  );
}

export { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator };

```
