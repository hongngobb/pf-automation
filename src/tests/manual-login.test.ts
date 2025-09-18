import { test, expect } from '@playwright/test';

test.describe('Manual Login Test', () => {
  test('should open Shopify admin for manual login', async ({ page }) => {
    const storeName = process.env.STORE || 'your_shopify_store_name';
    const adminUrl = `https://${storeName}.myshopify.com/admin`;
    
    console.log(`Opening Shopify admin URL: ${adminUrl}`);
    
    // Navigate to Shopify admin
    await page.goto(adminUrl);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    console.log('Page loaded. You have 5 minutes to manually log in...');
    console.log('Current URL:', page.url());
    console.log('Page title:', await page.title());
    
    // Wait for 5 minutes (300,000 ms) for manual login
    await page.waitForTimeout(300000);
    
    // After 5 minutes, check if we're logged in
    console.log('5 minutes elapsed. Checking login status...');
    console.log('Final URL:', page.url());
    console.log('Final title:', await page.title());
    
    // Check if we're on the admin dashboard
    const isOnAdmin = page.url().includes('/admin') && !page.url().includes('/login');
    
    if (isOnAdmin) {
      console.log('✅ Successfully logged in to Shopify admin!');
      
      // Try to navigate to PageFly
      console.log('Navigating to PageFly...');
      if (!process.env.BASE_URL) {
        throw new Error('BASE_URL environment variable is required but not set');
      }
      await page.goto(process.env.BASE_URL);
      await page.waitForLoadState('networkidle');
      
      console.log('PageFly URL:', page.url());
      console.log('PageFly title:', await page.title());
      
      // Wait another 2 minutes to see PageFly interface
      console.log('Waiting 2 more minutes to explore PageFly...');
      await page.waitForTimeout(120000);
      
    } else {
      console.log('❌ Still not logged in or on login page');
      console.log('Available buttons:', await page.locator('button').allTextContents());
    }
  });
  
  test('should open PageFly directly for manual setup', async ({ page }) => {
    console.log('Opening PageFly directly...');
    
    // Navigate to PageFly
    if (!process.env.BASE_URL) {
      throw new Error('BASE_URL environment variable is required but not set');
    }
    await page.goto(process.env.BASE_URL);
    await page.waitForLoadState('networkidle');
    
    console.log('PageFly loaded. You have 5 minutes to manually set up...');
    console.log('Current URL:', page.url());
    console.log('Page title:', await page.title());
    
    // Wait for 5 minutes for manual setup
    await page.waitForTimeout(300000);
    
    // After 5 minutes, check the state
    console.log('5 minutes elapsed. Checking PageFly status...');
    console.log('Final URL:', page.url());
    console.log('Final title:', await page.title());
    
    // Check available buttons
    const buttons = await page.locator('button').allTextContents();
    console.log('Available buttons:', buttons);
    
    // Check for any input fields
    const inputs = await page.locator('input').count();
    console.log('Number of input fields:', inputs);
  });
});
