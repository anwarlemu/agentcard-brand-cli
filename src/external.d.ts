declare module '@babel/plugin-transform-typescript' {
	const plugin: import('@babel/core').PluginItem;
	export default plugin;
}

/** The font parser has no shipped types. Only the calls this package makes are declared. */
declare module 'opentype.js' {
	export type GlyphPath = { toPathData(decimalPlaces?: number): string };
	export type Glyph = {
		name: string;
		index: number;
		advanceWidth?: number;
		getPath(x: number, y: number, fontSize: number): GlyphPath;
	};
	export type Font = {
		ascender: number;
		descender: number;
		unitsPerEm: number;
		stringToGlyphs(text: string): Glyph[];
		nameToGlyph(name: string): Glyph;
		getAdvanceWidth(text: string, fontSize: number, options?: { letterSpacing?: number; kerning?: boolean }): number;
		getPath(text: string, x: number, y: number, fontSize: number, options?: { letterSpacing?: number; kerning?: boolean }): GlyphPath;
		position: {
			getDefaultScriptName(): string;
			getKerningTables(script: string): unknown;
			getKerningValue(tables: unknown, left: number, right: number): number;
		};
	};
	export function parse(buffer: Buffer | ArrayBuffer): Font;
	const opentype: { parse: typeof parse };
	export default opentype;
}
