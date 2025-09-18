import { test, expect } from '@playwright/test';

// Import all test suites
import './v2-suite';
import './v1-suite';
import './api-suite';

test.describe('All Test Suites', () => {
  test('All Suites - All tests imported', async ({ page }) => {
    // This is a placeholder test to ensure all suites are properly configured
    // All actual tests are imported from their respective suite files
    expect(true).toBe(true);
  });
});
