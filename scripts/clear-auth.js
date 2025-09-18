#!/usr/bin/env node

/**
 * Clear authentication state script
 * Run this script to clear saved authentication and force re-login
 * 
 * Usage:
 *   node scripts/clear-auth.js
 *   npm run clear-auth
 */

const fs = require('fs');
const path = require('path');

console.log('🗑️  Clearing PageFly Authentication State');
console.log('==========================================');

// Load environment variables
require('dotenv').config();

const storageStatePath = process.env.STORAGE_STATE_PATH || './auth-state.json';

if (fs.existsSync(storageStatePath)) {
  try {
    fs.unlinkSync(storageStatePath);
    console.log('✅ Authentication state cleared successfully');
    console.log('Next time you run tests, you will need to authenticate again');
  } catch (error) {
    console.log('❌ Failed to clear authentication state:', error.message);
    process.exit(1);
  }
} else {
  console.log('ℹ️  No authentication state found to clear');
}

console.log('\nTo set up authentication again, run:');
console.log('  npm run setup-auth');
