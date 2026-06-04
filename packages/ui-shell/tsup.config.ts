import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm", "cjs"],
  dts: true,
  external: [
    "react",
    "react/jsx-runtime",
    "next",
    "next/image",
    "radix-ui",
    "lucide-react",
    "cmdk",
    "@mavene/shared-types",
  ],
  clean: true,
  splitting: false,
  treeshake: true,
  sourcemap: false,
});
