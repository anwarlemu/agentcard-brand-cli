"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { Button } from "@/components/ui/button";
import { Window } from "@/components/ui/window";
import { cn } from "@/lib/utils";

// The pricing page (agentcard.sh/pricing; .v7-pricing, .plan-tabs, .v7-offer-card): a 52px title, product tabs on the
// brand's sunken track with the blue key gliding to the chosen one, and that product's plans as windows, two across. A
// plan window has the sky bar (vault-free.plan; blue for the featured plan), its name at 24px, who it is for, the figure
// at 36px with its unit, a dotted rule, the features (a blue check, the title in ink, the detail muted), a dotted rule
// and the full-width blue key, over the hard 6px offset shadow. Plans side by side share rows, so their figures, lists
// and keys line up. Switching products slides the new plans up in turn; the old ones fade out at once.

type PlanFeature = { title: React.ReactNode; detail?: React.ReactNode };
type PlanAction = { label: React.ReactNode; href: string };

type Plan = {
  /** The plan's full name, as its title ("Vault Free"). */
  name: string;
  /** Who it is for, under the name. */
  line?: React.ReactNode;
  price?: React.ReactNode;
  /** Beside the figure: "up to 5,000 users", "/ month". */
  unit?: React.ReactNode;
  /** Points at the plan this one builds on, above its own features ("All features in the Free plan, plus:"). */
  includes?: React.ReactNode;
  features?: PlanFeature[];
  /** The plan's key: a label and href (the full-width blue key), or your own element. */
  action?: PlanAction | React.ReactNode;
  /** The plan to steer toward: its bar is blue. One per product at most. */
  featured?: boolean;
  /** The bar's name; defaults to the plan's slug with .plan. */
  file?: string;
};

type PricingProduct = { label: string; plans: Plan[] };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const isAction = (a: Plan["action"]): a is PlanAction => typeof a === "object" && a !== null && !React.isValidElement(a) && "href" in a;

function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="mt-0.75 size-4 fill-none stroke-brand [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.8]">
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  );
}

function PlanWindow({ plan, index, active }: { plan: Plan; index: number; active: boolean }) {
  const features = plan.features ?? [];
  return (
    <Window
      name={plan.file ?? `${slug(plan.name)}.plan`}
      tone={plan.featured ? "blue" : "sky"}
      // The new product's plans come up one after another; the old ones fade out at once.
      style={{ transitionDelay: active ? `${index * 35}ms` : "0ms" }}
      className={cn(
        "shadow-plan lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:gap-0",
        "transition-[opacity,translate] duration-(--ds-duration-moderate) ease-out motion-reduce:transition-none",
        !active && "opacity-0 duration-150 motion-safe:translate-y-2",
      )}
      bodyClassName="flex flex-col gap-3 p-5.5 md:px-7 md:py-5 lg:row-[2/-1] lg:grid lg:grid-rows-subgrid lg:gap-y-3"
    >
      <header className="flex flex-col gap-1.5">
        <h3 className="font-display text-h3 leading-display font-medium tracking-tight">{plan.name}</h3>
        {plan.line && <p className="text-body-sm leading-5.5 text-fg-muted">{plan.line}</p>}
      </header>
      <p className="flex items-baseline gap-2">
        {plan.price && <span className="font-display text-h2 leading-none font-medium tracking-tight">{plan.price}</span>}
        {plan.unit && <span className="text-body-sm leading-5.5 text-fg-muted">{plan.unit}</span>}
      </p>
      <div className="flex min-h-18 flex-1 flex-col items-start border-y-2 border-dotted border-line py-5">
        {plan.includes && <p className="mb-3 text-body-sm leading-normal font-medium last:mb-0">{plan.includes}</p>}
        {features.length > 0 && (
          <ul className="flex flex-col gap-3 self-stretch text-body-sm leading-normal">
            {features.map((feature, i) => (
              <li key={i} className="grid grid-cols-[1rem_minmax(0,1fr)] items-start gap-2.5">
                <Check />
                <span>
                  <b className="block font-medium">{feature.title}</b>
                  {feature.detail && <small className="block text-body-sm leading-5 opacity-65">{feature.detail}</small>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="lg:self-end">
        {isAction(plan.action) ? (
          <Button asChild className="w-full">
            <a href={plan.action.href}>{plan.action.label}</a>
          </Button>
        ) : (
          plan.action
        )}
      </div>
    </Window>
  );
}

function Pricing({
  title,
  products,
  className,
  ...props
}: Omit<React.ComponentProps<"section">, "title"> & { title?: React.ReactNode; products: PricingProduct[] }) {
  const [active, setActive] = React.useState(0);
  const index = Math.min(active, products.length - 1);
  return (
    <section data-slot="pricing" className={cn("flex flex-col items-center gap-5", className)} {...props}>
      {title && <h2 className="text-center font-display text-h1 leading-heading font-medium tracking-tight">{title}</h2>}
      <TabsPrimitive.Root value={String(index)} onValueChange={(v) => setActive(Number(v))} className="flex w-full flex-col items-center gap-5">
        {products.length > 1 && (
          <TabsPrimitive.List
            aria-label="Products"
            style={{ "--tabs": products.length, "--tab": index } as React.CSSProperties}
            className="relative isolate grid w-full max-w-170 grid-cols-[repeat(var(--tabs),minmax(0,1fr))] gap-1 rounded-card border border-hairline bg-subtle p-1 shadow-well"
          >
            {/* The blue key: one thumb under the labels, travelling to the chosen tab. */}
            <span
              aria-hidden
              className="pointer-events-none absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem-(var(--tabs)-1)*0.25rem)/var(--tabs))] translate-x-[calc(var(--tab)*(100%+0.25rem))] rounded-control border border-line-brand-edge bg-primary shadow-key-brand transition-[translate] duration-(--ds-duration-moderate) ease-in-out motion-reduce:transition-none"
            />
            {products.map((product, i) => (
              <TabsPrimitive.Trigger
                key={product.label}
                value={String(i)}
                className="relative z-10 flex h-10 items-center justify-center rounded-control border border-transparent px-4 font-display text-body-sm whitespace-nowrap text-fg-muted outline-none transition-[background-color,color] duration-150 ease-out hover:bg-[color-mix(in_srgb,var(--ds-color-ink)_6%,transparent)] hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring data-[state=active]:text-on-primary data-[state=active]:delay-100 data-[state=active]:hover:bg-transparent max-sm:px-0 motion-reduce:transition-none"
              >
                {product.label}
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>
        )}
        {/* Every product's plans share one cell, so the page keeps the tallest group's height between tabs. */}
        <div className="mt-3 grid w-full max-w-130 lg:max-w-250">
          {products.map((product, p) => (
            <TabsPrimitive.Content
              key={product.label}
              value={String(p)}
              forceMount
              className={cn(
                "grid grid-cols-1 gap-x-6 gap-y-4 self-start outline-none [grid-area:1/1] lg:gap-y-0",
                product.plans.length === 1 ? "lg:grid-cols-[minmax(0,calc(50%-0.75rem))] lg:justify-center" : "lg:grid-cols-2",
                "transition-[visibility] duration-150 data-[state=inactive]:pointer-events-none data-[state=inactive]:invisible motion-reduce:transition-none",
              )}
            >
              {product.plans.map((plan, i) => (
                <PlanWindow key={plan.name} plan={plan} index={i} active={p === index} />
              ))}
            </TabsPrimitive.Content>
          ))}
        </div>
      </TabsPrimitive.Root>
    </section>
  );
}

export { Pricing, type Plan, type PlanFeature, type PricingProduct };
