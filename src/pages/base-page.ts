import { Page } from '@playwright/test';
import { waitForPageLoaded, takeScreenshot } from '../utils/webui';

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await waitForPageLoaded(page);
}

/**
 * Take screenshot of the page
 */
export async function takePageScreenshot(page: Page, name: string): Promise<void> {
  await takeScreenshot(page, name);
}
