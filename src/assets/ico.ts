// A Windows icon file holding PNG images (every browser since 2010 reads PNG inside ICO).

export function icoOf(pngs: { size: number; data: Buffer }[]): Buffer {
	const head = Buffer.alloc(6);
	head.writeUInt16LE(0, 0);
	head.writeUInt16LE(1, 2);
	head.writeUInt16LE(pngs.length, 4);
	const entries: Buffer[] = [];
	let offset = 6 + 16 * pngs.length;
	for (const p of pngs) {
		const e = Buffer.alloc(16);
		e.writeUInt8(p.size >= 256 ? 0 : p.size, 0);
		e.writeUInt8(p.size >= 256 ? 0 : p.size, 1);
		e.writeUInt16LE(1, 4);
		e.writeUInt16LE(32, 6);
		e.writeUInt32LE(p.data.length, 8);
		e.writeUInt32LE(offset, 12);
		offset += p.data.length;
		entries.push(e);
	}
	return Buffer.concat([head, ...entries, ...pngs.map((p) => p.data)]);
}
