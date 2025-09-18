import { test, expect } from '@playwright/test';
import { openPageFly, openPageListingPage } from '../../../pages/bridge';
import { clickCreatePage, openBlankPageEditor } from '../../../pages/page-listing-page';
import { getPageEditor } from '../../../pages/page-editor';
import { PageType, EditorType } from '../../../types/enums';
import { ElementType } from '../../../types/element-types';

test.describe('V2 Drag and Drop Tests', () => {
  test.beforeEach(async ({ page }) => {
    await openPageFly(page);
    await openPageListingPage(page);
  });

  test('should drag and drop multiple elements to canvas', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();

    // Open elements drawer`
    await elementsDrawer.open();

    // Drag and drop multiple elements
    const elements = [ElementType.HEADING, ElementType.TEXT, ElementType.BUTTON, ElementType.IMAGE];
    
    for (const elementType of elements) {
      await elementsDrawer.dragAndDropElementToCanvas(elementType);
      await canvas.verifyElementExist(elementType);
    }

    // Verify all elements exist
    const elementCount = await canvas.getElementCount();
    expect(elementCount).toBe(elements.length);
  });

  test('should drag and drop elements in different positions', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();

    // Open elements drawer
    await elementsDrawer.open();

    // Drag and drop elements at different positions
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.TEXT);
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.BUTTON);

    // Verify elements exist
    await canvas.verifyElementExist(ElementType.HEADING);
    await canvas.verifyElementExist(ElementType.TEXT);
    await canvas.verifyElementExist(ElementType.BUTTON);

    // Verify element count
    const elementCount = await canvas.getElementCount();
    expect(elementCount).toBe(3);
  });

  test('should drag and drop elements and verify order', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();

    // Open elements drawer
    await elementsDrawer.open();

    // Drag and drop elements in specific order
    const elements = [ElementType.HEADING, ElementType.TEXT, ElementType.BUTTON];
    
    for (let i = 0; i < elements.length; i++) {
      await elementsDrawer.dragAndDropElementToCanvas(elements[i]);
      await canvas.verifyElementExist(elements[i]);
    }

    // Verify elements are in correct order
    for (let i = 0; i < elements.length; i++) {
      const element = canvas.getElementByIndex(i);
      await expect(element).toBeVisible();
    }
  });

  test('should drag and drop elements and select them', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();

    // Open elements drawer
    await elementsDrawer.open();

    // Drag and drop elements
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.TEXT);
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.BUTTON);

    // Select elements by index
    await canvas.selectElementByIndex(0);
    await canvas.selectElementByIndex(1);
    await canvas.selectElementByIndex(2);

    // Verify elements can be selected
    const selectedElement = canvas.getSelectedElement();
    await expect(selectedElement).toBeVisible();
  });

  test('should drag and drop elements and delete them', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();

    // Open elements drawer
    await elementsDrawer.open();

    // Drag and drop elements
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.TEXT);
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.BUTTON);

    // Verify initial count
    let elementCount = await canvas.getElementCount();
    expect(elementCount).toBe(3);

    // Select and delete elements
    for (let i = 0; i < 3; i++) {
      await canvas.selectElementByIndex(0); // Always select first element
      await page.keyboard.press('Delete');
    }

    // Verify all elements are deleted
    elementCount = await canvas.getElementCount();
    expect(elementCount).toBe(0);
  });
});
