// One SVG per frame. Positions come from the brand tokens. Progress samples --ds-easing-out. No clock and no random source.

import { tokens } from '../lib/brand.js';
import { brandFonts, document, drawBand, drawLine, drawLogo, drawText, fitText, flatten, logoBox, parseColor, px, rect, tokenColor, trackingEm, type Block } from '../image/paint.js';
import { VIDEO_FRAMES, type VideoJob } from './catalog.js';

const EASE = /^cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)$/;

function sample(t: number, a: number, b: number) {
	const u = 1 - t;
	return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t;
}

function slope(t: number, a: number, b: number) {
	const u = 1 - t;
	return 3 * u * u * a + 6 * u * t * (b - a) + 3 * t * t * (1 - b);
}

function easeOut(amount: number): number {
	const raw = tokens().site['--ds-easing-out'];
	const match = raw?.match(EASE);
	if (!match) throw new Error('Token --ds-easing-out is not a cubic-bezier. Video motion will not guess an easing.');
	const [x1, y1, x2, y2] = match.slice(1).map(Number);
	if (amount <= 0) return 0;
	if (amount >= 1) return 1;
	let t = amount;
	for (let i = 0; i < 12; i++) {
		const diff = sample(t, x1, x2) - amount;
		if (Math.abs(diff) < 1e-7) break;
		const rise = slope(t, x1, x2);
		if (Math.abs(rise) < 1e-7) break;
		t = Math.min(1, Math.max(0, t - diff / rise));
	}
	return Math.round(sample(t, y1, y2) * 1e6) / 1e6;
}

export function frameProgress(frame: number): number {
	if (VIDEO_FRAMES <= 1) return 1;
	if (frame <= 0) return 0;
	if (frame >= VIDEO_FRAMES - 1) return 1;
	return easeOut(frame / (VIDEO_FRAMES - 1));
}

function fade(amount: number) {
	return (Math.round(amount * 10000) / 10000).toFixed(4);
}

function lift(amount: number) {
	return Math.round((1 - amount) * px('--ds-space-6'));
}

function bandHeight(width: number) {
	return Math.max(px('--ds-band-step'), Math.round(width / 100)) * 4;
}

function bandStep(width: number) {
	return bandHeight(width) / 4;
}

function rgba(color: string, alpha: number) {
	const c = parseColor(color);
	return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
}

type Theme = { bg: string; fg: string; muted: string; accent: string; logo: string; bandToward: string };

function themeFor(ground: 'blue' | 'paper'): Theme {
	if (ground === 'blue') {
		const bg = tokenColor('brand');
		return { bg, fg: tokenColor('white'), muted: flatten(tokenColor('text-on-brand-muted'), bg), accent: tokenColor('sky'), logo: tokenColor('white'), bandToward: tokenColor('paper') };
	}
	const bg = tokenColor('paper');
	return { bg, fg: tokenColor('ink'), muted: tokenColor('text-secondary'), accent: tokenColor('brand'), logo: tokenColor('brand'), bandToward: tokenColor('brand') };
}

function reveal(width: number, height: number, amount: number) {
	const shown = amount >= 1 ? width : Math.max(0, Math.round(width * amount));
	return `<defs><clipPath id="reveal"><rect x="0" y="0" width="${shown}" height="${height}"/></clipPath></defs>`;
}

function moving(amount: number, body: string) {
	return `<g opacity="${fade(amount)}" transform="translate(0 ${lift(amount)})">${body}</g>`;
}

function footerLine(text: string, theme: Theme, y: number, x: number, maxWidth: number) {
	if (!text) return '';
	const { medium } = brandFonts();
	const size = 15;
	const baseline = y + (medium.ascender / medium.unitsPerEm) * size;
	return drawLine(medium, text, x, baseline, size, trackingEm('--ds-tracking-label'), maxWidth, theme.muted);
}

function place(block: Block | undefined, x: number, top: number, align: 'left' | 'center', boxW: number, fill: string) {
	if (!block) return '';
	return drawText(block, x, top, align, boxW, fill);
}

function windowMark(x: number, y: number, color: string) {
	return `<g transform="translate(${x} ${y}) scale(0.9)" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="square"><path d="M6 .5v11M1.24 3.25l9.52 5.5M1.24 8.75l9.52-5.5"/></g>`;
}

