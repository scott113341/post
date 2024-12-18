import React from "react";
import ReactDomServer from "react-dom/server";
import { Canvg, presets } from "canvg";
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
} from "../constants";

export default async function renderBack({
  size,
  message,
  isPreview,
  fromAddress = null,
  toAddress = null,
  scale = 300,
}) {
  const { width, height } = size;
  const d = (v) => (v * scale).toFixed(6);

  // Use Canvg to manually calculate what the postcard lines should
  // be, since SVG can't do text wrapping (well, it can if you use
  // foreignObject, but we can't use that because we can't render an
  // image from the Canvas if it contains a foreignObject...
  const lines = await (async () => {
    const svg = makeSVG({
      size,
      message,
      lines: [],
      fromAddress,
      toAddress,
      isPreview: true,
    });

    // Init SVG canvas
    const preset = presets.offscreen();
    const canvas = new OffscreenCanvas(d(width), d(height));
    const ctx = canvas.getContext("2d");
    const canvasThing = new Canvg(ctx, svg, preset);
    await canvasThing.render();

    // States:
    // - NEW_LINE
    //   - Word fits => add word
    //   - Word doesn't fit => add as many characters w/ hyphen
    //   - No word => done
    // - EXISTING_LINE
    //   - Word fits => add word
    //   - Word doesn't fit
    //     - Word fits on next line => new line
    //     - Word won't fit on next line => add as many characters w/ hyphen
    //   - Space fits => add space
    //   - Space doesn't fit => drop space
    //   - No word => done
    // - DONE
    //   - Add the final line if it has chars

    const lines = [];
    let state = "NEW_LINE";
    let currentLine = "";
    let nextLine = "";

    const currentLineIndex = () => lines.length;

    const maxWidthForLine = (lineIndex) => {
      const addressBox = canvasThing.documentElement.children.find(
        (e) => e.getAttribute("id")?.value === "addressBox",
      );
      const addressBoxBB = addressBox.getBoundingBox();

      // The "lowest" this line gets on the page (maximum Y coordinate)
      const lineMaxY =
        BLEED + TEXT_BLEED + message.fontSpacing * (lineIndex + 1);

      if (lineMaxY >= addressBoxBB.y1 - TEXT_BLEED) {
        // Line is far enough down postcard to collide with address box
        return addressBoxBB.x1 - BLEED - TEXT_BLEED * 1.5;
      } else {
        // Line is high enough to not collide with address box
        return size.width - BLEED - TEXT_BLEED * 2;
      }
    };

    const getTextWidth = (text) => {
      return canvasThing.documentElement.children[0].measureTargetText(
        ctx,
        text,
      );
    };

    const isLineBreak = (chars) => chars === "\n";

    const charsFit = (chars) => {
      const testLine = currentLine + chars;
      const width = getTextWidth(testLine);
      const maxWidth = maxWidthForLine(currentLineIndex());
      return width <= maxWidth;
    };

    const charsFitEntirelyOnNextLine = (chars) => {
      const width = getTextWidth(chars);
      const nextLineMaxWidth = maxWidthForLine(currentLineIndex() + 1);
      return width <= nextLineMaxWidth;
    };

    const addCharsWithHyphen = (chars) => {
      const maxWidth = maxWidthForLine(currentLineIndex());
      let remaining = chars;

      while (true) {
        const char = remaining.at(0);
        const newTestLine = currentLine + char + "-";
        const newTestWidth = getTextWidth(newTestLine);

        if (newTestWidth > maxWidth) {
          currentLine += "-";
          break;
        } else {
          remaining = remaining.slice(1);
          currentLine += char;
        }
      }

      return remaining;
    };

    const regex = /\S+|\s/g;
    const getNextChunk = () => {
      const chunk = regex.exec(message.content);
      return chunk === null ? chunk : chunk[0];
    };

    while (true) {
      if (state === "NEW_LINE") {
        const chunk = nextLine.length ? nextLine : getNextChunk();
        nextLine = "";

        if (chunk === null) {
          state = "DONE";
        } else if (isLineBreak(chunk)) {
          lines.push("");
          currentLine = "";
          state = "NEW_LINE";
        } else if (charsFit(chunk)) {
          currentLine = chunk;
          state = "EXISTING_LINE";
        } else {
          nextLine = addCharsWithHyphen(chunk);
          lines.push(currentLine);
          currentLine = "";
          state = "NEW_LINE";
        }
      } else if (state === "EXISTING_LINE") {
        const chunk = getNextChunk();

        if (chunk === null) {
          state = "DONE";
        } else if (isLineBreak(chunk)) {
          lines.push(currentLine);
          currentLine = "";
          nextLine = "";
          state = "NEW_LINE";
        } else if (charsFit(chunk)) {
          currentLine += chunk;
          nextLine = "";
          state = "EXISTING_LINE";
        } else if (!charsFitEntirelyOnNextLine(chunk)) {
          nextLine = addCharsWithHyphen(chunk);
          lines.push(currentLine);
          currentLine = "";
          state = "NEW_LINE";
        } else {
          lines.push(currentLine);
          currentLine = "";
          nextLine = chunk;
          state = "NEW_LINE";
        }
      } else if (state === "DONE") {
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }
        break;
      } else {
        throw "wut";
      }
    }

    return lines;
  })();

  const svg = makeSVG({
    size,
    message,
    lines,
    fromAddress,
    toAddress,
    isPreview,
  });
  svg.documentElement.setAttribute("width", d(width));
  svg.documentElement.setAttribute("height", d(height));

  // Render SVG to PNG blob
  const preset = presets.offscreen();
  const canvas = new OffscreenCanvas(d(width), d(height));
  const ctx = canvas.getContext("2d");
  const canvasThing = new Canvg(ctx, svg, preset);
  await canvasThing.render();
  return canvas.convertToBlob();
}

