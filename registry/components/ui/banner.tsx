import * as React from "react";

import { cn } from "@/lib/utils";

// A notice strip across the top of a page or a section, drawn like a window bar: `info` is the sky bar with blue marks,
// `brand` the blue bar with white ones for the notice that matters, `alert` a white strip on a red edge for trouble. The
// arrow mark leads, the title is in the 14px display face, a line of detail follows, and actions sit at the end (on the
// blue strip, use the on-brand key).
const TONES = {
  info: "border-line-window bg-window-bar text-window-bar-fg [&_[data-slot=banner-detail]]:text-fg-secondary",
  brand: "border-line-brand-edge bg-brand text-on-brand [&_[data-slot=banner-detail]]:text-fg-on-brand-muted",
  alert: "border-danger bg-surface text-danger [&_[data-slot=banner-detail]]:text-fg-muted",
} as const;

function Banner({
  tone = "info",
  title,
  actions,
  role,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & { tone?: keyof typeof TONES; title: React.ReactNode; actions?: React.ReactNode; role?: "status" | "alert" }) {
  return (
    <div
      role={role ?? (tone === "alert" ? "alert" : "status")}
      data-slot="banner"
      data-tone={tone}
      className={cn("flex flex-col gap-3 rounded-card border px-4 py-3 sm:flex-row sm:items-center sm:justify-between", TONES[tone], className)}
      {...props}
    >
      <div className="flex min-w-0 gap-2.5">
        <span aria-hidden className="font-display text-body-sm leading-snug tracking-mark opacity-45">
          ↳
        </span>
        <div className="min-w-0">
          <p className="font-display text-body-sm leading-snug font-medium">{title}</p>
          {children && (
            <div data-slot="banner-detail" className="mt-0.5 text-body-sm leading-snug">
              {children}
            </div>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2 sm:pl-0 pl-6">{actions}</div>}
    </div>
  );
}

export { Banner };
