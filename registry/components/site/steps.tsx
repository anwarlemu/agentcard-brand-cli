import * as React from "react";

import { SectionHeading, SiteSection, type SectionGround } from "@/components/site/section";
import { cn } from "@/lib/utils";

// Steps in order, as the image editor's numbered cards draw them: white cards with the card corner and shadow, the
// blue number badge, a title and a muted line. Built from the library's card and badge; the site shows its steps in
// prose, so the arrangement is derived, not measured.

type Step = { title: React.ReactNode; description?: React.ReactNode };

function Steps({ title, description, eyebrow, steps, ground = "paper", className }: { title?: React.ReactNode; description?: React.ReactNode; eyebrow?: React.ReactNode; steps: Step[]; ground?: SectionGround; className?: string }) {
  return (
    <SiteSection ground={ground} className={className}>
      {title ? <SectionHeading title={title} description={description} eyebrow={eyebrow} className="mb-10 md:mb-14" /> : null}
      <ol className={cn("grid list-none grid-cols-1 gap-4 p-0 md:gap-5", steps.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
        {steps.map((s, i) => (
          <li key={i} className="flex flex-col gap-3 rounded-card border border-hairline bg-surface p-6 text-fg shadow-card">
            <span aria-hidden className="flex size-7 items-center justify-center rounded-full bg-primary font-display text-caption text-on-primary">
              {i + 1}
            </span>
            <span className="sr-only">Step {i + 1}: </span>
            <h3 className="font-display text-h4 leading-tight font-medium tracking-tight">{s.title}</h3>
            {s.description ? <p className="text-body leading-6 text-fg-muted">{s.description}</p> : null}
          </li>
        ))}
      </ol>
    </SiteSection>
  );
}

export { Steps };
export type { Step };
