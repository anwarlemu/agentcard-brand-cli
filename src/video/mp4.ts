// Motion JPEG in an MP4 box. Times are zero and the encoder is pure JavaScript, so the bytes do not depend on a clock or a system install.

const four = (value: string) => Buffer.from(value, 'ascii');
const zeros = (size: number) => Buffer.alloc(size);
const u16 = (value: number) => {
	const buf = Buffer.alloc(2);
	buf.writeUInt16BE(value);
	return buf;
};
const u32 = (value: number) => {
	const buf = Buffer.alloc(4);
	buf.writeUInt32BE(value >>> 0);
	return buf;
};

function box(type: string, ...parts: Buffer[]): Buffer {
	const body = Buffer.concat(parts);
	return Buffer.concat([u32(body.length + 8), four(type), body]);
}

function matrix(): Buffer {
	return Buffer.concat([u32(0x00010000), u32(0), u32(0), u32(0), u32(0x00010000), u32(0), u32(0), u32(0), u32(0x40000000)]);
}

function ftyp(): Buffer {
	return box('ftyp', four('isom'), u32(0), four('isom'), four('iso2'), four('mp41'));
}

function mvhd(timescale: number, duration: number): Buffer {
	return box('mvhd', u32(0), u32(0), u32(0), u32(timescale), u32(duration), u32(0x00010000), u16(0x0100), u16(0), zeros(8), matrix(), zeros(24), u32(2));
}

function tkhd(duration: number, width: number, height: number): Buffer {
	return box('tkhd', u32(0x00000007), u32(0), u32(0), u32(1), u32(0), u32(duration), zeros(8), u16(0), u16(0), u16(0), u16(0), matrix(), u32(width << 16), u32(height << 16));
}

function mdhd(timescale: number, duration: number): Buffer {
	return box('mdhd', u32(0), u32(0), u32(0), u32(timescale), u32(duration), u16(0x55c4), u16(0));
}

function hdlr(): Buffer {
	return box('hdlr', u32(0), u32(0), four('vide'), zeros(12), Buffer.from('VideoHandler\0', 'ascii'));
}

function vmhd(): Buffer {
	return box('vmhd', u32(1), u16(0), u16(0), u16(0), u16(0));
}

function dinf(): Buffer {
	return box('dinf', box('dref', u32(0), u32(1), box('url ', u32(1))));
}

function jpegEntry(width: number, height: number): Buffer {
	const name = Buffer.alloc(32);
	name[0] = 4;
	name.write('jpeg', 1, 'ascii');
	return box('jpeg', zeros(6), u16(1), u16(0), u16(0), zeros(12), u16(width), u16(height), u32(0x00480000), u32(0x00480000), u32(0), u16(1), name, u16(0x0018), u16(0xffff));
}

function moov(width: number, height: number, frameCount: number, fps: number, sizes: number[], offset: number): Buffer {
	const stbl = box(
		'stbl',
		box('stsd', u32(0), u32(1), jpegEntry(width, height)),
		box('stts', u32(0), u32(1), u32(frameCount), u32(1)),
		box('stsc', u32(0), u32(1), u32(1), u32(frameCount), u32(1)),
		box('stsz', u32(0), u32(0), u32(sizes.length), ...sizes.map((size) => u32(size))),
		box('stco', u32(0), u32(1), u32(offset)),
	);
	const minf = box('minf', vmhd(), dinf(), stbl);
	const mdia = box('mdia', mdhd(fps, frameCount), hdlr(), minf);
	return box('moov', mvhd(fps, frameCount), box('trak', tkhd(frameCount, width, height), mdia));
}

/** One sample chunk of JPEG frames. `fps` is the movie timescale and each frame lasts one tick. */
export function muxMjpeg(frames: Buffer[], width: number, height: number, fps: number): Buffer {
	if (!frames.length) throw new Error('A video needs at least one frame.');
	if (!Number.isInteger(width) || !Number.isInteger(height) || width < 2 || height < 2) throw new Error('Video width and height must be integers of at least 2.');
	if (!Number.isInteger(fps) || fps < 1) throw new Error('Frame rate must be a positive integer.');
	const sizes = frames.map((frame) => frame.length);
	const payload = Buffer.concat(frames);
	const head = ftyp();
	const draft = moov(width, height, frames.length, fps, sizes, 0);
	const offset = head.length + draft.length + 8;
	if (offset > 0xffff_ffff) throw new Error('Video is too large for a 32-bit offset.');
	const movie = moov(width, height, frames.length, fps, sizes, offset);
	if (movie.length !== draft.length) throw new Error('Video header size changed while writing the sample offset.');
	const media = Buffer.concat([u32(payload.length + 8), four('mdat'), payload]);
	return Buffer.concat([head, movie, media]);
}
