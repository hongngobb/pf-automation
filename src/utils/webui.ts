import { Page, Locator, FrameLocator } from '@playwright/test';
import { FrameworkConstants } from '../config/framework-constants';

/**
 * Open a website and wait for page load
 */
export async function openWebsite(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await waitForPageLoaded(page);
}

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoaded(page: Page): Promise<void> {
  const timeout = FrameworkConstants.WAIT_PAGE_LOADED;
  try {
    // Wait for network to be idle
    await page.waitForLoadState('networkidle', { timeout });
    
    // Also wait for load state to be complete
    await page.waitForLoadState('load', { timeout });
    
    // Add a small delay for dynamic content
    await page.waitForTimeout(1000);
  } catch (error) {
    console.log('Warning: Page load timeout, continuing anyway...');
    console.log('Current URL:', page.url());
    // Don't throw, try to continue
  }
}

/**
 * Wait for element to be visible
 */
export async function waitForElementVisible(
  page: Page, 
  selector: string, 
  timeout = FrameworkConstants.WAIT_EXPLICIT
): Promise<Locator> {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible', timeout });
  return element;
}

/**
 * Wait for element to be hidden
 */
export async function waitForElementHidden(
  page: Page, 
  selector: string, 
  timeout = FrameworkConstants.WAIT_EXPLICIT
): Promise<void> {
  await page.locator(selector).waitFor({ state: 'hidden', timeout });
}

/**
 * Click on an element
 */
export async function click(page: Page, selector: string): Promise<void> {
  await page.locator(selector).click();
}

/**
 * Fill input field
 */
export async function fill(page: Page, selector: string, text: string): Promise<void> {
  await page.locator(selector).fill(text);
}

/**
 * Clear and fill input field
 */
export async function clearAndFill(page: Page, selector: string, text: string): Promise<void> {
  await page.locator(selector).clear();
  await page.locator(selector).fill(text);
}

/**
 * Get text from element
 */
export async function getText(page: Page, selector: string): Promise<string> {
  return await page.locator(selector).textContent() || '';
}

/**
 * Check if element is visible
 */
export async function isVisible(page: Page, selector: string): Promise<boolean> {
  return await page.locator(selector).isVisible();
}

/**
 * Check if element exists
 */
export async function isPresent(page: Page, selector: string): Promise<boolean> {
  return await page.locator(selector).count() > 0;
}

/**
 * Drag and drop operation
 */
export async function dragAndDrop(page: Page, fromSelector: string, toSelector: string): Promise<void> {
  await page.locator(fromSelector).dragTo(page.locator(toSelector));
}

/**
 * Switch to iframe
 */
export async function switchToFrame(page: Page, frameSelector: string): Promise<FrameLocator> {
  return page.frameLocator(frameSelector);
}

/**
 * Switch to PageFly iframe
 */
export async function switchToPageFlyFrame(page: Page): Promise<FrameLocator> {
  return page.frameLocator(`iframe[name="${FrameworkConstants.APP_IFRAME}"]`);
}

/**
 * Switch to editor iframe
 */
export async function switchToEditorFrame(page: Page): Promise<FrameLocator> {
  return page.frameLocator(FrameworkConstants.EDITOR_IFRAME);
}

/**
 * Execute JavaScript
 */
export async function executeScript(page: Page, script: string): Promise<any> {
  return await page.evaluate(script);
}

/**
 * Take screenshot
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ 
    path: `screenshots/${name}.png`,
    fullPage: true 
  });
}

/**
 * Sleep/wait for specified time
 */
export async function sleep(page: Page, ms: number): Promise<void> {
  await page.waitForTimeout(ms);
}

/**
 * Smart wait - combines page load wait and sleep
 */
export async function smartWait(page: Page): Promise<void> {
  if (FrameworkConstants.ACTIVE_PAGE_LOADED) {
    await waitForPageLoaded(page);
  }
  await sleep(page, FrameworkConstants.WAIT_SLEEP_STEP);
}

/**
 * Hover over element
 */
export async function hover(page: Page, selector: string): Promise<void> {
  await page.locator(selector).hover();
}

/**
 * Double click on element
 */
export async function doubleClick(page: Page, selector: string): Promise<void> {
  await page.locator(selector).dblclick();
}

/**
 * Right click on element
 */
export async function rightClick(page: Page, selector: string): Promise<void> {
  await page.locator(selector).click({ button: 'right' });
}

/**
 * Press key
 */
export async function pressKey(page: Page, key: string): Promise<void> {
  await page.keyboard.press(key);
}

/**
 * Type text
 */
export async function type(page: Page, selector: string, text: string): Promise<void> {
  await page.locator(selector).type(text);
}

/**
 * Select option from dropdown
 */
export async function selectOption(page: Page, selector: string, value: string): Promise<void> {
  await page.locator(selector).selectOption(value);
}

/**
 * Check checkbox
 */
export async function check(page: Page, selector: string): Promise<void> {
  await page.locator(selector).check();
}

/**
 * Uncheck checkbox
 */
export async function uncheck(page: Page, selector: string): Promise<void> {
  await page.locator(selector).uncheck();
}

/**
 * Get attribute value
 */
export async function getAttribute(page: Page, selector: string, attribute: string): Promise<string | null> {
  return await page.locator(selector).getAttribute(attribute);
}

/**
 * Scroll to element
 */
export async function scrollToElement(page: Page, selector: string): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Wait for URL to contain text
 */
export async function waitForURL(page: Page, url: string | RegExp): Promise<void> {
  await page.waitForURL(url);
}

/**
 * Get current URL
 */
export async function getCurrentURL(page: Page): Promise<string> {
  return page.url();
}

/**
 * Get page title
 */
export async function getPageTitle(page: Page): Promise<string> {
  return await page.title();
}

/**
 * Clear local storage
 */
export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

/**
 * Remove specific local storage items
 */
export async function removeLocalStorageItems(page: Page, items: string[]): Promise<void> {
  await page.evaluate((items) => {
    items.forEach(item => localStorage.removeItem(item));
  }, items);
}

/**
 * Reset PageFly specific local storage
 */
export async function resetDontRemind(page: Page): Promise<void> {
  const items = [
    'no-auto-save',
    'warning_saved',
    'warning_publish_home',
    'warning_publish_product',
    'warning_publish_collection'
  ];
  await removeLocalStorageItems(page, items);
}

/**
 * Remove Crisp popup
 */
export async function removeCrispPopup(page: Page): Promise<void> {
  await page.evaluate(() => {
    const crispElements = document.querySelectorAll('[id*="crisp"], [class*="crisp"]');
    crispElements.forEach(element => element.remove());
  });
}

/**
 * Remove AppNavigator padding
 */
export async function removeAppNavigatorPadding(page: Page): Promise<void> {
  await page.evaluate(() => {
    const appFrame = document.getElementById('AppFrameMain');
    if (appFrame) {
      appFrame.style.paddingLeft = '0px';
    }
  });
}
