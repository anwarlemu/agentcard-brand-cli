import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Command } from 'commander';
import { review, snapshot } from './commands/review.js';
import { run } from './commands/run.js';
import { guide } from './commands/guide.js';
import { workflow } from './commands/workflow.js';
import { imageList, imageRender } from './commands/image.js';
import { componentEmit, componentInspect, componentList } from './commands/component.js';
import { brandCommand, brandFonts, brandLogos, brandTokens, brandVoice, manifestCommand, principlesCommand } from './commands/system.js';
import { videoList, videoRender } from './commands/video.js';
import { approve, check, done, look, skip, tokensCommand } from './commands/small.js';
import { type HookResult, cursorPreToolUse, cursorStop, preToolUse, sessionStart, stop, userPromptSubmit } from './hooks/handlers.js';
import { readHookInput } from './hooks/payload.js';
import { brand, cli, hasProduct } from './lib/brand.js';
import { findProjectRoot } from './lib/paths.js';

const program = new Command();
const b = brand();

program.name(b.bin).description(`Build ${b.name} pages and interfaces. Start with manifest --json. It lists every command, template, size, component and rule.`);
// A brand with a site only styles every project as a site: no surface or theme to choose.
if (hasProduct())
	program
		.option('--surface <surface>', 'site (pages people read) or product (an app people work in); default: read from the project')
		.option('--theme <theme>', 'product only: light (default) or dark');
program
	.option('--redo', 'convert the project again (after an update, or after reverting)')
	.option('--dry-run', 'show what would change, write nothing')
	.option('--no-install', 'do not add the package to the project when run through npx')
	.option('--json', 'JSON output')
	.action((opts) => run(opts));

program.command('manifest').description('List every command, token, template, size, component and rule').option('--json', 'JSON output').action((_opts, command) => manifestCommand(command.optsWithGlobals()));
program.command('describe').description('Same as manifest').option('--json', 'JSON output').action((_opts, command) => manifestCommand(command.optsWithGlobals()));
program.command('guide').description('Read the portable agent workflow').option('--json', 'JSON output').action((_opts, command) => guide(command.optsWithGlobals()));

const brandCmd = program.command('brand').description('Read tokens, fonts, logos and voice from the brand files').option('--json', 'JSON output');
brandCmd.action((_opts, command) => brandCommand(command.optsWithGlobals()));
brandCmd.command('tokens').description('List tokens by group, or one token by exact name').option('--group <group>', 'color, type, space, radius, motion, shadow, band, glass, or other').option('--name <token>', 'exact token name, such as --ds-color-brand').option('--json', 'JSON output').action((_opts, command) => brandTokens(command.optsWithGlobals()));
brandCmd.command('fonts').description('Font files that ship, and font tokens whose families do not').option('--json', 'JSON output').action((_opts, command) => brandFonts(command.optsWithGlobals()));
brandCmd.command('logos').description('Logo files and the usage rules stored with them').option('--json', 'JSON output').action((_opts, command) => brandLogos(command.optsWithGlobals()));
brandCmd.command('voice').description('Voice section and the words it says to avoid').option('--json', 'JSON output').action((_opts, command) => brandVoice(command.optsWithGlobals()));
program.command('principles').description('Website rules and the product gap, from the brand files').option('--surface <surface>', 'site or product').option('--json', 'JSON output').action((_opts, command) => principlesCommand(command.optsWithGlobals()));

