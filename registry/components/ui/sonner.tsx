"use client";

import * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

// The brand's toasts: white with a 16 percent ink hairline, 12px corners and the tooltip shadow; the title in the 14px
// display face, the description in Inter at 68 percent ink; the action is the blue key and cancel the white key, both
// small. At the bottom center, with a close mark on each. Sonner's own enter, stack and exit motion is kept.
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      position="bottom-center"
      closeButton
      toastOptions={{
        classNames: {
          toast: "bg-surface! text-fg! border! border-hairline! rounded-card! shadow-tooltip! font-sans! text-body-sm! gap-3! px-4! py-3.5!",
          title: "font-display! text-body-sm! font-medium! leading-snug!",
          description: "text-fg-muted! text-body-sm! leading-snug!",
          actionButton: "h-8! rounded-control! border! border-line-brand-edge! bg-primary! px-3.5! font-display! text-caption! text-on-primary! shadow-key-brand!",
          cancelButton: "h-8! rounded-control! border! border-hairline! bg-surface! px-3.5! font-display! text-caption! text-fg! shadow-key!",
          closeButton: "border-hairline! bg-surface! text-fg-muted! shadow-key-muted! hover:bg-sky-wash! hover:text-fg-brand!",
          success: "[&_[data-icon]]:text-success!",
          error: "[&_[data-icon]]:text-danger!",
          warning: "[&_[data-icon]]:text-warning!",
          info: "[&_[data-icon]]:text-fg-brand!",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
