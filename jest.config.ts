/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  preset: "ts-jest",
  coverageProvider: "v8",
  testMatch: ["**/*.spec.ts"],
  setupFiles: ["<rootDir>/test/setup.ts"],
};