const component = program.command('component').description('List, inspect and emit components from the bundled library');
component.action(() => component.help());
component.command('list').description('List every component').option('--type <type>', 'ui, site, product, visual, block, hook, lib, theme').option('--surface <surface>', 'site, product or both').option('--json', 'JSON output').action((_opts, command) => componentList(command.optsWithGlobals()));
component.command('inspect <name>').description('Exports, variants, states, usage and constraints').option('--json', 'JSON output').action((name, _opts, command) => componentInspect(name, command.optsWithGlobals()));
component
	.command('emit <name>')
	.description('Copy an example state, or emit markup from the variant map')
	.option('--state <state>', 'example export to copy')
	.option('--set <key=value>', 'variant key and value, repeatable', (value: string, previous: string[]) => { previous.push(value); return previous; }, [] as string[])
	.option('--text <text>', 'child text when using --set')
	.option('--export <name>', 'component export to instantiate')
	.option('--variants <name>', 'which variant map, when the file has more than one')
	.option('--json', 'JSON output')
	.action((name, _opts, command) => componentEmit(name, command.optsWithGlobals()));

program.command('review [url]').description('Screenshot a page at desktop and phone width and score it against the brand; a task is done when it passes').option('--threshold <n>', 'minimum score').option('--submit <dir>', 'record the scorecard an agent wrote itself (when no separate reviewer is available)').option('--all', 'review every task screen that is not done yet, at once (pass the app\'s address)').option('--any', 'review a page that is not a task').option('--json', 'JSON output').action((url, _opts, command) => review(url, command.optsWithGlobals()));
program.command('look [target]').description('The brand styling (CSS, Tailwind, states) for every element in a file, or for one element kind').option('--surface <surface>', 'site or product').option('--json', 'JSON output').action((target, _opts, command) => look(target, command.optsWithGlobals()));
program.command('check [files...]').description('Check that every style value is a brand token (used by hooks, pre-commit and CI)').option('--fix', 'replace exact matches with their token').option('--changed', 'only files changed in git').option('--json', 'JSON output').action((files, _opts, command) => check(files ?? [], command.optsWithGlobals()));
program.command('tokens [term]').description('Find a brand token by name or value').option('--json', 'JSON output').action((term, _opts, command) => tokensCommand(term, command.optsWithGlobals()));

const image = program.command('image').description('Render on-brand Open Graph and social images from content');
image.action(() => image.help());
image.command('list').description('List sizes, templates and the fields each template takes').option('--json', 'JSON output').action((_opts, command) => imageList(command.optsWithGlobals()));
image
	.command('render')
	.description('Write PNG and SVG images for one template')
	.option('-t, --template <id>', 'headline, subtext, screenshot, quote or announcement')
	.option('-s, --size <sizes>', 'og, square, portrait, landscape, or all, comma-separated')
	.option('--headline <text>', 'main line')
	.option('--subtext <text>', 'supporting line')
	.option('--eyebrow <text>', 'short label above the headline')
	.option('--quote <text>', 'quote text, for the quote template')
	.option('--by <text>', 'who said the quote')
	.option('--image <file>', 'PNG or JPEG placed in the screenshot window')
	.option('--window <name>', 'title bar label, such as screen.preview')
	.option('--footer <text>', 'small line; default is the brand site host')
	.option('--no-footer', 'leave the footer line off')
	.option('--ground <ground>', 'blue, paper or white')
	.option('-o, --out <dir>', 'directory to write', 'images')
	.option('-n, --name <name>', 'file name prefix; default is the template')
	.option('--export <formats>', 'png, svg, or png,svg')
	.option('-i, --input <file>', 'JSON object of the same fields; flags override it. Use - for stdin')
	.option('--dry-run', 'list the files and write nothing')
	.option('--json', 'JSON output')
	.addHelpText('after', '\nExamples:\n  image render --template headline --headline "Let agents buy anything online" --json\n  image render --template subtext --size og,square --headline "..." --subtext "..." --out ./images\n  image render --template screenshot --image ./screen.png --headline "..."\n  image render --template quote --quote "..." --by "..."\n  image render --input content.json --size all --json\n')
	.action((_opts, command) => imageRender(command.optsWithGlobals()));

