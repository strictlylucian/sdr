import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 30000,
  expect: { timeout: 5000 },
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["junit", { outputFile: "test-results/results.xml" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:4322",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command:
      "node node_modules/http-server/bin/http-server apps/docs/dist -a 127.0.0.1 -p 4322 -c-1 --silent",
    url: "http://127.0.0.1:4322/ro/",
    reuseExistingServer: false,
    timeout: 30000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "firefox",
      testIgnore: ["**/catalog.spec.ts", "**/docs.spec.ts", "**/layout.spec.ts"],
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testIgnore: ["**/catalog.spec.ts", "**/docs.spec.ts", "**/layout.spec.ts"],
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
