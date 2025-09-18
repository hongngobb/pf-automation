import { Page, Locator } from '@playwright/test';
import { ListingType } from '../../types/enums';
import { waitForElementVisible, click } from '../../utils/webui';

export class TemplatesDrawer {
  private readonly drawer: Locator;
  private readonly templatesList: Locator;

  constructor(private page: Page, private listingType: ListingType) {
    this.drawer = page.locator('[data-testid="templates-drawer"], .templates-drawer, .drawer');
    this.templatesList = this.drawer.locator('[data-template], .template-item');
  }

  /**
   * Open templates drawer
   */
  async open(): Promise<void> {
    const openButton = this.page.locator('[data-testid="open-templates-drawer"], .open-templates-drawer, button:has-text("Templates")');
    await click(this.page, openButton.locator('xpath=.').toString());
    await waitForElementVisible(this.page, this.drawer.locator('xpath=.').toString());
  }

  /**
   * Close templates drawer
   */
  async close(): Promise<void> {
    const closeButton = this.drawer.locator('[data-testid="close-drawer"], .close-drawer, button:has-text("Close")');
    await click(this.page, closeButton.locator('xpath=.').toString());
  }

  /**
   * Select template by index
   */
  async selectTemplate(index: number = 0): Promise<void> {
    const template = this.templatesList.nth(index);
    await click(this.page, template.locator('xpath=.').toString());
  }

  /**
   * Select template by name
   */
  async selectTemplateByName(name: string): Promise<void> {
    const template = this.templatesList.filter({ hasText: name });
    await click(this.page, template.locator('xpath=.').toString());
  }

  /**
   * Confirm template selection
   */
  async confirmSelectTemplatePopover(): Promise<void> {
    const confirmButton = this.page.locator('[data-testid="confirm-template"], button:has-text("Select"), button:has-text("Confirm")');
    await click(this.page, confirmButton.locator('xpath=.').toString());
  }

  /**
   * Cancel template selection
   */
  async cancelSelectTemplatePopover(): Promise<void> {
    const cancelButton = this.page.locator('[data-testid="cancel-template"], button:has-text("Cancel")');
    await click(this.page, cancelButton.locator('xpath=.').toString());
  }

  /**
   * Search templates
   */
  async searchTemplates(searchTerm: string): Promise<void> {
    const searchInput = this.drawer.locator('[data-testid="search-templates"], input[placeholder*="search"]');
    await searchInput.fill(searchTerm);
  }

  /**
   * Filter templates by category
   */
  async filterTemplatesByCategory(category: string): Promise<void> {
    const filterButton = this.drawer.locator(`[data-category="${category}"], button:has-text("${category}")`);
    await click(this.page, filterButton.locator('xpath=.').toString());
  }

  /**
   * Get template count
   */
  async getTemplateCount(): Promise<number> {
    return await this.templatesList.count();
  }

  /**
   * Get template by index
   */
  getTemplateByIndex(index: number): Locator {
    return this.templatesList.nth(index);
  }

  /**
   * Get template by name
   */
  getTemplateByName(name: string): Locator {
    return this.templatesList.filter({ hasText: name });
  }

  /**
   * Check if template exists
   */
  async hasTemplate(name: string): Promise<boolean> {
    const template = this.getTemplateByName(name);
    return await template.count() > 0;
  }

  /**
   * Get template name by index
   */
  async getTemplateName(index: number): Promise<string> {
    const template = this.getTemplateByIndex(index);
    return await template.textContent() || '';
  }

  /**
   * Get template preview
   */
  async getTemplatePreview(index: number): Promise<string> {
    const template = this.getTemplateByIndex(index);
    const preview = template.locator('[data-preview], .preview, img');
    return await preview.getAttribute('src') || '';
  }
}

/**
 * Factory function to get templates drawer
 */
export function getTemplatesDrawer(page: Page, listingType: ListingType): TemplatesDrawer {
  return new TemplatesDrawer(page, listingType);
}