const video = program.command('video').description('Render on-brand short videos from content');
video.action(() => video.help());
video.command('list').description('List sizes, templates, the frame count and the renderer').option('--json', 'JSON output').action((_opts, command) => videoList(command.optsWithGlobals()));
video
	.command('render')
	.description('Write an MP4 for one template')
	.option('-t, --template <id>', 'social, announcement or product')
	.option('-s, --size <sizes>', 'square, vertical, landscape, or all, comma-separated')
	.option('--headline <text>', 'main line')
	.option('--subtext <text>', 'supporting line, for announcement and product')
	.option('--eyebrow <text>', 'short label, for social and announcement')
	.option('--window <name>', 'title bar label, for product')
	.option('--footer <text>', 'small line; default is the brand site host')
	.option('--no-footer', 'leave the footer line off')
	.option('-o, --out <dir>', 'directory to write', 'videos')
	.option('-n, --name <name>', 'file name prefix; default is the template')
	.option('--export <format>', 'mp4')
	.option('-i, --input <file>', 'JSON object of the same fields; flags override it. Use - for stdin')
	.option('--dry-run', 'list the files and write nothing')
	.option('--json', 'JSON output')
	.action((_opts, command) => videoRender(command.optsWithGlobals()));
program.command('approve').description('Approve ds-override comments (a person, in a terminal)').option('--all', 'approve every pending override').action((opts) => approve(opts));
program.command('snapshot [url]').description('Save how each main screen looks before hand edits (run once, with the app running); reviews compare against it').action((url) => snapshot(url));
program.command('skip <screen>').description('Leave a screen as it is when it cannot pass without changing words or elements; the person sees the reason').requiredOption('--reason <text>', 'why').action((id, opts) => skip(id, opts.reason));
program.command('done <screen>').description('Mark a native screen restyled (web screens are done when their review passes)').action((id) => done(id));

program
	.command('hook <event>')
	.description('Agent hook entry point (session-start, user-prompt-submit, pre-tool-use, stop); reads the event JSON on stdin')
	.option('--harness <name>', 'claude-code | cursor | codex', 'claude-code')
	.action((event: string, opts) => {
		const input = readHookInput();
		const root = findProjectRoot(input.cwd ?? process.env.CLAUDE_PROJECT_DIR ?? process.env.CURSOR_PROJECT_DIR ?? process.cwd());
		let result: HookResult = {};
		try {
			if (opts.harness === 'cursor') result = event === 'pre-tool-use' ? cursorPreToolUse(root, input) : event === 'stop' ? cursorStop(root, input) : {};
			else if (event === 'session-start') result = sessionStart(root, input);
			else if (event === 'user-prompt-submit') result = userPromptSubmit(root, input);
			else if (event === 'pre-tool-use') result = preToolUse(root, input);
			else if (event === 'stop') result = stop(root, input);
		} catch (error) {
			// Hooks fail open: a bug in the checker must never stop someone's work.
			process.stderr.write(`${b.bin} hook ${event} failed open: ${(error as Error).message}\n`);
			process.exit(0);
		}
		try {
			mkdirSync(join(root, '.ds'), { recursive: true });
			appendFileSync(join(root, '.ds', 'hooks.log'), `${JSON.stringify({ at: new Date().toISOString(), harness: opts.harness, event, blocked: result.exitCode === 2 || !!(result.json as any)?.decision || (result.json as any)?.permission === 'deny' })}\n`);
		} catch {}
		if (result.json) process.stdout.write(`${JSON.stringify(result.json)}\n`);
		else if (result.stdout) process.stdout.write(`${result.stdout}\n`);
		if (result.stderr) process.stderr.write(`${result.stderr}\n`);
		process.exit(result.exitCode ?? 0);
	});

workflow(program);

program.parseAsync().catch((error: Error) => {
	if (program.opts().json || process.argv.includes('--json')) process.stdout.write(`${JSON.stringify({ ok: false, error: error.message })}\n`);
	else process.stderr.write(`${error.message}\n`);
	process.exit(1);
});
void cli;
