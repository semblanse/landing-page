"use client";
/*
Runtime port of Figma's first-party "Dither" shader effect
(library id f5c0a2ff-247f-434e-ada4-ecce79213874, version 48a63bf8), which
every artwork layer in Revision 3 uses. Figma runs it as three WebGPU passes:
load (sample the layer at block centres), dither, present (upscale blocks).
Only the ordered (Bayer) family is used in the file, and that family is a
pure per-block function, so it runs here as one WebGL fragment pass over a
canvas whose pixels are the blocks. CSS upscales it with crisp edges.
*/
import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";

type Algorithm = "Bayer 2x2" | "Bayer 4x4" | "Bayer 8x8" | "Bayer 16x16";

export type DitherSettings = {
  algorithm?: Algorithm;
  /** Block size in CSS pixels. */
  pixelSize?: number;
  levels?: number;
  /** Percent, as in Figma's panel. 100 leaves the layer unchanged. */
  brightness?: number;
  contrast?: number;
};

// The settings on the Figma layers.
export const artworkDither: DitherSettings = {
  algorithm: "Bayer 2x2",
  pixelSize: 2,
  levels: 4,
  brightness: 100,
};
// The hero layer (549:2783) is the same effect, a little brighter.
export const heroDither: DitherSettings = { ...artworkDither, brightness: 111 };

// Same recursion and quadrant order as the Figma source.
function bayerMatrix(n: number): number[][] {
  if (n === 1) return [[0]];
  const small = bayerMatrix(n / 2);
  const m = n / 2;
  const out: number[][] = [];
  for (let y = 0; y < n; y++) {
    out[y] = [];
    for (let x = 0; x < n; x++) {
      const qx = Math.floor(x / m);
      const qy = Math.floor(y / m);
      const offset = qy === 0 ? (qx === 0 ? 0 : 2) : qx === 0 ? 3 : 1;
      out[y][x] = small[y % m][x % m] * 4 + offset;
    }
  }
  return out;
}

const vertex = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;
const fragment = `precision highp float;
uniform sampler2D uLayer;
uniform sampler2D uTile;
uniform vec2 uSize;
uniform float uTileSize;
uniform float uLevels;
uniform float uBright;
uniform float uContrast;
uniform float uCoarse;
void main() {
  // Block coordinates from the top left, as in the Figma compute pass.
  vec2 cell = vec2(floor(gl_FragCoord.x), uSize.y - 1.0 - floor(gl_FragCoord.y));
  vec2 block = floor(cell / uCoarse);
  vec2 centre = min(block * uCoarse + floor(uCoarse * 0.5), uSize - 1.0);
  vec4 s = texture2D(uLayer, (centre + 0.5) / uSize);
  vec3 c = s.a > 0.0 ? s.rgb / s.a : vec3(0.0);
  c = clamp((c - 0.5) * uContrast + 0.5 + uBright, 0.0, 1.0);
  float rank = texture2D(uTile, (mod(block, uTileSize) + 0.5) / uTileSize).r * 255.0;
  float threshold = (rank + 0.5) / (uTileSize * uTileSize);
  float steps = uLevels - 1.0;
  vec3 q = clamp(floor((c + (threshold - 0.5) / steps) * steps + 0.5) / steps, 0.0, 1.0);
  gl_FragColor = vec4(q * s.a, s.a);
}`;

type Painter = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) => void;

function createRenderer(canvas: HTMLCanvasElement, settings: DitherSettings) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
  });
  if (!gl) return null;
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const nearest = (texture: WebGLTexture | null, wrap: number) => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
  };

  const tileSize = Number((settings.algorithm ?? "Bayer 2x2").split("x")[1]);
  const ranks = new Uint8Array(bayerMatrix(tileSize).flat());
  gl.activeTexture(gl.TEXTURE1);
  nearest(gl.createTexture(), gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.LUMINANCE,
    tileSize,
    tileSize,
    0,
    gl.LUMINANCE,
    gl.UNSIGNED_BYTE,
    ranks,
  );

  gl.activeTexture(gl.TEXTURE0);
  nearest(gl.createTexture(), gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform1i(uniform("uLayer"), 0);
  gl.uniform1i(uniform("uTile"), 1);
  gl.uniform1f(uniform("uTileSize"), tileSize);
  gl.uniform1f(uniform("uLevels"), settings.levels ?? 4);
  gl.uniform1f(uniform("uBright"), ((settings.brightness ?? 100) - 100) / 200);
  gl.uniform1f(uniform("uContrast"), settings.contrast ?? 1);
  const size = uniform("uSize");
  const coarse = uniform("uCoarse");
  const layer = document.createElement("canvas");
  let ready = false;

  return {
    /** Rasterise the layer at block resolution, then keep it as a texture. */
    setLayer(width: number, height: number, paint: Painter) {
      layer.width = canvas.width = width;
      layer.height = canvas.height = height;
      const ctx = layer.getContext("2d")!;
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingQuality = "high";
      paint(ctx, width, height);
      gl.viewport(0, 0, width, height);
      gl.uniform2f(size, width, height);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        layer,
      );
      ready = true;
    },
    draw(blockScale = 1) {
      if (!ready) return;
      gl.uniform1f(coarse, Math.max(1, Math.round(blockScale)));
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
  };
}

