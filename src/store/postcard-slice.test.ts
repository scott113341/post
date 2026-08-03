import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Address } from "../types.ts";
import reducer, {
  addAddress,
  deleteAddress,
  goToStep,
  initialState,
  nextStep,
  previousStep,
  sendFinished,
  sendStarted,
  setLobApiKey,
  setSelectedAddress,
  type PostcardState,
} from "./postcard-slice.ts";

function makeAddress(name: string): Address {
  return {
    addressName: name,
    addressLine1: "1 Main St",
    addressLine2: "",
    addressCountry: "US",
    addressCity: "Bend",
    addressState: "OR",
    addressZip: "97701",
  };
}

/** State seeded with three addresses, to exercise index bookkeeping. */
function withAddresses(overrides: Partial<PostcardState["address"]> = {}) {
  return reducer(
    {
      ...initialState,
      address: {
        ...initialState.address,
        addresses: ["a", "b", "c"].map(makeAddress),
        ...overrides,
      },
    },
    { type: "@@init" },
  );
}

describe("step navigation", () => {
  it("advances and retreats", () => {
    let state = reducer(initialState, nextStep());
    state = reducer(state, nextStep());
    assert.equal(state.stepIndex, 2);

    state = reducer(state, previousStep());
    assert.equal(state.stepIndex, 1);
  });

  it("never retreats past the first step", () => {
    const state = reducer(initialState, previousStep());
    assert.equal(state.stepIndex, 0);
  });

  it("clamps a negative jump", () => {
    const state = reducer(initialState, goToStep(-5));
    assert.equal(state.stepIndex, 0);
  });
});

describe("setLobApiKey", () => {
  it("strips whitespace pasted in with the key", () => {
    const state = reducer(initialState, setLobApiKey("  test_abc 123\n"));
    assert.equal(state.lob.apiKey, "test_abc123");
  });
});

describe("addAddress", () => {
  it("appends without mutating the previous state", () => {
    const before = withAddresses();
    const after = reducer(before, addAddress(makeAddress("d")));

    assert.equal(after.address.addresses.length, 4);
    assert.equal(before.address.addresses.length, 3);
  });
});

describe("deleteAddress", () => {
  it("removes the address at the given index", () => {
    const state = reducer(withAddresses(), deleteAddress(1));
    assert.deepEqual(
      state.address.addresses.map((a) => a.addressName),
      ["a", "c"],
    );
  });

  it("clears a selection pointing at the deleted address", () => {
    const state = reducer(withAddresses({ selectedFromIndex: 1 }), deleteAddress(1));
    assert.equal(state.address.selectedFromIndex, -1);
  });

  it("shifts selections that sat after the deleted address", () => {
    // The old reducer left these stale, so deleting an address could silently
    // repoint the recipient at a different person.
    const state = reducer(
      withAddresses({ selectedFromIndex: 2, selectedToIndex: 2 }),
      deleteAddress(0),
    );

    assert.equal(state.address.selectedFromIndex, 1);
    assert.equal(state.address.selectedToIndex, 1);
    assert.equal(state.address.addresses[1]?.addressName, "c");
  });

  it("leaves selections before the deleted address alone", () => {
    const state = reducer(
      withAddresses({ selectedFromIndex: 0, selectedToIndex: 0 }),
      deleteAddress(2),
    );

    assert.equal(state.address.selectedFromIndex, 0);
    assert.equal(state.address.selectedToIndex, 0);
  });

  it("ignores an out-of-range index", () => {
    const state = reducer(withAddresses(), deleteAddress(9));
    assert.equal(state.address.addresses.length, 3);
  });

  it("does not leave a stray key at the state root", () => {
    const state = reducer(withAddresses(), deleteAddress(0));
    assert.ok(!("selectedToIndex" in state));
  });
});

describe("setSelectedAddress", () => {
  it("targets the from and to slots independently", () => {
    let state = reducer(withAddresses(), setSelectedAddress({ target: "from", index: 0 }));
    state = reducer(state, setSelectedAddress({ target: "to", index: 2 }));

    assert.equal(state.address.selectedFromIndex, 0);
    assert.equal(state.address.selectedToIndex, 2);
  });
});

describe("send lifecycle", () => {
  it("clears any previous error when a send starts", () => {
    let state = reducer(initialState, sendFinished({ error: "boom" }));
    state = reducer(state, sendStarted());

    assert.deepEqual(state.send, {
      isSending: true,
      didSend: false,
      error: "",
    });
  });

  it("records a failure", () => {
    let state = reducer(initialState, sendStarted());
    state = reducer(state, sendFinished({ error: "bad api key" }));

    assert.deepEqual(state.send, {
      isSending: false,
      didSend: true,
      error: "bad api key",
    });
  });

  it("records a success", () => {
    let state = reducer(initialState, sendStarted());
    state = reducer(state, sendFinished({ error: "" }));

    assert.deepEqual(state.send, {
      isSending: false,
      didSend: true,
      error: "",
    });
  });
});

describe("initial state", () => {
  it("is not self-referential", () => {
    // The old state nested itself under `initialState` so components could
    // reach defaults, which made it unserialisable.
    assert.ok(!("initialState" in initialState));
    assert.doesNotThrow(() => structuredClone(initialState));
  });
});
