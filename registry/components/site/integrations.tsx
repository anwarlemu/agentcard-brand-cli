"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

// The integrations (agentcard.sh home, "Integrates natively with the tools you use"; .v7-intg): one large raised card per
// kind of integration, on paper with the hard offset shadow. The copy sits at one side (a 36px title, a 19px line at
// 70 percent ink, then a list of raised rows, one per tool); a blue stage at the other shows the chosen tool, usually a
// code window with a glass panel over its corner. Choosing a row presses it in (blue edge, pale blue fill, the pressed
// well) and crossfades the stage. Rows alternate sides; below 1024px the copy sits above the stage.

type IntegrationOption = {
  label: React.ReactNode;
  /** The tool's mark, about 24px (decorative: the label is beside it). */
  icon?: React.ReactNode;
  /** What the stage shows for this tool: an IntegrationCode, an IntegrationScreen, or both. */
  panel: React.ReactNode;
};

type IntegrationRow = { title: React.ReactNode; description: React.ReactNode; options: IntegrationOption[] };

const ROW =
  "grid grid-cols-1 items-center gap-6 rounded-shell border border-[color-mix(in_srgb,var(--ds-color-ink)_12%,transparent)] bg-paper pt-6 pb-3 px-3 text-fg shadow-[inset_0_1px_0_var(--ds-color-white),inset_0_-3px_0_color-mix(in_srgb,var(--ds-color-ink)_6%,transparent),7px_7px_0_color-mix(in_srgb,var(--ds-color-ink)_10%,transparent)] lg:gap-[clamp(1.5rem,4vw,3.5rem)] lg:py-3";

const OPTION =
  "relative flex h-14 items-center gap-3 overflow-hidden rounded-control border px-4 text-left text-body-sm font-medium tracking-tight text-fg outline-none transition-[translate,box-shadow,border-color,background-color] duration-(--ds-duration-fast) ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring motion-reduce:transition-none " +
  // Unpicked: a raised white row on a 3px ledge that lifts a pixel under the pointer.
  "border-hairline bg-[linear-gradient(180deg,var(--ds-color-white),color-mix(in_srgb,var(--ds-color-ink)_3%,var(--ds-color-white)))] shadow-[var(--ds-shadow-key),0_3px_0_color-mix(in_srgb,var(--ds-color-ink)_10%,transparent)] hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--ds-color-ink)_28%,transparent)] hover:shadow-[var(--ds-shadow-key),0_4px_0_color-mix(in_srgb,var(--ds-color-ink)_12%,transparent)] " +
  // Picked: pressed in, the blue edge and a pale blue fill.
  "data-[state=active]:translate-y-0.5 data-[state=active]:border-brand data-[state=active]:bg-blue-5 data-[state=active]:bg-none data-[state=active]:shadow-[var(--ds-shadow-pressed),0_1px_0_var(--ds-color-brand)] data-[state=active]:hover:translate-y-0.5 data-[state=active]:hover:border-brand data-[state=active]:hover:shadow-[var(--ds-shadow-pressed),0_1px_0_var(--ds-color-brand)] motion-reduce:hover:translate-y-0";

