// Lighthouse CI: three runs per page against the preview server, with
// Core Web Vitals budgets (standards E14, item 51). The 404 page is left
// out because its noindex tag is intended and fails the SEO audit.
module.exports = {
  ci: {
    collect: {
      // The preview server must be running: npm run preview.
      url: ['http://127.0.0.1:4173/kerb-sense/', 'http://127.0.0.1:4173/kerb-sense/privacy/'],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox --headless=new',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
