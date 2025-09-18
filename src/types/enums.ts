export enum PageType {
  HOME = 'home',
  PRODUCT = 'product',
  COLLECTION = 'collection',
  CUSTOM = 'custom'
}

export enum EditorType {
  FLEX = 'flex',
  LEGACY = 'legacy'
}

export enum PageStatus {
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
  DRAFT = 'draft'
}

export enum ListingType {
  PAGE = 'page',
  SECTION = 'section',
  THEME = 'theme'
}

export enum BrowserType {
  CHROMIUM = 'chromium',
  WEBKIT = 'webkit',
  FIREFOX = 'firefox'
}

export enum FailureHandling {
  STOP_ON_FAILURE = 'stop_on_failure',
  CONTINUE_ON_FAILURE = 'continue_on_failure',
  OPTIONAL = 'optional'
}
