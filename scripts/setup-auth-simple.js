#!/usr/bin/env node

/**
 * Simple authentication setup script
 * This runs the auth setup in a single browser instance without test framework
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function setupAuth() {
  console.log('🔐 Starting PageFly Authentication Setup');
  console.log('=====================================');
  
  // Check required environment variables
  if (!process.env.STORE) {
    console.log('❌ STORE environment variable is required');
    console.log('Please set STORE=your_shopify_store_name in your .env file');
    process.exit(1);
  }
  
  if (!process.env.BASE_URL) {
    console.log('❌ BASE_URL environment variable is required');
    console.log('Please set BASE_URL=https://rc.pagefly.io in your .env file');
    process.exit(1);
  }
  
  console.log(`✅ Store: ${process.env.STORE}`);
  console.log(`✅ Base URL: ${process.env.BASE_URL}`);
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  });
  
  const page = await context.newPage();
  
  try {
    // Step 1: Shopify Admin Login
    console.log('\n📱 Step 1: Opening Shopify Admin...');
    const adminUrl = `https://${process.env.STORE}.myshopify.com/admin`;
    console.log(`🔗 URL: ${adminUrl}`);
    
    await page.goto(adminUrl);
    await page.waitForLoadState('networkidle');
    
    console.log('⏳ Please login to Shopify Admin manually...');
    console.log('⏰ Waiting for login to complete...');
    
    // Wait for login to complete by checking for Polaris navigation
    try {
      await page.waitForSelector('.Polaris-Navigation__Text', { timeout: 300000 }); // 5 minutes max
      console.log('✅ Login completed - Polaris navigation detected!');
    } catch (error) {
      console.log('⚠️  Polaris navigation not found, checking current state...');
      console.log('Current URL:', page.url());
      console.log('Page title:', await page.title());
    }
    
    // Check if login was successful
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/admin') && !currentUrl.includes('/login')) {
      console.log('✅ Shopify Admin login successful!');
      
      // Step 2: PageFly Navigation
      console.log('\n📱 Step 2: Opening PageFly...');
      console.log(`🔗 URL: ${process.env.BASE_URL}`);
      
      await page.goto(process.env.BASE_URL);
      await page.waitForLoadState('networkidle', { timeout: 60000 });
      await page.waitForTimeout(5000); // Add extra wait time for stability
      
      console.log('⏳ Waiting for PageFly to load...');
      
      // Wait for PageFly to load by checking for common PageFly elements
      try {
        // Wait for either PageFly iframe or PageFly content
        await Promise.race([
          page.waitForSelector('iframe[name*="pagefly"], iframe[src*="pagefly"]', { timeout: 60000 }),
          page.waitForSelector('[data-testid*="pagefly"], .pagefly, [class*="pagefly"]', { timeout: 60000 }),
          page.waitForSelector('body', { timeout: 60000 }) // Fallback to just wait for body
        ]);
        console.log('✅ PageFly loaded successfully!');
      } catch (error) {
        console.log('⚠️  PageFly elements not found, but continuing...');
      }
      
      // Step 3: Save authentication state
      console.log('\n💾 Saving authentication state...');
      
      // Wait a moment for any final requests to complete
      await page.waitForTimeout(2000);
      
      const storageStatePath = process.env.STORAGE_STATE_PATH || './auth-state.json';
      
      await context.storageState({ path: storageStatePath });
      
      console.log('✅ Authentication state saved to:', storageStatePath);
      console.log('\n🎉 Setup complete! You can now run tests without manual login.');
      console.log('\nNext steps:');
      console.log('  npm test                    # Run all tests');
      console.log('  npm run test:headed         # Run tests with browser visible');
      
    } else {
      console.log('❌ Shopify Admin login was not completed successfully');
      console.log('Current URL:', currentUrl);
      throw new Error('Authentication setup failed - please ensure you completed the Shopify login');
    }
    
  } catch (error) {
    console.error('❌ Authentication setup failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the setup
setupAuth().catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
});
