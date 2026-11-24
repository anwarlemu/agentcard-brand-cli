import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Command } from 'commander';
import { show } from '../assets/io.js';
import { rasterize } from '../image/render.js';
import { document, drawLogo, drawable, logoBox, xml } from '../image/paint.js';
import { brand, cli, colorHex, tokens } from '../lib/brand.js';
import { unknownName } from '../lib/names.js';
import { emit } from '../lib/output.js';

// `email <template>`: HTML emails built from tables with inline styles, which survive Gmail, Outlook and Apple Mail,
// in the brand's colors, type stack and radii. Only the copy passed is set; the logo is a PNG beside the HTML (email
// clients drop SVG), to host and link with --logo-url.

type Flags = Record<string, unknown>;
type Spec = { about: string; needs: string[]; slots: string[] };

export const EMAILS: Record<string, Spec> = {
	newsletter: { about: 'A headline, a few stories (title and a line each, blank line between) and a button.', needs: ['headline'], slots: ['preheader', 'badge', 'headline', 'body', 'items', 'button', 'buttonUrl', 'footer'] },
	announcement: { about: 'One announcement on the blue ground: badge, headline, a line and a button.', needs: ['headline'], slots: ['preheader', 'badge', 'headline', 'body', 'button', 'buttonUrl', 'footer'] },
	receipt: { about: 'A transactional receipt: a line, the items with amounts, and the total.', needs: ['headline', 'items', 'total'], slots: ['preheader', 'headline', 'body', 'items', 'total', 'footer'] },
	'password-reset': { about: 'A password reset: a line, the button, and the note for when it was not asked for.', needs: ['button', 'buttonUrl'], slots: ['preheader', 'headline', 'body', 'button', 'buttonUrl', 'note', 'footer'] },
	signature: { about: 'An email signature: name, role, the lockup and the address.', needs: ['name'], slots: ['name', 'role', 'email', 'phone', 'footer'] },
};

const c = (name: string) => colorHex(name) ?? '#000000';
const px = (token: string) => {
	const v = tokens().site[token] ?? '0';
	return v.endsWith('rem') ? Number.parseFloat(v) * 16 : Number.parseFloat(v);
};

function siteHost() {
	try {
		return brand().site ? new URL(brand().site!).host.replace(/^www\./, '') : '';
	} catch {
		return '';
	}
}

const esc = (s: string) => xml(drawable(s, 'email')).replace(/\n/g, '<br>');

/** Lines of `title\nline` blocks, blank line between, or `name | amount` rows. */
const blocks = (s: string) => s.replace(/\\n/g, '\n').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean).map((b) => b.split('\n'));

