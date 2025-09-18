import { PageType } from '../types/enums';

/**
 * Page types data provider
 */
export function getPageTypes(): PageType[] {
  return [
    PageType.HOME,
    PageType.PRODUCT,
    PageType.COLLECTION,
    PageType.CUSTOM
  ];
}

/**
 * Editor types data provider
 */
export function getEditorTypes(): string[] {
  return ['flex', 'legacy'];
}

/**
 * Test data for different scenarios
 */
export function getTestData() {
  return {
    validPageTitles: [
      'Test Page 1',
      'Test Page 2',
      'Test Page 3'
    ],
    invalidPageTitles: [
      '',
      '   ',
      'a'.repeat(256) // Too long title
    ]
  };
}

// Legacy class for backward compatibility
export class DataProviderFactory {
  static get pageTypes(): PageType[] {
    return getPageTypes();
  }

  static get editorTypes(): string[] {
    return getEditorTypes();
  }

  static get testData() {
    return getTestData();
  }
}
