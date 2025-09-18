# PageFly Company Playwright Test Automation

This project is a migration from Selenium Java to Playwright TypeScript for PageFly Company's test automation framework.

## 🚀 Features

- **Playwright TypeScript**: Modern, fast, and reliable browser automation
- **Page Object Model**: Clean, maintainable test structure
- **Cross-browser Testing**: Support for Chromium, WebKit, and Firefox
- **Allure Reporting**: Beautiful test reports with screenshots and videos
- **Parallel Execution**: Run tests in parallel for faster execution
- **Data-driven Testing**: Support for multiple test data scenarios
- **Environment Configuration**: Flexible configuration for different environments

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

## 🛠️ Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd pfcompany_playwright
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers**:
   ```bash
   npm run test:install
   ```

4. **Set up environment variables**:
   ```bash
   cp config.env .env
   # Edit .env file with your configuration
   ```

## ⚙️ Configuration

### Environment Variables

Copy `config.env` to `.env` and update the following variables:

```env
# Environment Configuration
ENVIRONMENT=RC
BASE_URL=https://rc.pagefly.io

# Store Configuration
STORE=your_shopify_store_name
PASSWORD=your_shopify_store_password

# Browser Configuration
BROWSER=chromium
HEADLESS=false
```

### Playwright Configuration

The `playwright.config.ts` file contains:
- Test directory configuration
- Browser settings
- Reporter configuration
- Timeout settings
- Parallel execution settings

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Generate test code
npm run test:codegen
```

### Running Specific Tests

```bash
# Run specific test file
npx playwright test src/tests/main-test.ts

# Run tests matching a pattern
npx playwright test --grep "Page Listing"

# Run tests in specific browser
npx playwright test --project=chromium

# Run specific test suites
npm run test:v2          # Run V2 tests
npm run test:v1          # Run V1 legacy tests
npm run test:api         # Run API tests
npm run test:suites      # Run all test suites
npm run test:editor      # Run editor tests
npm run test:ab-testing  # Run AB testing tests
npm run test:legacy      # Run legacy tests
```

### Running with Different Configurations

```bash
# Run in headless mode
HEADLESS=true npm test

# Run with different environment
ENVIRONMENT=LIVE npm test

# Run with custom timeout
npx playwright test --timeout=120000
```

## 📊 Test Reports

### HTML Report
```bash
# Generate and open HTML report
npx playwright show-report
```

### Allure Report
```bash
# Generate Allure report
npm run test:report
```

## 🏗️ Project Structure

```
pfcompany_playwright/
├── src/
│   ├── config/              # Configuration files
│   │   ├── framework-constants.ts
│   │   └── url-constants.ts
│   ├── data/                # Test data and data providers
│   │   └── data-provider.ts
│   ├── pages/               # Page Object Model
│   │   ├── base-page.ts
│   │   ├── bridge.ts
│   │   ├── page-editor.ts
│   │   ├── page-listing-page.ts
│   │   └── editor/          # Editor-specific page objects
│   │       ├── editor-canvas.ts
│   │       ├── elements-drawer.ts
│   │       ├── page-inspector.ts
│   │       └── templates-drawer.ts
│   ├── tests/               # Test files
│   │   ├── base/
│   │   │   └── base-test.ts
│   │   ├── v2/              # V2 modern tests
│   │   │   ├── editor/
│   │   │   │   ├── editor-test.ts
│   │   │   │   ├── drag-and-drop-test.ts
│   │   │   │   └── inspector-test.ts
│   │   │   └── ab-testing/
│   │   │       └── ab-testing-test.ts
│   │   ├── v1/              # V1 legacy tests
│   │   │   └── legacy/
│   │   │       └── page-editing-test.ts
│   │   ├── api/             # API tests
│   │   │   └── page-api-test.ts
│   │   ├── suites/          # Test suites
│   │   │   ├── v2-suite.ts
│   │   │   ├── v1-suite.ts
│   │   │   ├── api-suite.ts
│   │   │   └── all-suites.ts
│   │   ├── main-test.ts
│   │   └── page-listing-test.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── enums.ts
│   │   ├── element-types.ts
│   │   ├── device-modes.ts
│   │   ├── inspector-types.ts
│   │   └── rich-text-types.ts
│   └── utils/               # Utility functions
│       ├── webui.ts
│       ├── image-utils.ts
│       ├── clipboard-helper.ts
│       └── allure-manager.ts
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🔧 Key Components

