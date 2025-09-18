import { Page, Locator } from '@playwright/test';
import { InspectorTab, DesignProperty, FlexDirection, FlexWrap, JustifyContent, AlignItems, AlignContent } from '../../types/inspector-types';
import { waitForElementVisible, click, fill, selectOption } from '../../utils/webui';

export class PageInspector {
  private readonly inspector: Locator;
  private readonly tabs: Locator;

  constructor(private page: Page) {
    this.inspector = page.locator('[data-testid="page-inspector"], .page-inspector, .inspector');
    this.tabs = this.inspector.locator('[data-tab], .tab');
  }

  /**
   * Get General tab
   */
  getGeneral(): InspectorGeneral {
    return new InspectorGeneral(this.page, this.inspector);
  }

  /**
   * Get Design tab
   */
  getDesign(): InspectorDesign {
    return new InspectorDesign(this.page, this.inspector);
  }

  /**
   * Get Advanced tab
   */
  getAdvanced(): InspectorAdvanced {
    return new InspectorAdvanced(this.page, this.inspector);
  }

  /**
   * Get Animation tab
   */
  getAnimation(): InspectorAnimation {
    return new InspectorAnimation(this.page, this.inspector);
  }

  /**
   * Get Responsive tab
   */
  getResponsive(): InspectorResponsive {
    return new InspectorResponsive(this.page, this.inspector);
  }

  /**
   * Switch to tab
   */
  async switchToTab(tab: InspectorTab): Promise<void> {
    const tabElement = this.tabs.locator(`[data-tab="${tab}"], .${tab}`);
    await click(this.page, tabElement.locator('xpath=.').toString());
    await waitForElementVisible(this.page, tabElement.locator('xpath=.').toString());
  }

  /**
   * Check if inspector is visible
   */
  async isVisible(): Promise<boolean> {
    return await this.inspector.isVisible();
  }

  /**
   * Open inspector
   */
  async open(): Promise<void> {
    const openButton = this.page.locator('[data-testid="open-inspector"], .open-inspector, button:has-text("Inspector")');
    await click(this.page, openButton.locator('xpath=.').toString());
    await waitForElementVisible(this.page, this.inspector.locator('xpath=.').toString());
  }

  /**
   * Close inspector
   */
  async close(): Promise<void> {
    const closeButton = this.inspector.locator('[data-testid="close-inspector"], .close-inspector, button:has-text("Close")');
    await click(this.page, closeButton.locator('xpath=.').toString());
  }
}

export class InspectorGeneral {
  private readonly generalTab: Locator;

  constructor(private page: Page, private inspector: Locator) {
    this.generalTab = inspector.locator('[data-tab="general"], .general');
  }

  /**
   * Open General tab
   */
  async open(): Promise<void> {
    const tab = this.inspector.locator('[data-tab="general"], .general');
    await click(this.page, tab.locator('xpath=.').toString());
    await waitForElementVisible(this.page, this.generalTab.locator('xpath=.').toString());
  }

  /**
   * Get Content section
   */
  getContent(): InspectorContent {
    return new InspectorContent(this.page, this.generalTab);
  }
}

export class InspectorContent {
  private readonly contentSection: Locator;

  constructor(private page: Page, private generalTab: Locator) {
    this.contentSection = generalTab.locator('[data-section="content"], .content');
  }

  /**
   * Change content
   */
  async changeContent(content: string): Promise<void> {
    const contentInput = this.contentSection.locator('[data-field="content"], input[name="content"]');
    await fill(this.page, contentInput.locator('xpath=.').toString(), content);
  }

  /**
   * Change text content
   */
  async changeTextContent(text: string): Promise<void> {
    const textInput = this.contentSection.locator('[data-field="text"], input[name="text"]');
    await fill(this.page, textInput.locator('xpath=.').toString(), text);
  }

  /**
   * Change button type
   */
  async changeButtonType(type: string): Promise<void> {
    const typeSelect = this.contentSection.locator('[data-field="button-type"], select[name="button-type"]');
    await selectOption(this.page, typeSelect.locator('xpath=.').toString(), type);
  }
}

export class InspectorDesign {
  private readonly designTab: Locator;

  constructor(private page: Page, private inspector: Locator) {
    this.designTab = inspector.locator('[data-tab="design"], .design');
  }

  /**
   * Open Design tab
   */
  async open(): Promise<void> {
    const tab = this.inspector.locator('[data-tab="design"], .design');
    await click(this.page, tab.locator('xpath=.').toString());
    await waitForElementVisible(this.page, this.designTab.locator('xpath=.').toString());
  }

  /**
   * Change background
   */
  async changeBackground(background: string): Promise<void> {
    const backgroundInput = this.designTab.locator('[data-field="background"], input[name="background"]');
    await fill(this.page, backgroundInput.locator('xpath=.').toString(), background);
  }

  /**
   * Change border
   */
  async changeBorder(border: string): Promise<void> {
    const borderInput = this.designTab.locator('[data-field="border"], input[name="border"]');
    await fill(this.page, borderInput.locator('xpath=.').toString(), border);
  }

  /**
   * Change spacing
   */
  async changeSpacing(spacing: string): Promise<void> {
    const spacingInput = this.designTab.locator('[data-field="spacing"], input[name="spacing"]');
    await fill(this.page, spacingInput.locator('xpath=.').toString(), spacing);
  }
}

export class InspectorAdvanced {
  private readonly advancedTab: Locator;

  constructor(private page: Page, private inspector: Locator) {
    this.advancedTab = inspector.locator('[data-tab="advanced"], .advanced');
  }

  /**
   * Open Advanced tab
   */
  async open(): Promise<void> {
    const tab = this.inspector.locator('[data-tab="advanced"], .advanced');
    await click(this.page, tab.locator('xpath=.').toString());
    await waitForElementVisible(this.page, this.advancedTab.locator('xpath=.').toString());
  }
}

export class InspectorAnimation {
  private readonly animationTab: Locator;

  constructor(private page: Page, private inspector: Locator) {
    this.animationTab = inspector.locator('[data-tab="animation"], .animation');
  }

  /**
   * Open Animation tab
   */
  async open(): Promise<void> {
    const tab = this.inspector.locator('[data-tab="animation"], .animation');
    await click(this.page, tab.locator('xpath=.').toString());
    await waitForElementVisible(this.page, this.animationTab.locator('xpath=.').toString());
  }
}

export class InspectorResponsive {
  private readonly responsiveTab: Locator;

  constructor(private page: Page, private inspector: Locator) {
    this.responsiveTab = inspector.locator('[data-tab="responsive"], .responsive');
  }

  /**
   * Open Responsive tab
   */
  async open(): Promise<void> {
    const tab = this.inspector.locator('[data-tab="responsive"], .responsive');
    await click(this.page, tab.locator('xpath=.').toString());
    await waitForElementVisible(this.page, this.responsiveTab.locator('xpath=.').toString());
  }
}
