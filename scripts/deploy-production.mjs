import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const html = readFileSync("out/index.html", "utf8");
const headers = readFileSync("out/_headers", "utf8");
if (!html.includes('<link rel="canonical" href="https://semblanse.com/"') ||
    !html.includes('<meta name="robots" content="index, follow"') ||
    /X-Robots-Tag:\s*noindex/i.test(headers)) {
  throw new Error("Build production before deploying: npm run build:production");
}
const revision = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", windowsHide: true });
if (revision.status !== 0) throw new Error("Cannot identify the release commit");
const status = spawnSync("git", ["status", "--porcelain"], { encoding: "utf8", windowsHide: true });
if (status.status !== 0 || status.stdout.trim()) throw new Error("Commit the reviewed changes before production deployment");

// Pages requires the standard config filename. Always restore preview defaults.
const previewConfig = readFileSync("wrangler.jsonc", "utf8");
const productionConfig = readFileSync("wrangler.production.jsonc", "utf8");
let result;
try {
  writeFileSync("wrangler.jsonc", productionConfig);
  result = spawnSync(process.execPath, [
    join(dirname(require.resolve("wrangler/package.json")), "bin", "wrangler.js"), "pages", "deploy", "out",
    "--project-name=semblanse", "--branch=main",
    `--commit-hash=${revision.stdout.trim()}`, "--commit-dirty=false",
  ], { stdio: "inherit", windowsHide: true });
} finally {
  writeFileSync("wrangler.jsonc", previewConfig);
}
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
