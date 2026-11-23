import type { Command } from 'commander';
import { adapter, paint } from '../design/adapter.js';
import { designHelp, runDesign } from '../design/index.js';
import { cli } from '../lib/brand.js';

// `design`: the shared core (src/design), mounted on this brand's adapter. It reads its own arguments, so the program's
// global flags never swallow one of its own.

export function registerDesign(program: Command) {
	program
		.command('design [args...]')
		.description('Make a design, revise it in plain words or exact edits, check it, undo it (a small JSON file)')
		.option('--json', 'JSON output')
		.allowUnknownOption()
		.helpOption(false)
		.action(() => undefined);
}

/** Runs `design ...` when that is what was typed. True when it did. */
export async function designFrom(argv: string[]): Promise<boolean> {
	if (argv[0] !== 'design') return false;
	process.exitCode = await runDesign(argv.slice(1), adapter(), { cwd: process.cwd(), bin: cli(), out: (s) => process.stdout.write(`${s}\n`), err: (s) => process.stderr.write(`${s}\n`), paint });
	return true;
}

export { designHelp };
