// The five image templates. Each one uses the site's grounds, the lockup, the window and the stepped band.
// Positions are in pixels at the export size. Type sizes follow the brand's display steps and shrink to fit.

import { readFileSync } from 'node:fs';
import type { Ground, ImageJob } from './catalog.js';
import { brandFonts, document, drawBand, drawLine, drawLogo, drawText, fitText, flatten, logoBox, parseColor, px, rect, tokenColor, trackingEm, type Block } from './paint.js';

export type Theme = { bg: string; fg: string; muted: string; accent: string; logo: string; bandToward: string };

const ink = () => tokenColor('ink');
const paper = () => tokenColor('paper');
const white = () => tokenColor('white');
const brand = () => tokenColor('brand');
const sky = () => tokenColor('sky');

export function themeFor(ground: Ground): Theme {
	if (ground === 'blue') {
		const bg = brand();
		return { bg, fg: white(), muted: flatten(tokenColor('text-on-brand-muted'), bg), accent: sky(), logo: white(), bandToward: paper() };
	}
	const bg = ground === 'paper' ? paper() : white();
	return { bg, fg: ink(), muted: tokenColor('text-secondary'), accent: brand(), logo: brand(), bandToward: brand() };
}

const pad = () => px('--ds-space-14');
const radius = () => px('--ds-radius-card');
const shadow = () => 6;
/** The 9px site step, grown a little on a large export so the staircase still reads when the image is shown small. */
function bandHeight(width: number) {
	return Math.max(px('--ds-band-step'), Math.round(width / 100)) * 4;
}
function bandStep(width: number) {
	return bandHeight(width) / 4;
}

function wide(job: ImageJob) {
	return job.width / job.height > 1.15;
}

function stackPair(headline: string | undefined, subtext: string | undefined, boxW: number, boxH: number, headlineStart: number) {
	const { medium, regular } = brandFonts();
	const leadingH = px('--ds-leading-heading');
	const leadingB = px('--ds-leading-snug');
	const gap = subtext ? px('--ds-space-5') : 0;
	let start = headlineStart;
	while (start >= 28) {
		let head: Block | undefined;
		let sub: Block | undefined;
		try {
			head = headline ? fitText(medium, headline, boxW, boxH - gap - (subtext ? 20 : 0), { start, min: 28, leading: leadingH, maxLines: 4, role: 'headline' }) : undefined;
			const room = boxH - (head?.height ?? 0) - gap;
			sub = subtext ? fitText(regular, subtext, boxW, room, { start: Math.min(26, Math.max(16, start * 0.4)), min: 16, leading: leadingB, maxLines: 4, role: 'subtext' }) : undefined;
		} catch {
			start -= 2;
			continue;
		}
		if ((head?.height ?? 0) + gap + (sub?.height ?? 0) <= boxH + 0.5) return { head, sub, gap };
		start -= 2;
	}
	throw new Error('The headline does not fit this size. Shorten it.');
}

function placeBlock(block: Block | undefined, x: number, top: number, align: 'left' | 'center', boxW: number, fill: string) {
	if (!block) return '';
	return drawText(block, x, top, align, boxW, fill);
}

function footerLine(job: ImageJob, theme: Theme, y: number, x: number, maxWidth: number) {
	if (!job.footer) return '';
	const { medium } = brandFonts();
	const size = 15;
	const tracking = trackingEm('--ds-tracking-label');
	const baseline = y + (medium.ascender / medium.unitsPerEm) * size;
	return drawLine(medium, job.footer, x, baseline, size, tracking, maxWidth, theme.muted);
}

function lockup(theme: Theme, x = pad(), y = pad()) {
	return drawLogo('lockup', x, y, 34, theme.logo);
}

function windowMark(x: number, y: number, color: string) {
	return `<g transform="translate(${x} ${y}) scale(0.9)" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="square"><path d="M6 .5v11M1.24 3.25l9.52 5.5M1.24 8.75l9.52-5.5"/></g>`;
}

let clipSeq = 0;

function rgba(color: string, alpha: number) {
	const c = parseColor(color);
	return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
}

