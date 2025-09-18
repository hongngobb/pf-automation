import { test, expect } from '@playwright/test';

// Import all V2 test files
import '../../v2/editor/editor-test';
import '../../v2/editor/drag-and-drop-test';
import '../../v2/editor/inspector-test';
import '../../v2/ab-testing/ab-testing-test';
import '../../page-listing-test';

test.describe('V2 Test Suite', () => {
  test('V2 Suite - All tests imported', async ({ page }) => {
    // This is a placeholder test to ensure the suite is properly configured
    // All actual tests are imported from their respective files
    expect(true).toBe(true);
  });
});
