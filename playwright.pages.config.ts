import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/pages',
  outputDir: './output/pages-test-results',
  fullyParallel: true,
  retries: 0,
  workers: 3,
  timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:4323', trace: 'retain-on-failure' },
  webServer: {
    command: 'node node_modules/http-server/bin/http-server output/pages -a 127.0.0.1 -p 4323 -c-1 --silent',
    url: 'http://127.0.0.1:4323/sdr/ro/',
    reuseExistingServer: false,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
