"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Window } from "@/components/ui/window";
import { cn } from "@/lib/utils";

// The FAQ (agentcard.sh home; .faq-card, .faq-tabs, .faq-list): one large window (the sky bar, faq.help) holding the
// 52px title, a one-line lead, topic tabs on the brand's sunken track with the blue key gliding to the chosen one, and
// the questions on light rules. A question is the display face at 14px and 500 beside a drawn +, which turns into an x
// as the answer slides open; hovering washes the row and turns it blue. The topics share one cell, so the window keeps
// the tallest topic's height and never jumps; switching fades the old questions out and brings the new ones up in turn.

type FaqItem = { question: React.ReactNode; answer: React.ReactNode };
type FaqTopic = { label: string; items: FaqItem[] };

const QUESTION =
  "group items-baseline gap-4 rounded-sm px-3.5 py-5 font-display text-body-sm [line-height:1.2] font-medium [letter-spacing:-0.01em] text-fg transition-[background-color,color] duration-(--ds-duration-fast) ease-out hover:bg-[color-mix(in_srgb,var(--ds-color-ink)_5%,transparent)] hover:text-fg-brand data-[state=open]:text-fg-brand motion-reduce:transition-none";

// The + is drawn, not typed: a bar across and a bar down, turning an eighth into an x when open.
const PLUS =
  "h-3.5 w-7.5 flex-none self-center bg-[linear-gradient(currentColor,currentColor),linear-gradient(currentColor,currentColor)] bg-[length:12px_1.5px,1.5px_12px] bg-center bg-no-repeat text-fg-faint transition-[rotate,color] duration-200 ease-out group-hover:text-fg-brand group-data-[state=open]:rotate-45 group-data-[state=open]:text-fg-brand motion-reduce:transition-none";

function Faq({
  title,
  lead,
  topics,
  bar = "faq.help",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & { title: React.ReactNode; lead?: React.ReactNode; topics: FaqTopic[]; bar?: React.ReactNode }) {
  const [active, setActive] = React.useState(0);
  const index = Math.min(active, topics.length - 1);
  const tabbed = topics.length > 1;
  return (
    <Window
      name={bar}
      data-slot="faq"
      className={cn("mx-auto w-full max-w-198 shadow-[var(--ds-shadow-card),0_18px_40px_-24px_color-mix(in_srgb,var(--ds-color-ink)_45%,transparent)]", className)}
      bodyClassName="flex flex-col items-center px-5 pt-5 pb-5 md:px-14 md:pt-13.5 md:pb-13.5"
      {...props}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="font-display text-h1 leading-display font-medium tracking-tight text-balance">{title}</h2>
        {lead && <p className="max-w-[36ch] text-body text-fg-muted">{lead}</p>}
      </div>
      <TabsPrimitive.Root value={String(index)} onValueChange={(v) => setActive(Number(v))} className="flex w-full max-w-170 flex-col">
        {tabbed && (
          <TabsPrimitive.List
            style={{ "--tabs": topics.length, "--tab": index } as React.CSSProperties}
            className="relative isolate mt-8 mb-6 grid grid-cols-[repeat(var(--tabs),minmax(0,1fr))] gap-1 rounded-card border border-hairline bg-subtle p-1 shadow-well md:mt-11 md:mb-9"
          >
            {/* The blue key: one thumb under the labels, travelling to the chosen tab. */}
            <span
              aria-hidden
              className="pointer-events-none absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem-(var(--tabs)-1)*0.25rem)/var(--tabs))] translate-x-[calc(var(--tab)*(100%+0.25rem))] rounded-control border border-line-brand-edge bg-primary shadow-key-brand transition-[translate] duration-(--ds-duration-moderate) ease-in-out motion-reduce:transition-none"
            />
            {topics.map((topic, i) => (
              <TabsPrimitive.Trigger
                key={topic.label}
                value={String(i)}
                className="relative z-10 flex h-10 items-center justify-center rounded-control border border-transparent px-4 font-display text-body-sm whitespace-nowrap text-fg-muted outline-none transition-[background-color,color] duration-150 ease-out hover:bg-[color-mix(in_srgb,var(--ds-color-ink)_6%,transparent)] hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring data-[state=active]:text-on-primary data-[state=active]:delay-100 data-[state=active]:hover:bg-transparent max-sm:px-0 motion-reduce:transition-none"
              >
                {topic.label}
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>
        )}
        <div className={cn("grid w-full", !tabbed && "mt-8 md:mt-11")}>
          {topics.map((topic, t) => (
            <TabsPrimitive.Content
              key={topic.label}
              value={String(t)}
              forceMount
              className="group/topic [grid-area:1/1] self-start outline-none transition-[visibility] duration-150 data-[state=inactive]:pointer-events-none data-[state=inactive]:invisible"
            >
              <Accordion type="multiple">
                {topic.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={String(i)}
                    // The chosen topic's questions come up one after another; the old ones fade out at once.
                    style={{ transitionDelay: t === index ? `${110 + i * 22}ms` : "0ms" }}
                    className="border-b border-[color-mix(in_srgb,var(--ds-color-ink)_20%,transparent)] transition-[opacity,translate] duration-(--ds-duration-moderate) ease-out first:border-t first:border-t-line group-data-[state=inactive]/topic:opacity-0 group-data-[state=inactive]/topic:duration-150 motion-safe:group-data-[state=inactive]/topic:translate-y-2"
                  >
                    <AccordionTrigger className={QUESTION} icon={<span aria-hidden className={PLUS} />}>
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="max-w-135 px-3.5 pb-5.5 text-body-sm [line-height:1.8] text-fg-muted opacity-80">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsPrimitive.Content>
          ))}
        </div>
      </TabsPrimitive.Root>
    </Window>
  );
}

export { Faq, type FaqTopic, type FaqItem };
