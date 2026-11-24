import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Encoding through ffmpeg when it is installed: H.264 in MP4 and VP9 in WebM, single-threaded and bit-exact so the same
// frames give the same bytes on the same ffmpeg. Frames go in as raw RGBA on stdin.

export type Container = 'mp4' | 'webm' | 'gif';

let found: string | null | undefined;
/** The ffmpeg to use (FFMPEG or DS_FFMPEG, else ffmpeg on the PATH), or null when there is none. */
export function ffmpegPath(): string | null {
	if (found !== undefined) return found;
	for (const bin of [process.env.DS_FFMPEG, process.env.FFMPEG, 'ffmpeg'].filter(Boolean) as string[]) {
		const r = spawnSync(bin, ['-version'], { stdio: 'ignore' });
		if (r.status === 0) return (found = bin);
	}
	return (found = null);
}

const CODEC: Record<Container, string[]> = {
	mp4: ['-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-threads', '1', '-x264-params', 'threads=1:sliced-threads=0', '-movflags', '+faststart'],
	// A GIF with its own palette (from the clip's frames), dithered by Bayer so the same frames give the same file.
	gif: ['-vf', 'split[a][b];[a]palettegen=stats_mode=full:max_colors=256[p];[b][p]paletteuse=dither=bayer:bayer_scale=3', '-loop', '0'],
	webm: ['-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-pix_fmt', 'yuv420p', '-threads', '1', '-row-mt', '0', '-deadline', 'good', '-cpu-used', '2'],
};

export async function encode(frames: AsyncIterable<Uint8Array>, width: number, height: number, fps: number, containers: Container[]): Promise<Buffer[]> {
	const bin = ffmpegPath();
	if (!bin) throw new Error(`${containers.join(' and ')} needs ffmpeg. Install it (https://ffmpeg.org) or set DS_FFMPEG to its path.`);
	const dir = mkdtempSync(join(tmpdir(), 'ds-video-'));
	try {
		// One ffmpeg per container, fed the same frames, so a clip is drawn once whatever it is exported as.
		const jobs = containers.map((container) => {
			const out = join(dir, `clip.${container}`);
			const args = ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${width}x${height}`, '-r', String(fps), '-i', '-', '-an', ...CODEC[container], '-fflags', '+bitexact', '-flags:v', '+bitexact', '-map_metadata', '-1', out];
			const child = spawn(bin, args, { stdio: ['pipe', 'ignore', 'pipe'] });
			let err = '';
			child.stderr.on('data', (d) => (err += String(d)));
			const done = new Promise<void>((resolve, reject) => {
				child.on('error', reject);
				child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg failed (${code}): ${err.trim().slice(0, 400)}`))));
			});
			return { out, child, done };
		});
		for await (const frame of frames) {
			await Promise.all(jobs.map((j) => (j.child.stdin.write(frame) ? undefined : new Promise((r) => j.child.stdin.once('drain', r)))));
		}
		for (const j of jobs) j.child.stdin.end();
		await Promise.all(jobs.map((j) => j.done));
		return jobs.map((j) => readFileSync(j.out));
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
}
