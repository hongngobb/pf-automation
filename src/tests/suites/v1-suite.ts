import { test, expect } from '@playwright/test';

// Import all V1 test files
import '../../v1/legacy/page-editing-test';

test.describe('V1 Test Suite', () => {
  test('V1 Suite - All tests imported', async ({ page }) => {
    // This is a placeholder test to ensure the suite is properly configured
    // All actual tests are imported from their respective files
    expect(true).toBe(true);
  });
});
