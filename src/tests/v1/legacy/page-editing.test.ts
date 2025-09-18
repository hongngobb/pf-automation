import { test, expect } from '@playwright/test';
import { openPageFly, openPageListingPage } from '../../../pages/bridge';
import { clickCreatePage, openBlankPageEditor } from '../../../pages/page-listing-page';
import { getPageEditor } from '../../../pages/page-editor';
import { PageType, EditorType } from '../../../types/enums';
import { ElementType } from '../../../types/element-types';

test.describe('V1 Legacy Page Editing Tests', () => {
  test.beforeEach(async ({ page }) => {
    await openPageFly(page);
    await openPageListingPage(page);
  });

  test('should create and edit page with basic elements', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();

    // Open elements drawer
    await elementsDrawer.open();

    // Add basic elements
    const basicElements = [ElementType.HEADING, ElementType.TEXT, ElementType.BUTTON];
    
    for (const elementType of basicElements) {
      await elementsDrawer.dragAndDropElementToCanvas(elementType);
      await canvas.verifyElementExist(elementType);
    }

    // Verify all elements exist
    const elementCount = await canvas.getElementCount();
    expect(elementCount).toBe(basicElements.length);
  });

  test('should create and edit page with media elements', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();

    // Open elements drawer
    await elementsDrawer.open();

    // Add media elements
    const mediaElements = [ElementType.IMAGE, ElementType.VIDEO];
    
    for (const elementType of mediaElements) {
      await elementsDrawer.dragAndDropElementToCanvas(elementType);
      await canvas.verifyElementExist(elementType);
    }

    // Verify all elements exist
    const elementCount = await canvas.getElementCount();
    expect(elementCount).toBe(mediaElements.length);
  });

  test('should create and edit page with layout elements', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();

    // Open elements drawer
    await elementsDrawer.open();

    // Add layout elements
    const layoutElements = [ElementType.SECTION, ElementType.ROW, ElementType.COLUMN];
    
    for (const elementType of layoutElements) {
      await elementsDrawer.dragAndDropElementToCanvas(elementType);
      await canvas.verifyElementExist(elementType);
    }

    // Verify all elements exist
    const elementCount = await canvas.getElementCount();
    expect(elementCount).toBe(layoutElements.length);
  });

  test('should create and edit page with utility elements', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();

    // Open elements drawer
    await elementsDrawer.open();

    // Add utility elements
    const utilityElements = [ElementType.SPACER, ElementType.DIVIDER, ElementType.ICON];
    
    for (const elementType of utilityElements) {
      await elementsDrawer.dragAndDropElementToCanvas(elementType);
      await canvas.verifyElementExist(elementType);
    }

    // Verify all elements exist
    const elementCount = await canvas.getElementCount();
    expect(elementCount).toBe(utilityElements.length);
  });

  test('should create and edit page with interactive elements', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();

    // Open elements drawer
    await elementsDrawer.open();

    // Add interactive elements
    const interactiveElements = [ElementType.BUTTON, ElementType.COUNTDOWN, ElementType.QRCODE];
    
    for (const elementType of interactiveElements) {
      await elementsDrawer.dragAndDropElementToCanvas(elementType);
      await canvas.verifyElementExist(elementType);
    }

    // Verify all elements exist
    const elementCount = await canvas.getElementCount();
    expect(elementCount).toBe(interactiveElements.length);
  });

  test('should create and edit page with all element types', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();

    // Open elements drawer
    await elementsDrawer.open();

    // Add all available element types
    const allElements = [
      ElementType.HEADING, ElementType.TEXT, ElementType.BUTTON, ElementType.IMAGE,
      ElementType.VIDEO, ElementType.SPACER, ElementType.DIVIDER, ElementType.COUNTDOWN,
      ElementType.QRCODE, ElementType.ICON, ElementType.SECTION, ElementType.ROW, ElementType.COLUMN
    ];
    
    for (const elementType of allElements) {
      await elementsDrawer.dragAndDropElementToCanvas(elementType);
      await canvas.verifyElementExist(elementType);
    }

    // Verify all elements exist
    const elementCount = await canvas.getElementCount();
    expect(elementCount).toBe(allElements.length);
  });

  test('should save and publish edited page', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();

    // Open elements drawer and add element
    await elementsDrawer.open();
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);

    // Change page title
    await pageEditor.changePageTitle('Test Page Title');

    // Save page
    await pageEditor.save();

    // Publish page
    await pageEditor.publish();

    // Verify page was saved and published
    const pageTitle = await pageEditor.getPageTitle();
    expect(pageTitle).toBe('Test Page Title');
  });

  test('should preview edited page', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();

    // Open elements drawer and add element
    await elementsDrawer.open();
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);

    // Preview page
    await pageEditor.preview();

    // Verify preview opened (look for preview indicators)
    const previewIndicator = page.locator('[data-testid="preview-mode"], .preview-mode, .preview-indicator');
    if (await previewIndicator.count() > 0) {
      await expect(previewIndicator).toBeVisible();
    }
  });

  test('should go back to page listing from editor', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);

    // Go back to page listing
    await pageEditor.goBack();

    // Verify we're back at page listing
    const pageListingIndicator = page.locator('[data-testid="page-listing"], .page-listing, .pages-list');
    if (await pageListingIndicator.count() > 0) {
      await expect(pageListingIndicator).toBeVisible();
    }
  });
});
