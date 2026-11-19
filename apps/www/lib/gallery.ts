import { readFileSync } from "node:fs";
import path from "node:path";

// The asset gallery written by scripts/build-asset-gallery.ts (npm run gallery): each picture, its size and the command
// that makes it.
export type GalleryEntry = { file: string; title: string; command: string; width: number; height: number; group: string };

export const gallery = JSON.parse(readFileSync(path.join(process.cwd(), "public/assets/gallery.json"), "utf8")) as GalleryEntry[];
export const galleryOf = (group: string) => gallery.filter((e) => e.group === group);
