import merge from "lodash/merge";

import * as CONSTANTS from "../constants.js";
import { clone, getFromLocalStorage } from "../util.js";
import { POSTCARD_4X6 } from "../constants";
import { POSTCARD_6X11, POSTCARD_6X9 } from "../constants.js";

export const SET_VALUE = "SET_VALUE";
export const GO_TO_STEP = "GO_TO_STEP";
export const RESET_PREVIEW = "RESET_PREVIEW";
export const ADD_ADDRESS = "ADD_ADDRESS";
export const DELETE_ADDRESS = "DELETE_ADDRESS";

export function goToStep(step) {
  return { type: GO_TO_STEP, step };
}

export function changeLobApiKey(apiKey) {
  apiKey = apiKey.replace(/\s/g, "");
  localStorage.setItem(CONSTANTS.LOB_API_KEY, apiKey);
  return { type: SET_VALUE, value: { lob: { apiKey } } };
}

export function changeSelectedSize(selectedIndex) {
  return (dispatch) => {
    dispatch({ type: SET_VALUE, value: { size: { selectedIndex } } });
    dispatch({ type: RESET_PREVIEW, side: "front" });
    dispatch({ type: RESET_PREVIEW, side: "back" });
  };
}

export function changeImage(image) {
  return (dispatch) => {
    dispatch({ type: SET_VALUE, value: { image } });
    dispatch({ type: RESET_PREVIEW, side: "front" });
  };
}

export function changeMessage(content) {
  return (dispatch) => {
    dispatch({ type: SET_VALUE, value: { message: { content } } });
    dispatch({ type: RESET_PREVIEW, side: "back" });
  };
}

export function changeSelectedAddress(toOrFrom, index) {
  const capitalized = capitalizeFirstLetter(toOrFrom);
  const selectedToFromIndex = `selected${capitalized}Index`;

  return (dispatch) => {
    dispatch({
      type: SET_VALUE,
      value: { address: { [selectedToFromIndex]: index } },
    });
    dispatch({ type: RESET_PREVIEW, side: "back" });
  };
}

export function showNewAddressModal(showModal) {
  return { type: SET_VALUE, value: { address: { showModal } } };
}

export function addAddress(address) {
  return { type: ADD_ADDRESS, address };
}

export function deleteAddress(index) {
  return (dispatch) => {
    dispatch({ type: DELETE_ADDRESS, index });
    dispatch({
      type: SET_VALUE,
      value: { address: { selectedFromIndex: -1 } },
    });
  };
}

export function changeSelectedPreviewSide(side) {
  return { type: SET_VALUE, value: { preview: { side } } };
}

export function changePreviewImage(side, data) {
  const frontBackData = `${side}Data`;
  return { type: SET_VALUE, value: { preview: { [frontBackData]: data } } };
}

export function changeSendingStatus(isSending) {
  return { type: SET_VALUE, value: { send: { isSending } } };
}

export function changeSentStatus(didSend) {
  return { type: SET_VALUE, value: { send: { didSend } } };
}

export function changeResponseStatus(response) {
  return { type: SET_VALUE, value: { send: { response } } };
}

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export const initialState = {
  stepIndex: 0,
  lob: {
    apiKey: getFromLocalStorage("LOB_API_KEY", ""),
  },
  size: {
    selectedIndex: 0,
    sizes: [POSTCARD_4X6, POSTCARD_6X9, POSTCARD_6X11],
  },
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
    addresses: getFromLocalStorage("ADDRESSES", []),
  },
  preview: {
    side: "front",
    frontData: "",
    backData: "",
  },
  send: {
    isSending: false,
    didSend: false,
    response: "",
  },
};
initialState.initialState = initialState;

export default function postcardReducer(state = initialState, action) {
  switch (action.type) {
    case SET_VALUE: {
      return merge({}, state, action.value);
    }

    case GO_TO_STEP: {
      let stepIndex = state.stepIndex;
      if (action.step === "next") stepIndex++;
      else if (action.step === "back") stepIndex--;
      else stepIndex = action.step;
      return clone(state, { stepIndex });
    }

    case RESET_PREVIEW: {
      const sideData = `${action.side}Data`;
      return merge({}, state, { preview: { [sideData]: "" } });
    }

    case ADD_ADDRESS: {
      let addresses = [].concat(state.address.addresses, action.address);
      localStorage.setItem("ADDRESSES", JSON.stringify(addresses));
      return merge({}, state, { address: { addresses } });
    }

    case DELETE_ADDRESS: {
      let addresses = [].concat(state.address.addresses);
      addresses.splice(action.index, 1);
      localStorage.setItem("ADDRESSES", JSON.stringify(addresses));
      return merge(
        {},
        state,
        { address: { addresses: null } },
        { address: { addresses }, selectedToIndex: -1 },
      );
    }

    default: {
      return state;
    }
  }
}
