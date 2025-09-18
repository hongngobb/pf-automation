import { test as base, expect, Page } from '@playwright/test';

export interface TestFixtures {
  page: Page;
}

export const test = base.extend<TestFixtures>({
  page: async ({ browser }, use) => {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true,
      permissions: ['notifications'],
    });
    
    const page = await context.newPage();
    
    // Disable notifications and other browser features
    await context.addInitScript(() => {
      // Disable notifications
      Object.defineProperty(navigator, 'permissions', {
        value: {
          query: () => Promise.resolve({ state: 'denied' })
        }
      });
      
      // Disable automation indicators
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });
    
    await use(page);
    await context.close();
  },
});

export { expect };
