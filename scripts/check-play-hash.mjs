// Checks that the game at public/play/index.html is byte-for-byte unchanged.
// The expected hash is the SHA-256 of the game as it was before the website
// was added. Update it only when the team ships a new game build on purpose.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const EXPECTED = 'd5dd3116553426731172dfa662764b8fb5c57ad6be87cb117de4753a96170d1f';
const file = new URL('../public/play/index.html', import.meta.url);
const actual = createHash('sha256').update(readFileSync(file)).digest('hex');

if (actual !== EXPECTED) {
  console.error(`The game file changed. Expected ${EXPECTED}, got ${actual}.`);
  console.error('Do not change the game. If a new game build is intended, update scripts/check-play-hash.mjs.');
  process.exit(1);
}
console.log('The game file is unchanged.');
