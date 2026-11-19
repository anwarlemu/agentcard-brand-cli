import type { ZodType } from 'zod';

type Issue = { path: PropertyKey[]; message: string; keys?: string[] };

/** Validate a command payload. Unknown keys and wrong types throw; nothing is dropped or coerced. */
export function parseSchema<T>(schema: ZodType<T>, value: unknown, label: string, allowed?: readonly string[]): T {
	const parsed = schema.safeParse(value);
	if (parsed.success) return parsed.data;
	const issue = parsed.error.issues[0] as Issue | undefined;
	if (!issue) throw new Error(`${label} is not valid.`);
	if (issue.keys?.length) {
		const hint = allowed?.length ? ` Use ${allowed.join(', ')}.` : '';
		throw new Error(`Unknown ${label} field ${issue.keys.map((key) => JSON.stringify(key)).join(', ')}.${hint}`);
	}
	const path = issue.path.length ? issue.path.map(String).join('.') : label;
	throw new Error(`${path}: ${issue.message}`);
}
