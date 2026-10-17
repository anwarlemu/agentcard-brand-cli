import * as React from "react";

import { WindowBar } from "@/components/ui/window";
import { cn } from "@/lib/utils";

// A notice, drawn as the guides' note (agentcard-website src/app/globals.css .v7-guide-note): a small window with a 16
// percent ink edge, 12px corners and the guides' light bevel, its 32px bar labeled like a file (`name`), over a sheet
// with 14px of padding on top, 18px at the sides and 16px below. `info` is the note itself: the sky bar over a sheet
// washed 22 percent sky. `brand` is the notice that matters: the blue bar over white. `alert` is trouble: the rose
// window tint over white, its title in red. The title is set as the guides' card titles (.v7-guide-cta-title: 16px
// display at 500, tracked -0.01em), the detail in 14px Inter at 68 percent ink, and actions sit at the end.
const GUIDE_BEVEL =
  "shadow-[inset_0_1px_0_var(--ds-color-white),inset_0_-1px_0_color-mix(in_srgb,var(--ds-color-ink)_5%,transparent),0_1px_2px_color-mix(in_srgb,var(--ds-color-ink)_7%,transparent),0_4px_10px_-6px_color-mix(in_srgb,var(--ds-color-ink)_14%,transparent)]";

const TONES = {
  info: { bar: "sky", sheet: "bg-[color-mix(in_srgb,var(--ds-color-sky)_22%,var(--ds-color-white))]", title: "text-fg", name: "note" },
  brand: { bar: "blue", sheet: "bg-surface", title: "text-fg", name: "news" },
  alert: { bar: "rose", sheet: "bg-surface", title: "text-danger", name: "alert" },
} as const;

function Banner({
  tone = "info",
  title,
  name,
  actions,
  role,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  tone?: keyof typeof TONES;
  title: React.ReactNode;
  /** The bar's label, file-like: `voice.beta`, `card.paused`. Defaults to note, news or alert. */
  name?: React.ReactNode;
  actions?: React.ReactNode;
  role?: "status" | "alert";
}) {
  const t = TONES[tone];
  return (
    <div
      role={role ?? (tone === "alert" ? "alert" : "status")}
      data-slot="banner"
      data-tone={tone}
      className={cn("flex flex-col overflow-hidden rounded-card border border-hairline text-fg", GUIDE_BEVEL, t.sheet, className)}
      {...props}
    >
      <WindowBar aria-hidden name={name ?? t.name} tone={t.bar} className="[&>span:nth-child(2)]:mr-auto" />
      <div className="flex flex-col gap-3 px-4.5 pt-3.5 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <p className={cn("font-display text-body leading-snug font-medium [letter-spacing:-0.01em]", t.title)}>{title}</p>
          {children && (
            <div data-slot="banner-detail" className="mt-1 text-body-sm [line-height:1.65] text-fg-muted">
              {children}
            </div>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export { Banner };
