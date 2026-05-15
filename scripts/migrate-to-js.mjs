/**
 * One-time: transpile src TypeScript to JavaScript with esbuild, fix import paths, remove .ts sources.
 * Run: node scripts/migrate-to-js.mjs
 */
import * as esbuild from "esbuild";
import { readdir, readFile, writeFile, unlink, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const srcRoot = join(root, "src");

async function walk(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else if (/\.(ts|tsx)$/.test(e.name) && e.name !== "vite-env.d.ts") out.push(p);
  }
  return out;
}

function targetPath(p) {
  if (p.endsWith(".tsx")) return `${p.slice(0, -4)}.jsx`;
  if (p.endsWith(".ts")) return `${p.slice(0, -3)}.js`;
  return p;
}

function fixImportExtensions(code) {
  return code
    .replace(/from (["'])([^"']+?)\.tsx\1/g, "from $1$2.jsx$1")
    .replace(/import\((["'])([^"']+?)\.tsx\1\)/g, "import($1$2.jsx$1)")
    .replace(/from (["'])([^"']+?)\.ts\1/g, "from $1$2.js$1")
    .replace(/import\((["'])([^"']+?)\.ts\1\)/g, "import($1$2.js$1)");
}

async function main() {
  const files = await walk(srcRoot);
  console.log(`Migrating ${files.length} files under src/…`);

  for (const file of files) {
    const raw = await readFile(file, "utf8");
    const loader = file.endsWith(".tsx") ? "tsx" : "ts";
    const result = await esbuild.transform(raw, {
      loader,
      format: "esm",
      target: "es2020",
      jsx: "automatic",
    });

    let code = fixImportExtensions(result.code).trimEnd();
    if (!code || code === '"";' || code === "'';") {
      code = "// Types-only module (erased during JS migration).\nexport {};\n";
    }

    const out = targetPath(file);
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, `${code}\n`, "utf8");
    await unlink(file);
    console.log(out.replace(root + "\\", "").replace(root + "/", ""));
  }

  console.log("Done. Remove old TS configs if you have not already.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
