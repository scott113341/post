import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { formatPrice, getFromLocalStorage, setInLocalStorage } from "./util.ts";

interface FakeStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** Installs a stand-in for the localStorage global, which Node lacks. */
function stubStorage(storage: Partial<FakeStorage>) {
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
    writable: true,
  });
}

function clearStorage() {
  Reflect.deleteProperty(globalThis, "localStorage");
}

afterEach(clearStorage);

describe("getFromLocalStorage", () => {
  it("falls back when the key is absent", () => {
    stubStorage({ getItem: () => null });
    assert.equal(getFromLocalStorage("missing", "fallback"), "fallback");
  });

  it("parses stored JSON", () => {
    stubStorage({ getItem: () => '[{"addressName":"Rico"}]' });
    assert.deepEqual(getFromLocalStorage<{ addressName: string }[]>("ADDRESSES", []), [
      { addressName: "Rico" },
    ]);
  });

  it("returns a legacy unquoted value rather than dropping it", () => {
    // Older versions wrote the Lob API key with setItem directly, so it is a
    // bare string and not valid JSON. Losing it would silently sign the user out.
    const key = "test_1234567890abcdefghijklmnopqrstuvwxyz";
    stubStorage({ getItem: () => key });
    assert.equal(getFromLocalStorage("LOB_API_KEY", ""), key);
  });

  it("falls back when localStorage is unavailable", () => {
    stubStorage({
      getItem: () => {
        throw new Error("SecurityError");
      },
    });
    assert.equal(getFromLocalStorage("LOB_API_KEY", ""), "");
  });

  it("falls back when there is no localStorage global at all", () => {
    clearStorage();
    assert.deepEqual(getFromLocalStorage("ADDRESSES", []), []);
  });
});

describe("setInLocalStorage", () => {
  it("writes values as JSON", () => {
    const written: Record<string, string> = {};
    stubStorage({
      getItem: () => null,
      setItem: (key, value) => {
        written[key] = value;
      },
    });

    setInLocalStorage("LOB_API_KEY", "abc");
    assert.equal(written["LOB_API_KEY"], '"abc"');
  });

  it("round-trips through getFromLocalStorage", () => {
    const written: Record<string, string> = {};
    stubStorage({
      getItem: (key) => written[key] ?? null,
      setItem: (key, value) => {
        written[key] = value;
      },
    });

    const addresses = [{ addressName: "Rico" }];
    setInLocalStorage("ADDRESSES", addresses);
    assert.deepEqual(getFromLocalStorage("ADDRESSES", []), addresses);
  });

  it("swallows a full quota instead of breaking the reducer", () => {
    stubStorage({
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    });

    assert.doesNotThrow(() => setInLocalStorage("ADDRESSES", [1, 2, 3]));
  });
});

describe("formatPrice", () => {
  it("formats to two decimal places in USD", () => {
    assert.equal(formatPrice(0.833), "$0.83");
    assert.equal(formatPrice(0.954), "$0.95");
    assert.equal(formatPrice(0.993), "$0.99");
  });
});
