import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: [
        "packages/core/src/**/*.ts",
        "packages/react/src/**/*.{ts,tsx}",
      ],
      reporter: ["text", "html", "lcov", "json-summary"],
      thresholds: { lines: 90, statements: 90, functions: 90, branches: 85 },
    },
    projects: [
      {
        test: {
          name: "components",
          environment: "jsdom",
          include: ["tests/unit/**/*.test.{ts,tsx}"],
          setupFiles: ["tests/support/setup.ts"],
          restoreMocks: true,
          clearMocks: true,
        },
      },
      {
        test: {
          name: "packages",
          environment: "node",
          include: ["tests/packages/**/*.test.ts"],
          fileParallelism: false,
        },
      },
      {
        test: {
          name: "quality",
          environment: "node",
          include: ["tests/quality/**/*.test.ts"],
        },
      },
    ],
  },
});
