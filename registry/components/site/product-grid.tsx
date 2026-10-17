import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// The products (agentcard.sh home, "Explore our products"; .v7-sol): large raised cards, white with 20px corners, a
// hairline and the hard 7px offset shadow, each holding a blue stage for the product's picture and its copy. A `lead`
// card spans the row, the stage on one side and the copy on the other (each lead turns the other way from the last);
// `half` cards pair up, stage above copy, their stages and copy lined up across the pair. Titles are the display face
// at 36px and 400, the line 19px at 60 percent ink, then the blue key. Below 1024px every card stacks, stage first.

type ProductAction = { label: React.ReactNode; href: string; icon?: React.ReactNode };

type ProductItem = {
  title: React.ReactNode;
  description: React.ReactNode;
  /** The card's key: a label and href (the blue key), or your own element. */
  action?: ProductAction | React.ReactNode;
  /** The product's picture on the blue stage: a screen, a window, a 3D object. */
  media: React.ReactNode;
  layout?: "lead" | "half";
};

const isAction = (a: ProductItem["action"]): a is ProductAction => typeof a === "object" && a !== null && !React.isValidElement(a) && "href" in a;

function Action({ action, className }: { action: ProductItem["action"]; className?: string }) {
  if (!action) return null;
  if (!isAction(action)) return <div className={className}>{action}</div>;
  return (
    <Button asChild className={className}>
      <a href={action.href}>
        {action.label}
        {action.icon}
      </a>
    </Button>
  );
}

// The stage: the blue ground under the brand's horizontal lines, darkened toward its edges.
function Stage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative isolate flex min-h-80 items-center justify-center overflow-hidden rounded-card bg-brand p-[clamp(0.875rem,1.8vw,1.375rem)]",
        "before:absolute before:inset-0 before:-z-10 before:bg-[repeating-linear-gradient(0deg,color-mix(in_srgb,var(--ds-color-ink)_58%,transparent)_0_3px,transparent_3px_5px)]",
        "after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:bg-[radial-gradient(ellipse_at_center,transparent_55%,color-mix(in_srgb,var(--ds-color-ink)_38%,transparent)),linear-gradient(90deg,color-mix(in_srgb,var(--ds-color-ink)_34%,transparent),transparent_16%,transparent_84%,color-mix(in_srgb,var(--ds-color-ink)_34%,transparent))]",
        className,
      )}
    >
      {children}
    </div>
  );
}

const CARD = "rounded-shell border border-hairline bg-surface p-3 text-fg shadow-raised max-lg:mx-auto max-lg:w-full max-lg:max-w-140";
const TITLE = "mb-3 font-display text-h2 leading-display font-normal tracking-tighter";
const LINE = "text-body-lg leading-snug tracking-tight opacity-60";

function LeadCard({ product, reverse }: { product: ProductItem; reverse: boolean }) {
  return (
    <li
      className={cn(
        CARD,
        "grid grid-cols-1 items-center lg:col-span-2 lg:gap-[clamp(2rem,5vw,4.5rem)]",
        reverse ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]" : "lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]",
      )}
    >
      <Stage className={cn("self-stretch", reverse && "lg:order-2")}>{product.media}</Stage>
      <div className={cn("px-3 pt-5.5 pb-3 lg:px-0 lg:py-6", reverse ? "lg:pl-[clamp(1.25rem,3vw,3rem)]" : "lg:pr-[clamp(1.25rem,3vw,3rem)]")}>
        <h3 className={TITLE}>{product.title}</h3>
        <p className={cn(LINE, "max-w-[30ch]")}>{product.description}</p>
        <Action action={product.action} className="mt-5.5" />
      </div>
    </li>
  );
}

function HalfCard({ product }: { product: ProductItem }) {
  return (
    <li className={cn(CARD, "grid grid-cols-1 lg:row-span-2 lg:grid-rows-subgrid lg:gap-0")}>
      <Stage className="self-stretch py-[clamp(1.125rem,2vw,1.625rem)]">{product.media}</Stage>
      <div className="flex flex-col self-stretch px-3 pt-5.5 pb-3">
        <h3 className={TITLE}>{product.title}</h3>
        <p className={cn(LINE, "mb-9 max-w-[44ch]")}>{product.description}</p>
        {product.action && <Action action={product.action} className="mt-auto self-start" />}
      </div>
    </li>
  );
}

/** The product cards: leads across the row, halves in pairs. */
function ProductGrid({ products, className, ...props }: React.ComponentProps<"ul"> & { products: ProductItem[] }) {
  let leads = 0;
  return (
    <ul data-slot="product-grid" className={cn("grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8", className)} {...props}>
      {products.map((product, i) =>
        product.layout === "half" ? <HalfCard key={i} product={product} /> : <LeadCard key={i} product={product} reverse={leads++ % 2 === 1} />,
      )}
    </ul>
  );
}

export { ProductGrid, type ProductItem, type ProductAction };
