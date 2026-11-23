import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Command } from 'commander';
import { review, snapshot } from './commands/review.js';
import { run } from './commands/run.js';
import { guide } from './commands/guide.js';
import { workflow } from './commands/workflow.js';
import { registerImage } from './commands/image.js';
import { componentEmit, componentInspect, componentList } from './commands/component.js';
import { brandCommand, brandFonts, brandLogos, brandTokens, brandVoice, manifestCommand, principlesCommand } from './commands/system.js';
import { registerVideo } from './commands/video.js';
import { registerIllustrate } from './commands/illustrate.js';
import { registerDeck } from './commands/deck.js';
import { registerMerch } from './commands/merch.js';
import { registerFigma } from './commands/figma.js';
import { designFrom, registerDesign } from './commands/design.js';
import { approve, check, done, look, skip, tokensCommand } from './commands/small.js';
import { type HookResult, cursorPreToolUse, cursorStop, preToolUse, sessionStart, stop, userPromptSubmit } from './hooks/handlers.js';
import { readHookInput } from './hooks/payload.js';
import { brand, cli, hasProduct } from './lib/brand.js';
import { findProjectRoot } from './lib/paths.js';
import { unknownName } from './lib/names.js';
import { attachProgram } from './brand/manifest.js';

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

registerImage(program);

registerVideo(program);
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
registerIllustrate(program);
registerDeck(program);
registerMerch(program);
registerFigma(program);
registerDesign(program);

// An unknown command exits 1 with the nearest names, instead of commander's "too many arguments".
{
	const args = process.argv.slice(2);
	let first: string | undefined;
	for (let i = 0; i < args.length; i++) {
		const a = args[i]!;
		if (a === '-c' || a === '--cwd') {
			i++;
			continue;
		}
		if (a.startsWith('-')) continue;
		first = a;
		break;
	}
	const names = program.commands.flatMap((c) => [c.name(), ...c.aliases()]).concat('help');
	const group = first ? program.commands.find((c) => c.name() === first || c.aliases().includes(first)) : undefined;
	// A group (image, video, component, brand) takes no arguments of its own: its next word must be one of its commands.
	const next = group && group.commands.length && !group.registeredArguments.length ? args.slice(args.indexOf(first!) + 1).find((a) => !a.startsWith('-')) : undefined;
	const subs = group ? group.commands.flatMap((c) => [c.name(), ...c.aliases()]) : [];
	const bad = first === 'design' ? undefined : first && !names.includes(first) ? unknownName('command', first, names.filter((n) => n !== 'help')) : next && !subs.includes(next) && next !== 'help' ? unknownName(`${first} command`, next, subs) : undefined;
	if (bad) {
		const error = bad;
		if (args.includes('--json')) process.stdout.write(`${JSON.stringify({ ok: false, error: error.message })}\n`);
		else process.stderr.write(`${error.message}\n`);
		process.exit(1);
	}
}

attachProgram(program);

const start = async () => {
	if (!(await designFrom(process.argv.slice(2)))) await program.parseAsync();
};
start().catch((error: Error) => {
	if (program.opts().json || process.argv.includes('--json')) process.stdout.write(`${JSON.stringify({ ok: false, error: error.message })}\n`);
	else process.stderr.write(`${error.message}\n`);
	process.exit(1);
});
void cli;
