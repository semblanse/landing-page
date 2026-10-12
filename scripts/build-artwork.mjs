// Re-encodes the undithered Figma source artwork for the runtime dither shader.
// Inputs are the original image fills from Figma file Y0U7GeXRJxDj0p72fYLe1l,
// named by the first eight characters of their Figma image hash below.
import sharp from "sharp";

const sources = [
  // [original fill in public/figma, Figma image hash, output name]
  ["ddccf5f4-ce1f-43bc-9555-711b06caeec5.png", "91c6f912", "hero"],
  ["bd4d196d-291b-4d11-9be8-ce59fe6d04bf.png", "58ad2b23", "creator-recording"],
  ["994fd497-b64d-4edf-99f1-df1ef6172200.png", "b4a61bb1", "cap-scene"],
];

for (const [file, hash, name] of sources) {
  const out = `public/figma/source/${name}.webp`;
  const info = await sharp(`public/figma/${file}`)
    .webp({ quality: 90, effort: 6 })
    .toFile(out);
  console.log(`${hash} ${file} -> ${out} (${info.width}x${info.height}, ${info.size} bytes)`);
}
