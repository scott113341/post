import { renderToStaticMarkup } from "react-dom/server";

import type { PostcardImage, PostcardSize } from "../types.ts";
import { parseSvg, rasterise } from "./rasterise.ts";

export interface RenderFrontOptions {
  image: PostcardImage;
  size: PostcardSize;
  /** Output resolution, in pixels per inch. */
  scale?: number;
}

/**
 * Scales the chosen photo to cover the full postcard front, cropping the
 * overflowing axis and rotating portrait images a quarter turn.
 */
export default async function renderFront({
  image,
  size,
  scale = 300,
}: RenderFrontOptions): Promise<Blob> {
  const { width, height } = size;
  const px = (inches: number) => Number((inches * scale).toFixed(6));

  const rotate = image.width < image.height;
  const aspect = image.width / image.height;

  let trimSides: boolean;
  let degrees: number[];
  let scaled: number;
  let translate: [number, number];

  if (rotate) {
    trimSides = aspect < height / width;
    degrees = [90, image.height / 2, image.height / 2];
    scaled = trimSides ? px(height) / image.width : px(width) / image.height;
    translate = trimSides
      ? [-((scaled * image.height - px(width)) / 2), 0]
      : [0, -((scaled * image.width - px(height)) / 2)];
  } else {
    trimSides = aspect > width / height;
    degrees = [0];
    scaled = trimSides ? px(height) / image.height : px(width) / image.width;
    translate = trimSides
      ? [-((scaled * image.width - px(width)) / 2), 0]
      : [0, -((scaled * image.height - px(height)) / 2)];
  }

  const svg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={px(width)}
      height={px(height)}
      viewBox={`0 0 ${px(width)} ${px(height)}`}
    >
      <image
        width={image.width}
        height={image.height}
        transform={`translate(${translate.join(" ")}) scale(${scaled}) rotate(${degrees.join(" ")})`}
        href={image.data}
      />
    </svg>
  );

  const document = parseSvg(renderToStaticMarkup(svg));
  const { canvas } = await rasterise(document, px(width), px(height));
  return canvas.convertToBlob();
}
