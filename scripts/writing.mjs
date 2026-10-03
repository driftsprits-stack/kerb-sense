// Checks the site copy and the documentation for the signs of AI writing
// listed on Wikipedia (Wikipedia:Signs of AI writing) and for the banned
// words in WEBSITE-STANDARDS.md V35. It fails on:
//   - em dashes and curly quotation marks;
//   - the "not only X but also Y" and "not X, it's Y" patterns (V26);
//   - the AI vocabulary list (delve, tapestry, testament, pivotal, ...);
//   - the copula-avoiding verbs "serves as", "stands as", "boasts";
//   - "-ing" tails that add significance ("highlighting", "underscoring", ...);
//   - section summaries ("In summary", "In conclusion", "Overall,");
//   - didactic disclaimers ("it is important to note", "worth noting");
//   - chatbot phrases ("I hope this helps", "Certainly", "Let me know");
//   - thematic breaks between sections in Markdown;
//   - emoji.
// The game at public/play/ is not checked: it is a separate, unchanged
// product. The quoted game rule in CONTENT.md is product text (V26).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = new URL('../', import.meta.url).pathname;

const FILES = [
  'src/content.ts',
  'src/copy-pool.json',
  'index.html',
  'privacy/index.html',
  'terms/index.html',
  '404.html',
  'README.md',
  'CONTRIBUTING.md',
  'website-handoff/RESEARCH-NOTES.md',
  'website-handoff/PLAN.md',
  ...walk('docs').filter((f) => extname(f) === '.md'),
  ...walk('src/pages').filter((f) => extname(f) === '.tsx'),
];

