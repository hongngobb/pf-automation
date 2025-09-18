import { test } from '@playwright/test';
import { setupAuthentication, hasAuthState, clearAuthState } from '../utils/auth-setup';

test.describe('Authentication Setup', () => {
  test('setup authentication for first time', async () => {
    // Skip if auth state already exists
    if (hasAuthState()) {
      console.log('✅ Authentication state already exists, skipping setup');
      return;
    }
    
    console.log('🔐 Running one-time authentication setup...');
    await setupAuthentication();
  }, { timeout: 600000 }); // 10 minutes timeout for auth setup
  
  test('clear authentication state', async () => {
    // This test can be run manually to clear auth state
    // Only run if explicitly requested
    if (process.env.CLEAR_AUTH === 'true') {
      await clearAuthState();
    } else {
      console.log('ℹ️  Skipping auth clear (set CLEAR_AUTH=true to clear)');
    }
  });
});
