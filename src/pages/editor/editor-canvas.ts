import { Page, Locator } from '@playwright/test';
import { ElementType } from '../../types/element-types';
import { waitForElementVisible, click, getText, getAttribute } from '../../utils/webui';

export class EditorCanvas {
  private readonly canvas: Locator;
  private readonly elements: Locator;

  constructor(private page: Page) {
    this.canvas = page.locator('[data-testid="canvas"], .canvas, .editor-canvas');
    this.elements = this.canvas.locator('[data-element], .element');
  }

  /**
   * Verify element exists on canvas
   */
  async verifyElementExist(elementType: ElementType): Promise<void> {
    const element = this.canvas.locator(`[data-element-type="${elementType}"], .${elementType}`);
    await waitForElementVisible(this.page, element.locator('xpath=.').toString());
  }

  /**
   * Get selected element
   */
  getSelectedElement(): Locator {
    return this.canvas.locator('[data-selected="true"], .selected, .element.selected');
  }

  /**
   * Get element by index
   */
  getElementByIndex(index: number): Locator {
    return this.elements.nth(index);
  }

  /**
   * Get element by type
   */
  getElementByType(elementType: ElementType): Locator {
    return this.canvas.locator(`[data-element-type="${elementType}"], .${elementType}`);
  }

  /**
   * Click on element
   */
  async clickElement(elementType: ElementType): Promise<void> {
    const element = this.getElementByType(elementType);
    await element.click();
  }

  /**
   * Get element text
   */
  async getElementText(elementType: ElementType): Promise<string> {
    const element = this.getElementByType(elementType);
    return await getText(this.page, element.locator('xpath=.').toString());
  }

  /**
   * Get element attribute
   */
  async getElementAttribute(elementType: ElementType, attribute: string): Promise<string | null> {
    const element = this.getElementByType(elementType);
    return await getAttribute(this.page, element.locator('xpath=.').toString(), attribute);
  }

  /**
   * Get selected element attribute
   */
  async getSelectedElementAttribute(attribute: string): Promise<string | null> {
    const element = this.getSelectedElement();
    return await getAttribute(this.page, element.locator('xpath=.').toString(), attribute);
  }

  /**
   * Get selected element text
   */
  async getSelectedElementText(): Promise<string> {
    const element = this.getSelectedElement();
    return await getText(this.page, element.locator('xpath=.').toString());
  }

  /**
   * Select element by index
   */
  async selectElementByIndex(index: number): Promise<void> {
    const element = this.getElementByIndex(index);
    await element.click();
  }

  /**
   * Select element by type
   */
  async selectElementByType(elementType: ElementType): Promise<void> {
    const element = this.getElementByType(elementType);
    await element.click();
  }

  /**
   * Get element count
   */
  async getElementCount(): Promise<number> {
    return await this.elements.count();
  }

  /**
   * Get element count by type
   */
  async getElementCountByType(elementType: ElementType): Promise<number> {
    const elements = this.getElementByType(elementType);
    return await elements.count();
  }

  /**
   * Clear canvas
   */
  async clearCanvas(): Promise<void> {
    // Select all elements and delete them
    await this.page.keyboard.press('Control+a');
    await this.page.keyboard.press('Delete');
  }

  /**
   * Get canvas dimensions
   */
  async getCanvasDimensions(): Promise<{ width: number; height: number }> {
    const boundingBox = await this.canvas.boundingBox();
    return {
      width: boundingBox?.width || 0,
      height: boundingBox?.height || 0
    };
  }
}