function walk(dir, out = []) {
  for (const name of readdirSync(join(ROOT, dir))) {
    const rel = join(dir, name);
    if (statSync(join(ROOT, rel)).isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}

// Each rule: a pattern and a short name. Patterns are case-insensitive and
// match whole words.
const WORDS = [
  'delve',
  'delves',
  'delving',
  'tapestry',
  'testament',
  'pivotal',
  'crucial',
  'landscape',
  'underscore',
  'underscores',
  'underscoring',
  'showcase',
  'showcases',
  'showcasing',
  'foster',
  'fosters',
  'fostering',
  'vibrant',
  'meticulous',
  'meticulously',
  'intricate',
  'intricacies',
  'boasts',
  'bolster',
  'bolstered',
  'garner',
  'garnered',
  'enduring',
  'interplay',
  'seamless',
  'seamlessly',
  'robust',
  'leverage',
  'leverages',
  'leveraging',
  'enhance',
  'enhances',
  'enhancing',
  'empower',
  'empowers',
  'empowering',
  'elevate',
  'elevates',
  'revolutionary',
  'cutting-edge',
  'game-changer',
  'unlock',
  'unlocks',
  'nestled',
  'groundbreaking',
  'renowned',
  'profound',
  'realm',
  'journey',
  'navigate',
  'navigating',
  'resonate',
  'resonates',
  'synergy',
  'holistic',
  'utilize',
  'utilise',
  'additionally',
  'moreover',
  'furthermore',
  'notably',
];

const PHRASES = [
  ['not only .{1,60} but also', '"not only X but also Y"'],
  [
    "(?:isn't|is not|aren't|are not|wasn't|was not) (?:just |only |merely )?[^.;]{1,50}, (?:it's|it is|they're|they are|but) ",
    '"not X, it\'s Y"',
  ],
  ['\\bnot (?:just|merely) \\b', '"not just X"'],
  ['\\bserves as\\b', '"serves as"'],
  ['\\bstands as\\b', '"stands as"'],
  ['\\bmarks a\\b', '"marks a"'],
  ['\\brepresents a\\b', '"represents a"'],
  ['\\bdeep dive\\b', '"deep dive"'],
  ['\\bvaluable insights?\\b', '"valuable insight"'],
  ['\\balign(?:s|ed|ing)? with\\b', '"align with"'],
  ['\\bkey (?:role|moment|factor|turning point)\\b', '"key role"'],
  ['\\bcommitment to\\b', '"commitment to"'],
  ['\\bin the heart of\\b', '"in the heart of"'],
  ['\\bdiverse (?:array|range)\\b', '"diverse array"'],
  ['\\brich (?:history|heritage|tapestry|culture)\\b', '"rich history"'],
  ['\\bin summary\\b', '"In summary"'],
  ['\\bin conclusion\\b', '"In conclusion"'],
  ['^overall,', '"Overall,"'],
  [
    "\\b(?:it is|it's) (?:important|crucial|worth|critical) to (?:note|remember|consider)\\b",
    '"it is important to note"',
  ],
  ['\\bworth noting\\b', '"worth noting"'],
  ['\\bi hope this helps\\b', '"I hope this helps"'],
  ['\\bcertainly!', '"Certainly!"'],
  ['\\blet me know\\b', '"let me know"'],
  ['\\bwould you like\\b', '"Would you like"'],
  ['\\bdespite (?:these|its) challenges\\b', '"Despite these challenges"'],
  ['\\bfuture outlook\\b', '"Future outlook"'],
  ['\\bawards and recognition\\b', '"Awards and recognition"'],
  ['\\b(?:in connection with|in association with|associated with)\\b', '"associated with"'],
  ['\\bactive social media presence\\b', '"active social media presence"'],
  [
    ',\\s+(?:highlighting|underscoring|emphasizing|emphasising|reflecting|symbolizing|symbolising|ensuring|contributing to|cultivating|encompassing|demonstrating|solidifying)\\b',
    'an "-ing" tail that adds significance',
  ],
];

const problems = [];

function report(file, line, what, text) {
  problems.push(`${file}:${line}: ${what}: ${text.trim().slice(0, 90)}`);
}

for (const rel of FILES) {
  const text = readFileSync(join(ROOT, rel), 'utf8');
  const lines = text.split('\n');
  const md = rel.endsWith('.md');
  let inFence = false;
  lines.forEach((raw, i) => {
    const n = i + 1;
    if (md && raw.startsWith('```')) inFence = !inFence;
    if (inFence) return;
    const line = raw;
    if (/—/.test(line)) report(rel, n, 'em dash', line);
    if (/[“”‘’]/.test(line) && !/'[^']*[“”‘’][^']*'/.test(line) && !rel.endsWith('.md'))
      report(rel, n, 'curly quotation mark', line);
    if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(line)) report(rel, n, 'emoji', line);
    if (md && /^---\s*$/.test(line) && n > 1) report(rel, n, 'thematic break', line);
    if (
      md &&
      /^#+ .*\b[A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+\b/.test(line) &&
      !/Kerb Sense|Delta Challenge|Singapore Police|Google Search|GitHub|Simplified Technical English|Personal Data Protection|National Crime|Young ChangeMakers/.test(
        line,
      )
    )
      report(rel, n, 'title-case heading', line);
    const lower = line.toLowerCase();
    for (const w of WORDS) {
      const re = new RegExp(`(?<![\\w-])${w.replace('-', '\\-')}(?![\\w-])`, 'i');
      if (re.test(lower)) {
        // "landscape" as a page orientation and "journey" in "reading
        // journey" (PROMPT.md's own term) are plain uses.
        if (w === 'landscape' && /landscape (?:mode|orientation|format)/.test(lower)) continue;
        if (w === 'journey' && /reading journey/.test(lower)) continue;
        report(rel, n, `the word "${w}"`, line);
      }
    }
    for (const [pattern, name] of PHRASES) {
      const re = new RegExp(pattern, 'i');
      if (re.test(line)) {
        // The game's own rule is product text (V26 exception).
        if (/green means cars are braking/i.test(line)) continue;
        // The standards file names the pattern itself.
        if (/V26|"It's not X|not X, it's Y/.test(line)) continue;
        report(rel, n, name, line);
      }
    }
  });
}

if (problems.length) {
  console.error('Writing check failed:');
  for (const p of problems) console.error(' -', p);
  process.exit(1);
}
console.log(`Writing check passed: ${FILES.length} files.`);
