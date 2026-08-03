/**
 * Greedy line-breaking with hyphenation for postcard messages.
 *
 * SVG cannot wrap text on its own (foreignObject can, but Canvg refuses to
 * rasterise a document containing one), so the message is measured and broken
 * into explicit lines here before being emitted as one <text> per line.
 *
 * Measurement is injected so this stays a pure function: the real renderer
 * passes a Canvg-backed measurer, and tests pass a simple synthetic one.
 */
export interface WrapTextOptions {
  content: string;
  /** Rendered width of `text`, in the same units as `maxWidthForLine`. */
  measureText: (text: string) => number;
  /**
   * Maximum width available to the line at `lineIndex`. This varies down the
   * postcard, because lines low enough to reach the address block are short.
   */
  maxWidthForLine: (lineIndex: number) => number;
}

type State = "NEW_LINE" | "EXISTING_LINE" | "DONE";

const isLineBreak = (chunk: string) => chunk === "\n";

export function wrapText({ content, measureText, maxWidthForLine }: WrapTextOptions): string[] {
  const lines: string[] = [];
  let state: State = "NEW_LINE";
  let currentLine = "";
  let pending = "";

  // Each chunk is either a run of non-whitespace or a single whitespace
  // character, so newlines arrive as their own chunk.
  const chunks = /\S+|\s/g;
  const nextChunk = (): string | null => chunks.exec(content)?.[0] ?? null;

  const fitsOnCurrentLine = (chunk: string) =>
    measureText(currentLine + chunk) <= maxWidthForLine(lines.length);

  const fitsAloneOnNextLine = (chunk: string) =>
    measureText(chunk) <= maxWidthForLine(lines.length + 1);

  /**
   * Fills the current line with as much of `chunk` as fits, leaving room for a
   * trailing hyphen, and returns whatever is left over. Always consumes at
   * least one character so an unbreakably narrow line cannot loop forever.
   */
  const hyphenate = (chunk: string): string => {
    const maxWidth = maxWidthForLine(lines.length);
    let remaining = chunk;

    while (remaining.length > 0) {
      const char = remaining[0]!;
      if (currentLine.length > 0 && measureText(`${currentLine}${char}-`) > maxWidth) {
        break;
      }
      currentLine += char;
      remaining = remaining.slice(1);
    }

    currentLine += "-";
    return remaining;
  };

  for (;;) {
    if (state === "NEW_LINE") {
      const chunk = pending.length > 0 ? pending : nextChunk();
      pending = "";

      if (chunk === null) {
        state = "DONE";
      } else if (isLineBreak(chunk)) {
        lines.push("");
      } else if (fitsOnCurrentLine(chunk)) {
        currentLine = chunk;
        state = "EXISTING_LINE";
      } else {
        pending = hyphenate(chunk);
        lines.push(currentLine);
        currentLine = "";
      }
    } else if (state === "EXISTING_LINE") {
      const chunk = nextChunk();

      if (chunk === null) {
        state = "DONE";
      } else if (isLineBreak(chunk)) {
        lines.push(currentLine);
        currentLine = "";
        pending = "";
        state = "NEW_LINE";
      } else if (fitsOnCurrentLine(chunk)) {
        currentLine += chunk;
        pending = "";
      } else if (fitsAloneOnNextLine(chunk)) {
        lines.push(currentLine);
        currentLine = "";
        pending = chunk;
        state = "NEW_LINE";
      } else {
        pending = hyphenate(chunk);
        lines.push(currentLine);
        currentLine = "";
        state = "NEW_LINE";
      }
    } else {
      if (currentLine.length > 0) lines.push(currentLine);
      return lines;
    }
  }
}
