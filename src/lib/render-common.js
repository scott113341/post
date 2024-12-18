import { BLEED } from "../constants";
import { Canvg, presets } from "canvg";

export function setSvgDocumentProps(svg, width, height, scale, isPreview) {
  const d = (v) => (v * scale).toFixed(6);

  const renderWidth = isPreview ? width - d(BLEED * 2) : width;
  const renderHeight = isPreview ? height - d(BLEED * 2) : width;
  const renderViewbox = isPreview
    ? `${d(BLEED)} ${d(BLEED)} ${width} ${height}`
    : `0 0 ${width} ${height}`;

  console.log({
    renderWidth,
    renderHeight,
    renderViewbox,
  });

  svg.documentElement.setAttribute("width", renderWidth);
  svg.documentElement.setAttribute("height", renderHeight);
  svg.documentElement.setAttribute("viewBox", renderViewbox);
}

export async function renderCropped(svg, width, height) {
  const preset = presets.offscreen();
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const canvasThing = new Canvg(ctx, svg, preset);
  await canvasThing.render();
  return await canvas.convertToBlob();
}