function framedWindow(x: number, y: number, w: number, h: number, name: string, inner: string) {
	if (w < 64 || h < 64) throw new Error('The window does not fit this size. Shorten the text.');
	const { medium } = brandFonts();
	const id = `w${++clipSeq}`;
	const bar = 36;
	const r = radius();
	const edge = flatten(tokenColor('border-hairline'), white());
	const rule = flatten(tokenColor('border-window'), sky());
	const mark = brand();
	const arrow = flatten(rgba(brand(), 0.45), sky());
	const labelSize = 14;
	const baseline = y + bar / 2 + (medium.ascender / medium.unitsPerEm) * labelSize * 0.35;
	const nameX = x + 36;
	const nameW = Math.max(40, w - 78);
	return [
		rect(x + shadow(), y + shadow(), w, h, rgba(ink(), 0.22), r),
		`<defs><clipPath id="${id}">${rect(x, y, w, h, '#fff', r)}</clipPath></defs>`,
		`<g clip-path="url(#${id})">`,
		rect(x, y, w, h, white()),
		inner,
		rect(x, y, w, bar, sky()),
		rect(x, y + bar - 1, w, 1, rule),
		drawLine(medium, '\u21B3', x + 14, baseline, labelSize, 0.02, 18, arrow),
		drawLine(medium, name, nameX, baseline, labelSize, trackingEm('--ds-tracking-label'), nameW, mark),
		drawLine(medium, '[', x + w - 36, baseline, labelSize, 0, 12, mark),
		windowMark(x + w - 28, y + (bar - 11) / 2, mark),
		drawLine(medium, ']', x + w - 16, baseline, labelSize, 0, 12, mark),
		`</g>`,
		`<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="${r}" fill="none" stroke="${edge}"/>`,
	].join('');
}

function screenshotInner(job: ImageJob, x: number, y: number, w: number, h: number) {
	const top = y + 36;
	const bodyH = h - 36;
	if (job.image) {
		let buf: Buffer;
		try {
			buf = readFileSync(job.image);
		} catch {
			throw new Error(`Could not read the screenshot at ${job.image}.`);
		}
		if (buf.length > 15_000_000) throw new Error('Screenshot is larger than 15MB.');
		const kind = buf[0] === 0x89 && buf[1] === 0x50 ? 'png' : buf[0] === 0xff && buf[1] === 0xd8 ? 'jpeg' : '';
		if (!kind) throw new Error('Screenshot must be a PNG or JPEG.');
		const href = `data:image/${kind};base64,${buf.toString('base64')}`;
		const inset = 0;
		return `<image href="${href}" x="${x + inset}" y="${top}" width="${w - inset * 2}" height="${bodyH}" preserveAspectRatio="xMidYMin slice"/>`;
	}
	// No file yet: the hand, in the window, so the frame still reads as the brand.
	const markH = Math.min(120, bodyH * 0.42);
	const box = logoBox('mark');
	const markW = markH * (box.width / box.height);
	return [rect(x, top, w, bodyH, paper()), drawLogo('mark', x + (w - markW) / 2, top + (bodyH - markH) / 2, markH, brand())].join('');
}

function headlineLayout(job: ImageJob, theme: Theme) {
	const bandY = job.height - bandHeight(job.width);
	const footerH = job.footer ? 28 : 0;
	const top = pad() + 34 + 20;
	const bottom = bandY - footerH - 16;
	const boxW = job.width - pad() * 2 - 48;
	const boxX = (job.width - boxW) / 2;
	const parts = [rect(0, 0, job.width, job.height, theme.bg), lockup(theme)];
	let cursor = top;
	if (job.eyebrow) {
		const eye = fitText(brandFonts().medium, job.eyebrow, boxW, 48, { start: 16, min: 13, leading: 1.2, maxLines: 2, role: 'eyebrow' });
		parts.push(placeBlock(eye, boxX, cursor, 'center', boxW, theme.accent));
		cursor += eye.height + 18;
	}
	const head = fitText(brandFonts().medium, job.headline!, boxW, bottom - cursor, { start: Math.min(104, job.height * 0.2), min: 32, leading: px('--ds-leading-heading'), maxLines: job.height > 900 ? 4 : 3, role: 'headline' });
	const blockTop = cursor + Math.max(0, (bottom - cursor - head.height) / 2);
	parts.push(placeBlock(head, boxX, blockTop, 'center', boxW, theme.fg));
	parts.push(footerLine(job, theme, bandY - footerH, pad(), job.width - pad() * 2));
	parts.push(drawBand(bandY, job.width, theme.bg, theme.bandToward, bandStep(job.width)).svg);
	return parts.join('');
}