export function emailHtml(template: string, copy: Record<string, string>, logoUrl: string): string {
	const sans = 'Inter, -apple-system, \'Segoe UI\', Helvetica, Arial, sans-serif';
	const display = '\'Helvetica Neue\', Helvetica, Arial, sans-serif';
	const ink = c('ink');
	const muted = c('text-muted');
	const blue = c('brand');
	const white = c('white');
	const paper = c('paper');
	const line = '#E3E2DE';
	const radius = px('--ds-radius-card');
	const key = px('--ds-radius-control');
	const onBlue = template === 'announcement';
	const fg = onBlue ? white : ink;
	const sub = onBlue ? '#CCDBFF' : muted;
	const box = logoBox('lockup');
	const logoW = 140;
	const logo = `<img src="${xml(logoUrl)}" width="${logoW}" height="${Math.round((logoW * box.height) / box.width)}" alt="${xml(brand().name)}" style="display:block;border:0;outline:none;">`;
	const button = copy.button && copy.buttonUrl ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;"><tr><td style="background:${onBlue ? white : blue};border-radius:${key}px;"><a href="${xml(copy.buttonUrl)}" style="display:inline-block;padding:12px 22px;font-family:${display};font-size:16px;font-weight:500;color:${onBlue ? blue : white};text-decoration:none;border-radius:${key}px;">${esc(copy.button)}</a></td></tr></table>` : '';
	const p = (text: string | undefined, style = '') => (text ? `<p style="margin:12px 0 0;font-family:${sans};font-size:16px;line-height:1.5;color:${sub};${style}">${esc(text)}</p>` : '');
	const head = copy.headline ? `<h1 style="margin:${copy.badge ? '8px' : '0'} 0 0;font-family:${display};font-size:30px;line-height:1.15;font-weight:500;letter-spacing:-0.02em;color:${fg};">${esc(copy.headline)}</h1>` : '';
	const badge = copy.badge ? `<div style="font-family:${display};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${onBlue ? '#CCDBFF' : blue};">${esc(copy.badge)}</div>` : '';
	let middle = '';
	if (template === 'newsletter' && copy.items) {
		middle = blocks(copy.items).map(([title, ...rest]) => `<tr><td style="padding:20px 0;border-top:1px solid ${line};"><div style="font-family:${display};font-size:19px;font-weight:500;color:${ink};">${esc(title!)}</div>${rest.length ? `<div style="margin-top:6px;font-family:${sans};font-size:15px;line-height:1.5;color:${muted};">${esc(rest.join(' '))}</div>` : ''}</td></tr>`).join('');
		middle = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">${middle}</table>`;
	}
	if (template === 'receipt') {
		const rows = copy.items.replace(/\\n/g, '\n').split('\n').map((r) => r.trim()).filter(Boolean).map((r) => {
			const [name, amount] = r.split('|').map((x) => x.trim());
			if (!name || !amount) throw new Error(`Each receipt line is "item | amount", not "${r}".`);
			return `<tr><td style="padding:10px 0;border-top:1px solid ${line};font-family:${sans};font-size:15px;color:${ink};">${esc(name)}</td><td align="right" style="padding:10px 0;border-top:1px solid ${line};font-family:${sans};font-size:15px;color:${ink};">${esc(amount)}</td></tr>`;
		});
		middle = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">${rows.join('')}<tr><td style="padding:14px 0;border-top:2px solid ${ink};font-family:${display};font-size:16px;font-weight:500;color:${ink};">Total</td><td align="right" style="padding:14px 0;border-top:2px solid ${ink};font-family:${display};font-size:16px;font-weight:500;color:${ink};">${esc(copy.total)}</td></tr></table>`;
	}
	if (template === 'signature') {
		return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-family:${sans};"><tr><td style="padding:0 0 10px;"><div style="font-family:${display};font-size:16px;font-weight:500;color:${ink};">${esc(copy.name)}</div>${copy.role ? `<div style="font-size:14px;color:${muted};">${esc(copy.role)}</div>` : ''}</td></tr><tr><td style="padding:0 0 8px;">${logo.replace(`width="${logoW}"`, 'width="110"').replace(/height="\d+"/, `height="${Math.round((110 * box.height) / box.width)}"`)}</td></tr><tr><td style="font-size:13px;line-height:1.5;color:${muted};">${[copy.email && `<a href="mailto:${xml(copy.email)}" style="color:${blue};text-decoration:none;">${esc(copy.email)}</a>`, copy.phone && esc(copy.phone), copy.footer && `<a href="https://${xml(copy.footer)}" style="color:${blue};text-decoration:none;">${esc(copy.footer)}</a>`].filter(Boolean).join(' &middot; ')}</td></tr></table>\n`;
	}
	const card = `<td style="background:${onBlue ? blue : white};border-radius:${radius}px;padding:36px;">${badge}${head}${p(copy.body)}${middle}${button}${p(copy.note, 'font-size:13px;')}</td>`;
	const footer = copy.footer ? `<tr><td style="padding:20px 8px 0;font-family:${sans};font-size:13px;color:${muted};">${esc(copy.footer)}</td></tr>` : '';
	const pre = copy.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(copy.preheader)}</div>` : '';
	return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${xml(copy.headline ?? brand().name)}</title></head>
<body style="margin:0;padding:0;background:${paper};">${pre}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${paper};"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
<tr><td style="padding:0 8px 24px;">${logo}</td></tr>
<tr>${card}</tr>
${footer}
</table></td></tr></table>
</body></html>
`;
}

