// Environment Configuration
export const ENVIRONMENT = process.env.ENVIRONMENT || 'RC';
if (!process.env.BASE_URL) {
  throw new Error('BASE_URL environment variable is required but not set');
}
export const BASE_URL = process.env.BASE_URL;

// PageFly Configuration
export const APP_IFRAME = process.env.APP_IFRAME || 'app-iframe';
export const APP = process.env.APP || 'RC';
export const HELPER_SCRIPTS_PATTERN = process.env.HELPER_SCRIPTS_PATTERN || 
  'https://cdn\\.shopify\\.com/extensions/.*/pagefly-rc-\\d+/assets/pagefly(-helper)?\\.js';
export const EDITOR_IFRAME = process.env.EDITOR_IFRAME || 
  '//iframe[starts-with(@name, \'frame://RC/modal/\') and contains(@name, \'/src\')]';
export const OVERLAY_MODAL_IFRAME = process.env.OVERLAY_MODAL_IFRAME || 
  '//iframe[starts-with(@name, \'frame://RC/modal/\') and not(contains(@name, \'/src\'))]';
export const DRAG_DROP_IFRAME = process.env.DRAG_DROP_IFRAME || 'pf-sandbox';

// Store Configuration
export const STORE = process.env.STORE || 'your_shopify_store_name';
export const PASSWORD = process.env.PASSWORD || 'your_shopify_store_password';

// Browser Configuration
export const BROWSER = process.env.BROWSER || 'chromium';
export const HEADLESS = process.env.HEADLESS === 'true';
export const USER_DATA_DIR = process.env.USER_DATA_DIR || './user-data';

// Wait Configuration
export const WAIT_DEFAULT = parseInt(process.env.WAIT_DEFAULT || '5000');
export const WAIT_IMPLICIT = parseInt(process.env.WAIT_IMPLICIT || '20000');
export const WAIT_EXPLICIT = parseInt(process.env.WAIT_EXPLICIT || '15000');
export const WAIT_PAGE_LOADED = parseInt(process.env.WAIT_PAGE_LOADED || '60000');
export const ACTIVE_PAGE_LOADED = process.env.ACTIVE_PAGE_LOADED === 'true';
export const WAIT_SLEEP_STEP = parseInt(process.env.WAIT_SLEEP_STEP || '0');

// Screenshot Configuration
export const SCREENSHOT_PASSED_TCS = process.env.SCREENSHOT_PASSED_TCS === 'true';
export const SCREENSHOT_FAILED_TCS = process.env.SCREENSHOT_FAILED_TCS === 'true';
export const SCREENSHOT_SKIPPED_TCS = process.env.SCREENSHOT_SKIPPED_TCS === 'true';
export const SCREENSHOT_ALL_STEPS = process.env.SCREENSHOT_ALL_STEPS === 'true';

// Video Recording
export const VIDEO_RECORD = process.env.VIDEO_RECORD === 'true';

// Retry Configuration
export const RETRY_TEST_FAIL = parseInt(process.env.RETRY_TEST_FAIL || '2');

// Report Configuration
export const AUTHOR = process.env.AUTHOR || 'PageFly Team';
export const PROJECT_NAME = process.env.PROJECT_NAME || 'PageFly Automation Test';
export const REPORT_TITLE = process.env.REPORT_TITLE || 'PageFly Automation Test Report';

// Legacy class for backward compatibility
export class FrameworkConstants {
  static readonly ENVIRONMENT = ENVIRONMENT;
  static readonly BASE_URL = BASE_URL;
  static readonly APP_IFRAME = APP_IFRAME;
  static readonly APP = APP;
  static readonly HELPER_SCRIPTS_PATTERN = HELPER_SCRIPTS_PATTERN;
  static readonly EDITOR_IFRAME = EDITOR_IFRAME;
  static readonly OVERLAY_MODAL_IFRAME = OVERLAY_MODAL_IFRAME;
  static readonly DRAG_DROP_IFRAME = DRAG_DROP_IFRAME;
  static readonly STORE = STORE;
  static readonly PASSWORD = PASSWORD;
  static readonly BROWSER = BROWSER;
  static readonly HEADLESS = HEADLESS;
  static readonly USER_DATA_DIR = USER_DATA_DIR;
  static readonly WAIT_DEFAULT = WAIT_DEFAULT;
  static readonly WAIT_IMPLICIT = WAIT_IMPLICIT;
  static readonly WAIT_EXPLICIT = WAIT_EXPLICIT;
  static readonly WAIT_PAGE_LOADED = WAIT_PAGE_LOADED;
  static readonly ACTIVE_PAGE_LOADED = ACTIVE_PAGE_LOADED;
  static readonly WAIT_SLEEP_STEP = WAIT_SLEEP_STEP;
  static readonly SCREENSHOT_PASSED_TCS = SCREENSHOT_PASSED_TCS;
  static readonly SCREENSHOT_FAILED_TCS = SCREENSHOT_FAILED_TCS;
  static readonly SCREENSHOT_SKIPPED_TCS = SCREENSHOT_SKIPPED_TCS;
  static readonly SCREENSHOT_ALL_STEPS = SCREENSHOT_ALL_STEPS;
  static readonly VIDEO_RECORD = VIDEO_RECORD;
  static readonly RETRY_TEST_FAIL = RETRY_TEST_FAIL;
  static readonly AUTHOR = AUTHOR;
  static readonly PROJECT_NAME = PROJECT_NAME;
  static readonly REPORT_TITLE = REPORT_TITLE;
}