function Row({ row, index }: { row: IntegrationRow; index: number }) {
  const [value, setValue] = React.useState("0");
  const reverse = index % 2 === 1;
  return (
    <TabsPrimitive.Root asChild value={value} onValueChange={setValue} orientation="vertical">
      <li
        className={cn(
          ROW,
          reverse ? "lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] lg:pr-[clamp(1.5rem,3vw,2.5rem)]" : "lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)] lg:pl-[clamp(1.5rem,3vw,2.5rem)]",
        )}
      >
        <div className="px-3 lg:px-0">
          <h3 className="mb-3.5 font-display text-h2 leading-heading font-medium tracking-display">{row.title}</h3>
          <p className="mb-7 max-w-[34ch] text-body-lg leading-6.5 tracking-tight opacity-70">{row.description}</p>
          <TabsPrimitive.List className="grid gap-2" aria-label={typeof row.title === "string" ? row.title : undefined}>
            {row.options.map((option, i) => (
              <TabsPrimitive.Trigger key={i} value={String(i)} className={OPTION}>
                {option.icon && (
                  <span aria-hidden className="flex size-6 flex-none items-center justify-center [&>img]:size-full [&>svg]:size-full">
                    {option.icon}
                  </span>
                )}
                {option.label}
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>
        </div>
        <div
          className={cn(
            "relative isolate flex items-center overflow-hidden rounded-card bg-brand p-[clamp(1.125rem,2.4vw,2rem)] lg:min-h-105",
            "before:absolute before:inset-0 before:-z-10 before:bg-[repeating-linear-gradient(0deg,color-mix(in_srgb,var(--ds-color-ink)_58%,transparent)_0_3px,transparent_3px_5px)]",
            "after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:bg-[radial-gradient(ellipse_at_center,transparent_55%,color-mix(in_srgb,var(--ds-color-ink)_38%,transparent)),linear-gradient(90deg,color-mix(in_srgb,var(--ds-color-ink)_34%,transparent),transparent_16%,transparent_84%,color-mix(in_srgb,var(--ds-color-ink)_34%,transparent))]",
            reverse && "lg:order-first",
          )}
        >
          {/* Every tool's panel shares one cell, so the stage keeps the tallest one's height and never jumps. */}
          <div className="grid w-full items-center">
            {row.options.map((option, i) => (
              <TabsPrimitive.Content
                key={i}
                value={String(i)}
                forceMount
                className="[grid-area:1/1] outline-none transition-[opacity,visibility] duration-200 ease-out data-[state=inactive]:pointer-events-none data-[state=inactive]:invisible data-[state=inactive]:opacity-0 motion-reduce:transition-none"
              >
                {option.panel}
              </TabsPrimitive.Content>
            ))}
          </div>
        </div>
      </li>
    </TabsPrimitive.Root>
  );
}

/** The integration rows, alternating sides. */
function Integrations({ rows, className, ...props }: React.ComponentProps<"ul"> & { rows: IntegrationRow[] }) {
  return (
    <ul data-slot="integrations" className={cn("grid gap-6", className)} {...props}>
      {rows.map((row, i) => (
        <Row key={i} row={row} index={i} />
      ))}
    </ul>
  );
}

/** A code window for the stage: ink, a 30px bar with three marks and the file's name, code in the display face. */
function IntegrationCode({ name, children, className }: { name: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-full overflow-hidden rounded-control bg-code text-[color-mix(in_srgb,var(--ds-color-white)_88%,transparent)] shadow-code md:w-[88%] lg:h-78", className)}>
      <div className="flex h-7.5 items-center gap-1.5 border-b border-[color-mix(in_srgb,var(--ds-color-white)_10%,transparent)] px-3 text-micro text-[color-mix(in_srgb,var(--ds-color-white)_55%,transparent)]">
        <i className="size-2 rounded-chip bg-[color-mix(in_srgb,currentColor_45%,transparent)]" />
        <i className="size-2 rounded-chip bg-[color-mix(in_srgb,currentColor_45%,transparent)]" />
        <i className="size-2 rounded-chip bg-[color-mix(in_srgb,currentColor_45%,transparent)]" />
        <span className="ml-2">{name}</span>
      </div>
      <pre className="overflow-hidden px-4 pt-3.5 pb-15 font-mono text-micro [line-height:1.55] whitespace-pre md:text-caption">{children}</pre>
    </div>
  );
}

/**
 * A glass panel for the stage, laid over the code window's lower corner when it follows one: a bar with the tool's name
 * and an address, then your content (rows, steps, a conversation) in white on the glass.
 */
function IntegrationScreen({ name, address, children, className }: { name?: React.ReactNode; address?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative z-10 -mt-11 ml-auto overflow-hidden rounded-control border border-line-on-brand-strong bg-[linear-gradient(180deg,color-mix(in_srgb,var(--ds-color-white)_28%,transparent),color-mix(in_srgb,var(--ds-color-white)_12%,transparent))] text-caption text-on-brand shadow-[inset_0_1px_0_color-mix(in_srgb,var(--ds-color-white)_60%,transparent),0_18px_40px_-16px_color-mix(in_srgb,var(--ds-color-ink)_45%,transparent)] backdrop-blur-xl backdrop-saturate-150 max-md:w-[92%] md:-mt-16 md:w-[68%]",
        className,
      )}
    >
      {(name || address) && (
        <div className="flex h-7.5 items-center gap-1.5 border-b border-[color-mix(in_srgb,var(--ds-color-white)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-color-white)_18%,transparent)] px-3 text-micro text-[color-mix(in_srgb,var(--ds-color-ink)_60%,transparent)]">
          {name && <b className="font-display text-caption font-medium tracking-label text-fg">{name}</b>}
          {address && <span className="ml-2 flex-1 truncate rounded-chip bg-[color-mix(in_srgb,var(--ds-color-white)_70%,transparent)] px-2 py-0.5 text-[color-mix(in_srgb,var(--ds-color-ink)_70%,transparent)]">{address}</span>}
        </div>
      )}
      <div className="grid gap-3 p-3.5">{children}</div>
    </div>
  );
}

export { Integrations, IntegrationCode, IntegrationScreen, type IntegrationRow, type IntegrationOption };