function subtextLayout(job: ImageJob, theme: Theme) {
	const bandY = job.height - bandHeight(job.width);
	const footerH = job.footer ? 28 : 0;
	const boxW = Math.min(job.width - pad() * 2 - 32, 860 * (job.width / 1200));
	const boxX = (job.width - boxW) / 2;
	const top = pad() + 34 + 28;
	const bottom = bandY - footerH - 20;
	const pair = stackPair(job.headline, job.subtext, boxW, bottom - top - (job.eyebrow ? 40 : 0), Math.min(76, job.height * 0.12));
	let cursor = top + Math.max(0, (bottom - top - (pair.head?.height ?? 0) - pair.gap - (pair.sub?.height ?? 0) - (job.eyebrow ? 40 : 0)) / 2);
	const parts = [rect(0, 0, job.width, job.height, theme.bg), lockup(theme)];
	if (job.eyebrow) {
		const eye = fitText(brandFonts().medium, job.eyebrow, boxW, 40, { start: 16, min: 13, leading: 1.2, maxLines: 1, role: 'eyebrow' });
		parts.push(placeBlock(eye, boxX, cursor, 'center', boxW, theme.accent));
		cursor += eye.height + 16;
	}
	parts.push(placeBlock(pair.head, boxX, cursor, 'center', boxW, theme.fg));
	cursor += (pair.head?.height ?? 0) + pair.gap;
	parts.push(placeBlock(pair.sub, boxX, cursor, 'center', boxW, theme.muted));
	parts.push(footerLine(job, theme, bandY - footerH, pad(), job.width - pad() * 2));
	parts.push(drawBand(bandY, job.width, theme.bg, theme.bandToward, bandStep(job.width)).svg);
	return parts.join('');
}

function screenshotLayout(job: ImageJob, theme: Theme) {
	const bandY = job.height - bandHeight(job.width);
	const name = job.window ?? 'screen.preview';
	const parts = [rect(0, 0, job.width, job.height, theme.bg)];
	if (wide(job)) {
		const col = Math.round(job.width * 0.36);
		const textW = col - pad() - 24;
		const winX = col + 8;
		const winY = pad();
		const winW = job.width - winX - pad();
		const winH = bandY - winY - 20;
		const footerH = job.footer ? 28 : 0;
		const textTop = pad() + 34 + 20;
		const textBottom = bandY - footerH - 16;
		const pair = stackPair(job.headline, job.subtext, textW, textBottom - textTop, Math.min(64, job.height * 0.1));
		parts.push(lockup(theme));
		let cursor = textTop + Math.max(0, (textBottom - textTop - (pair.head?.height ?? 0) - pair.gap - (pair.sub?.height ?? 0)) * 0.42);
		parts.push(placeBlock(pair.head, pad(), cursor, 'left', textW, theme.fg));
		cursor += (pair.head?.height ?? 0) + pair.gap;
		parts.push(placeBlock(pair.sub, pad(), cursor, 'left', textW, theme.muted));
		parts.push(footerLine(job, theme, bandY - footerH, pad(), textW));
		parts.push(framedWindow(winX, winY, winW, winH, name, screenshotInner(job, winX, winY, winW, winH)));
	} else {
		const textW = job.width - pad() * 2;
		const pair = stackPair(job.headline, job.subtext, textW, job.height * 0.28, Math.min(64, job.width * 0.06));
		let cursor = pad() + 34 + 18;
		parts.push(lockup(theme));
		parts.push(placeBlock(pair.head, pad(), cursor, 'left', textW, theme.fg));
		cursor += (pair.head?.height ?? 0) + (job.subtext ? pair.gap : 0);
		parts.push(placeBlock(pair.sub, pad(), cursor, 'left', textW, theme.muted));
		cursor += (pair.sub?.height ?? 0) + 24;
		const winX = pad();
		const winW = job.width - pad() * 2;
		const winH = bandY - cursor - (job.footer ? 36 : 16);
		parts.push(framedWindow(winX, cursor, winW, winH, name, screenshotInner(job, winX, cursor, winW, winH)));
		if (job.footer) parts.push(footerLine(job, theme, bandY - 26, pad(), textW));
	}
	parts.push(drawBand(bandY, job.width, theme.bg, theme.bandToward, bandStep(job.width)).svg);
	return parts.join('');
}

