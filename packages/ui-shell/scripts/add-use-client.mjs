import { readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");

for (const file of ["index.js", "index.cjs"]) {
  const filePath = join(distDir, file);
  const content = await readFile(filePath, "utf8");
  if (!content.startsWith('"use client"')) {
    await writeFile(filePath, `"use client";\n${content}`);
    console.log(`  ✓ prepended "use client" → dist/${file}`);
  }
}