### WebUI Utility Functions
The `webui.ts` module provides common browser automation functions:
- Element interactions (click, fill, hover)
- Waits and assertions
- Screenshot capture
- JavaScript execution
- Local storage management

### Page Object Functions
- **base-page.ts**: Common page utility functions
- **bridge.ts**: Main navigation functions
- **page-listing-page.ts**: Page listing functionality
- **page-editor.ts**: Enhanced page editor with canvas, elements drawer, and inspector
- **Editor Components** (`src/pages/editor/`):
  - **EditorCanvas**: Canvas interaction functionality
  - **ElementsDrawer**: Elements drawer functionality
  - **PageInspector**: Inspector panel functionality
  - **TemplatesDrawer**: Templates drawer functionality

### Test Base Functions
- **base-test.ts**: Provides fixtures for page
- Browser context configuration
- Common test setup and teardown

### Test Organization
- **V2 Tests** (`src/tests/v2/`): Modern editor and AB testing tests
- **V1 Legacy Tests** (`src/tests/v1/`): Legacy page editing tests
- **API Tests** (`src/tests/api/`): API functionality tests
- **Test Suites** (`src/tests/suites/`): Organized test suites

### Additional Utilities
- **Image Utils**: Image manipulation utilities
- **Clipboard Helper**: Clipboard operations
- **Allure Manager**: Allure reporting utilities

## 🎯 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from './base/base-test';
import { openWebsite, click } from '../utils/webui';

test.describe('Feature Tests', () => {
  test('should perform some action', async ({ page }) => {
    // Test implementation
    await openWebsite(page, 'https://example.com');
    await click(page, 'button');
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

### Using Page Functions

```typescript
import { openPageListingPage } from '../pages/bridge';
import { clickCreatePage } from '../pages/page-listing-page';

test('should create a new page', async ({ page }) => {
  await openPageListingPage(page);
  await clickCreatePage(page);
  // ... rest of test
});
```

## 🐛 Debugging

### Debug Mode
```bash
npm run test:debug
```

### Screenshots and Videos
- Screenshots are automatically captured on test failures
- Videos are recorded for failed tests
- Traces are available for debugging

### Console Logs
```typescript
// In your test
console.log('Debug information');
await page.screenshot({ path: 'debug.png' });
```

## 🔄 Migration from Selenium

### Key Differences

| Selenium Java | Playwright TypeScript |
|---------------|----------------------|
| `WebDriver` | `Page` |
| `WebElement` | `Locator` |
| `WebDriverWait` | Built-in auto-waiting |
| `Actions` | `page.mouse` / `page.keyboard` |
| `@Test` | `test()` |
| `@BeforeMethod` | `test.beforeEach()` |

### Migration Benefits

1. **Faster Execution**: No WebDriver overhead
2. **Better Reliability**: Built-in waiting mechanisms
3. **Modern API**: Async/await support
4. **Cross-browser**: Single API for all browsers
5. **Better Debugging**: Built-in tracing and debugging tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📝 Best Practices

1. **Use Function-Based Approach**: Keep tests clean and maintainable with pure functions
2. **Use Data Providers**: For data-driven tests
3. **Add Proper Waits**: Use Playwright's built-in waiting
4. **Write Descriptive Tests**: Clear test names and descriptions
5. **Handle Flakiness**: Use retries and proper waits
6. **Keep Tests Independent**: Each test should be able to run alone
7. **Import Only What You Need**: Use specific function imports for better tree-shaking

## 🆘 Troubleshooting

### Common Issues

1. **Browser Installation**:
   ```bash
   npx playwright install
   ```

2. **Permission Issues** (macOS):
   ```bash
   # Allow ChromeDriver in System Preferences > Security & Privacy
   ```

3. **Timeout Issues**:
   - Increase timeout in `playwright.config.ts`
   - Use proper waits in tests

4. **Element Not Found**:
   - Check if element is in iframe
   - Use proper selectors
   - Add explicit waits

### Getting Help

- Check Playwright documentation: https://playwright.dev/
- Review test logs and screenshots
- Use debug mode for step-by-step execution

## 📄 License

This project is licensed under the MIT License.

## 🏆 Acknowledgments

- Original Selenium Java framework team
- Playwright team for the excellent tooling
- PageFly team for the migration requirements
# pf-automation
