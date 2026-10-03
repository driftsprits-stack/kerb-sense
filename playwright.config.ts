import { defineConfig, devices } from '@playwright/test';

// The E2E tests run against the built site served by `vite preview`, at the
// same base path as GitHub Pages, at 375, 768, 1024 and 1440 px (A14).
// PW_CHROMIUM_PATH points at a preinstalled Chromium where one exists.
// PW_SOFTWARE_GL=1 turns on SwiftShader for WebGL on a machine with no GPU.
const executablePath = process.env.PW_CHROMIUM_PATH;
const args = process.env.PW_SOFTWARE_GL
  ? ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  : [];

export default defineConfig({
  testDir: 'tests',
  timeout: 90_000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173/kerb-sense/',
    trace: 'retain-on-failure',
    launchOptions: { ...(executablePath ? { executablePath } : {}), args },
  },
  webServer: {
    command: 'npx vite preview --host 127.0.0.1',
    url: 'http://127.0.0.1:4173/kerb-sense/',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'laptop', use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } } },
    {
      name: 'tablet',
      use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 }, hasTouch: true },
    },
    {
      name: 'phone',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
