import type { PostcardSize } from "./types.ts";

export const LOB_API_KEY = "LOB_API_KEY";
export const ADDRESSES = "ADDRESSES";

/** Lob requires a 40-character API key. */
export const LOB_API_KEY_LENGTH = 40;

export const BLEED = 0.125;
export const TEXT_BLEED = 0.125;

export const POSTAGE_WIDTH = 0.78;
export const POSTAGE_HEIGHT = 0.639;
export const POSTAGE_OFFSET_TOP = 0.15;
export const POSTAGE_OFFSET_RIGHT = 0.15;

export const ADDRESS_HEIGHT = 2.375;
export const ADDRESS_PADDING_LEFT = 0.15;
export const ADDRESS_FROM_PADDING_TOP = 0.125;
export const ADDRESS_FROM_FONT_SIZE = 0.12;
export const ADDRESS_TO_PADDING_TOP = 1.2;
export const ADDRESS_TO_FONT_SIZE = 0.14;
export const ADDRESS_FONT = "Times New Roman";

/** Gap between the address block and the right/bottom trim edges, in inches. */
const ADDRESS_MARGIN_RIGHT = 0.15;
const ADDRESS_MARGIN_BOTTOM = 0.125;

type SizeSpec = Pick<
  PostcardSize,
  "name" | "display" | "price" | "uspsClass" | "width" | "height" | "addressWidth"
>;

/** Derives the address-block and postage positions for a postcard size. */
function makeSize(spec: SizeSpec): PostcardSize {
  const addressLeft = spec.width - BLEED - ADDRESS_MARGIN_RIGHT - spec.addressWidth;
  const addressTop = spec.height - BLEED - ADDRESS_MARGIN_BOTTOM - ADDRESS_HEIGHT;

  return {
    ...spec,
    addressLeft,
    addressTop,
    postageLeft: addressLeft + spec.addressWidth - POSTAGE_WIDTH - POSTAGE_OFFSET_RIGHT,
    postageTop: addressTop + POSTAGE_OFFSET_TOP,
  };
}

export const POSTCARD_4X6 = makeSize({
  name: "4x6",
  display: `4"x6"`,
  price: 0.833,
  uspsClass: "usps_first_class",
  width: 6.25,
  height: 4.25,
  addressWidth: 3.2835,
});

export const POSTCARD_6X9 = makeSize({
  name: "6x9",
  display: `6"x9"`,
  price: 0.954,
  uspsClass: "usps_first_class",
  width: 9.25,
  height: 6.25,
  addressWidth: 4,
});

export const POSTCARD_6X11 = makeSize({
  name: "6x11",
  display: `6"x11"`,
  price: 0.993,
  uspsClass: "usps_standard",
  width: 11.25,
  height: 6.25,
  addressWidth: 4,
});

/** Selectable sizes, in the order they appear in the size dropdown. */
export const POSTCARD_SIZES: readonly PostcardSize[] = [POSTCARD_4X6, POSTCARD_6X9, POSTCARD_6X11];
