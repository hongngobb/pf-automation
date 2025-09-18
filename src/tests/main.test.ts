import { test, expect } from '@playwright/test';
import { openWebsite, sleep, waitForPageLoaded, dragAndDrop } from '../utils/webui';

test.describe('Main Page Tests', () => {
  test('Setup - Open Google', async ({ page }) => {
    await openWebsite(page, 'https://www.google.com');
    await sleep(page, 30000);
  });

  test('Test1 - Trello Drag and Drop', async ({ page }) => {
    await openWebsite(page, 'https://trello.com/b/WAPQKMQV/board');
    await waitForPageLoaded(page);
    
    const fromSelector = '//*[@data-list-id][1]//*[@data-testid="list-card"][2]';
    const toSelector = '//*[@data-list-id][2]//*[@data-testid="list-card"][2]';
    
    await dragAndDrop(page, fromSelector, toSelector);
    await sleep(page, 2000);
    await dragAndDrop(page, toSelector, fromSelector);
    await sleep(page, 5000);
  });
});
