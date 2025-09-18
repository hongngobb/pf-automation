import { test, expect } from '@playwright/test';
import { PageType, EditorType, PageStatus } from '../types/enums';
import { DataProviderFactory } from '../data/data-provider';
import { openPageListingPage, verifyPageLoaded } from '../pages/bridge';
import { 
  openBlankPageEditor, 
  openTemplatePageEditor, 
  verifyPageListingLoaded,
  filterTableByStatus,
  publishPage as publishPageFromTable,
  unpublishPage as unpublishPageFromTable,
  getPageStatus
} from '../pages/page-listing-page';
import { 
  changePageTitle, 
  savePage, 
  publishPage 
} from '../pages/page-editor';
import { 
  openWebsite, 
  waitForPageLoaded, 
  switchToPageFlyFrame, 
  switchToEditorFrame,
  sleep,
  waitForElementVisible,
  click
} from '../utils/webui';

test.describe('Page Listing Tests', () => {
  let newPageCount = 0;

  test.beforeEach(async ({ page }) => {
    // Open PageFly and navigate to page listing
    if (!process.env.BASE_URL) {
      throw new Error('BASE_URL environment variable is required but not set');
    }
    await openWebsite(page, `${process.env.BASE_URL}/pages`);
    await waitForPageLoaded(page);
    await switchToPageFlyFrame(page);
  });

  /**
   * Create blank page from page listing
   */
  async function createBlankPageFromPageListing(
    page: any, 
    editorType: EditorType, 
    pageType: PageType, 
    pageTitle: string
  ) {
    await openBlankPageEditor(page, editorType, pageType);
    
    await switchToEditorFrame(page);
    
    // Select template (this would need to be implemented based on actual UI)
    const templatesDrawer = page.locator('[data-testid="templates-drawer"], .templates-drawer');
    await templatesDrawer.click();
    
    const template = page.locator('[data-testid="template-item"], .template-item').first();
    await template.click();
    
    const confirmButton = page.locator('button:has-text("Select"), [data-testid="confirm-template"]');
    await confirmButton.click();
    
    await changePageTitle(page, `${pageTitle} - ${pageType} - ${new Date().toString()}`);
    await savePage(page);
    await publishPage(page);
    
    newPageCount++;
    console.log(`New page count: ${newPageCount}`);
  }

  test('TC-010: User create Blank page (Flex layout) from Page Listing', async ({ page }) => {
    const pageTypes = DataProviderFactory.pageTypes;
    
    for (const pageType of pageTypes) {
      await createBlankPageFromPageListing(
        page, 
        
        EditorType.FLEX, 
        pageType, 
        'TC-010: Blank Page Flex Layout'
      );
    }
  });

  test('TC-010: User create Blank page (Legacy layout) from Page Listing', async ({ page }) => {
    const pageTypes = DataProviderFactory.pageTypes;
    
    for (const pageType of pageTypes) {
      await createBlankPageFromPageListing(
        page, 
        EditorType.LEGACY, 
        pageType, 
        'TC-010: Blank Page Legacy Layout'
      );
    }
  });

  test('TC-011: User create Template page (Flex layout) from Page Listing', async ({ page }) => {
    const pageTypes = DataProviderFactory.pageTypes;
    
    for (const pageType of pageTypes) {
      await openTemplatePageEditor(page, EditorType.FLEX, pageType);
      
      await changePageTitle(page, `TC-011: Template Page Flex Layout - ${pageType} - ${new Date().toString()}`);
      await savePage(page);
      await publishPage(page);
      
      newPageCount++;
    }
  });

  test('TC-011: User create Template page (Legacy layout) from Page Listing', async ({ page }) => {
    const pageTypes = DataProviderFactory.pageTypes;
    
    for (const pageType of pageTypes) {
      await openTemplatePageEditor(page, EditorType.LEGACY, pageType);
      
      await changePageTitle(page, `TC-011: Template Page Legacy Layout - ${pageType} - ${new Date().toString()}`);
      await savePage(page);
      await publishPage(page);
      
      newPageCount++;
    }
  });

  test('TC-012: User publish page in the Page listing screen', async ({ page }) => {
    await openPageListingPage(page);
    await verifyPageListingLoaded(page);
    
    await filterTableByStatus(page, PageStatus.UNPUBLISHED);
    await waitForPageLoaded(page);
    await sleep(page, 3000);
    
    const firstRow = page.locator('[data-testid="page-table"], .page-table, table tbody tr, .page-row').first();
    await waitForElementVisible(page, firstRow.locator('xpath=.').toString());
    
    // Publish the first unpublished page
    await publishPageFromTable(page, 1);
    await waitForPageLoaded(page);
    
    // Verify page is now published
    const status = await getPageStatus(page, 1);
    expect(status.toLowerCase()).toContain('published');
  });

  test('TC-013: User unpublish page in the Page listing screen', async ({ page }) => {
    await openPageListingPage(page);
    await verifyPageListingLoaded(page);
    
    await filterTableByStatus(page, PageStatus.PUBLISHED);
    await waitForPageLoaded(page);
    await sleep(page, 3000);
    
    const firstRow = page.locator('[data-testid="page-table"], .page-table, table tbody tr, .page-row').first();
    await waitForElementVisible(page, firstRow.locator('xpath=.').toString());
    
    // Unpublish the first published page
    await unpublishPageFromTable(page, 1);
    await waitForPageLoaded(page);
    
    // Verify page is now unpublished
    const status = await getPageStatus(page, 1);
    expect(status.toLowerCase()).toContain('unpublished');
  });
});
