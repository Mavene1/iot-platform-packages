import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: false,
  clean: true,
  splitting: false,
  treeshake: true,
  jsx: "react-jsx",
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "next",
    "next/image",
    "next/link",
    "next/navigation",
    "radix-ui",
    "class-variance-authority",
    "cmdk",
    "lucide-react",
    "@iot-platform-saf/nav-config",
    "@iot-platform-saf/shared-types",
  ],
});
