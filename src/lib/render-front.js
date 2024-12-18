import React from "react";
import { Canvg, presets } from "canvg";
import ReactDomServer from "react-dom/server";

export default async function renderFront({
  image,
  size,
  isPreview,
  scale = 300,
}) {
  const { width, height } = size;
  const d = (v) => (v * scale).toFixed(6);

  const rotate = image.width < image.height;

  let trimSides, degrees, scaled, translate;
  if (rotate) {
    trimSides = image.width / image.height < height / width;
    degrees = [90, image.height / 2, image.height / 2];
    scaled = trimSides ? d(height) / image.width : d(width) / image.height;
    translate = trimSides
      ? [-((scaled * image.height - d(width)) / 2), 0]
      : [0, -((scaled * image.width - d(height)) / 2)];
  } else {
    trimSides = image.width / image.height > width / height;
    degrees = [0];
    scaled = trimSides ? d(height) / image.height : d(width) / image.width;
    translate = trimSides
      ? [-((scaled * image.width - d(width)) / 2), 0]
      : [0, -((scaled * image.height - d(height)) / 2)];
  }

  // Make SVG in React
  const svgReact = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={d(width)}
      height={d(height)}
      viewBox={`0 0 ${d(width)} ${d(height)}`}
    >
      <image
        width={image.width}
        height={image.height}
        transform={`translate(${translate.join(" ")}) scale(${scaled}) rotate(${degrees.join(" ")})`}
        href={image.data}
      />
    </svg>
  );

  // Convert into SVG string
  const svgStr =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    ReactDomServer.renderToStaticMarkup(svgReact);

  // Parse into SVG document
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgStr, "image/svg+xml");

  // Render SVG to PNG blob
  const preset = presets.offscreen();
  const canvas = new OffscreenCanvas(d(width), d(height));
  const ctx = canvas.getContext("2d");
  const canvasThing = new Canvg(ctx, svg, preset);
  await canvasThing.render();
  return await canvas.convertToBlob();
}
