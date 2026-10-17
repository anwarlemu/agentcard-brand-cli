import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The brand's scales have their own names (text-body-sm, rounded-card, shadow-key). Without teaching tailwind-merge,
// it reads text-body-sm as a text color and drops the real color beside it, and keeps a default rounded-md next to a
// brand radius meant to replace it.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["chip", "sm", "menu", "control", "card", "panel", "shell", "pill"],
      shadow: ["guide", "inset", "key", "key-brand", "key-muted", "pressed", "well", "card", "raised", "code", "plan", "tile", "floating", "glass-hover", "tooltip", "ring-hover"],
    },
    classGroups: {
      "font-size": [{ text: ["display", "hero", "h1", "h2", "h3", "h4", "h5", "body-lg", "body", "body-sm", "caption", "micro"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
