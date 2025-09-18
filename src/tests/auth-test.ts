import { test, expect } from '@playwright/test';

test.describe('Authentication Test', () => {
  test('should be authenticated and access PageFly', async ({ page }) => {
    if (!process.env.BASE_URL) {
      throw new Error('BASE_URL environment variable is required but not set');
    }
    
    console.log('🔍 Testing authentication...');
    
    // Navigate to PageFly
    await page.goto(process.env.BASE_URL);
    await page.waitForLoadState('networkidle');
    
    console.log('Current URL:', page.url());
    console.log('Page title:', await page.title());
    
    // Check if we're on a login page (should not be if authenticated)
    const loginElements = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="store"], input[name="store"]');
    const loginCount = await loginElements.count();
    
    console.log('Login elements found:', loginCount);
    
    if (loginCount > 0) {
      console.log('❌ Still on login page - authentication may not be working');
      console.log('Please run: npm run setup-auth');
    } else {
      console.log('✅ No login elements found - authentication appears to be working');
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'auth-test-screenshot.png' });
    
    // Basic assertion - we should not be on a login page
    expect(loginCount).toBe(0);
  });
});
