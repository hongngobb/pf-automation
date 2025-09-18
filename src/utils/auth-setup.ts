import { chromium, Browser, Page } from '@playwright/test';
import { loginToPageFly } from '../pages/bridge';

/**
 * One-time authentication setup to save login state
 * Run this script once to authenticate and save the session
 */
export async function setupAuthentication(): Promise<void> {
  console.log('🔐 Starting one-time authentication setup...');
  
  if (!process.env.BASE_URL) {
    throw new Error('BASE_URL environment variable is required but not set');
  }
  
  if (!process.env.STORE) {
    throw new Error('STORE environment variable is required but not set');
  }

  const browser: Browser = await chromium.launch({ 
    headless: false, // Show browser for manual login
    slowMo: 1000 // Slow down actions for better visibility
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  });
  
  const page: Page = await context.newPage();
  
  try {
    console.log('📱 Step 1: Opening Shopify Admin...');
    const storeName = process.env.STORE;
    const adminUrl = `https://${storeName}.myshopify.com/admin`;
    
    await page.goto(adminUrl);
    await page.waitForLoadState('networkidle');
    
    console.log('⏳ Please login to Shopify Admin manually...');
    console.log('🔗 URL:', adminUrl);
    console.log('⏰ You have 5 minutes to complete the login...');
    
    // Wait for user to login manually
    await page.waitForTimeout(300000); // 5 minutes
    
    // Check if login was successful
    const currentUrl = page.url();
    if (currentUrl.includes('/admin') && !currentUrl.includes('/login')) {
      console.log('✅ Shopify Admin login successful!');
      
      console.log('📱 Step 2: Opening PageFly...');
      await page.goto(process.env.BASE_URL);
      await page.waitForLoadState('networkidle');
      
      console.log('⏳ Please complete PageFly authentication if needed...');
      console.log('🔗 URL:', process.env.BASE_URL);
      console.log('⏰ You have 3 minutes to complete PageFly setup...');
      
      // Wait for PageFly authentication
      await page.waitForTimeout(180000); // 3 minutes
      
      // Try to login to PageFly programmatically
      try {
        await loginToPageFly(page);
        console.log('✅ PageFly authentication completed!');
      } catch (error) {
        console.log('⚠️  PageFly auto-login failed, but manual setup should work');
      }
      
      // Save the authentication state
      const storageStatePath = process.env.STORAGE_STATE_PATH || './auth-state.json';
      await context.storageState({ path: storageStatePath });
      
      console.log('💾 Authentication state saved to:', storageStatePath);
      console.log('🎉 Setup complete! You can now run tests without manual login.');
      
    } else {
      console.log('❌ Shopify Admin login was not completed successfully');
      console.log('Current URL:', currentUrl);
      throw new Error('Authentication setup failed - please ensure you completed the Shopify login');
    }
    
  } catch (error) {
    console.error('❌ Authentication setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Check if authentication state exists
 */
export function hasAuthState(): boolean {
  const fs = require('fs');
  const storageStatePath = process.env.STORAGE_STATE_PATH || './auth-state.json';
  return fs.existsSync(storageStatePath);
}

/**
 * Clear saved authentication state
 */
export async function clearAuthState(): Promise<void> {
  const fs = require('fs');
  const storageStatePath = process.env.STORAGE_STATE_PATH || './auth-state.json';
  
  if (fs.existsSync(storageStatePath)) {
    fs.unlinkSync(storageStatePath);
    console.log('🗑️  Authentication state cleared');
  } else {
    console.log('ℹ️  No authentication state found to clear');
  }
}
