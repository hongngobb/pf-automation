import { Page, Locator } from '@playwright/test';
import { ElementType } from '../../types/element-types';
import { waitForElementVisible, click, dragAndDrop } from '../../utils/webui';

export class ElementsDrawer {
  private readonly drawer: Locator;
  private readonly elementsList: Locator;

  constructor(private page: Page) {
    this.drawer = page.locator('[data-testid="elements-drawer"], .elements-drawer, .drawer');
    this.elementsList = this.drawer.locator('[data-element-type], .element-item');
  }

  /**
   * Open elements drawer
   */
  async open(): Promise<void> {
    const openButton = this.page.locator('[data-testid="open-elements-drawer"], .open-elements-drawer, button:has-text("Elements")');
    await click(this.page, openButton.locator('xpath=.').toString());
    await waitForElementVisible(this.page, this.drawer.locator('xpath=.').toString());
  }

  /**
   * Close elements drawer
   */
  async close(): Promise<void> {
    const closeButton = this.drawer.locator('[data-testid="close-drawer"], .close-drawer, button:has-text("Close")');
    await click(this.page, closeButton.locator('xpath=.').toString());
  }

  /**
   * Get element by type
   */
  getElementByType(elementType: ElementType): Locator {
    return this.elementsList.locator(`[data-element-type="${elementType}"], .${elementType}`);
  }

  /**
   * Drag and drop element to canvas
   */
  async dragAndDropElementToCanvas(elementType: ElementType): Promise<void> {
    const element = this.getElementByType(elementType);
    const canvas = this.page.locator('[data-testid="canvas"], .canvas, .editor-canvas');
    
    await dragAndDrop(
      this.page, 
      element.locator('xpath=.').toString(), 
      canvas.locator('xpath=.').toString()
    );
  }

  /**
   * Drag and drop element to canvas by name
   */
  async dragAndDropElementToCanvasByName(elementType: ElementType): Promise<void> {
    await this.dragAndDropElementToCanvas(elementType);
  }

  /**
   * Search for element
   */
  async searchElement(searchTerm: string): Promise<void> {
    const searchInput = this.drawer.locator('[data-testid="search-elements"], input[placeholder*="search"]');
    await searchInput.fill(searchTerm);
  }

  /**
   * Filter elements by category
   */
  async filterElementsByCategory(category: string): Promise<void> {
    const filterButton = this.drawer.locator(`[data-category="${category}"], button:has-text("${category}")`);
    await click(this.page, filterButton.locator('xpath=.').toString());
  }

  /**
   * Get element count
   */
  async getElementCount(): Promise<number> {
    return await this.elementsList.count();
  }

  /**
   * Get element count by type
   */
  async getElementCountByType(elementType: ElementType): Promise<number> {
    const elements = this.getElementByType(elementType);
    return await elements.count();
  }

  /**
   * Check if element exists
   */
  async hasElement(elementType: ElementType): Promise<boolean> {
    const element = this.getElementByType(elementType);
    return await element.count() > 0;
  }

  /**
   * Get all available element types
   */
  async getAvailableElementTypes(): Promise<ElementType[]> {
    const elements = this.elementsList;
    const count = await elements.count();
    const types: ElementType[] = [];
    
    for (let i = 0; i < count; i++) {
      const element = elements.nth(i);
      const type = await element.getAttribute('data-element-type');
      if (type) {
        types.push(type as ElementType);
      }
    }
    
    return types;
  }
}
