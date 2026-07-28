import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ADDRESS_HEIGHT,
  BLEED,
  POSTAGE_HEIGHT,
  POSTAGE_WIDTH,
  POSTCARD_4X6,
  POSTCARD_6X9,
  POSTCARD_6X11,
  POSTCARD_SIZES,
} from "./constants.ts";

describe("postcard geometry", () => {
  it("keeps the trim dimensions Lob expects, including bleed", () => {
    // Lob's nominal sizes plus 0.125" of bleed on each edge.
    assert.deepEqual([POSTCARD_4X6.width, POSTCARD_4X6.height], [6 + BLEED * 2, 4 + BLEED * 2]);
    assert.deepEqual([POSTCARD_6X9.width, POSTCARD_6X9.height], [9 + BLEED * 2, 6 + BLEED * 2]);
    assert.deepEqual([POSTCARD_6X11.width, POSTCARD_6X11.height], [11 + BLEED * 2, 6 + BLEED * 2]);
  });

  for (const size of POSTCARD_SIZES) {
    describe(size.name, () => {
      it("keeps the address block inside the trim area", () => {
        assert.ok(size.addressLeft > BLEED, "address block crosses left bleed");
        assert.ok(
          size.addressLeft + size.addressWidth <= size.width - BLEED,
          "address block crosses right bleed",
        );
        assert.ok(size.addressTop > BLEED, "address block crosses top bleed");
        assert.ok(
          size.addressTop + ADDRESS_HEIGHT <= size.height - BLEED,
          "address block crosses bottom bleed",
        );
      });

      it("keeps the postage box inside the address block", () => {
        assert.ok(size.postageLeft >= size.addressLeft);
        assert.ok(size.postageLeft + POSTAGE_WIDTH <= size.addressLeft + size.addressWidth);
        assert.ok(size.postageTop >= size.addressTop);
        assert.ok(size.postageTop + POSTAGE_HEIGHT <= size.addressTop + ADDRESS_HEIGHT);
      });

      it("leaves room for a message beside the address block", () => {
        assert.ok(size.addressLeft > size.width / 3);
      });
    });
  }

  it("matches the geometry the renderer was calibrated against", () => {
    // Pinned so a refactor of makeSize cannot silently move printed output.
    // Compared within a ten-thousandth of an inch, well under one dot at 300dpi.
    const expected = {
      addressLeft: 2.6915,
      addressTop: 1.625,
      postageLeft: 5.045,
      postageTop: 1.775,
    };

    for (const [key, value] of Object.entries(expected)) {
      const actual = POSTCARD_4X6[key as keyof typeof expected];
      assert.ok(Math.abs(actual - value) < 1e-4, `${key}: expected ~${value}, got ${actual}`);
    }
  });

  it("prices sizes in ascending order", () => {
    const prices = POSTCARD_SIZES.map((size) => size.price);
    assert.deepEqual(
      prices,
      prices.toSorted((a, b) => a - b),
    );
  });
});
