import * as ACTIONS from './constants';
import * as CONSTANTS from '../constants';


export function goToStep(step) {
  return { type: ACTIONS.GO_TO_STEP, step };
}


export function changeLobApiKey(apiKey) {
  apiKey = apiKey.replace(/\s/g, '');
  localStorage.setItem(CONSTANTS.LOB_API_KEY, apiKey);
  return { type: ACTIONS.SET_VALUE, value: { lob: { apiKey }}};
}


export function changeSelectedSize(selectedIndex) {
  return dispatch => {
    dispatch({ type: ACTIONS.SET_VALUE, value: { size: { selectedIndex }}});
    dispatch({ type: ACTIONS.RESET_PREVIEW, side: 'front' });
    dispatch({ type: ACTIONS.RESET_PREVIEW, side: 'back' });
  };
}


export function changeImageData(data) {
  return dispatch => {
    dispatch({ type: ACTIONS.SET_VALUE, value: { image: { data }}});
    dispatch({ type: ACTIONS.RESET_PREVIEW, side: 'front' });
  };
}


export function changeMessage(content) {
  return dispatch => {
    dispatch({ type: ACTIONS.SET_VALUE, value: { message: { content }}});
    dispatch({ type: ACTIONS.RESET_PREVIEW, side: 'back' });
  };
}


export function changeSelectedAddress(toOrFrom, index) {
  const capitalized = capitalizeFirstLetter(toOrFrom);
  const selectedToFromIndex = `selected${capitalized}Index`;

  return dispatch => {
    dispatch({ type: ACTIONS.SET_VALUE, value: { address: { [selectedToFromIndex]: index }}});
    dispatch({ type: ACTIONS.RESET_PREVIEW, side: 'back' });
  };
}


export function showNewAddressModal(showModal) {
  return { type: ACTIONS.SET_VALUE, value: { address: { showModal }}};
}


export function addAddress(address) {
  return { type: ACTIONS.ADD_ADDRESS, address };
}


export function deleteAddress(index) {
  return dispatch => {
    dispatch({ type: ACTIONS.DELETE_ADDRESS, index });
    dispatch({ type: ACTIONS.SET_VALUE, value: { address: { selectedFromIndex: -1 }}});
  };
}


export function changeSelectedPreviewSide(side) {
  return { type: ACTIONS.SET_VALUE, value: { preview: { side }}};
}


export function changePreviewImage(side, data) {
  const frontBackData = `${side}Data`;
  return { type: ACTIONS.SET_VALUE, value: { preview: { [frontBackData]: data }}};
}


export function changeSendingStatus(isSending) {
  return { type: ACTIONS.SET_VALUE, value: { send: { isSending }}};
}


export function changeSentStatus(didSend) {
  return { type: ACTIONS.SET_VALUE, value: { send: { didSend }}};
}


export function changeResponseStatus(response) {
  return { type: ACTIONS.SET_VALUE, value: { send: { response }}};
}


function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
