# Function-Based Architecture Guide

This guide explains the function-based architecture used in the PageFly Playwright test automation framework.

## 🎯 Why Function-Based?

The framework has been converted from class-based to function-based architecture for several benefits:

### ✅ **Advantages of Function-Based Approach**

1. **Better Tree Shaking**: Only import the functions you need
2. **Easier Testing**: Pure functions are easier to unit test
3. **Better Performance**: No class instantiation overhead
4. **Simpler Mental Model**: Functions are more straightforward than classes
5. **Modern JavaScript**: Aligns with modern functional programming patterns
6. **Better IDE Support**: Better autocomplete and refactoring support

## 🏗️ Architecture Overview

### Before (Class-Based)

```typescript
// Old approach
const webUI = new WebUI(page);
await webUI.click('button');
await webUI.fill('input', 'text');

const pageListing = new PageListingPage(page);
await pageListing.clickCreatePage();
```

### After (Function-Based)

```typescript
// New approach
import { click, fill } from '../utils/webui';
import { clickCreatePage } from '../pages/page-listing-page';

await click(page, 'button');
await fill(page, 'input', 'text');
await clickCreatePage(page);
```

## 📁 File Structure

```
src/
├── utils/
│   └── webui.ts              # Pure utility functions
├── pages/
│   ├── base-page.ts          # Common page functions
│   ├── bridge.ts             # Navigation functions
│   ├── page-listing-page.ts  # Page listing functions
│   └── page-editor.ts        # Page editor functions
├── config/
│   ├── framework-constants.ts # Configuration constants
│   └── url-constants.ts      # URL constants
├── data/
│   └── data-provider.ts      # Data provider functions
└── tests/
    ├── base/
    │   └── base-test.ts      # Test fixtures
    └── *.test.ts             # Test files
```

## 🔧 Core Components

### 1. WebUI Utility Functions

**File**: `src/utils/webui.ts`

```typescript
// Element interactions
export async function click(page: Page, selector: string): Promise<void>;
export async function fill(page: Page, selector: string, text: string): Promise<void>;
export async function hover(page: Page, selector: string): Promise<void>;

// Waits
export async function waitForPageLoaded(page: Page): Promise<void>;
export async function waitForElementVisible(page: Page, selector: string): Promise<Locator>;

// Navigation
export async function openWebsite(page: Page, url: string): Promise<void>;
export async function switchToPageFlyFrame(page: Page): Promise<FrameLocator>;
```

**Usage**:

```typescript
import { click, fill, waitForPageLoaded } from '../utils/webui';

await click(page, 'button');
await fill(page, 'input[name="email"]', 'test@example.com');
await waitForPageLoaded(page);
```

### 2. Page Functions

**File**: `src/pages/page-listing-page.ts`

```typescript
// Page listing functions
export async function verifyPageListingLoaded(page: Page): Promise<void>;
export async function clickCreatePage(page: Page): Promise<void>;
export async function openBlankPageEditor(
  page: Page,
  editorType: EditorType,
  pageType: PageType
): Promise<void>;

// Table functions
export async function getPageCount(page: Page): Promise<number>;
export async function publishPage(page: Page, index: number): Promise<void>;
export async function getPageStatus(page: Page, index: number): Promise<string>;
```

**Usage**:

```typescript
import { clickCreatePage, openBlankPageEditor, publishPage } from '../pages/page-listing-page';

await clickCreatePage(page);
await openBlankPageEditor(page, EditorType.FLEX, PageType.HOME);
await publishPage(page, 1);
```

### 3. Configuration Constants

**File**: `src/config/framework-constants.ts`

```typescript
// Direct exports
if (!process.env.BASE_URL) {
  throw new Error('BASE_URL environment variable is required but not set');
}
export const BASE_URL = process.env.BASE_URL;
export const WAIT_EXPLICIT = parseInt(process.env.WAIT_EXPLICIT || '15000');
export const APP_IFRAME = process.env.APP_IFRAME || 'app-iframe';

// Legacy class for backward compatibility
export class FrameworkConstants {
  static readonly BASE_URL = BASE_URL;
  // ... other constants
}
```

**Usage**:

```typescript
// Preferred: Direct import
import { BASE_URL, WAIT_EXPLICIT } from '../config/framework-constants';

// Legacy: Class import (still supported)
import { FrameworkConstants } from '../config/framework-constants';
```

### 4. Data Provider Functions

**File**: `src/data/data-provider.ts`

```typescript
export function getPageTypes(): PageType[] {
  return [PageType.HOME, PageType.PRODUCT, PageType.COLLECTION, PageType.CUSTOM];
}

export function getEditorTypes(): string[] {
  return ['flex', 'legacy'];
}

export function getTestData() {
  return {
    validPageTitles: ['Test Page 1', 'Test Page 2'],
    invalidPageTitles: ['', '   '],
  };
}
```

**Usage**:

```typescript
import { getPageTypes, getTestData } from '../data/data-provider';

const pageTypes = getPageTypes();
const testData = getTestData();
```

## 🧪 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from './base/base-test';
import { openWebsite, click, waitForPageLoaded } from '../utils/webui';
import { clickCreatePage } from '../pages/page-listing-page';

test.describe('Page Creation Tests', () => {
  test('should create a new page', async ({ page }) => {
    if (!process.env.BASE_URL) {
      throw new Error('BASE_URL environment variable is required but not set');
    }
    await openWebsite(page, `${process.env.BASE_URL}/pages`);
    await waitForPageLoaded(page);
    await clickCreatePage(page);

    // Assertions
    await expect(page.locator('text=Create Page')).toBeVisible();
  });
});
```

### Data-Driven Tests

```typescript
import { getPageTypes } from '../data/data-provider';
import { openBlankPageEditor } from '../pages/page-listing-page';

