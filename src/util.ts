import type { Address } from "./types.ts";

const LOB_ENDPOINT = "https://api.lob.com/v1/postcards";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** Loads and parses a JSON value from localStorage, falling back on any error. */
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  let raw: string | null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    // No localStorage at all (private mode, or a non-browser test runner).
    return defaultValue;
  }

  if (raw === null) return defaultValue;

  try {
    return JSON.parse(raw) as T;
  } catch {
    // Older versions wrote the Lob API key unquoted, so it is not valid JSON.
    // Hand back the raw string rather than dropping a saved key.
    return raw as T;
  }
}

export function setInLocalStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing or a full quota; persistence is best-effort.
  }
}

export function formatPrice(price: number): string {
  return USD.format(price);
}

export interface OrderResult {
  ok: boolean;
  /** Empty when the order succeeded, otherwise the error body to display. */
  error: string;
}

export interface OrderParams {
  apiKey: string;
  to: Address;
  from: Address;
  size: string;
  uspsClass: string;
  front: Blob;
  back: Blob;
}

function appendAddress(form: FormData, prefix: "to" | "from", address: Address): void {
  form.append(`${prefix}[name]`, address.addressName);
  form.append(`${prefix}[address_line1]`, address.addressLine1);
  form.append(`${prefix}[address_line2]`, address.addressLine2);
  form.append(`${prefix}[address_country]`, address.addressCountry);
  form.append(`${prefix}[address_city]`, address.addressCity);
  form.append(`${prefix}[address_state]`, address.addressState);
  form.append(`${prefix}[address_zip]`, address.addressZip);
}

export async function orderPostcard({
  apiKey,
  to,
  from,
  size,
  uspsClass,
  front,
  back,
}: OrderParams): Promise<OrderResult> {
  const form = new FormData();
  appendAddress(form, "to", to);
  appendAddress(form, "from", from);
  form.append("use_type", "operational");
  form.append("size", size);
  form.append("mail_type", uspsClass);
  form.append("front", front, "front.png");
  form.append("back", back, "back.png");

  try {
    const response = await fetch(LOB_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Basic ${btoa(`${apiKey}:`)}` },
      body: form,
    });

    if (response.ok) return { ok: true, error: "" };
    return { ok: false, error: await response.text() };
  } catch (error) {
    // fetch only rejects on network-level failures, which the previous
    // XMLHttpRequest implementation silently hung on.
    return { ok: false, error: `Could not reach Lob: ${String(error)}` };
  }
}

export function loadImageFromData(data: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img), { once: true });
    img.addEventListener("error", () => reject(new Error("Could not decode that image")), {
      once: true,
    });
    img.src = data;
  });
}

export function loadFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string), {
      once: true,
    });
    reader.addEventListener("error", () => reject(new Error("Could not read that file")), {
      once: true,
    });
    reader.readAsDataURL(file);
  });
}
