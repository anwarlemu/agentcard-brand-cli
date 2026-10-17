"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";

import { SegmentedControl } from "@/components/ui/segmented-control";
import { Window } from "@/components/ui/window";
import { cn } from "@/lib/utils";

const WIDTHS = { desktop: 1440, phone: 390 } as const;
const MAX_HEIGHT = 2400;

/**
 * A full-page example in an iframe at a real window width, scaled down to the frame: desktop (1440px) or phone
 * (390px). The frame takes the page's own height (up to a cap) so nothing scrolls inside it.
 */
export function FramePreview({ src, name, label }: { src: string; name: string; label: string; surface?: "site" }) {
  const box = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = React.useState<keyof typeof WIDTHS>("desktop");
  const [boxWidth, setBoxWidth] = React.useState(0);
  const [pageHeight, setPageHeight] = React.useState(900);
  const width = WIDTHS[device];
  const scale = boxWidth ? Math.min(1, boxWidth / width) : 0;

  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setBoxWidth(el.clientWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The page's height once it has laid out at this width, and again whenever it changes (images, stories).
  const measure = React.useCallback(() => {
    const doc = frame.current?.contentDocument;
    const root = doc?.querySelector<HTMLElement>("[data-preview-root]");
    if (!root) return;
    // The example's own height, not the document's (which is never shorter than the frame).
    const observer = new ResizeObserver(() => setPageHeight(Math.max(120, Math.min(MAX_HEIGHT, Math.ceil(root.getBoundingClientRect().height)))));
    observer.observe(root);
  }, []);

  return (
    <figure className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <SegmentedControl label="Window width" size="sm" value={device} onValueChange={setDevice} options={[{ value: "desktop", label: "Desktop" }, { value: "phone", label: "Phone" }]} />
        <a href={src} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-sm px-2 py-1.5 font-display text-caption text-fg-muted outline-none transition-colors duration-150 ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-focus-ring motion-reduce:transition-none">
          Open alone <ArrowUpRight aria-hidden className="size-3.5" />
        </a>
      </div>
      <Window name={`${name}.${label.toLowerCase().replaceAll(" ", "-")}`}>
        <div ref={box} className={cn("relative overflow-hidden", device === "phone" ? "bg-subtle" : "bg-surface")} style={{ height: scale ? pageHeight * scale : 400 }}>
          <div className={cn("absolute top-0", device === "phone" ? "left-1/2 -translate-x-1/2 bg-surface" : "left-0")} style={{ width: width * scale || "100%" }}>
            {scale > 0 && (
              <iframe
                ref={frame}
                key={device}
                src={src}
                title={label}
                onLoad={measure}
                className="block origin-top-left border-0"
                style={{ width, height: pageHeight, transform: `scale(${scale})` }}
              />
            )}
          </div>
        </div>
      </Window>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