test.describe('Page Type Tests', () => {
  const pageTypes = getPageTypes();

  for (const pageType of pageTypes) {
    test(`should create ${pageType} page`, async ({ page }) => {
      await openBlankPageEditor(page, EditorType.FLEX, pageType);
      // ... test implementation
    });
  }
});
```

### Complex Test with Multiple Functions

```typescript
import { openWebsite, waitForPageLoaded, switchToPageFlyFrame } from '../utils/webui';
import { openPageListingPage, verifyPageListingLoaded } from '../pages/bridge';
import {
  clickCreatePage,
  openBlankPageEditor,
  publishPage,
  getPageStatus,
} from '../pages/page-listing-page';
import { changePageTitle, savePage } from '../pages/page-editor';

test('should create and publish a page', async ({ page }) => {
  // Navigate to page listing
  await openPageListingPage(page);
  await verifyPageListingLoaded(page);

  // Create new page
  await openBlankPageEditor(page, EditorType.FLEX, PageType.HOME);

  // Edit page
  await changePageTitle(page, 'My Test Page');
  await savePage(page);

  // Publish page
  await publishPage(page, 1);

  // Verify
  const status = await getPageStatus(page, 1);
  expect(status).toContain('published');
});
```

## 🔄 Migration from Classes

### Step 1: Update Imports

**Before**:

```typescript
import { WebUI } from '../utils/webui';
import { PageListingPage } from '../pages/page-listing-page';
```

**After**:

```typescript
import { click, fill, waitForPageLoaded } from '../utils/webui';
import { clickCreatePage, openBlankPageEditor } from '../pages/page-listing-page';
```

### Step 2: Update Function Calls

**Before**:

```typescript
const webUI = new WebUI(page);
await webUI.click('button');
await webUI.fill('input', 'text');

const pageListing = new PageListingPage(page);
await pageListing.clickCreatePage();
```

**After**:

```typescript
await click(page, 'button');
await fill(page, 'input', 'text');
await clickCreatePage(page);
```

### Step 3: Update Test Fixtures

**Before**:

```typescript
test('my test', async ({ page, webUI }) => {
  await webUI.openWebsite('https://example.com');
});
```

**After**:

```typescript
test('my test', async ({ page }) => {
  await openWebsite(page, 'https://example.com');
});
```

## 🎨 Best Practices

### 1. **Import Only What You Need**

```typescript
// Good: Specific imports
import { click, fill } from '../utils/webui';

// Avoid: Wildcard imports
import * as webui from '../utils/webui';
```

### 2. **Use Descriptive Function Names**

```typescript
// Good
export async function openBlankPageEditor(
  page: Page,
  editorType: EditorType,
  pageType: PageType
): Promise<void>;

// Avoid
export async function openEditor(page: Page, type1: string, type2: string): Promise<void>;
```

### 3. **Keep Functions Pure**

```typescript
// Good: Pure function
export async function getPageTitle(page: Page): Promise<string> {
  return await page.title();
}

// Avoid: Side effects
export async function getPageTitleAndLog(page: Page): Promise<string> {
  const title = await page.title();
  console.log(title); // Side effect
  return title;
}
```

### 4. **Use TypeScript for Better IntelliSense**

```typescript
// Good: Proper typing
export async function clickElement(page: Page, selector: string): Promise<void> {
  await page.locator(selector).click();
}

// Avoid: Any types
export async function clickElement(page: any, selector: any): Promise<any> {
  await page.locator(selector).click();
}
```

### 5. **Group Related Functions**

```typescript
// Good: Grouped by functionality
// page-listing-page.ts
export async function clickCreatePage(page: Page): Promise<void> {}
export async function openBlankPageEditor(
  page: Page,
  editorType: EditorType,
  pageType: PageType
): Promise<void> {}
export async function openTemplatePageEditor(
  page: Page,
  editorType: EditorType,
  pageType: PageType
): Promise<void> {}

// page-editor.ts
export async function changePageTitle(page: Page, title: string): Promise<void> {}
export async function savePage(page: Page): Promise<void> {}
export async function publishPage(page: Page): Promise<void> {}
```

## 🔧 Backward Compatibility

The framework maintains backward compatibility with the old class-based approach:

```typescript
// Old way still works
import { FrameworkConstants } from '../config/framework-constants';
import { DataProviderFactory } from '../data/data-provider';

const baseUrl = FrameworkConstants.BASE_URL;
const pageTypes = DataProviderFactory.pageTypes;

// New way (preferred)
import { BASE_URL, getPageTypes } from '../config/framework-constants';
import { getPageTypes } from '../data/data-provider';

const baseUrl = BASE_URL;
const pageTypes = getPageTypes();
```

## 🚀 Performance Benefits

1. **Smaller Bundle Size**: Tree shaking removes unused functions
2. **Faster Execution**: No class instantiation overhead
3. **Better Memory Usage**: Functions are garbage collected immediately
4. **Improved Caching**: Functions can be cached more effectively

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Function Types](https://www.typescriptlang.org/docs/handbook/functions.html)
- [Modern JavaScript Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)

## 🤝 Contributing

When adding new functionality:

1. **Create functions instead of classes**
2. **Use descriptive names**
3. **Add proper TypeScript types**
4. **Include JSDoc comments**
5. **Export functions individually**
6. **Maintain backward compatibility where possible**

This function-based approach provides a more modern, maintainable, and performant test automation framework while keeping the same powerful functionality.
