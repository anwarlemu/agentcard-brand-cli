"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";

import { SegmentedControl } from "@/components/ui/segmented-control";
import { Window } from "@/components/ui/window";
import { cn } from "@/lib/utils";

const WIDTHS = { desktop: 1440, phone: 390 } as const;
const MAX_HEIGHT = 2400;
// Next's development runtime needs cookies and same-origin HMR. Published previews stay isolated.
const PREVIEW_SANDBOX = process.env.NODE_ENV === "development" ? "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox" : "allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox";

// Each mounted frame owns its height listener, including device changes and navigation.
function MeasuredFrame({ src, label, width, height, scale, onHeightChange }: { src: string; label: string; width: number; height: number; scale: number; onHeightChange: (height: number) => void }) {
  const frame = React.useRef<HTMLIFrameElement>(null);
  const updateHeight = React.useEffectEvent(onHeightChange);
  React.useEffect(() => {
    // Sandboxed previews have an opaque origin, so authenticate the sending window.
    const receiveHeight = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.data?.type !== "agentcard:preview-height") return;
      const height = event.data.height;
      if (typeof height === "number" && Number.isFinite(height)) {
        updateHeight(Math.max(120, Math.min(MAX_HEIGHT, Math.ceil(height))));
      }
    };
    window.addEventListener("message", receiveHeight);
    return () => window.removeEventListener("message", receiveHeight);
  }, [src]);
  return (
    <iframe
      ref={frame}
      src={src}
      title={label}
      loading="lazy"
      sandbox={PREVIEW_SANDBOX}
      className="block origin-top-left border-0"
      style={{ width, height, transform: `scale(${scale})` }}
    />
  );
}

/**
 * A full-page example in an iframe at a real window width, scaled down to the frame: desktop (1440px) or phone
 * (390px). The frame takes the page's own height (up to a cap) so nothing scrolls inside it.
 */
export function FramePreview({ src, name, label, component = false }: { src: string; name: string; label: string; component?: boolean }) {
  const box = React.useRef<HTMLDivElement>(null);
  const [device, setDevice] = React.useState<keyof typeof WIDTHS>("desktop");
  const [boxWidth, setBoxWidth] = React.useState(0);
  const [pageHeight, setPageHeight] = React.useState(component ? 480 : 900);
  const width = component && device === "desktop" ? boxWidth : WIDTHS[device];
  const scale = boxWidth ? Math.min(1, boxWidth / width) : 0;

  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setBoxWidth(el.clientWidth));
    observer.observe(el);
    return () => observer.disconnect();
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
              <MeasuredFrame key={device} src={src} label={label} width={width} height={pageHeight} scale={scale} onHeightChange={setPageHeight} />
            )}
          </div>
        </div>
      </Window>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
