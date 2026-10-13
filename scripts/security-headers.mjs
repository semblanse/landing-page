import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

export function writeSecurityHeaders(root = "out") {
  const rules = [];
  const aliases = [];
  function walk(folder) {
    for (const item of readdirSync(folder, { withFileTypes: true })) {
      const path = join(folder, item.name);
      if (item.isDirectory()) walk(path);
      else if (item.name.endsWith(".txt")) {
        // This Windows export puts RSC segments in folders; the client requests
        // dot-separated filenames. Keep both paths for static-host navigation.
        const parts = relative(root, path).split(sep);
        const at = parts.findIndex((part) => part.startsWith("__next."));
        if (at >= 0 && at < parts.length - 1)
          aliases.push([path, join(root, ...parts.slice(0, at), parts.slice(at).join("."))]);
      } else if (item.name.endsWith(".html")) {
        const html = readFileSync(path, "utf8");
        const hashes = new Set();
        for (const match of html.matchAll(
          /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
        ))
          if (!/\bsrc\s*=/.test(match[1]) && match[2])
            hashes.add(
              `'sha256-${createHash("sha256").update(match[2]).digest("base64")}'`,
            );
        const policy = `  Content-Security-Policy: script-src 'self' ${[...hashes].join(" ")} https://challenges.cloudflare.com`;
        if (policy.length > 2000)
          throw new Error(
            `Cloudflare header line exceeds 2000 characters: ${path}`,
          );
        const filename = "/" + relative(root, path).split(sep).join("/");
        const canonical = filename.endsWith("/index.html")
          ? filename.slice(0, -10)
          : filename;
        rules.push(`${canonical}\n${policy}`);
        if (canonical !== filename) rules.push(`${filename}\n${policy}`);
      }
    }
  }
  walk(root);
  for (const [source, target] of aliases) writeFileSync(target, readFileSync(source));
  const original = readFileSync(join(root, "_headers"), "utf8")
    .split("# Generated inline script policies")[0]
    .trimEnd();
  if (rules.length + 2 > 100)
    throw new Error("Too many Cloudflare header rules");
  writeFileSync(
    join(root, "_headers"),
    original +
      "\n\n# Generated inline script policies\n" +
      rules.join("\n\n") +
      "\n",
  );
  console.log(
    `Added hash-based inline script policies for ${rules.length} static page paths.`,
  );
  console.log(`Added ${aliases.length} static navigation segment aliases.`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  writeSecurityHeaders();
