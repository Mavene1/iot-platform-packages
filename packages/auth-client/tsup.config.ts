import { defineConfig } from "tsup";

export default defineConfig([
  // ── Client bundle ─────────────────────────────────────────────────────────
  // Exports: createAuthClient, useIdleTimeout, types
  // All framework/React deps are peer deps — never bundled.
  // "use client" banner tells Next.js App Router these are client components.
  {
    name: "client",
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    external: [
      "react",
      "react/jsx-runtime",
      "next",
      "zustand",
      "react-idle-timer",
    ],
    clean: true,
    splitting: false,
    treeshake: true,
    sourcemap: false,
  },
  // ── Server bundle ─────────────────────────────────────────────────────────
  // Exports: verifySessionToken, getSessionCookieName, getShellLoginUrl,
  //          createSessionRoute
  // jose is bundled (consumers don't need to install it separately).
  // next/* is external — resolved from the consumer's Next.js install.
  {
    name: "server",
    entry: { server: "src/server.ts" },
    format: ["esm", "cjs"],
    dts: true,
    external: [
      "next",
      "next/server",
      "next/headers",
    ],
    clean: false,
    splitting: false,
    treeshake: true,
    sourcemap: false,
  },
]);
