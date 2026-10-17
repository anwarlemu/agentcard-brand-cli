import { readFileSync } from "node:fs";
import path from "node:path";

import index from "./registry-index.json";

export type Item = {
  name: string;
  title: string;
  type: "ui" | "site" | "product" | "visual" | "block" | "hook" | "lib";
  surface: "site" | "product" | "both";
  description: string;
  kinds: string[];
  use_for: string;
  never: string[];
  source?: string;
  paths: string[];
  dependencies: string[];
  npm: string[];
  examples: string[];
  body: string;
};

export const registryName = index.name;
export const registryUrl = index.url;
export const REPO = "https://github.com/anwarlemu/agentcard-brand-cli";
export const BRAND_SITE = "https://www.agentcard.sh";
export const APPLY_COMMAND = "npx -y github:anwarlemu/agentcard-brand-cli#release";
export const items = (index.items as Item[]).filter((i) => i.type !== "lib" && i.type !== "hook");

export const GROUPS: { type: Item["type"]; id: string; label: string; blurb: string }[] = [
  { type: "ui", id: "components", label: "Components", blurb: "The primitives: keys, windows, tabs, fields and overlays." },
  { type: "site", id: "site", label: "Sections", blurb: "The site's header, hero, sections and footer." },
  { type: "block", id: "blocks", label: "Pages", blurb: "Whole pages, composed from the pieces above, to start from." },
  { type: "visual", id: "visuals", label: "Visuals", blurb: "The bands, the striped wordmark and the scan lines that carry the brand." },
];

export const counts = Object.fromEntries(GROUPS.map((g) => [g.type, items.filter((i) => i.type === g.type).length]));
export const findItem = (name: string) => items.find((i) => i.name === name);

const root = path.join(process.cwd(), "../../registry");
export const sourceOf = (rel: string) => readFileSync(path.join(root, rel), "utf8");
export const exampleSource = (name: string) => sourceOf(`examples/${name}.tsx`);

// These demos open overlays or focus/scroll their content on mount. Keep those effects inside a frame.
const FRAMED_COMPONENTS = new Set(["command", "dialog", "dropdown-menu", "popover", "select", "sheet", "tooltip"]);
export const needsPreviewFrame = (item: Pick<Item, "type" | "name">) => item.type === "site" || item.type === "block" || FRAMED_COMPONENTS.has(item.name);
