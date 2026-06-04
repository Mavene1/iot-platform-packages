/**
 * Post-build: prepend "use client" to the client-side bundle outputs.
 *
 * esbuild strips module-level directives when bundling multiple source files
 * together, even when the entry point has "use client". We inject it as a
 * raw string after the build so Next.js App Router correctly marks the
 * exported components as client-only.
 */
import { readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");
const targets = ["index.js", "index.cjs"];

for (const file of targets) {
  const filePath = join(distDir, file);
  const content = await readFile(filePath, "utf8");
  if (!content.startsWith('"use client"')) {
    await writeFile(filePath, `"use client";\n${content}`);
    console.log(`  ✓ prepended "use client" → dist/${file}`);
  }
}
