import { test, expect } from '@playwright/test';
import { openPageFly, openPageListingPage } from '../../../pages/bridge';
import { clickCreatePage, openBlankPageEditor, verifyPageListingLoaded } from '../../../pages/page-listing-page';
import { getPageEditor } from '../../../pages/page-editor';
import { PageType, EditorType } from '../../../types/enums';
import { ElementType } from '../../../types/element-types';
import { switchToEditorFrame } from '../../../utils/webui';

test.describe('V2 Editor Tests', () => {
  test.beforeEach(async ({ page }) => {
    // await openPageFly(page);
    await openPageListingPage(page);
  });

  test('should drag and drop heading element to canvas', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();

    // Open elements drawer
    await elementsDrawer.open();

    // Drag and drop heading element
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);

    // Verify element exists on canvas
    const canvas = pageEditor.getCanvas();
    await canvas.verifyElementExist(ElementType.HEADING);
  });

  test('should drag and drop text element to canvas', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();

    // Open elements drawer
    await elementsDrawer.open();

    // Drag and drop text element
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.TEXT);

    // Verify element exists on canvas
    const canvas = pageEditor.getCanvas();
    await canvas.verifyElementExist(ElementType.TEXT);
  });

  test('should drag and drop button element to canvas', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();

    // Open elements drawer
    await elementsDrawer.open();

    // Drag and drop button element
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.BUTTON);

    // Verify element exists on canvas
    const canvas = pageEditor.getCanvas();
    await canvas.verifyElementExist(ElementType.BUTTON);
  });

  test.describe('Image drag and drop tests', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to page listing and ensure it's loaded
      await openPageListingPage(page);
      await verifyPageListingLoaded(page);
      await page.waitForTimeout(2000); // Extra wait for dynamic content

      // Create a new blank page
      await clickCreatePage(page);
      await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

      // Wait for editor to load
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000); // Wait for animations
    });

    test('should drag and drop image from elements panel to canvas', async ({ page }) => {
      // Get page editor instance
      const pageEditor = getPageEditor(page, PageType.CUSTOM);
      const elementsDrawer = pageEditor.getElementsDrawer();

      // Open elements drawer and wait for it to be visible
      await elementsDrawer.open();
      await page.waitForTimeout(1000); // Wait for drawer animation

      // Switch to editor frame
      const editorFrame = await switchToEditorFrame(page);
      
      // Get source and target elements
      const imageElement = editorFrame.locator('[data-element-type="image"], .image-element').first();
      const canvasElement = editorFrame.locator('[data-testid="canvas"], .canvas, .editor-canvas').first();

      // Ensure elements are visible
      await imageElement.waitFor({ state: 'visible' });
      await canvasElement.waitFor({ state: 'visible' });

      // Perform drag and drop
      const sourceBound = await imageElement.boundingBox();
      const targetBound = await canvasElement.boundingBox();
      
      if (sourceBound && targetBound) {
        await page.mouse.move(
          sourceBound.x + sourceBound.width / 2,
          sourceBound.y + sourceBound.height / 2
        );
        await page.mouse.down();
        await page.mouse.move(
          targetBound.x + targetBound.width / 2,
          targetBound.y + targetBound.height / 2
        );
        await page.mouse.up();
      }

      // Wait for drag operation to complete
      await page.waitForTimeout(1000);

      // Verify element exists on canvas
      const canvas = pageEditor.getCanvas();
      await canvas.verifyElementExist(ElementType.IMAGE);
    });

    test('should drag and drop image after selecting it in canvas', async ({ page }) => {
      // Get page editor instance
      const pageEditor = getPageEditor(page, PageType.CUSTOM);
      const elementsDrawer = pageEditor.getElementsDrawer();

      // Add initial image to canvas
      await elementsDrawer.open();
      await elementsDrawer.dragAndDropElementToCanvas(ElementType.IMAGE);
      await page.waitForTimeout(1000);

      // Switch to editor frame
      const editorFrame = await switchToEditorFrame(page);

      // Select the image in canvas
      const imageInCanvas = editorFrame.locator('[data-element-type="image"], .image-element').first();
      await imageInCanvas.click();
      await page.waitForTimeout(500); // Wait for selection

      // Get target location (e.g., below the current position)
      const sourceBound = await imageInCanvas.boundingBox();
      
      if (sourceBound) {
        // Move image down by its height
        await page.mouse.move(
          sourceBound.x + sourceBound.width / 2,
          sourceBound.y + sourceBound.height / 2
        );
        await page.mouse.down();
        await page.mouse.move(
          sourceBound.x + sourceBound.width / 2,
          sourceBound.y + sourceBound.height * 2
        );
        await page.mouse.up();
      }

      // Wait for drag operation to complete
      await page.waitForTimeout(1000);

      // Verify image was moved
      const newPosition = await imageInCanvas.boundingBox();
      expect(newPosition?.y).toBeGreaterThan(sourceBound?.y || 0);
    });
  });

  test('should drag and drop video element to canvas', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();

    // Open elements drawer
    await elementsDrawer.open();

    // Drag and drop video element
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.VIDEO);

    // Verify element exists on canvas
    const canvas = pageEditor.getCanvas();
    await canvas.verifyElementExist(ElementType.VIDEO);
  });

  test('should drag and drop spacer element to canvas', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();

    // Open elements drawer
    await elementsDrawer.open();

    // Drag and drop spacer element
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.SPACER);

    // Verify element exists on canvas
    const canvas = pageEditor.getCanvas();
    await canvas.verifyElementExist(ElementType.SPACER);
  });

  test('should drag and drop divider element to canvas', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();

    // Open elements drawer
    await elementsDrawer.open();

    // Drag and drop divider element
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.DIVIDER);

    // Verify element exists on canvas
    const canvas = pageEditor.getCanvas();
    await canvas.verifyElementExist(ElementType.DIVIDER);
  });

  test('should drag and drop countdown element to canvas', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();

    // Open elements drawer
    await elementsDrawer.open();

    // Drag and drop countdown element
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.COUNTDOWN);

    // Verify element exists on canvas
    const canvas = pageEditor.getCanvas();
    await canvas.verifyElementExist(ElementType.COUNTDOWN);
  });

  test('should drag and drop QR code element to canvas', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();

    // Open elements drawer
    await elementsDrawer.open();

    // Drag and drop QR code element
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.QRCODE);

    // Verify element exists on canvas
    const canvas = pageEditor.getCanvas();
    await canvas.verifyElementExist(ElementType.QRCODE);
  });

  test('should drag and drop icon element to canvas', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();

    // Open elements drawer
    await elementsDrawer.open();

    // Drag and drop icon element
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.ICON);

    // Verify element exists on canvas
    const canvas = pageEditor.getCanvas();
    await canvas.verifyElementExist(ElementType.ICON);
  });
});
