// Records a real gameplay clip of the game at public/play/ with Playwright
// in headless Chromium, on the Teenager profile. ffmpeg then trims it to
// 8 seconds, removes audio, and writes WebM, MP4 and a WebP poster frame.
// Nothing in the clip is staged: the script only presses the same keys a
// player presses.
// Run: npm run clip
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, mkdir, rm, readdir, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const PLAY = new URL('../public/play/', import.meta.url).pathname;
const OUT = new URL('../src/assets/clip/', import.meta.url).pathname;
const TMP = new URL('../.clip-tmp/', import.meta.url).pathname;
const WIDTH = 1280;
const HEIGHT = 720;
const CLIP_SECONDS = 8;
const LIMIT = 2 * 1024 * 1024;

// A small static server for the game only. The copy it serves to the
// recording browser gets one read-only hook at the end of the game's closure,
// so the bot can read the board state. The published game file is not
// changed (scripts/check-play-hash.mjs proves it).
const HOOK =
  'window.__kerbSense = { get run() { return run; }, bandAtRow, signalPhase, bandData, blockedAt };\n})();';
const server = createServer(async (req, res) => {
  try {
    const original = await readFile(join(PLAY, 'index.html'), 'utf8');
    const marker = original.lastIndexOf('})();');
    const body = original.slice(0, marker) + HOOK + original.slice(marker + '})();'.length);
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;

await rm(TMP, { recursive: true, force: true });
await mkdir(TMP, { recursive: true });
await mkdir(OUT, { recursive: true });

// The CI runner installs Playwright's own Chromium. This container has one
// preinstalled at PW_CHROMIUM_PATH, so use it when it is set.
const browser = await chromium.launch(
  process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
);
const context = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  recordVideo: { dir: TMP, size: { width: WIDTH, height: HEIGHT } },
  reducedMotion: 'no-preference',
});
const page = await context.newPage();
await page.goto(`http://127.0.0.1:${port}/`);

// The pledge, then the Teenager profile (slider value 1), then start.
await page.click('#pledge-btn');
await page.waitForSelector('#start-screen:not([hidden])');
await page.focus('#tier-slider');
await page.keyboard.press('ArrowRight');
await page.click('#start-btn');
await page.waitForTimeout(600);

// Play like a careful player. The bot reads the same game state the player
// sees: it walks to the marked crossing, waits for the green signal and a
// clear lane, then crosses. It answers phone messages only on the pavement.
// It presses only the keys a player presses.
const nextKey = () =>
  page.evaluate(() => {
    const { run, bandAtRow, signalPhase, bandData, blockedAt } = window.__kerbSense;
    if (!run || run.phase !== 'playing') return null;
    if (run.activeBlock) return run.activeBlock.event.requiresReply ? 'Digit1' : 'Space';
    if (run.hopT < 1) return null;
    const band = bandAtRow(run.bands, run.row);
    if (!band) return null;
    const carNear = (roadBand, row, col, margin) =>
      bandData(roadBand).cars.some((car) => car.row === row && Math.abs(car.x - col) < car.len / 2 + margin);
    if (band.type === 'pavement') {
      if (run.pendingNotifications.length > 0) return 'Space';
      let road = null;
      for (let r = run.row + 1; r < run.row + 12; r += 1) {
        const b = bandAtRow(run.bands, r);
        if (b && b.type === 'road') {
          road = b;
          break;
        }
      }
      if (!road) return 'ArrowUp';
      const target = road.zebraCol + 1;
      if (run.col < target && !blockedAt(run.row, run.col + 1)) return 'ArrowRight';
      if (run.col > target && !blockedAt(run.row, run.col - 1)) return 'ArrowLeft';
      if (run.col !== target) return 'ArrowUp';
      const nextBand = bandAtRow(run.bands, run.row + 1);
      if (nextBand && nextBand.type === 'pavement') return blockedAt(run.row + 1, run.col) ? null : 'ArrowUp';
      const green = signalPhase(run.elapsedMs, road.seed) === 'green';
      if (!green) return null;
      if (carNear(road, run.row + 1, run.col, 2.5)) return null;
      return 'ArrowUp';
    }
    // On the road: keep going while the next row is clear.
    const nextBand = bandAtRow(run.bands, run.row + 1);
    if (nextBand && nextBand.type === 'road' && carNear(nextBand, run.row + 1, run.col, 2)) return null;
    if (
      nextBand &&
      nextBand.type === 'road' &&
      nextBand !== band &&
      signalPhase(run.elapsedMs, nextBand.seed) !== 'green'
    )
      return null;
    return 'ArrowUp';
  });

const startedAt = Date.now();
while (Date.now() - startedAt < (CLIP_SECONDS + 8) * 1000) {
  const key = await nextKey();
  if (key) await page.keyboard.press(key);
  await page.waitForTimeout(140);
}
const { phase, distance } = await page.evaluate(() => {
  const { run } = window.__kerbSense;
  return { phase: run ? run.phase : 'none', distance: run ? run.distance : 0 };
});
console.log('run phase at the end:', phase, 'distance:', distance);

await context.close();
await browser.close();
server.close();

const [video] = (await readdir(TMP)).filter((f) => f.endsWith('.webm'));
if (!video) throw new Error('No video was recorded.');
const source = join(TMP, video);

// Skip the pledge and start screens, then keep 8 seconds.
const SKIP = 1.6;
const common = [
  '-y',
  '-ss',
  String(SKIP),
  '-t',
  String(CLIP_SECONDS),
  '-i',
  source,
  '-an',
  '-vf',
  'scale=960:-2',
];
execFileSync(
  'ffmpeg',
  [...common, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '36', join(OUT, 'gameplay.webm')],
  {
    stdio: 'ignore',
  },
);
execFileSync(
  'ffmpeg',
  [
    ...common,
    '-c:v',
    'libx264',
    '-profile:v',
    'main',
    '-pix_fmt',
    'yuv420p',
    '-crf',
    '28',
    '-movflags',
    '+faststart',
    join(OUT, 'gameplay.mp4'),
  ],
  { stdio: 'ignore' },
);
execFileSync(
  'ffmpeg',
  [
    '-y',
    '-ss',
    String(SKIP + 3),
    '-i',
    source,
    '-frames:v',
    '1',
    '-vf',
    'scale=960:-2',
    '-quality',
    '80',
    join(OUT, 'gameplay-poster.webp'),
  ],
  { stdio: 'ignore' },
);
await rm(TMP, { recursive: true, force: true });

for (const f of ['gameplay.webm', 'gameplay.mp4', 'gameplay-poster.webp']) {
  const size = (await stat(join(OUT, f))).size;
  console.log(f, Math.round(size / 1024), 'KB');
  if (size > LIMIT) {
    console.error(`${f} is over 2 MB.`);
    process.exit(1);
  }
}
