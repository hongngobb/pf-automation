import { Page, Locator } from '@playwright/test';
import { waitForElementVisible, clearAndFill, getText, click, waitForPageLoaded, pressKey } from '../utils/webui';
import { PageType } from '../types/enums';
import { EditorCanvas } from './editor/editor-canvas';
import { ElementsDrawer } from './editor/elements-drawer';
import { PageInspector } from './editor/page-inspector';
import { TemplatesDrawer } from './editor/templates-drawer';
import { ListingType } from '../types/enums';

/**
 * Verify page editor is loaded
 */
export async function verifyPageEditorLoaded(page: Page): Promise<void> {
  const pageTitleInput = page.locator('[data-testid="page-title"], input[name="title"], .page-title-input');
  const saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]');
  
  await waitForElementVisible(page, pageTitleInput.locator('xpath=.').toString());
  await waitForElementVisible(page, saveButton.locator('xpath=.').toString());
}

/**
 * Change page title
 */
export async function changePageTitle(page: Page, title: string): Promise<void> {
  const pageTitleInput = page.locator('[data-testid="page-title"], input[name="title"], .page-title-input');
  await clearAndFill(page, pageTitleInput.locator('xpath=.').toString(), title);
}

/**
 * Get current page title
 */
export async function getPageTitle(page: Page): Promise<string> {
  const pageTitleInput = page.locator('[data-testid="page-title"], input[name="title"], .page-title-input');
  return await pageTitleInput.inputValue();
}

/**
 * Save the page
 */
export async function savePage(page: Page): Promise<void> {
  const saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]');
  await saveButton.click();
  await waitForPageLoaded(page);
}

/**
 * Publish the page
 */
export async function publishPage(page: Page): Promise<void> {
  const publishButton = page.locator('button:has-text("Publish"), [data-testid="publish-button"]');
  await publishButton.click();
  await waitForPageLoaded(page);
}

/**
 * Preview the page
 */
export async function previewPage(page: Page): Promise<void> {
  const previewButton = page.locator('button:has-text("Preview"), [data-testid="preview-button"]');
  await previewButton.click();
  await waitForPageLoaded(page);
}

/**
 * Go back to page listing
 */
export async function goBackToPageListing(page: Page): Promise<void> {
  const backButton = page.locator('button:has-text("Back"), [data-testid="back-button"]');
  await backButton.click();
  await waitForPageLoaded(page);
}

/**
 * Add element to page
 */
export async function addElement(page: Page, elementType: string): Promise<void> {
  const elementSelector = `[data-element-type="${elementType}"], button:has-text("${elementType}")`;
  await click(page, elementSelector);
}

/**
 * Drag element to canvas
 */
export async function dragElementToCanvas(page: Page, elementType: string, x: number, y: number): Promise<void> {
  const element = page.locator(`[data-element-type="${elementType}"]`);
  const canvas = page.locator('[data-testid="canvas"], .canvas, .editor-canvas');
  
  await element.dragTo(canvas, {
    targetPosition: { x, y }
  });
}

/**
 * Select element on canvas
 */
export async function selectElementOnCanvas(page: Page, index: number): Promise<void> {
  const canvas = page.locator('[data-testid="canvas"], .canvas, .editor-canvas');
  const elements = canvas.locator('[data-element], .element');
  await elements.nth(index).click();
}

/**
 * Delete selected element
 */
export async function deleteSelectedElement(page: Page): Promise<void> {
  await pressKey(page, 'Delete');
}

/**
 * Undo last action
 */
export async function undoAction(page: Page): Promise<void> {
  await pressKey(page, 'Control+z');
}

/**
 * Redo last action
 */
export async function redoAction(page: Page): Promise<void> {
  await pressKey(page, 'Control+y');
}

// Enhanced Page Editor Class
export class BaseEditor {
  private _canvas: EditorCanvas | null = null;
  private _elementsDrawer: ElementsDrawer | null = null;
  private _pageInspector: PageInspector | null = null;

  constructor(private page: Page, private pageType: PageType) {}

  /**
   * Get canvas instance
   */
  getCanvas(): EditorCanvas {
    if (!this._canvas) {
      this._canvas = new EditorCanvas(this.page);
    }
    return this._canvas;
  }

  /**
   * Get elements drawer instance
   */
  getElementsDrawer(): ElementsDrawer {
    if (!this._elementsDrawer) {
      this._elementsDrawer = new ElementsDrawer(this.page);
    }
    return this._elementsDrawer;
  }

  /**
   * Get page inspector instance
   */
  getPageInspector(): PageInspector {
    if (!this._pageInspector) {
      this._pageInspector = new PageInspector(this.page);
    }
    return this._pageInspector;
  }

  /**
   * Drag and drop element to canvas by name
   */
  async dragAndDropElementToCanvasByName(elementType: string): Promise<void> {
    const elementsDrawer = this.getElementsDrawer();
    await elementsDrawer.dragAndDropElementToCanvasByName(elementType as any);
  }

  /**
   * Change page title
   */
  async changePageTitle(title: string): Promise<void> {
    await changePageTitle(this.page, title);
  }

  /**
   * Save page
   */
  async save(): Promise<void> {
    await savePage(this.page);
  }

  /**
   * Publish page
   */
  async publish(): Promise<void> {
    await publishPage(this.page);
  }

  /**
   * Preview page
   */
  async preview(): Promise<void> {
    await previewPage(this.page);
  }

  /**
   * Go back to page listing
   */
  async goBack(): Promise<void> {
    await goBackToPageListing(this.page);
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    const pageTitleInput = this.page.locator('[data-testid="page-title"], input[name="title"], .page-title-input');
    return await pageTitleInput.inputValue();
  }
}

/**
 * Factory function to get page editor
 */
export function getPageEditor(page: Page, pageType: PageType): BaseEditor {
  return new BaseEditor(page, pageType);
}
