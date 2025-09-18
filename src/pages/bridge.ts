import { Page } from '@playwright/test';
import { openWebsite, waitForPageLoaded, switchToPageFlyFrame, fill, click } from '../utils/webui';

/**
 * Login to PageFly
 */
export async function loginToPageFly(page: Page): Promise<void> {
  const storeName = process.env.STORE || 'your_shopify_store_name';
  const password = 'welcome2PF';
  
  console.log('Checking login status...');
  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());
  
  // Check if we're already logged in by looking for page listing elements
  const pageListingElements = page.locator('[data-testid="create-page-button"], .create-page-btn, button:has-text("Create page"), button:has-text("Create")');
  if (await pageListingElements.count() > 0) {
    console.log('Already logged in to PageFly');
    return;
  }
  
  // Check if we're on a login page
  const loginElements = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="store"], input[name="store"]');
  if (await loginElements.count() > 0) {
    console.log('Login required, attempting to login...');
    console.log('Found login elements:', await loginElements.count());
    
    // Fill in store name/email
    const storeInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="store"], input[name="store"]').first();
    await storeInput.fill(storeName);
    console.log('Filled store name:', storeName);
    
    // Fill in password
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await passwordInput.fill(password);
    console.log('Filled password');
    
    // Click login/submit button
    const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in"), button:has-text("Submit")').first();
    await loginButton.click();
    console.log('Clicked login button');
    
    // Wait for login to complete
    await waitForPageLoaded(page);
    await page.waitForTimeout(3000);
    
    console.log('After login - URL:', page.url());
    console.log('After login - Title:', await page.title());
  } else {
    console.log('No login form found, checking if already authenticated...');
    
    // Check if we're on an install page and need to click Login
    if (page.url().includes('/install')) {
      console.log('On install page, looking for Login button...');
      const loginButton = page.locator('button:has-text("Login")');
      if (await loginButton.count() > 0) {
        console.log('Found Login button, checking if enabled...');
        
        // Check if button is enabled
        const isEnabled = await loginButton.isEnabled();
        console.log('Login button enabled:', isEnabled);
        
        if (!isEnabled) {
          console.log('Login button is disabled, looking for form fields to fill...');
          
          // Look for any input fields that might need to be filled
          const allInputs = page.locator('input[type="text"], input[type="email"], input[type="password"], input:not([type])');
          const inputCount = await allInputs.count();
          console.log('Found input fields:', inputCount);
          
          // Try to fill any visible input fields
          for (let i = 0; i < inputCount; i++) {
            const input = allInputs.nth(i);
            const isVisible = await input.isVisible();
            const placeholder = await input.getAttribute('placeholder');
            const name = await input.getAttribute('name');
            const type = await input.getAttribute('type');
            
            console.log(`Input ${i}: visible=${isVisible}, placeholder="${placeholder}", name="${name}", type="${type}"`);
            
            if (isVisible) {
              if (type === 'password' || name?.includes('password')) {
                await input.fill(password);
                console.log('Filled password field');
              } else if (type === 'email' || name?.includes('email') || name?.includes('store') || placeholder?.toLowerCase().includes('store') || placeholder?.toLowerCase().includes('email')) {
                await input.fill(storeName);
                console.log('Filled store/email field');
              } else {
                // Try filling with store name as default
                await input.fill(storeName);
                console.log('Filled field with store name');
              }
            }
          }
          
          // Wait a bit for any form validation
          await page.waitForTimeout(1000);
          
          // Check if button is now enabled
          const isNowEnabled = await loginButton.isEnabled();
          console.log('Login button enabled after filling fields:', isNowEnabled);
        }
        
        if (await loginButton.isEnabled()) {
          console.log('Clicking enabled Login button...');
          
          // Try to dismiss any backdrop or modal first
          const backdrop = page.locator('.Polaris-Backdrop, .backdrop, [class*="backdrop"]');
          if (await backdrop.count() > 0) {
            console.log('Found backdrop, trying to dismiss it...');
            await backdrop.click({ force: true });
            await page.waitForTimeout(500);
          }
          
          // Try clicking the button with force to bypass any overlays
          try {
            await loginButton.click({ force: true });
            console.log('Successfully clicked Login button with force');
          } catch (error) {
            console.log('Force click failed, trying regular click...');
            await loginButton.click();
          }
          
          // Wait a bit and check if we need to click Submit instead
          await page.waitForTimeout(1000);
          const submitButton = page.locator('button:has-text("Submit")');
          if (await submitButton.count() > 0 && await submitButton.isEnabled()) {
            console.log('Found Submit button, clicking it...');
            await submitButton.click({ force: true });
            await page.waitForTimeout(2000);
          }
          
          await waitForPageLoaded(page);
          await page.waitForTimeout(2000);
        } else {
          console.log('Login button still disabled, cannot proceed');
        }
        
        // Now try to login again
        console.log('After clicking Login - URL:', page.url());
        console.log('After clicking Login - Title:', await page.title());
        
        // Check for login form again
        const loginElements = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="store"], input[name="store"]');
        if (await loginElements.count() > 0) {
          console.log('Login form now available, attempting login...');
          
          // Fill in store name/email
          const storeInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="store"], input[name="store"]').first();
          await storeInput.fill(storeName);
          console.log('Filled store name:', storeName);
          
          // Fill in password
          const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
          await passwordInput.fill(password);
          console.log('Filled password');
          
          // Click login/submit button
          const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in"), button:has-text("Submit")').first();
          await submitButton.click();
          console.log('Clicked submit button');
          
          // Wait for login to complete
          await waitForPageLoaded(page);
          await page.waitForTimeout(3000);
          
          console.log('After login - URL:', page.url());
          console.log('After login - Title:', await page.title());
        }
      }
    }
    
    // Check for any error messages or other indicators
    const errorMessages = page.locator('.error, .alert, [class*="error"], [class*="alert"]');
    if (await errorMessages.count() > 0) {
      const errorText = await errorMessages.first().textContent();
      console.log('Found error message:', errorText);
    }
  }
}

