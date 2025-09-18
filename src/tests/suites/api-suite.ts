import { test, expect } from '@playwright/test';

// Import all API test files
import '../../api/page-api-test';

test.describe('API Test Suite', () => {
  test('API Suite - All tests imported', async ({ request }) => {
    // This is a placeholder test to ensure the suite is properly configured
    // All actual tests are imported from their respective files
    expect(true).toBe(true);
  });
});
