import { Page } from '@playwright/test';

export class ClipboardHelper {
  /**
   * Put text into clipboard
   */
  static async putTextIntoClipboard(page: Page, text: string): Promise<void> {
    await page.evaluate((text) => {
      navigator.clipboard.writeText(text);
    }, text);
  }

  /**
   * Get text from clipboard
   */
  static async getTextFromClipboard(page: Page): Promise<string> {
    return await page.evaluate(() => {
      return navigator.clipboard.readText();
    });
  }

  /**
   * Copy element text to clipboard
   */
  static async copyElementTextToClipboard(page: Page, selector: string): Promise<void> {
    const text = await page.locator(selector).textContent();
    if (text) {
      await this.putTextIntoClipboard(page, text);
    }
  }

  /**
   * Paste text from clipboard
   */
  static async pasteTextFromClipboard(page: Page, selector: string): Promise<void> {
    const text = await this.getTextFromClipboard(page);
    await page.locator(selector).fill(text);
  }
}
