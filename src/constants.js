export const LOB_API_KEY = "LOB_API_KEY";

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

function computeAddressLeft({ width, addressWidth }) {
  return width - BLEED - 0.15 - addressWidth;
}

function computeAddressTop({ height }) {
  return height - BLEED - 0.125 - ADDRESS_HEIGHT;
}

function computePostageLeft({ addressLeft, addressWidth }) {
  return addressLeft + addressWidth - POSTAGE_WIDTH - POSTAGE_OFFSET_RIGHT;
}

function computePostageTop({ addressTop }) {
  return addressTop + POSTAGE_OFFSET_TOP;
}

export const POSTCARD_4X6 = (() => {
  const width = 6.25;
  const height = 4.25;
  const addressWidth = 3.2835;

  const addressLeft = computeAddressLeft({ width, addressWidth });
  const addressTop = computeAddressTop({ height });
  const postageLeft = computePostageLeft({ addressLeft, addressWidth });
  const postageTop = computePostageTop({ addressTop });

  return {
    name: "4x6",
    display: `4"x6"`,
    price: 0.7,
    width,
    height,
    addressWidth,
    addressLeft,
    addressTop,
    postageLeft,
    postageTop,
  };
})();

export const POSTCARD_6X9 = (() => {
  const width = 9.25;
  const height = 6.25;
  const addressWidth = 4;

  const addressLeft = computeAddressLeft({ width, addressWidth });
  const addressTop = computeAddressTop({ height });
  const postageLeft = computePostageLeft({ addressLeft, addressWidth });
  const postageTop = computePostageTop({ addressTop });

  return {
    name: "6x9",
    display: '6"x9"',
    price: 1.35,
    width,
    height,
    addressWidth,
    addressLeft,
    addressTop,
    postageLeft,
    postageTop,
  };
})();

export const POSTCARD_6X11 = (() => {
  const width = 11.25;
  const height = 6.25;
  const addressWidth = 4;

  const addressLeft = computeAddressLeft({ width, addressWidth });
  const addressTop = computeAddressTop({ height });
  const postageLeft = computePostageLeft({ addressLeft, addressWidth });
  const postageTop = computePostageTop({ addressTop });

  return {
    name: "6x11",
    display: '6"x11"',
    price: 1.5,
    width,
    height,
    addressWidth,
    addressLeft,
    addressTop,
    postageLeft,
    postageTop,
  };
})();
