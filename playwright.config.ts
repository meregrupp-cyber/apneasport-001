import { defineConfig, devices } from '@playwright/test';

const webServer = {
  command: 'npm run dev -- --host 127.0.0.1 --port 4321',
  url: 'http://127.0.0.1:4321',
  reuseExistingServer: !process.env.CI,
  timeout: 120_000,
};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium-mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
  ],
  ...(process.env.PLAYWRIGHT_SKIP_WEBSERVER ? {} : { webServer }),
});
