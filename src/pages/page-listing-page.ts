import { Page, Locator } from '@playwright/test';
import { waitForElementVisible, click, fill, pressKey, waitForPageLoaded, selectOption } from '../utils/webui';
import { PageType, EditorType, PageStatus } from '../types/enums';

/**
 * Verify page listing page is loaded
 */
export async function verifyPageListingLoaded(page: Page): Promise<void> {
  // Wait for page to be fully loaded
  await waitForPageLoaded(page);
  
  // Check for any of the common page listing elements
  const possibleElements = [
    '[data-testid="create-page-button"]',
    '.create-page-btn',
    'button:has-text("Create page")',
    'button:has-text("Create")',
    '[data-testid="page-table"]',
    '.page-table',
    'table',
    '.page-list',
    '[data-testid="page-list"]'
  ];
  
  let foundElement = false;
  
  for (const selector of possibleElements) {
    const element = page.locator(selector);
    if (await element.count() > 0 && await element.isVisible()) {
      foundElement = true;
      break;
    }
  }
  
  if (!foundElement) {
    // Log page content for debugging
    const pageTitle = await page.title();
    const pageUrl = page.url();
    console.log('Page title:', pageTitle);
    console.log('Page URL:', pageUrl);
    throw new Error('Page listing page not properly loaded. Title: ' + pageTitle + ', URL: ' + pageUrl);
  }
}

/**
 * Click create page button
 */
export async function clickCreatePage(page: Page): Promise<void> {
  // Wait for page to be fully loaded first
  await waitForPageLoaded(page);
  
  // Try multiple possible selectors for the create page button
  const possibleSelectors = [
    '#pages--create-blank-page-btn',
    '[data-testid="create-page-button"]',
    '.create-page-btn',
    'button:has-text("Create page")',
    'button:has-text("Create")',
    'button:has-text("New page")',
    'button:has-text("Add page")',
    '[data-testid="create-button"]',
    '.create-button',
    'button[class*="create"]',
    'button[class*="add"]'
  ];
  
  let createPageButton = null;
  
  // Try each selector until we find a visible button
  for (const selector of possibleSelectors) {
    const button = page.locator(selector);
    if (await button.count() > 0 && await button.isVisible()) {
      createPageButton = button;
      break;
    }
  }
  
  if (!createPageButton) {
    // If no button found, log available buttons for debugging
    const allButtons = await page.locator('button').all();
    const buttonTexts = await Promise.all(allButtons.map(btn => btn.textContent()));
    console.log('Available buttons on page:', buttonTexts);
    throw new Error('Create page button not found. Available buttons: ' + buttonTexts.join(', '));
  }
  
  await createPageButton.click();
}

/**
 * Open blank page editor
 */
export async function openBlankPageEditor(page: Page, editorType: EditorType, pageType: PageType): Promise<void> {
  await clickCreatePage(page);
  
  // Select editor type (Flex or Legacy)
  const editorTypeSelector = `[data-editor-type="${editorType}"], button:has-text("${editorType}")`;
  await click(page, editorTypeSelector);
  
  // Select page type
  const pageTypeSelector = `[data-page-type="${pageType}"], button:has-text("${pageType}")`;
  await click(page, pageTypeSelector);
  
  // Click create blank page
  await click(page, 'button:has-text("Create blank page"), [data-testid="create-blank-page"]');
}

/**
 * Open template page editor
 */
export async function openTemplatePageEditor(page: Page, editorType: EditorType, pageType: PageType): Promise<void> {
  await clickCreatePage(page);
  
  // Select editor type
  const editorTypeSelector = `[data-editor-type="${editorType}"], button:has-text("${editorType}")`;
  await click(page, editorTypeSelector);
  
  // Select page type
  const pageTypeSelector = `[data-page-type="${pageType}"], button:has-text("${pageType}")`;
  await click(page, pageTypeSelector);
  
  // Click create from template
  await click(page, 'button:has-text("Create from template"), [data-testid="create-from-template"]');
}

/**
 * Search for pages
 */
export async function searchPages(page: Page, searchTerm: string): Promise<void> {
  const searchInput = page.locator('[data-testid="search-input"], input[placeholder*="search"], input[type="search"]');
  await fill(page, searchInput.locator('xpath=.').toString(), searchTerm);
  await pressKey(page, 'Enter');
  await waitForPageLoaded(page);
}

/**
 * Filter pages by status
 */
export async function filterPagesByStatus(page: Page, status: PageStatus): Promise<void> {
  const filterDropdown = page.locator('[data-testid="filter-dropdown"], select, .filter-dropdown');
  await selectOption(page, filterDropdown.locator('xpath=.').toString(), status);
  await waitForPageLoaded(page);
}

// Page Listing Table Functions

/**
 * Get page table rows
 */
export function getPageTableRows(page: Page): Locator {
  const table = page.locator('[data-testid="page-table"], .page-table, table');
  return table.locator('tbody tr, .page-row');
}

/**
 * Get row by index (1-based)
 */
export function getPageRowByIndex(page: Page, index: number): Locator {
  const rows = getPageTableRows(page);
  return rows.nth(index - 1);
}

/**
 * Get row by page title
 */
export function getPageRowByTitle(page: Page, title: string): Locator {
  const rows = getPageTableRows(page);
  return rows.filter({ hasText: title });
}

/**
 * Filter table by status
 */
export async function filterTableByStatus(page: Page, status: PageStatus): Promise<void> {
  const filterSelector = `[data-testid="status-filter"], select, .status-filter`;
  await selectOption(page, filterSelector, status);
}

/**
 * Get page count
 */
export async function getPageCount(page: Page): Promise<number> {
  const rows = getPageTableRows(page);
  return await rows.count();
}

/**
 * Click on page row
 */
export async function clickPageRow(page: Page, index: number): Promise<void> {
  const row = getPageRowByIndex(page, index);
  await row.click();
}

/**
 * Get page status from row
 */
export async function getPageStatus(page: Page, index: number): Promise<string> {
  const row = getPageRowByIndex(page, index);
  const statusElement = row.locator('[data-testid="page-status"], .status, .page-status');
  return await statusElement.textContent() || '';
}

/**
 * Publish page from row
 */
export async function publishPage(page: Page, index: number): Promise<void> {
  const row = getPageRowByIndex(page, index);
  await row.locator('button:has-text("Publish"), [data-testid="publish-button"]').click();
}

/**
 * Unpublish page from row
 */
export async function unpublishPage(page: Page, index: number): Promise<void> {
  const row = getPageRowByIndex(page, index);
  await row.locator('button:has-text("Unpublish"), [data-testid="unpublish-button"]').click();
}

/**
 * Delete page from row
 */
export async function deletePage(page: Page, index: number): Promise<void> {
  const row = getPageRowByIndex(page, index);
  await row.locator('button:has-text("Delete"), [data-testid="delete-button"]').click();
  
  // Confirm deletion
  await page.locator('button:has-text("Confirm"), button:has-text("Delete"), [data-testid="confirm-delete"]').click();
}