/**
 * Open PageFly base URL
 */
export async function openPageFly(page: Page): Promise<void> {
  if (!process.env.BASE_URL) {
    throw new Error('BASE_URL environment variable is required but not set');
  }
  await openWebsite(page, process.env.BASE_URL);
  await waitForPageLoaded(page);
  
  // Check if we're already on a PageFly page (not install page)
  const currentUrl = page.url();
  if (currentUrl.includes('/install')) {
    console.log('On install page, attempting login...');
    await loginToPageFly(page);
  } else {
    console.log('Already on PageFly page, checking if login is needed...');
    
    // Check if we need to login by looking for login elements
    const loginElements = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="store"], input[name="store"]');
    if (await loginElements.count() > 0) {
      console.log('Login form detected, attempting login...');
      await loginToPageFly(page);
    } else {
      console.log('No login required, continuing...');
    }
  }
  
  // Try to switch to PageFly frame if it exists
  try {
    await switchToPageFlyFrame(page);
  } catch (error) {
    console.log('No PageFly frame found, continuing with main page');
  }
}

/**
 * Open page listing page
 */
export async function openPageListingPage(page: Page): Promise<void> {
  await openWebsite(page, process.env.BASE_URL+'/pages');
  await waitForPageLoaded(page);
  
  // Try to login if needed
  // await loginToPageFly(page);
  
  // Try to switch to PageFly frame if it exists
  try {
    await switchToPageFlyFrame(page);
  } catch (error) {
    console.log('No PageFly frame found, continuing with main page');
  }
  
  // Wait a bit more for any dynamic content to load
  await page.waitForTimeout(2000);
}

/**
 * Open sections page
 */
export async function openSectionsPage(page: Page): Promise<void> {
  if (!process.env.BASE_URL) {
    throw new Error('BASE_URL environment variable is required but not set');
  }
  await openWebsite(page, `${process.env.BASE_URL}/sections`);
  await waitForPageLoaded(page);
  await switchToPageFlyFrame(page);
}

/**
 * Open trash page
 */
export async function openTrashPage(page: Page): Promise<void> {
  if (!process.env.BASE_URL) {
    throw new Error('BASE_URL environment variable is required but not set');
  }
  await openWebsite(page, `${process.env.BASE_URL}/trash`);
  await waitForPageLoaded(page);
  await switchToPageFlyFrame(page);
}

/**
 * Verify page is loaded (base implementation)
 */
export async function verifyPageLoaded(page: Page): Promise<void> {
  await waitForPageLoaded(page);
}
