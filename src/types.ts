export interface Address {
  addressName: string;
  addressLine1: string;
  addressLine2: string;
  addressCountry: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
}

/** A Lob postcard size, plus the derived geometry used when rendering. */
export interface PostcardSize {
  /** Lob's size identifier, e.g. "4x6". */
  name: string;
  /** Human-readable label, e.g. `4"x6"`. */
  display: string;
  price: number;
  /** USPS mail class, sent to Lob as `mail_type`. */
  uspsClass: "usps_first_class" | "usps_standard";
  /** All dimensions below are in inches, and include the bleed. */
  width: number;
  height: number;
  addressWidth: number;
  addressLeft: number;
  addressTop: number;
  postageLeft: number;
  postageTop: number;
}

export interface PostcardImage {
  /** A `data:image/...` URL. */
  data: string;
  width: number;
  height: number;
}

export interface Message {
  content: string;
  font: string;
  /** In inches. */
  fontSize: number;
  /** Baseline-to-baseline distance, in inches. */
  fontSpacing: number;
}

export type PreviewSide = "front" | "back";

export type AddressTarget = "to" | "from";