function quoteLayout(job: ImageJob, theme: Theme) {
	const bandY = job.height - bandHeight(job.width);
	const { medium, regular } = brandFonts();
	const availTop = pad() + 34 + 16;
	const availH = bandY - availTop - (job.footer ? 36 : 16);
	const w = job.width - pad() * 2;
	const innerW = w - 88;
	const mark = fitText(medium, '\u201C', innerW, 88, { start: 64, min: 40, leading: 1, maxLines: 1, role: 'quote' });
	const by = job.by ? fitText(regular, job.by, innerW, 28, { start: 18, min: 14, leading: 1.2, maxLines: 1, role: 'attribution' }) : undefined;
	const chrome = 36 + 28 + mark.height + 12 + 28 + (by ? by.height + 18 : 0);
	const quote = fitText(medium, job.quote!, innerW, Math.max(48, availH - chrome), { start: Math.min(44, job.height * 0.048), min: 22, leading: px('--ds-leading-snug'), maxLines: job.height > 1000 ? 8 : 6, role: 'quote' });
	const h = Math.min(availH, chrome + quote.height);
	const y = availTop + Math.max(0, (availH - h) / 2);
	const x = pad();
	const innerX = x + 44;
	let cursor = y + 36 + 20;
	const inner = [placeBlock(mark, innerX, cursor, 'left', innerW, brand())];
	cursor += mark.height + 8;
	inner.push(placeBlock(quote, innerX, cursor, 'left', innerW, ink()));
	cursor += quote.height + 18;
	if (by) inner.push(placeBlock(by, innerX, cursor, 'left', innerW, brand()));
	const parts = [
		rect(0, 0, job.width, job.height, theme.bg),
		lockup(theme),
		framedWindow(x, y, w, h, job.window ?? 'note.quote', inner.join('')),
		footerLine(job, theme, bandY - 26, pad(), job.width - pad() * 2),
		drawBand(bandY, job.width, theme.bg, theme.bandToward, bandStep(job.width)).svg,
	];
	return parts.join('');
}

function announcementLayout(job: ImageJob) {
	const blue = brand();
	const page = paper();
	const cap = pad() + 34 + (job.eyebrow ? 52 : 16) + 20;
	const band = drawBand(cap, job.width, blue, page, bandStep(job.width));
	const textTop = cap + band.height + 28;
	const footerH = job.footer ? 36 : 24;
	const boxW = Math.min(job.width - pad() * 2, 920);
	const boxX = (job.width - boxW) / 2;
	const pair = stackPair(job.headline, job.subtext, boxW, job.height - textTop - footerH, Math.min(84, job.height * 0.1));
	const parts = [rect(0, 0, job.width, job.height, page), rect(0, 0, job.width, cap, blue), drawLogo('lockup', pad(), pad(), 34, white())];
	if (job.eyebrow) {
		const eye = fitText(brandFonts().medium, job.eyebrow, job.width - pad() * 2, 32, { start: 16, min: 13, leading: 1.2, maxLines: 1, role: 'eyebrow' });
		parts.push(placeBlock(eye, pad(), pad() + 34 + 12, 'left', job.width - pad() * 2, sky()));
	}
	parts.push(band.svg);
	const blockH = (pair.head?.height ?? 0) + pair.gap + (pair.sub?.height ?? 0);
	const areaBottom = job.height - footerH - 12;
	let cursor = textTop + Math.max(0, (areaBottom - textTop - blockH) / 2);
	parts.push(placeBlock(pair.head, boxX, cursor, 'center', boxW, ink()));
	cursor += (pair.head?.height ?? 0) + pair.gap;
	parts.push(placeBlock(pair.sub, boxX, cursor, 'center', boxW, tokenColor('text-secondary')));
	const footerTheme = themeFor('paper');
	parts.push(footerLine(job, footerTheme, job.height - footerH, pad(), job.width - pad() * 2));
	return parts.join('');
}

export function renderSvg(job: ImageJob): string {
	clipSeq = 0;
	const ground = job.template === 'announcement' ? 'paper' : job.ground ?? 'blue';
	const theme = themeFor(ground);
	let body = '';
	if (job.template === 'headline') body = headlineLayout(job, theme);
	else if (job.template === 'subtext') body = subtextLayout(job, theme);
	else if (job.template === 'screenshot') body = screenshotLayout(job, theme);
	else if (job.template === 'quote') body = quoteLayout(job, theme);
	else body = announcementLayout(job);
	const title = job.headline || job.quote || job.template;
	return document(job.width, job.height, title, body);
}
