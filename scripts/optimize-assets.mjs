import sharp from "sharp";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, basename } from "node:path";
const manifestPath = "src/lib/figma-assets.json";
const assets = JSON.parse(
  readFileSync("src/lib/figma-assets.source.json", "utf8"),
);
const report = [];
const duplicates = new Map();
const byPath = new Map();
mkdirSync("public/assets/optimized", { recursive: true });
for (const [key, path] of Object.entries(assets)) {
  if (!path.endsWith(".png")) continue;
  if (byPath.has(path)) {
    assets[key] = byPath.get(path);
    continue;
  }
  const original = readFileSync(resolve("public", path.slice(1)));
  const decoded = await sharp(original)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const hash = createHash("sha256")
    .update(decoded.data)
    .update(JSON.stringify(decoded.info))
    .digest("hex");
  if (duplicates.has(hash)) {
    assets[key] = duplicates.get(hash);
    byPath.set(path, assets[key]);
    report.push({
      path,
      optimized: assets[key],
      before: original.length,
      after: 0,
      deduplicated: true,
    });
    continue;
  }
  duplicates.set(hash, path);
  const webp = await sharp(original)
    .webp({ lossless: true, effort: 6 })
    .toBuffer();
  const check = await sharp(webp)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (
    !decoded.data.equals(check.data) ||
    decoded.info.width !== check.info.width ||
    decoded.info.height !== check.info.height
  ) {
    // Preserve the original if an encoder changes even an invisible pixel.
    byPath.set(path, path);
    report.push({
      path,
      before: original.length,
      after: original.length,
      skipped: "decoded pixels differ",
    });
    continue;
  }
  if (webp.length >= original.length) {
    byPath.set(path, path);
    continue;
  }
  const optimized = `/assets/optimized/${basename(path, ".png")}.webp`;
  writeFileSync(resolve("public", optimized.slice(1)), webp);
  assets[key] = optimized;
  byPath.set(path, optimized);
  duplicates.set(hash, optimized);
  report.push({
    path,
    optimized,
    before: original.length,
    after: webp.length,
    pixelHash: hash,
  });
}
writeFileSync(manifestPath, JSON.stringify(assets, null, 2) + "\n");
writeFileSync(
  "docs/asset-optimization.json",
  JSON.stringify(report, null, 2) + "\n",
);
const before = report.reduce((sum, item) => sum + item.before, 0);
const after = report.reduce((sum, item) => sum + item.after, 0);
console.log(
  JSON.stringify({
    optimizedFiles: report.filter((item) => item.optimized).length,
    before,
    after,
    saved: before - after,
    percentSaved: Math.round((100 * (before - after)) / before),
    decodedPixelsUnchanged: true,
  }),
);
