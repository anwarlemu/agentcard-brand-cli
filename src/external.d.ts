declare module '@babel/plugin-transform-typescript' {
	const plugin: import('@babel/core').PluginItem;
	export default plugin;
}

/** The font parser has no shipped types. Only the calls this package makes are declared. */
declare module 'opentype.js' {
	export type GlyphPath = { toPathData(decimalPlaces?: number): string };
	export type Font = {
		ascender: number;
		descender: number;
		unitsPerEm: number;
		getAdvanceWidth(text: string, fontSize: number, options?: { letterSpacing?: number; kerning?: boolean }): number;
		getPath(text: string, x: number, y: number, fontSize: number, options?: { letterSpacing?: number; kerning?: boolean }): GlyphPath;
	};
	export function parse(buffer: Buffer | ArrayBuffer): Font;
	const opentype: { parse: typeof parse };
	export default opentype;
}
