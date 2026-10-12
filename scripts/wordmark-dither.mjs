// Prints the dither tile for the footer wordmark as a CSS data URI.
//
// The wordmark is one flat colour, and Figma's ordered dither is a pure
// function of each block, so its result over that colour is a repeating
// 16 by 16 tile. The footer paints real text with this tile, which gives the
// Figma effect (layer 549:3447: Bayer 16x16, 4 levels, brightness 131)
// without drawing the word as an image.
import sharp from "sharp";

const colour = [0x1f, 0x6f, 0x22];
const levels = 4;
const brightness = 131;
const size = 16;

// Same recursion and quadrant order as the Figma shader source.
function bayer(n) {
  if (n === 1) return [[0]];
  const small = bayer(n / 2);
  const m = n / 2;
  return Array.from({ length: n }, (_, y) =>
    Array.from({ length: n }, (_, x) => {
      const qx = Math.floor(x / m);
      const qy = Math.floor(y / m);
      const offset = qy === 0 ? (qx === 0 ? 0 : 2) : qx === 0 ? 3 : 1;
      return small[y % m][x % m] * 4 + offset;
    }),
  );
}

const steps = levels - 1;
const bright = (brightness - 100) / 200;
const pixels = Buffer.alloc(size * size * 3);
bayer(size).forEach((row, y) =>
  row.forEach((rank, x) => {
    const threshold = (rank + 0.5) / (size * size);
    colour.forEach((channel, i) => {
      const c = Math.min(1, Math.max(0, channel / 255 + bright));
      const q = Math.round((c + (threshold - 0.5) / steps) * steps) / steps;
      pixels[(y * size + x) * 3 + i] = Math.round(
        Math.min(1, Math.max(0, q)) * 255,
      );
    });
  }),
);
const png = await sharp(pixels, {
  raw: { width: size, height: size, channels: 3 },
})
  .png({ palette: true, compressionLevel: 9 })
  .toBuffer();
console.log(`url("data:image/png;base64,${png.toString("base64")}")`);
