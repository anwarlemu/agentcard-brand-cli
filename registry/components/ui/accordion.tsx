"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";

// The brand's FAQ list (agentcard.sh /, .faq-list under .v7-page, measured as rendered): a 14 percent ink rule above
// the first question and a 20 percent one under each; the question in the 14px display face at 500 (tracked -0.01em,
// 1.2 leading, 20px by 14px of padding, 6px corners), blue and on a faint wash under the pointer (the wash eases in
// 160ms, the color does not); a drawn + (a bar across and a bar down in a 30px box, not a glyph) that turns an eighth
// into an x when open (220ms ease-out). Open, the question and its mark stay blue. The answer is 14px Inter at 1.8
// leading, 68 percent ink at 80 percent opacity, 540px wide; it slides open in 200ms ease-out (and shut in 200ms) and
// fades down 4px into place (240ms, 40ms late). Reduced motion opens it at once.
function Accordion(props: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn("border-b border-b-ink/20 first:border-t first:border-t-line", className)} {...props} />;
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
          "group flex flex-1 cursor-pointer items-center justify-between gap-3.75 rounded-sm px-3.5 py-5 text-left font-display text-body-sm font-medium [letter-spacing:-0.01em] [line-height:1.2] text-fg transition-[background-color] duration-160 ease-out outline-none hover:bg-ink/5 hover:text-fg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-fg-brand motion-reduce:transition-none",
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
      className="overflow-hidden text-body-sm [line-height:1.8] text-fg-muted motion-safe:data-[state=closed]:animate-accordion-up data-[state=closed]:[animation-duration:var(--ds-duration-base)] motion-safe:data-[state=open]:animate-accordion-down motion-reduce:animate-none"
      {...props}
    >
      <div className={cn("max-w-135 px-3.5 pb-5.5 opacity-80 transition-[opacity,translate] delay-40 duration-240 ease-out starting:-translate-y-1 starting:opacity-0 motion-reduce:transition-none", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionMark, AccordionTrigger };
