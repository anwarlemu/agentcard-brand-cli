

// A PNG's print resolution: a pHYs chunk after the header, so print tools read the file at its real size.

const CRC = (() => {
	const table = new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		table[n] = c >>> 0;
	}
	return table;
})();

function crc32(buf: Buffer) {
	let c = 0xffffffff;
	for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]!) & 0xff]! ^ (c >>> 8);
	return (c ^ 0xffffffff) >>> 0;
}

export function withDpi(png: Buffer, dpi: number): Buffer {
	const ppm = Math.round(dpi / 0.0254);
	const data = Buffer.alloc(9);
	data.writeUInt32BE(ppm, 0);
	data.writeUInt32BE(ppm, 4);
	data[8] = 1;
	const typed = Buffer.concat([Buffer.from('pHYs', 'ascii'), data]);
	const chunk = Buffer.alloc(4 + typed.length + 4);
	chunk.writeUInt32BE(9, 0);
	typed.copy(chunk, 4);
	chunk.writeUInt32BE(crc32(typed), 4 + typed.length);
	const ihdrEnd = 8 + 4 + 4 + 13 + 4;
	return Buffer.concat([png.subarray(0, ihdrEnd), chunk, png.subarray(ihdrEnd)]);
}

