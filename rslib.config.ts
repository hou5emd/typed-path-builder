import { pluginTypeCheck } from "@rsbuild/plugin-type-check";
import { defineConfig } from "@rslib/core";

export default defineConfig({
  plugins: [pluginTypeCheck()],
  lib: [
    {
      format: "esm",
      dts: true,
    },
    {
      format: "cjs",
    },
  ],
  source: {
    entry: {
      index: "./src/index.ts",
    },
  },
  output: {
    cleanDistPath: true,
  },
});
