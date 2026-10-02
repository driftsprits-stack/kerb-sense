import { defineConfig, devices } from '@playwright/test';

// The E2E tests run against the built site served by `vite preview`, at the
// same base path as GitHub Pages. PW_CHROMIUM_PATH points at a preinstalled
// Chromium where one exists.
const executablePath = process.env.PW_CHROMIUM_PATH;

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173/kerb-sense/',
    trace: 'retain-on-failure',
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
  webServer: {
    command: 'npx vite preview --host 127.0.0.1',
    url: 'http://127.0.0.1:4173/kerb-sense/',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    {
      name: 'tablet',
      use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 }, hasTouch: true },
    },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
});
