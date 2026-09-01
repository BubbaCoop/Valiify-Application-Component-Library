/**
 * Playwright configuration for component visual verification.
 * Used by scripts/visual-verify.mjs to render Storybook stories and read
 * computed styles. See docs/component-process.md.
 */

import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Test directory (not used for workflow, but required)
  testDir: './tests',

  // Timeout for each test
  timeout: 30000,

  // Fail fast - stop on first failure
  fullyParallel: false,

  // Retry failed tests
  retries: 1,

  // Reporter configuration
  reporter: 'list',

  // Shared settings for all projects
  use: {
    // Base URL for Storybook
    baseURL: 'http://localhost:6006',

    // Collect trace on failure
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  // Browser configuration
  projects: [
    {
      name: 'chromium',
      use: {
        // Use chromium (fastest, matches most users)
        browserName: 'chromium',

        // Viewport size (responsive design)
        viewport: { width: 1280, height: 720 },

        // Disable animations for consistent screenshots
        reducedMotion: 'reduce',
      },
    },
  ],

  // Dev server configuration
  webServer: {
    command: 'npm run storybook',
    url: 'http://localhost:6006',
    timeout: 120000, // 2 minutes to start Storybook
    reuseExistingServer: !process.env.CI,
  },
});
