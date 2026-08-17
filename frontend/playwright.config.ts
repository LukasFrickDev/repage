import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testIgnore: [
    '**/prerender-hydration.spec.ts',
    '**/prerender-consent.spec.ts',
  ],
  outputDir: './test-results',
  fullyParallel: true,
  workers: 4,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  reporter: [['list'], ['html', { outputFolder: './playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    browserName: 'chromium',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
  },
  projects: [
    { name: 'wide', use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 1000 } } },
    { name: 'notebook', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 900, height: 1100 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } } },
    { name: 'compact', use: { ...devices['iPhone 13'], viewport: { width: 360, height: 740 } } },
    { name: 'low-height', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 640 } } },
    { name: 'landscape', use: { ...devices['Desktop Chrome'], viewport: { width: 844, height: 390 } } },
  ],
});
