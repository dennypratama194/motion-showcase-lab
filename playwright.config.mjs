import { defineConfig } from '@playwright/test';

const baseURL = process.env.ATELIER_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL,
    browserName: 'chromium',
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined },
  },
  webServer: process.env.ATELIER_URL ? undefined : {
    command: 'npm run dev -- --port 3000',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
