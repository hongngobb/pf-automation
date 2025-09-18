# Setup Guide - PageFly Playwright Migration

This guide will help you set up and run the migrated Playwright TypeScript test automation framework.

## 🚀 Quick Start

### 1. Prerequisites Check

Ensure you have the following installed:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check if Git is installed
git --version
```

### 2. Install Dependencies

```bash
# Navigate to project directory
cd pfcompany_playwright

# Install all dependencies
npm install

# Install Playwright browsers
npm run test:install
```

### 3. Environment Setup

```bash
# Copy environment template
cp config.env .env

# Edit the .env file with your settings
# At minimum, update:
# - STORE=your_shopify_store_name
# - PASSWORD=your_shopify_store_password
```

### 4. Run Your First Test

```bash
# Run a simple test
npm test

# Or run in headed mode to see the browser
npm run test:headed
```

## 📋 Detailed Setup Instructions

### Step 1: Node.js Installation

If Node.js is not installed:

**macOS (using Homebrew):**
```bash
brew install node
```

**Windows:**
- Download from [nodejs.org](https://nodejs.org/)
- Run the installer

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Project Dependencies

The project uses the following key dependencies:

- **@playwright/test**: Core testing framework
- **typescript**: TypeScript support
- **allure-playwright**: Test reporting
- **@faker-js/faker**: Test data generation
- **dotenv**: Environment variable management

### Step 3: Browser Configuration

Playwright supports multiple browsers:

```bash
# Install all browsers
npx playwright install

# Install specific browser
npx playwright install chromium
npx playwright install webkit
npx playwright install firefox
```

### Step 4: Environment Configuration

Create a `.env` file with your configuration:

```env
# Required Settings
STORE=your_shopify_store_name
PASSWORD=your_shopify_store_password

# Optional Settings
ENVIRONMENT=RC
BASE_URL=https://rc.pagefly.io
BROWSER=chromium
HEADLESS=false
```

### Step 5: Verify Installation

Run a simple test to verify everything is working:

```bash
# Run the main test
npx playwright test src/tests/main-test.ts --headed
```

## 🔧 Configuration Options

### Playwright Configuration

The `playwright.config.ts` file contains:

```typescript
export default defineConfig({
  testDir: './src/tests',           // Test directory
  fullyParallel: true,              // Run tests in parallel
  retries: 2,                       // Retry failed tests
  timeout: 60000,                   // Test timeout
  use: {
    baseURL: 'https://rc.pagefly.io', // Base URL for tests
    trace: 'on-first-retry',        // Record traces
    screenshot: 'only-on-failure',  // Screenshot on failure
    video: 'retain-on-failure',     // Video on failure
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

### TypeScript Configuration

The `tsconfig.json` file configures TypeScript compilation:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in debug mode
npm run test:debug
```

### Advanced Commands

```bash
# Run specific test file
npx playwright test src/tests/main-test.ts

# Run tests matching pattern
npx playwright test --grep "Page Listing"

# Run in specific browser
npx playwright test --project=chromium

# Run with custom timeout
npx playwright test --timeout=120000

# Run with custom workers
npx playwright test --workers=4
```

### Environment-Specific Runs

```bash
# Run with different environment
ENVIRONMENT=LIVE npm test

# Run in headless mode
HEADLESS=true npm test

# Run with custom base URL
BASE_URL=https://live.pagefly.io npm test
```

## 📊 Test Reports

### HTML Report

```bash
# Generate HTML report
npx playwright show-report

# Or open existing report
npx playwright show-report playwright-report
```

### Allure Report

```bash
# Generate Allure report
npm run test:report

# Or manually
allure serve allure-results
```

### Custom Reports

```bash
# JSON report
npx playwright test --reporter=json

# JUnit report
npx playwright test --reporter=junit
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Browser Installation Issues

```bash
# Reinstall browsers
npx playwright install --force

# Check browser installation
npx playwright install --dry-run
```

#### 2. Permission Issues (macOS)

```bash
# Allow ChromeDriver in System Preferences
# Go to: System Preferences > Security & Privacy > Privacy > Developer Tools
# Add Terminal or your IDE to the list
```

#### 3. Network Issues

```bash
# Check if you can access the base URL
curl -I https://rc.pagefly.io

# Test with different network settings
npx playwright test --headed --timeout=120000
```

#### 4. Element Not Found

```bash
# Run with debug mode to see what's happening
npx playwright test --debug

# Take screenshots for debugging
npx playwright test --screenshot=on
```

### Debug Mode

```bash
# Run in debug mode
npm run test:debug

# Or with specific test
npx playwright test src/tests/main-test.ts --debug
```

### Logging

```bash
# Enable debug logging
DEBUG=pw:api npm test

# Enable trace logging
npx playwright test --trace=on
```

## 🔄 Migration Verification

### Compare with Original Selenium Tests

1. **Run Original Tests**: Execute the Java Selenium tests
2. **Run Migrated Tests**: Execute the Playwright TypeScript tests
3. **Compare Results**: Ensure same test coverage and results

### Test Coverage

```bash
# Run all test suites
npm test

# Check test results
npx playwright show-report
```

### Performance Comparison

```bash
# Run with timing
time npm test

# Run with detailed output
npx playwright test --reporter=line
```

## 📝 Next Steps

After successful setup:

1. **Update Configuration**: Modify `.env` with your specific settings
2. **Run Test Suite**: Execute all tests to verify functionality
3. **Customize Tests**: Add your specific test scenarios
4. **Set Up CI/CD**: Integrate with your build pipeline
5. **Team Training**: Train team members on Playwright

## 🆘 Getting Help

### Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Allure Documentation](https://docs.qameta.io/allure/)

### Support

- Check test logs and screenshots
- Use debug mode for step-by-step execution
- Review error messages and stack traces
- Check browser console for JavaScript errors

### Common Commands Reference

```bash
# Installation
npm install
npm run test:install

# Running Tests
npm test                    # Run all tests
npm run test:headed        # Run with browser visible
npm run test:ui            # Interactive UI mode
npm run test:debug         # Debug mode

# Reports
npm run test:report        # Allure report
npx playwright show-report # HTML report

# Utilities
npx playwright codegen     # Generate test code
npx playwright test --list # List all tests
```