function makeSVG({ size, message, lines, fromAddress, toAddress, isPreview }) {
  const { width, height } = size;

  // Make SVG in React
  const startingSvgReact = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <text
        id={"emptyTextForMeasuring"}
        x={BLEED + TEXT_BLEED}
        y={BLEED + TEXT_BLEED + message.fontSpacing}
        fontSize={message.fontSize}
        fontFamily={message.font}
      >
        {" "}
      </text>

      {lines.map((line, idx) => (
        <text
          x={BLEED + TEXT_BLEED}
          y={BLEED + TEXT_BLEED + message.fontSpacing * (idx + 1)}
          fontSize={message.fontSize}
          fontFamily={message.font}
        >
          {line}
        </text>
      ))}

      {isPreview && (
        <rect
          id={"postage"}
          width={POSTAGE_WIDTH}
          height={POSTAGE_HEIGHT}
          x={size.postageLeft}
          y={size.postageTop}
          fill="#aaa"
          stroke="black"
          strokeWidth={0.01}
        />
      )}

      {isPreview && (
        <rect
          id={"addressBox"}
          width={size.addressWidth}
          height={ADDRESS_HEIGHT}
          x={size.addressLeft}
          y={size.addressTop}
          fill="none"
          stroke="black"
          strokeWidth={0.01}
        />
      )}

      {isPreview && (
        <svg
          x={size.addressLeft + ADDRESS_PADDING_LEFT}
          y={
            size.addressTop + ADDRESS_FROM_PADDING_TOP + ADDRESS_FROM_FONT_SIZE
          }
          fontSize={ADDRESS_FROM_FONT_SIZE}
          fontFamily={ADDRESS_FONT}
        >
          {formatAddress(fromAddress, ADDRESS_FROM_FONT_SIZE)}
        </svg>
      )}

      {isPreview && (
        <svg
          x={size.addressLeft + ADDRESS_PADDING_LEFT}
          y={size.addressTop + ADDRESS_TO_PADDING_TOP + ADDRESS_TO_FONT_SIZE}
          fontSize={ADDRESS_TO_FONT_SIZE}
          fontFamily={ADDRESS_FONT}
        >
          {formatAddress(toAddress, ADDRESS_TO_FONT_SIZE)}
        </svg>
      )}
    </svg>
  );

  // Convert into SVG string
  const startingSvgStr =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    ReactDomServer.renderToStaticMarkup(startingSvgReact);

  // Parse into SVG document
  const parser = new DOMParser();
  return parser.parseFromString(startingSvgStr, "image/svg+xml");
}

function formatAddress(a, fontSize) {
  const cityStateZip =
    `${a.addressCity}, ${a.addressState} ${a.addressZip}`.toUpperCase();

  if (a.addressLine2) {
    return (
      <g>
        <text>{a.addressName.toUpperCase()}</text>
        <text dy={fontSize}>{a.addressLine1.toUpperCase()}</text>
        <text dy={fontSize * 2}>{a.addressLine2.toUpperCase()}</text>
        <text dy={fontSize * 3}>{cityStateZip}</text>
      </g>
    );
  } else {
    return (
      <g>
        <text>{a.addressName.toUpperCase()}</text>
        <text dy={fontSize}>{a.addressLine1.toUpperCase()}</text>
        <text dy={fontSize * 2}>{cityStateZip}</text>
      </g>
    );
  }
}