/**
 * Shared canvas lifecycle. `paint` draws the undithered layer; the returned
 * state says whether the dithered canvas is showing or the fallback should.
 */
function useDither(
  settings: DitherSettings,
  paint: Painter | null,
  coarse?: MotionValue<number>,
  intro = false,
) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"pending" | "ready" | "failed">("pending");
  const paintRef = useRef(paint);
  useEffect(() => {
    paintRef.current = paint;
  });
  const hasPaint = paint !== null;

  useEffect(() => {
    const box = wrap.current;
    const target = canvas.current;
    if (!box || !target || !hasPaint) return;
    const renderer = createRenderer(target, settings);
    if (!renderer) {
      setState("failed");
      return;
    }
    const block = settings.pixelSize ?? 2;
    let introScale = intro ? 8 : 1;
    let frame = 0;
    const draw = () =>
      renderer.draw(Math.max(coarse ? coarse.get() : 1, introScale));
    const layout = () => {
      const width = Math.ceil(box.clientWidth / block);
      const height = Math.ceil(box.clientHeight / block);
      if (!width || !height || !paintRef.current) return;
      // Whole blocks only, so every block is the same size on screen.
      target.style.width = `${width * block}px`;
      target.style.height = `${height * block}px`;
      renderer.setLayer(width, height, (ctx, w, h) => {
        ctx.scale(1 / block, 1 / block);
        paintRef.current?.(ctx, w * block, h * block);
      });
      draw();
      setState("ready");
    };
    layout();
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(layout);
    });
    observer.observe(box);
    const stopCoarse = coarse?.on("change", draw);

    // The artwork resolves from large blocks to the final 2px grain.
    let introFrame = 0;
    if (
      intro &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 900);
        introScale = 1 + Math.round(7 * (1 - t) ** 3);
        draw();
        if (t < 1) introFrame = requestAnimationFrame(step);
      };
      introFrame = requestAnimationFrame(step);
    } else {
      introScale = 1;
    }
    return () => {
      observer.disconnect();
      stopCoarse?.();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(introFrame);
    };
    // Settings are constants per call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPaint, coarse, intro]);

  return { wrap, canvas, state };
}

export function DitherImage({
  src,
  alt,
  className = "",
  position = [0.5, 0.5],
  flipX = false,
  priority = false,
  settings = artworkDither,
  coarse,
  intro = false,
}: {
  src: string;
  alt: string;
  className?: string;
  /** Focal point for the cover crop, 0 to 1 on each axis. */
  position?: [number, number];
  flipX?: boolean;
  priority?: boolean;
  settings?: DitherSettings;
  /** Block scale, 1 at rest. Larger values group blocks for a coarse reveal. */
  coarse?: MotionValue<number>;
  intro?: boolean;
}) {
  const image = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (image.current?.complete && image.current.naturalWidth) setLoaded(true);
  }, []);
  const [px, py] = position;
  const paint: Painter | null = loaded
    ? (ctx, width, height) => {
        const img = image.current;
        if (!img) return;
        const scale = Math.max(
          width / img.naturalWidth,
          height / img.naturalHeight,
        );
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        if (flipX) {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(img, (width - w) * px, (height - h) * py, w, h);
      }
    : null;
  const { wrap, canvas, state } = useDither(settings, paint, coarse, intro);
  return (
    <div ref={wrap} className={`dither ${className}`} data-dither={state}>
      <img
        ref={image}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        onLoad={() => setLoaded(true)}
        style={{
          objectPosition: `${px * 100}% ${py * 100}%`,
          transform: flipX ? "scaleX(-1)" : undefined,
        }}
      />
      <canvas ref={canvas} aria-hidden="true" />
    </div>
  );
}
