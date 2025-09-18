import { test, expect } from '@playwright/test';
import { openPageFly, openPageListingPage } from '../../../pages/bridge';
import { clickCreatePage, openBlankPageEditor } from '../../../pages/page-listing-page';
import { getPageEditor } from '../../../pages/page-editor';
import { PageType, EditorType } from '../../../types/enums';
import { ElementType } from '../../../types/element-types';
import { InspectorTab } from '../../../types/inspector-types';

test.describe('V2 Inspector Tests', () => {
  test.beforeEach(async ({ page }) => {
    await openPageFly(page);
    await openPageListingPage(page);
  });

  test('should open inspector and switch between tabs', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();
    const pageInspector = pageEditor.getPageInspector();

    // Open elements drawer and add element
    await elementsDrawer.open();
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);
    await canvas.selectElementByType(ElementType.HEADING);

    // Open inspector
    await pageInspector.open();

    // Switch between tabs
    await pageInspector.switchToTab(InspectorTab.GENERAL);
    await pageInspector.switchToTab(InspectorTab.DESIGN);
    await pageInspector.switchToTab(InspectorTab.ADVANCED);
    await pageInspector.switchToTab(InspectorTab.ANIMATION);
    await pageInspector.switchToTab(InspectorTab.RESPONSIVE);

    // Verify inspector is visible
    await expect(pageInspector.isVisible()).resolves.toBe(true);
  });

  test('should change element content in General tab', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();
    const pageInspector = pageEditor.getPageInspector();

    // Open elements drawer and add element
    await elementsDrawer.open();
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);
    await canvas.selectElementByType(ElementType.HEADING);

    // Open inspector and switch to General tab
    await pageInspector.open();
    await pageInspector.switchToTab(InspectorTab.GENERAL);

    // Get General tab and change content
    const general = pageInspector.getGeneral();
    await general.open();
    const content = general.getContent();
    await content.changeContent('New Heading Text');

    // Verify content changed
    const elementText = await canvas.getElementText(ElementType.HEADING);
    expect(elementText).toContain('New Heading Text');
  });

  test('should change element design properties', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();
    const pageInspector = pageEditor.getPageInspector();

    // Open elements drawer and add element
    await elementsDrawer.open();
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);
    await canvas.selectElementByType(ElementType.HEADING);

    // Open inspector and switch to Design tab
    await pageInspector.open();
    await pageInspector.switchToTab(InspectorTab.DESIGN);

    // Get Design tab and change properties
    const design = pageInspector.getDesign();
    await design.open();
    await design.changeBackground('#ff0000');
    await design.changeBorder('1px solid #000000');
    await design.changeSpacing('10px');

    // Verify element is still visible (design changes applied)
    await canvas.verifyElementExist(ElementType.HEADING);
  });

  test('should change button type in General tab', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();
    const pageInspector = pageEditor.getPageInspector();

    // Open elements drawer and add button element
    await elementsDrawer.open();
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.BUTTON);
    await canvas.selectElementByType(ElementType.BUTTON);

    // Open inspector and switch to General tab
    await pageInspector.open();
    await pageInspector.switchToTab(InspectorTab.GENERAL);

    // Get General tab and change button type
    const general = pageInspector.getGeneral();
    await general.open();
    const content = general.getContent();
    await content.changeButtonType('submit');

    // Verify button element still exists
    await canvas.verifyElementExist(ElementType.BUTTON);
  });

  test('should close inspector', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();
    const canvas = pageEditor.getCanvas();
    const pageInspector = pageEditor.getPageInspector();

    // Open elements drawer and add element
    await elementsDrawer.open();
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);
    await canvas.selectElementByType(ElementType.HEADING);

    // Open inspector
    await pageInspector.open();
    await expect(pageInspector.isVisible()).resolves.toBe(true);

    // Close inspector
    await pageInspector.close();
    await expect(pageInspector.isVisible()).resolves.toBe(false);
  });
});
