// One image job to SVG. Every template is a scene (scene.ts), so a still, a slide and a video frame share one drawing.

import type { DrawnLayer } from '../design/types.js';
import type { ImageJob } from './catalog.js';
import { buildScene } from './compose.js';
import { document } from './paint.js';
import { drawScene, type Scene } from './scene.js';

export type Rendered = { svg: string; layers: DrawnLayer[]; notes: string[] };

export function renderScene(scene: Scene): Rendered {
	const drawn = drawScene(scene);
	return { svg: document(scene.width, scene.height, scene.title || scene.headline || scene.quote || scene.template, drawn.svg), layers: drawn.layers, notes: drawn.notes };
}

export const renderJob = (job: ImageJob): Rendered => renderScene(buildScene(job));
export const renderSvg = (job: ImageJob): string => renderJob(job).svg;
