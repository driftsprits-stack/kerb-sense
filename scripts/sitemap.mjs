// Writes dist/sitemap.xml with every public route. Runs after the build.
import { writeFileSync } from 'node:fs';

const ORIGIN = 'https://driftsprits-stack.github.io/kerb-sense/';
const ROUTES = ['', 'play/', 'privacy/', 'terms/', 'cookies/'];
const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => `  <url><loc>${ORIGIN}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
writeFileSync(new URL('../dist/sitemap.xml', import.meta.url), xml);
console.log(`sitemap.xml: ${ROUTES.length} routes.`);
