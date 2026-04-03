import { defineConfig } from "@rstest/core";
import { withRslibConfig } from "@rstest/adapter-rslib";

export default defineConfig({
  extends: withRslibConfig(),
  globals: true,
  include: [
    "src/**/__tests__/**/*.+(ts|tsx|js)",
    "src/**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  testEnvironment: "node",
});