function framedWindow(x: number, y: number, w: number, h: number, name: string, inner: string) {
	if (w < 64 || h < 64) throw new Error('The window does not fit this size. Shorten the text.');
	const { medium } = brandFonts();
	const bar = 36;
	const radius = px('--ds-radius-card');
	const edge = flatten(tokenColor('border-hairline'), tokenColor('white'));
	const rule = flatten(tokenColor('border-window'), tokenColor('sky'));
	const mark = tokenColor('brand');
	const ink = tokenColor('ink');
	const labelSize = 14;
	const baseline = y + bar / 2 + (medium.ascender / medium.unitsPerEm) * labelSize * 0.35;
	const nameX = x + 36;
	const nameW = Math.max(40, w - 78);
	const arrow = flatten(rgba(mark, 0.45), tokenColor('sky'));
	return [
		rect(x + 6, y + 6, w, h, rgba(ink, 0.22), radius),
		`<defs><clipPath id="win">${rect(x, y, w, h, '#fff', radius)}</clipPath></defs>`,
		`<g clip-path="url(#win)">`,
		rect(x, y, w, h, tokenColor('white')),
		inner,
		rect(x, y, w, bar, tokenColor('sky')),
		rect(x, y + bar - 1, w, 1, rule),
		drawLine(medium, '\u21B3', x + 14, baseline, labelSize, 0.02, 18, arrow),
		drawLine(medium, name, nameX, baseline, labelSize, trackingEm('--ds-tracking-label'), nameW, mark),
		drawLine(medium, '[', x + w - 36, baseline, labelSize, 0, 12, mark),
		windowMark(x + w - 28, y + (bar - 11) / 2, mark),
		drawLine(medium, ']', x + w - 16, baseline, labelSize, 0, 12, mark),
		`</g>`,
		`<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="${radius}" fill="none" stroke="${edge}"/>`,
	].join('');
}

function markInner(x: number, y: number, w: number, h: number) {
	const top = y + 36;
	const bodyH = h - 36;
	const markH = Math.min(120, bodyH * 0.42);
	const box = logoBox('mark');
	const markW = markH * (box.width / box.height);
	return [rect(x, top, w, bodyH, tokenColor('paper')), drawLogo('mark', x + (w - markW) / 2, top + (bodyH - markH) / 2, markH, tokenColor('brand'))].join('');
}

function social(job: VideoJob, amount: number) {
	const theme = themeFor('blue');
	const pad = px('--ds-space-14');
	const bandY = job.height - bandHeight(job.width);
	const footerH = job.footer ? 28 : 0;
	const boxW = job.width - pad * 2 - 48;
	const boxX = (job.width - boxW) / 2;
	let cursor = pad + 34 + 20;
	const content: string[] = [];
	if (job.eyebrow) {
		const eye = fitText(brandFonts().medium, job.eyebrow, boxW, 48, { start: 16, min: 13, leading: 1.2, maxLines: 2, role: 'eyebrow' });
		content.push(place(eye, boxX, cursor, 'center', boxW, theme.accent));
		cursor += eye.height + 18;
	}
	const bottom = bandY - footerH - 16;
	const head = fitText(brandFonts().medium, job.headline, boxW, Math.max(48, bottom - cursor), { start: Math.min(96, job.height * 0.16), min: 28, leading: px('--ds-leading-heading'), maxLines: job.height > 1400 ? 6 : 4, role: 'headline' });
	content.push(place(head, boxX, cursor + Math.max(0, (bottom - cursor - head.height) / 2), 'center', boxW, theme.fg));
	const band = drawBand(bandY, job.width, theme.bg, theme.bandToward, bandStep(job.width));
	return [
		rect(0, 0, job.width, job.height, theme.bg),
		drawLogo('lockup', pad, pad, 34, theme.logo),
		reveal(job.width, job.height, amount),
		moving(amount, content.join('')),
		footerLine(job.footer, theme, bandY - footerH, pad, job.width - pad * 2),
		`<g clip-path="url(#reveal)">${band.svg}</g>`,
	].join('');
}

function announcement(job: VideoJob, amount: number) {
	const blue = tokenColor('brand');
	const page = tokenColor('paper');
	const pad = px('--ds-space-14');
	const cap = pad + 34 + (job.eyebrow ? 52 : 16) + 20;
	const band = drawBand(cap, job.width, blue, page, bandStep(job.width));
	const textTop = cap + band.height + 28;
	const footerH = job.footer ? 36 : 24;
	const boxW = Math.min(job.width - pad * 2, 920);
	const boxX = (job.width - boxW) / 2;
	const room = Math.max(80, job.height - textTop - footerH);
	const { medium, regular } = brandFonts();
	const head = fitText(medium, job.headline, boxW, job.subtext ? room * 0.62 : room, { start: Math.min(84, job.height * 0.1), min: 28, leading: px('--ds-leading-heading'), maxLines: job.height > 1400 ? 5 : 3, role: 'headline' });
	const sub = job.subtext ? fitText(regular, job.subtext, boxW, Math.max(32, room - head.height - px('--ds-space-5')), { start: 26, min: 16, leading: px('--ds-leading-snug'), maxLines: 4, role: 'subtext' }) : undefined;
	const blockH = head.height + (sub ? px('--ds-space-5') + sub.height : 0);
	let cursor = textTop + Math.max(0, (room - blockH) / 2);
	const body = [place(head, boxX, cursor, 'center', boxW, tokenColor('ink'))];
	if (sub) body.push(place(sub, boxX, cursor + head.height + px('--ds-space-5'), 'center', boxW, tokenColor('text-secondary')));
	const eyebrow = job.eyebrow ? place(fitText(medium, job.eyebrow, job.width - pad * 2, 32, { start: 16, min: 13, leading: 1.2, maxLines: 1, role: 'eyebrow' }), pad, pad + 34 + 12, 'left', job.width - pad * 2, tokenColor('sky')) : '';
	const theme = themeFor('paper');
	return [
		rect(0, 0, job.width, job.height, page),
		rect(0, 0, job.width, cap, blue),
		drawLogo('lockup', pad, pad, 34, tokenColor('white')),
		reveal(job.width, job.height, amount),
		`<g opacity="${fade(amount)}">${eyebrow}</g>`,
		moving(amount, body.join('')),
		`<g clip-path="url(#reveal)">${band.svg}</g>`,
		footerLine(job.footer, theme, job.height - footerH, pad, job.width - pad * 2),
	].join('');
}

