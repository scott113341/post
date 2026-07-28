import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { wrapText } from "./wrap-text.ts";

/** Synthetic monospace measurer: one unit per character. */
const measureText = (text: string) => text.length;

const wrapAt = (content: string, maxWidth: number) =>
  wrapText({ content, measureText, maxWidthForLine: () => maxWidth });

/** Full width until the message reaches the address block, then short. */
const narrowsAt = (firstNarrowLine: number, wide: number, narrow: number) => (lineIndex: number) =>
  lineIndex < firstNarrowLine ? wide : narrow;

function assertLinesFit(lines: string[], maxWidthForLine: (lineIndex: number) => number) {
  for (const [index, line] of lines.entries()) {
    assert.ok(
      measureText(line) <= maxWidthForLine(index),
      `line ${index} (${JSON.stringify(line)}) exceeds its budget`,
    );
  }
}

describe("wrapText", () => {
  it("returns no lines for empty content", () => {
    assert.deepEqual(wrapAt("", 10), []);
  });

  it("keeps content that fits on a single line", () => {
    assert.deepEqual(wrapAt("hello there", 20), ["hello there"]);
  });

  it("breaks at word boundaries when a word would overflow", () => {
    assert.deepEqual(wrapAt("aaa bbb ccc", 7), ["aaa bbb", " ccc"]);
  });

  it("preserves explicit line breaks", () => {
    assert.deepEqual(wrapAt("a\nb", 10), ["a", "b"]);
  });

  it("preserves blank lines between paragraphs", () => {
    assert.deepEqual(wrapAt("a\n\nb", 10), ["a", "", "b"]);
  });

  it("hyphenates a word too long for any line", () => {
    assert.deepEqual(wrapAt("aaaaaaaaaa", 5), ["aaaa-", "aaaa-", "aa"]);
  });

  it("terminates when no character fits alongside a hyphen", () => {
    // Guards a hang in the original implementation: at this width the
    // hyphenation pass could consume zero characters and loop forever.
    assert.deepEqual(wrapAt("abc", 1), ["a-", "b-", "c"]);
  });

  it("narrows lines that reach the address block", () => {
    const maxWidthForLine = narrowsAt(2, 12, 4);
    const lines = wrapText({
      content: "one two three four five six seven",
      measureText,
      maxWidthForLine,
    });

    assertLinesFit(lines, maxWidthForLine);
  });
});

describe("wrapText with a realistic message", () => {
  // Deliberately includes unbreakable runs far longer than any line.
  const MESSAGE = `Hi Rico,

Greetings from Santorini! The views here are absolutely breathtaking; the whitewashed buildings with their blue domes seem to tumble down the cliffs, and the Aegean Sea stretches endlessly in every direction.

Evenifareallylonglinestartshereandican'tdoanythingaboutitexceptwritetrashcodethatdealswithit

Take care,
Papi`;

  const maxWidthForLine = narrowsAt(10, 40, 22);

  const lines = wrapText({
    content: MESSAGE,
    measureText,
    maxWidthForLine,
  });

  it("never produces a line wider than its budget", () => {
    assertLinesFit(lines, maxWidthForLine);
  });

  it("preserves every non-whitespace character in order", () => {
    const original = MESSAGE.replace(/\s/g, "");
    const wrapped = lines.join("").replace(/\s/g, "").replaceAll("-", "");
    // Hyphens are inserted at breaks, so compare with them stripped. The
    // message itself contains none.
    assert.equal(wrapped, original.replaceAll("-", ""));
  });

  it("keeps the paragraph breaks", () => {
    assert.ok(lines.includes(""), "expected at least one blank line");
  });
});
