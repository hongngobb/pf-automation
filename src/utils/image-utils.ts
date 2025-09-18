import { Page } from '@playwright/test';

export class ImageUtils {
  /**
   * Take screenshot of element
   */
  static async takeElementScreenshot(page: Page, selector: string, name: string): Promise<void> {
    await page.locator(selector).screenshot({ path: `screenshots/${name}.png` });
  }

  /**
   * Take full page screenshot
   */
  static async takeFullPageScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({ 
      path: `screenshots/${name}.png`,
      fullPage: true 
    });
  }

  /**
   * Compare images (placeholder implementation)
   */
  static async compareImages(image1Path: string, image2Path: string): Promise<boolean> {
    // This would typically use a library like pixelmatch or similar
    // For now, return true as placeholder
    return true;
  }

  /**
   * Resize image (placeholder implementation)
   */
  static async resizeImage(imagePath: string, width: number, height: number): Promise<string> {
    // This would typically use a library like sharp or similar
    // For now, return the original path
    return imagePath;
  }

  /**
   * Get image dimensions (placeholder implementation)
   */
  static async getImageDimensions(imagePath: string): Promise<{ width: number; height: number }> {
    // This would typically use a library to read image metadata
    // For now, return default dimensions
    return { width: 1920, height: 1080 };
  }
}
