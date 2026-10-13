// Re-encodes the undithered brand artwork used on the linked pages for the
// runtime dither shader. Sources sit beside this repo, in
// ../brand-artwork-concepts/round-2-cropped (3:2) and its portrait-9x16 folder.
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const source = "../brand-artwork-concepts/round-2-cropped";
const landscape = [
  "01-signature",
  "03-door-and-key",
  "04-headphones",
  "05-hand-mirror",
  "06-curtain",
  "07-envelope",
  "08-hood",
  "09-mug",
  "11-picture-frame",
  "12-searching",
  "13-panels",
  "14-scissors",
  "15-ring-light",
];
const portrait = [
  "02-phone-call",
  "05-hand-mirror",
  "07-envelope",
  "15-ring-light",
];

await mkdir("public/artwork/portrait", { recursive: true });
const jobs = [
  ...landscape.map((name) => [`${source}/${name}.png`, name]),
  ...portrait.map((name) => [
    `${source}/portrait-9x16/${name}.png`,
    `portrait/${name}`,
  ]),
];
for (const [file, name] of jobs) {
  // The number prefix orders the concepts; the site refers to them by name.
  const out = `public/artwork/${name.replace(/\d+-/, "")}.webp`;
  const info = await sharp(file).webp({ quality: 90, effort: 6 }).toFile(out);
  console.log(
    `${file} -> ${out} (${info.width}x${info.height}, ${info.size} bytes)`,
  );
}
