import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('Starting global setup...');
  
  // Create a browser instance for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Perform any global setup tasks here
    console.log('Performing global setup tasks...');
    
    // Example: Login to the application if needed
    // await page.goto(process.env.BASE_URL || 'https://rc.pagefly.io');
    // await page.fill('[data-testid="email"]', process.env.EMAIL || '');
    // await page.fill('[data-testid="password"]', process.env.PASSWORD || '');
    // await page.click('[data-testid="login-button"]');
    // await page.waitForURL('**/dashboard');
    
    console.log('Global setup completed successfully');
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
