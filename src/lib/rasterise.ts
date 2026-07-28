import { Canvg, presets } from "canvg";

/**
 * canvg does not typecheck against its own IOptions: the offscreen preset's
 * createCanvas returns an OffscreenCanvas, whose getContext("2d") is nullable,
 * while IOptions demands a non-nullable one.
 */
const OFFSCREEN_PRESET = presets.offscreen() as ConstructorParameters<typeof Canvg>[2];

export interface Rasterised {
  canvas: OffscreenCanvas;
  ctx: OffscreenCanvasRenderingContext2D;
  canvg: Canvg;
}

/** Parses SVG markup into a document canvg can consume. */
export function parseSvg(markup: string): Document {
  return new DOMParser().parseFromString(
    `<?xml version="1.0" encoding="UTF-8"?>${markup}`,
    "image/svg+xml",
  );
}

export async function rasterise(svg: Document, width: number, height: number): Promise<Rasterised> {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get a 2D canvas context");

  const instance = new Canvg(ctx, svg, OFFSCREEN_PRESET);
  await instance.render();

  return { canvas, ctx, canvg: instance };
}
