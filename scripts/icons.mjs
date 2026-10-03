// Makes the PNG favicons, the apple-touch-icon and favicon.ico from the
// "k." monogram SVG. The SVG favicon is used as is.
// Run: npm run assets
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const MARK = new URL('../website-handoff/assets/logo/kerbsense-mark-on-green.svg', import.meta.url).pathname;
const PUB = new URL('../public/', import.meta.url).pathname;

const png = (size) => sharp(MARK, { density: 300 }).resize(size, size).png().toBuffer();

for (const [size, name] of [
  [32, 'favicon-32.png'],
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
  [180, 'apple-touch-icon.png'],
]) {
  await writeFile(`${PUB}${name}`, await png(size));
}

// An ICO file can hold PNG images. One directory, three entries.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
const dir = Buffer.alloc(16 * sizes.length);
let offset = 6 + dir.length;
images.forEach((img, i) => {
  const o = i * 16;
  dir.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], o);
  dir.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], o + 1);
  dir.writeUInt8(0, o + 2);
  dir.writeUInt8(0, o + 3);
  dir.writeUInt16LE(1, o + 4);
  dir.writeUInt16LE(32, o + 6);
  dir.writeUInt32LE(img.length, o + 8);
  dir.writeUInt32LE(offset, o + 12);
  offset += img.length;
});
await writeFile(`${PUB}favicon.ico`, Buffer.concat([header, dir, ...images]));
console.log('icons written');
