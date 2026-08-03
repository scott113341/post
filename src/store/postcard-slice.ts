import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { ADDRESSES, LOB_API_KEY } from "../constants.ts";
import type { Address, AddressTarget, Message, PostcardImage, PreviewSide } from "../types.ts";
import { getFromLocalStorage } from "../util.ts";

export interface PostcardState {
  stepIndex: number;
  lob: { apiKey: string };
  size: { selectedIndex: number };
  image: PostcardImage | null;
  message: Message;
  address: {
    showModal: boolean;
    selectedFromIndex: number;
    selectedToIndex: number;
    addresses: Address[];
  };
  preview: { side: PreviewSide };
  send: { isSending: boolean; didSend: boolean; error: string };
}

export const initialState: PostcardState = {
  stepIndex: 0,
  lob: { apiKey: getFromLocalStorage<string>(LOB_API_KEY, "") },
  size: { selectedIndex: 0 },
  image: null,
  message: {
    content: "",
    font: `"Helvetica Neue", Helvetica, Arial, sans-serif`,
    fontSize: 0.14,
    fontSpacing: 0.16,
  },
  address: {
    showModal: false,
    selectedFromIndex: -1,
    selectedToIndex: -1,
    addresses: getFromLocalStorage<Address[]>(ADDRESSES, []),
  },
  preview: { side: "front" },
  send: { isSending: false, didSend: false, error: "" },
};

/**
 * Keeps a stored selection pointing at the same address after a deletion
 * shifts the list, and clears it if that address was the one deleted.
 */
function adjustSelection(selected: number, removed: number): number {
  if (selected === removed) return -1;
  return selected > removed ? selected - 1 : selected;
}

const postcardSlice = createSlice({
  name: "postcard",
  initialState,
  reducers: {
    nextStep(state) {
      state.stepIndex += 1;
    },

    previousStep(state) {
      state.stepIndex = Math.max(0, state.stepIndex - 1);
    },

    goToStep(state, action: PayloadAction<number>) {
      state.stepIndex = Math.max(0, action.payload);
    },

    setLobApiKey(state, action: PayloadAction<string>) {
      state.lob.apiKey = action.payload.replace(/\s/g, "");
    },

    setSelectedSize(state, action: PayloadAction<number>) {
      state.size.selectedIndex = action.payload;
    },

    setImage(state, action: PayloadAction<PostcardImage | null>) {
      state.image = action.payload;
    },

    setMessage(state, action: PayloadAction<string>) {
      state.message.content = action.payload;
    },

    setSelectedAddress(state, action: PayloadAction<{ target: AddressTarget; index: number }>) {
      const { target, index } = action.payload;
      if (target === "from") state.address.selectedFromIndex = index;
      else state.address.selectedToIndex = index;
    },

    setShowAddressModal(state, action: PayloadAction<boolean>) {
      state.address.showModal = action.payload;
    },

    addAddress(state, action: PayloadAction<Address>) {
      state.address.addresses.push(action.payload);
    },

    deleteAddress(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index < 0 || index >= state.address.addresses.length) return;

      state.address.addresses.splice(index, 1);
      state.address.selectedFromIndex = adjustSelection(state.address.selectedFromIndex, index);
      state.address.selectedToIndex = adjustSelection(state.address.selectedToIndex, index);
    },

    setPreviewSide(state, action: PayloadAction<PreviewSide>) {
      state.preview.side = action.payload;
    },

    sendStarted(state) {
      state.send = { isSending: true, didSend: false, error: "" };
    },

    sendFinished(state, action: PayloadAction<{ error: string }>) {
      state.send = {
        isSending: false,
        didSend: true,
        error: action.payload.error,
      };
    },
  },
});

export const {
  addAddress,
  deleteAddress,
  goToStep,
  nextStep,
  previousStep,
  sendFinished,
  sendStarted,
  setImage,
  setLobApiKey,
  setMessage,
  setPreviewSide,
  setSelectedAddress,
  setSelectedSize,
  setShowAddressModal,
} = postcardSlice.actions;

export default postcardSlice.reducer;
