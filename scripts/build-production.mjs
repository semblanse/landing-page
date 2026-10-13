import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
if (
  !siteKey ||
  siteKey.startsWith("1x000000") ||
  siteKey.startsWith("2x000000") ||
  siteKey.startsWith("3x000000")
) {
  throw new Error(
    "Set the real NEXT_PUBLIC_TURNSTILE_SITE_KEY before building production.",
  );
}

const result = spawnSync(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "build"],
  {
    stdio: "inherit",
    env: { ...process.env, SITE_ENV: "production" },
  },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const headers = readFileSync("out/_headers", "utf8");
writeFileSync(
  "out/_headers",
  headers.replace(/^\s*X-Robots-Tag:.*\r?\n/gm, ""),
);
console.log(
  "Production build uses semblanse.com and permits indexing. No deployment was made.",
);
