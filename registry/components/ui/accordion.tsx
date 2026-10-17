"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";

// The brand's FAQ list (agentcard.sh, .faq-list on /): 14 percent ink rules above and below each question; the question
// in the 14px display face at 500, a faint wash under the pointer; a drawn + (a bar across and a bar down, not a glyph)
// that turns an eighth into an x when open (220ms ease-out). Open, the question and its mark turn blue. The answer is
// Inter at 68 percent ink, sliding open in 200ms ease-out and fading in. Reduced motion opens it at once.
function Accordion(props: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn("border-b border-line first:border-t", className)} {...props} />;
}

/** The FAQ's mark: a 12px plus drawn in two 1.5px bars, in a 30px box so a column of them lines up. */
function AccordionMark({ className }: { className?: string }) {
  return (
    <span aria-hidden data-slot="accordion-mark" className={cn("grid h-3.5 w-7.5 shrink-0 place-items-center self-center text-fg-faint transition-[rotate,color] duration-220 ease-out motion-reduce:transition-none", className)}>
      <svg viewBox="0 0 12 12" className="size-3 fill-none stroke-current [stroke-width:1.5]">
        <path d="M0 6h12M6 0v12" />
      </svg>
    </span>
  );
}

function AccordionTrigger({ className, children, icon, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger> & { icon?: React.ReactNode | null }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 items-baseline justify-between gap-6 rounded-sm px-3.5 py-5 text-left font-display text-body-sm leading-snug font-medium tracking-tight text-fg transition-[background-color,color] duration-150 ease-out outline-none hover:bg-wash-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-fg-brand max-md:gap-4 max-md:py-4 motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        {children}
        {icon === undefined ? <AccordionMark className="group-hover:text-fg-brand group-data-[state=open]:rotate-45 group-data-[state=open]:text-fg-brand" /> : icon}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="group/content overflow-hidden text-body-sm leading-relaxed text-fg-muted data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none"
      {...props}
    >
      <div className={cn("max-w-135 px-3.5 pb-5.5 group-data-[state=open]/content:animate-fade-in", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionMark, AccordionTrigger };
