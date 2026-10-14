import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { writeSecurityHeaders } from "./security-headers.mjs";

const require = createRequire(import.meta.url);
const requested = process.argv[2] ?? process.env.PREVIEW_BRANCH ?? "staging";
const branch =
  requested === "main"
    ? "staging"
    : requested.toLowerCase().replace(/[^a-z0-9-]/g, "-");
if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(branch))
  throw new Error("Use a short branch name with letters, numbers and hyphens");
const config = readFileSync("wrangler.jsonc", "utf8");
if (
  !config.includes('"name": "semblanse-landing-preview"') ||
  !config.includes('"EMAIL_DELIVERY_MODE": "disabled"') ||
  config.includes("469627ac-c58d-4f2b-87b0-7fa625527072")
)
  throw new Error(
    "Preview must use its own project and database, with email disabled",
  );
const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
if (!key || /^[123]x000000/.test(key))
  throw new Error("Set the real preview Turnstile public key");
const revision = spawnSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
  windowsHide: true,
});
if (revision.status !== 0)
  throw new Error("Cannot identify the preview commit");
const status = spawnSync("git", ["status", "--porcelain"], {
  encoding: "utf8",
  windowsHide: true,
});
if (status.status !== 0 || status.stdout.trim())
  throw new Error("Commit the changes before deploying preview");
const url = `https://${branch}.semblanse-landing-preview.pages.dev`;
function run(args, env = process.env) {
  const result = spawnSync(process.execPath, args, {
    stdio: "inherit",
    env,
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
run([require.resolve("next/dist/bin/next"), "build"], {
  ...process.env,
  SITE_ENV: "preview",
  PREVIEW_SITE_URL: url,
});
writeSecurityHeaders();
if (!/X-Robots-Tag:\s*noindex/i.test(readFileSync("out/_headers", "utf8")))
  throw new Error("Preview indexing must remain blocked");
run([
  join(dirname(require.resolve("wrangler/package.json")), "bin", "wrangler.js"),
  "pages",
  "deploy",
  "out",
  "--project-name=semblanse-landing-preview",
  `--branch=${branch}`,
  `--commit-hash=${revision.stdout.trim()}`,
  "--commit-dirty=false",
]);
console.log(`Preview: ${url}`);
