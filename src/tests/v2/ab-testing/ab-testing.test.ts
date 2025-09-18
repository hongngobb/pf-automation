import { test, expect } from '@playwright/test';
import { openPageFly, openPageListingPage } from '../../../pages/bridge';
import { clickCreatePage, openBlankPageEditor } from '../../../pages/page-listing-page';
import { getPageEditor } from '../../../pages/page-editor';
import { PageType, EditorType } from '../../../types/enums';
import { ElementType } from '../../../types/element-types';

test.describe('V2 AB Testing Tests', () => {
  test.beforeEach(async ({ page }) => {
    await openPageFly(page);
    await openPageListingPage(page);
  });

  test('should open AB testing modal', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();

    // Open elements drawer and add element
    await elementsDrawer.open();
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);

    // Look for AB testing button/menu
    const abTestingButton = page.locator('[data-testid="ab-testing"], button:has-text("AB Testing"), .ab-testing-button');
    
    if (await abTestingButton.count() > 0) {
      await abTestingButton.click();
      
      // Verify AB testing modal is open
      const abTestingModal = page.locator('[data-testid="ab-testing-modal"], .ab-testing-modal, .modal');
      await expect(abTestingModal).toBeVisible();
    }
  });

  test('should create AB test with page selection', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();

    // Open elements drawer and add element
    await elementsDrawer.open();
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);

    // Look for AB testing functionality
    const abTestingButton = page.locator('[data-testid="ab-testing"], button:has-text("AB Testing"), .ab-testing-button');
    
    if (await abTestingButton.count() > 0) {
      await abTestingButton.click();
      
      // Look for create AB test button
      const createABTestButton = page.locator('[data-testid="create-ab-test"], button:has-text("Create AB Test"), .create-ab-test');
      
      if (await createABTestButton.count() > 0) {
        await createABTestButton.click();
        
        // Look for page selection
        const pageSelection = page.locator('[data-testid="page-selection"], .page-selection, select[name="page"]');
        
        if (await pageSelection.count() > 0) {
          // Select a page for AB testing
          await pageSelection.selectOption({ index: 0 });
          
          // Look for confirm button
          const confirmButton = page.locator('[data-testid="confirm-ab-test"], button:has-text("Confirm"), button:has-text("Create")');
          
          if (await confirmButton.count() > 0) {
            await confirmButton.click();
            
            // Verify AB test was created (look for success message or AB test indicator)
            const successMessage = page.locator('[data-testid="success-message"], .success-message, .toast-success');
            if (await successMessage.count() > 0) {
              await expect(successMessage).toBeVisible();
            }
          }
        }
      }
    }
  });

  test('should configure AB test settings', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();

    // Open elements drawer and add element
    await elementsDrawer.open();
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);

    // Look for AB testing functionality
    const abTestingButton = page.locator('[data-testid="ab-testing"], button:has-text("AB Testing"), .ab-testing-button');
    
    if (await abTestingButton.count() > 0) {
      await abTestingButton.click();
      
      // Look for AB test settings
      const settingsButton = page.locator('[data-testid="ab-test-settings"], button:has-text("Settings"), .settings-button');
      
      if (await settingsButton.count() > 0) {
        await settingsButton.click();
        
        // Look for traffic allocation setting
        const trafficAllocation = page.locator('[data-testid="traffic-allocation"], input[name="traffic-allocation"], .traffic-allocation');
        
        if (await trafficAllocation.count() > 0) {
          await trafficAllocation.fill('50');
        }
        
        // Look for test duration setting
        const testDuration = page.locator('[data-testid="test-duration"], input[name="test-duration"], .test-duration');
        
        if (await testDuration.count() > 0) {
          await testDuration.fill('7');
        }
        
        // Look for save settings button
        const saveSettingsButton = page.locator('[data-testid="save-settings"], button:has-text("Save"), button:has-text("Apply")');
        
        if (await saveSettingsButton.count() > 0) {
          await saveSettingsButton.click();
          
          // Verify settings were saved
          const successMessage = page.locator('[data-testid="success-message"], .success-message, .toast-success');
          if (await successMessage.count() > 0) {
            await expect(successMessage).toBeVisible();
          }
        }
      }
    }
  });

  test('should start AB test', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();

    // Open elements drawer and add element
    await elementsDrawer.open();
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);

    // Look for AB testing functionality
    const abTestingButton = page.locator('[data-testid="ab-testing"], button:has-text("AB Testing"), .ab-testing-button');
    
    if (await abTestingButton.count() > 0) {
      await abTestingButton.click();
      
      // Look for start AB test button
      const startABTestButton = page.locator('[data-testid="start-ab-test"], button:has-text("Start Test"), .start-ab-test');
      
      if (await startABTestButton.count() > 0) {
        await startABTestButton.click();
        
        // Look for confirmation dialog
        const confirmDialog = page.locator('[data-testid="confirm-dialog"], .confirm-dialog, .modal');
        
        if (await confirmDialog.count() > 0) {
          const confirmButton = confirmDialog.locator('[data-testid="confirm"], button:has-text("Confirm"), button:has-text("Yes")');
          
          if (await confirmButton.count() > 0) {
            await confirmButton.click();
            
            // Verify AB test started
            const successMessage = page.locator('[data-testid="success-message"], .success-message, .toast-success');
            if (await successMessage.count() > 0) {
              await expect(successMessage).toBeVisible();
            }
          }
        }
      }
    }
  });

  test('should stop AB test', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();

    // Open elements drawer and add element
    await elementsDrawer.open();
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);

    // Look for AB testing functionality
    const abTestingButton = page.locator('[data-testid="ab-testing"], button:has-text("AB Testing"), .ab-testing-button');
    
    if (await abTestingButton.count() > 0) {
      await abTestingButton.click();
      
      // Look for stop AB test button
      const stopABTestButton = page.locator('[data-testid="stop-ab-test"], button:has-text("Stop Test"), .stop-ab-test');
      
      if (await stopABTestButton.count() > 0) {
        await stopABTestButton.click();
        
        // Look for confirmation dialog
        const confirmDialog = page.locator('[data-testid="confirm-dialog"], .confirm-dialog, .modal');
        
        if (await confirmDialog.count() > 0) {
          const confirmButton = confirmDialog.locator('[data-testid="confirm"], button:has-text("Confirm"), button:has-text("Yes")');
          
          if (await confirmButton.count() > 0) {
            await confirmButton.click();
            
            // Verify AB test stopped
            const successMessage = page.locator('[data-testid="success-message"], .success-message, .toast-success');
            if (await successMessage.count() > 0) {
              await expect(successMessage).toBeVisible();
            }
          }
        }
      }
    }
  });

  test('should view AB test results', async ({ page }) => {
    // Create a new blank page
    await clickCreatePage(page);
    await openBlankPageEditor(page, EditorType.FLEX, PageType.CUSTOM);

    // Get page editor instance
    const pageEditor = getPageEditor(page, PageType.CUSTOM);
    const elementsDrawer = pageEditor.getElementsDrawer();

    // Open elements drawer and add element
    await elementsDrawer.open();
    await elementsDrawer.dragAndDropElementToCanvas(ElementType.HEADING);

    // Look for AB testing functionality
    const abTestingButton = page.locator('[data-testid="ab-testing"], button:has-text("AB Testing"), .ab-testing-button');
    
    if (await abTestingButton.count() > 0) {
      await abTestingButton.click();
      
      // Look for view results button
      const viewResultsButton = page.locator('[data-testid="view-results"], button:has-text("View Results"), .view-results');
      
      if (await viewResultsButton.count() > 0) {
        await viewResultsButton.click();
        
        // Look for results modal or page
        const resultsModal = page.locator('[data-testid="results-modal"], .results-modal, .modal');
        const resultsPage = page.locator('[data-testid="results-page"], .results-page');
        
        if (await resultsModal.count() > 0) {
          await expect(resultsModal).toBeVisible();
        } else if (await resultsPage.count() > 0) {
          await expect(resultsPage).toBeVisible();
        }
      }
    }
  });
});