export async function email(template: string | undefined, flags: Flags) {
	if (flags.list || !template) {
		emit({ json: !!flags.json }, { templates: Object.entries(EMAILS).map(([id, s]) => ({ id, ...s })), note: 'Tables and inline styles only, 600 px wide. The logo is a PNG written beside the HTML: host it and pass --logo-url.' }, () => [...Object.entries(EMAILS).map(([id, s]) => `  ${id.padEnd(15)} ${s.about} Needs ${s.needs.join(', ')}.`), '', `${cli()} email announcement --headline "..." --button "Read more" --button-url https://... -o email`].join('\n'));
		return;
	}
	const spec = EMAILS[template];
	if (!spec) throw unknownName('email template', template, Object.keys(EMAILS));
	const input = typeof flags.input === 'string' ? (JSON.parse(readFileSync(resolve(flags.input), 'utf8')) as Record<string, string>) : {};
	const copy: Record<string, string> = {};
	for (const slot of spec.slots) {
		const v = flags[slot] ?? input[slot];
		if (typeof v === 'string' && v.trim()) copy[slot] = v.trim();
	}
	for (const k of Object.keys(input)) if (!spec.slots.includes(k)) throw unknownName(`${template} field`, k, spec.slots);
	for (const k of ['badge', 'body', 'items', 'total', 'note', 'name', 'role', 'email', 'phone', 'preheader'] as const) if (flags[k] !== undefined && !spec.slots.includes(k)) throw new Error(`The ${template} email does not take --${k}.`);
	if (flags.footer === undefined && !input.footer) copy.footer = siteHost();
	if (flags.footer === false) delete copy.footer;
	const missing = spec.needs.filter((n) => !copy[n]);
	if (missing.length) throw new Error(`The ${template} email needs ${missing.map((m) => `--${m.replace(/[A-Z]/g, (x) => `-${x.toLowerCase()}`)}`).join(' and ')}.`);
	if ((copy.button && !copy.buttonUrl) || (!copy.button && copy.buttonUrl)) throw new Error('--button and --button-url go together.');
	const dir = resolve(typeof flags.out === 'string' ? flags.out : 'email');
	const logoFile = 'logo.png';
	const logoUrl = typeof flags.logoUrl === 'string' ? flags.logoUrl : logoFile;
	const html = emailHtml(template, copy, logoUrl);
	mkdirSync(dir, { recursive: true });
	const htmlPath = join(dir, `${template}.html`);
	writeFileSync(htmlPath, html);
	const files = [htmlPath];
	if (typeof flags.logoUrl !== 'string') {
		const box = logoBox('lockup');
		const h = Math.round((280 * box.height) / box.width);
		const svg = document(280, h, brand().name, drawLogo('lockup', 0, 0, h, c('brand')));
		writeFileSync(join(dir, logoFile), await rasterize(svg, 280));
		files.push(join(dir, logoFile));
	}
	emit({ json: !!flags.json }, { ok: true, template, files: files.map(show), note: typeof flags.logoUrl === 'string' ? undefined : `Host ${logoFile} and pass --logo-url so the logo shows in the inbox.` }, () => [`Wrote ${files.map(show).join(', ')}.`, typeof flags.logoUrl === 'string' ? '' : `Host ${logoFile} and pass --logo-url so the logo shows in the inbox.`].join('\n'));
}

export function registerEmail(program: Command) {
	program
		.command('email [template]')
		.description('HTML emails that survive email clients: newsletter, announcement, receipt, password-reset, signature')
		.option('--preheader <text>', 'the preview line inboxes show')
		.option('--badge <text>', 'a short label over the headline')
		.option('--headline <text>', 'the headline')
		.option('--body <text>', 'a line under it')
		.option('--items <text>', 'newsletter: stories, blank line between, title first; receipt: "item | amount" per line')
		.option('--total <text>', 'receipt: the total')
		.option('--button <text>', 'the button')
		.option('--button-url <url>', 'where the button goes')
		.option('--note <text>', 'password-reset: the small note under the button')
		.option('--name <text>', 'signature: the name')
		.option('--role <text>', 'signature: the role')
		.option('--email <text>', 'signature: the address')
		.option('--phone <text>', 'signature: the phone number')
		.option('--footer <text>', 'the small line (default: the brand site host)')
		.option('--no-footer', 'leave the footer off')
		.option('--logo-url <url>', 'where the hosted logo PNG lives')
		.option('-i, --input <file>', 'JSON of the same fields')
		.option('-o, --out <dir>', 'directory to write (default ./email)')
		.option('--list', 'list the templates')
		.option('--json', 'JSON output')
		.action((template: string | undefined, _o: unknown, cmd: Command) => email(template, cmd.optsWithGlobals()));
}
