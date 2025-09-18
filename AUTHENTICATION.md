# 🔐 Persistent Authentication Setup

This guide explains how to set up persistent authentication for PageFly testing, so you only need to login once and the browser will remember your session.

## 🚀 Quick Start

### 1. First Time Setup

```bash
# 1. Copy environment template
cp env.example .env

# 2. Edit .env file with your store details
# Update STORE=your_shopify_store_name
# Update BASE_URL=https://rc.pagefly.io

# 3. Run one-time authentication setup
npm run setup-auth
```

### 2. Run Tests (No Login Required)

```bash
# Run all tests (browser will use saved authentication)
npm test

# Run tests with browser visible
npm run test:headed

# Run specific test suites
npm run test:editor
npm run test:ab-testing
```

### 3. Clear Authentication (If Needed)

```bash
# Clear saved authentication and force re-login
npm run clear-auth
```

## 📋 Detailed Setup Process

### Step 1: Environment Configuration

Create a `.env` file in the project root:

```env
# Required Settings
STORE=your_shopify_store_name
BASE_URL=https://rc.pagefly.io

# Authentication Settings
STORAGE_STATE_PATH=./auth-state.json
```

### Step 2: One-Time Authentication

Run the authentication setup:

```bash
npm run setup-auth
```

This will:

1. Open a browser window
2. Navigate to your Shopify admin
3. Wait for you to login manually (5 minutes)
4. Navigate to PageFly
5. Complete PageFly authentication
6. Save the authentication state to `auth-state.json`

### Step 3: Verify Setup

After setup, you should see:

- `auth-state.json` file created in project root
- Console message: "Authentication state saved"

## 🔧 How It Works

### Browser Context Persistence

The setup uses Playwright's `storageState` feature to save:

- Cookies
- Local storage
- Session storage
- IndexedDB data

### Configuration

The `playwright.config.ts` is configured to automatically load the saved state:

```typescript
contextOptions: {
  storageState: process.env.STORAGE_STATE_PATH || './auth-state.json',
}
```

### Authentication Flow

1. **First Run**: Manual login required
2. **Subsequent Runs**: Automatic authentication using saved state
3. **Session Expiry**: Clear auth state and re-run setup

## 🛠️ Troubleshooting

### Authentication State Not Working

```bash
# Check if auth state file exists
ls -la auth-state.json

# Clear and re-setup
npm run clear-auth
npm run setup-auth
```

### Login Issues

1. **Shopify Login Fails**:
   - Ensure store name is correct in `.env`
   - Check if 2FA is enabled (may need manual intervention)
   - Verify store access permissions

2. **PageFly Access Issues**:
   - Ensure PageFly app is installed in your Shopify store
   - Check if you have proper permissions
   - Verify BASE_URL is correct

### Session Expired

If you get authentication errors:

```bash
# Clear old authentication
npm run clear-auth

# Re-authenticate
npm run setup-auth
```

## 📁 File Structure

```
pfcompany_playwright/
├── auth-state.json          # Saved authentication state
├── .env                     # Environment configuration
├── scripts/
│   ├── setup-auth.js        # Authentication setup script
│   └── clear-auth.js        # Clear authentication script
├── src/
│   ├── utils/
│   │   └── auth-setup.ts    # Authentication utilities
│   └── tests/
│       └── auth-setup.test.ts # Authentication test
└── playwright.config.ts     # Playwright configuration
```

## 🔒 Security Notes

- The `auth-state.json` file contains sensitive authentication data
- Add it to `.gitignore` to avoid committing to version control
- Only use this approach in secure, trusted environments
- Consider using environment-specific authentication states

## 🎯 Best Practices

1. **Environment Separation**: Use different auth states for different environments
2. **Regular Refresh**: Clear and re-setup authentication periodically
3. **Team Sharing**: Don't share auth-state.json files between team members
4. **CI/CD**: Use different authentication strategies for automated testing

## 📞 Support

If you encounter issues:

1. Check the console output during setup
2. Verify environment variables are correct
3. Ensure browser permissions are granted
4. Try clearing authentication and re-setting up

For persistent issues, check the test logs and error messages for specific guidance.
