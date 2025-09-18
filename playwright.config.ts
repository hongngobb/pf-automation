import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 300000, // 5 minutes default timeout
  expect: {
    timeout: 10000,
  },
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.spec.ts'
  ],
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['json', { outputFile: 'test-results.json' }]
  ],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        viewport: { width: 1440, height: 1080 },
        ignoreHTTPSErrors: true,
        headless: false,
        // Use persistent browser context for authentication (if file exists)
        ...(require('fs').existsSync(process.env.STORAGE_STATE_PATH || './auth-state.json') 
          ? { storageState: process.env.STORAGE_STATE_PATH || './auth-state.json' } 
          : {}),
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
      },
    },
  ],
  // webServer: {
  //   command: 'echo "No web server needed"',
  //   port: 3000,
  //   reuseExistingServer: !process.env.CI,
  // },
});
