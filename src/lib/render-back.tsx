import type { Canvg } from "canvg";
import { renderToStaticMarkup } from "react-dom/server";

import {
  ADDRESS_FONT,
  ADDRESS_FROM_FONT_SIZE,
  ADDRESS_FROM_PADDING_TOP,
  ADDRESS_HEIGHT,
  ADDRESS_PADDING_LEFT,
  ADDRESS_TO_FONT_SIZE,
  ADDRESS_TO_PADDING_TOP,
  BLEED,
  POSTAGE_HEIGHT,
  POSTAGE_WIDTH,
  TEXT_BLEED,
} from "../constants.ts";
import type { Address, Message, PostcardSize } from "../types.ts";
import { parseSvg, rasterise } from "./rasterise.ts";
import { wrapText } from "./wrap-text.ts";

/**
 * Canvg parses the SVG into its own element tree, but keeps `documentElement`
 * private and `measureTargetText` protected. Both drive the final raster, so we
 * reach in through narrow structural types rather than reimplementing text
 * measurement and risking wrap decisions that disagree with what gets printed.
 */
interface CanvgBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface CanvgNode {
  getAttribute(name: string): { value: string } | undefined;
  getBoundingBox(): CanvgBox;
  measureTargetText(ctx: OffscreenCanvasRenderingContext2D, text: string): number;
}

function documentElementOf(instance: Canvg): { children: CanvgNode[] } {
  return (instance as unknown as { documentElement: { children: CanvgNode[] } }).documentElement;
}

export interface RenderBackOptions {
  size: PostcardSize;
  message: Message;
  /** Draws the postage and address guides, which Lob adds itself when false. */
  isPreview: boolean;
  fromAddress: Address | null;
  toAddress: Address | null;
  /** Output resolution, in pixels per inch. */
  scale?: number;
}

export default async function renderBack({
  size,
  message,
  isPreview,
  fromAddress = null,
  toAddress = null,
  scale = 300,
}: RenderBackOptions): Promise<Blob> {
  const { width, height } = size;
  const px = (inches: number) => Number((inches * scale).toFixed(6));

  // Measuring pass. Always built as a preview so the address box exists to
  // measure against, even when the final render omits it.
  const measuringSvg = makeSvg({
    size,
    message,
    lines: [],
    fromAddress,
    toAddress,
    isPreview: true,
  });
  const measuring = await rasterise(measuringSvg, px(width), px(height));
  const children = documentElementOf(measuring.canvg).children;

  const addressBox = children.find((child) => child.getAttribute("id")?.value === "addressBox");
  if (!addressBox) throw new Error("Measuring SVG is missing its address box");

  // Hoisted out of the measure callbacks: this used to be re-scanned and
  // re-measured once per word.
  const addressBounds = addressBox.getBoundingBox();
  const textProbe = children[0];
  if (!textProbe) throw new Error("Measuring SVG is missing its text probe");

  const lines = wrapText({
    content: message.content,
    measureText: (text) => textProbe.measureTargetText(measuring.ctx, text),
    maxWidthForLine: (lineIndex) => {
      // How far down the postcard this line reaches.
      const lineMaxY = BLEED + TEXT_BLEED + message.fontSpacing * (lineIndex + 1);

      return lineMaxY >= addressBounds.y1 - TEXT_BLEED
        ? // Low enough to collide with the address block, so stop short of it.
          addressBounds.x1 - BLEED - TEXT_BLEED * 1.5
        : // Clears the address block, so the full trim width is available.
          width - BLEED * 2 - TEXT_BLEED * 2;
    },
  });

  const svg = makeSvg({
    size,
    message,
    lines,
    fromAddress,
    toAddress,
    isPreview,
  });
  svg.documentElement.setAttribute("width", String(px(width)));
  svg.documentElement.setAttribute("height", String(px(height)));

  const final = await rasterise(svg, px(width), px(height));
  return final.canvas.convertToBlob();
}

interface MakeSvgOptions {
  size: PostcardSize;
  message: Message;
  lines: string[];
  fromAddress: Address | null;
  toAddress: Address | null;
  isPreview: boolean;
}

function makeSvg({
  size,
  message,
  lines,
  fromAddress,
  toAddress,
  isPreview,
}: MakeSvgOptions): Document {
  const { width, height } = size;

  const svg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Kept first and non-empty: wrapText measures against this element. */}
      <text
        id="emptyTextForMeasuring"
        x={BLEED + TEXT_BLEED}
        y={BLEED + TEXT_BLEED + message.fontSpacing}
        fontSize={message.fontSize}
        fontFamily={message.font}
      >
        {" "}
      </text>

      {lines.map((line, index) => (
        <text
          key={index}
          x={BLEED + TEXT_BLEED}
          y={BLEED + TEXT_BLEED + message.fontSpacing * (index + 1)}
          fontSize={message.fontSize}
          fontFamily={message.font}
        >
          {line}
        </text>
      ))}

      {isPreview && (
        <>
          <rect
            id="postage"
            width={POSTAGE_WIDTH}
            height={POSTAGE_HEIGHT}
            x={size.postageLeft}
            y={size.postageTop}
            fill="#aaa"
            stroke="black"
            strokeWidth={0.01}
          />

          <rect
            id="addressBox"
            width={size.addressWidth}
            height={ADDRESS_HEIGHT}
            x={size.addressLeft}
            y={size.addressTop}
            fill="none"
            stroke="black"
            strokeWidth={0.01}
          />

          {fromAddress && (
            <g
              transform={`translate(${size.addressLeft + ADDRESS_PADDING_LEFT}, ${size.addressTop + ADDRESS_FROM_PADDING_TOP + ADDRESS_FROM_FONT_SIZE})`}
              fontSize={ADDRESS_FROM_FONT_SIZE}
              fontFamily={ADDRESS_FONT}
            >
              <AddressLines address={fromAddress} fontSize={ADDRESS_FROM_FONT_SIZE} />
            </g>
          )}

          {toAddress && (
            <g
              transform={`translate(${size.addressLeft + ADDRESS_PADDING_LEFT}, ${size.addressTop + ADDRESS_TO_PADDING_TOP + ADDRESS_TO_FONT_SIZE})`}
              fontSize={ADDRESS_TO_FONT_SIZE}
              fontFamily={ADDRESS_FONT}
            >
              <AddressLines address={toAddress} fontSize={ADDRESS_TO_FONT_SIZE} />
            </g>
          )}
        </>
      )}
    </svg>
  );

  return parseSvg(renderToStaticMarkup(svg));
}

function AddressLines({ address, fontSize }: { address: Address; fontSize: number }) {
  const cityStateZip = `${address.addressCity}, ${address.addressState} ${address.addressZip}`;
  const lines = [
    address.addressName,
    address.addressLine1,
    address.addressLine2,
    cityStateZip,
  ].filter((line) => line.trim().length > 0);

  return (
    <g>
      {lines.map((line, index) => (
        <text key={index} dy={fontSize * index}>
          {line.toUpperCase()}
        </text>
      ))}
    </g>
  );
}