function product(job: VideoJob, amount: number) {
	const theme = themeFor('blue');
	const pad = px('--ds-space-14');
	const bandY = job.height - bandHeight(job.width);
	const wide = job.width / job.height > 1.15;
	const { medium, regular } = brandFonts();
	const parts = [rect(0, 0, job.width, job.height, theme.bg), drawLogo('lockup', pad, pad, 34, theme.logo), reveal(job.width, job.height, amount)];
	const content: string[] = [];
	if (wide) {
		const col = Math.round(job.width * 0.36);
		const textW = col - pad - 24;
		const textTop = pad + 34 + 20;
		const textBottom = bandY - (job.footer ? 28 : 16);
		const head = fitText(medium, job.headline, textW, job.subtext ? (textBottom - textTop) * 0.6 : textBottom - textTop, { start: Math.min(64, job.height * 0.1), min: 28, leading: px('--ds-leading-heading'), maxLines: 4, role: 'headline' });
		const sub = job.subtext ? fitText(regular, job.subtext, textW, Math.max(32, textBottom - textTop - head.height - px('--ds-space-5')), { start: 22, min: 16, leading: px('--ds-leading-snug'), maxLines: 4, role: 'subtext' }) : undefined;
		const blockH = head.height + (sub ? px('--ds-space-5') + sub.height : 0);
		let cursor = textTop + Math.max(0, (textBottom - textTop - blockH) * 0.42);
		content.push(place(head, pad, cursor, 'left', textW, theme.fg));
		if (sub) content.push(place(sub, pad, cursor + head.height + px('--ds-space-5'), 'left', textW, theme.muted));
		const winX = col + 8;
		const winY = pad;
		const winW = job.width - winX - pad;
		const winH = bandY - winY - 20;
		content.push(framedWindow(winX, winY, winW, winH, job.window ?? 'screen.preview', markInner(winX, winY, winW, winH)));
		parts.push(footerLine(job.footer, theme, bandY - 28, pad, textW));
	} else {
		const textW = job.width - pad * 2;
		let cursor = pad + 34 + 18;
		const head = fitText(medium, job.headline, textW, job.height * 0.22, { start: Math.min(64, job.width * 0.06), min: 28, leading: px('--ds-leading-heading'), maxLines: 3, role: 'headline' });
		content.push(place(head, pad, cursor, 'left', textW, theme.fg));
		cursor += head.height + (job.subtext ? px('--ds-space-4') : 0);
		if (job.subtext) {
			const sub = fitText(regular, job.subtext, textW, job.height * 0.12, { start: 22, min: 16, leading: px('--ds-leading-snug'), maxLines: 3, role: 'subtext' });
			content.push(place(sub, pad, cursor, 'left', textW, theme.muted));
			cursor += sub.height;
		}
		cursor += 24;
		const winH = bandY - cursor - (job.footer ? 36 : 16);
		content.push(framedWindow(pad, cursor, textW, winH, job.window ?? 'screen.preview', markInner(pad, cursor, textW, winH)));
		if (job.footer) parts.push(footerLine(job.footer, theme, bandY - 26, pad, textW));
	}
	const band = drawBand(bandY, job.width, theme.bg, theme.bandToward, bandStep(job.width));
	parts.push(moving(amount, content.join('')), `<g clip-path="url(#reveal)">${band.svg}</g>`);
	return parts.join('');
}

export function frameSvg(job: VideoJob, frame: number): string {
	if (!Number.isInteger(frame) || frame < 0 || frame >= VIDEO_FRAMES) throw new Error(`Frame ${frame} is outside 0 to ${VIDEO_FRAMES - 1}.`);
	const amount = frameProgress(frame);
	const body = job.template === 'social' ? social(job, amount) : job.template === 'announcement' ? announcement(job, amount) : product(job, amount);
	return document(job.width, job.height, job.headline, body);
}
