import * as ACTIONS from './constants';


export function goToStep(step) {
  return { type: ACTIONS.GO_TO_STEP, step };
}


export function persistLobApiKey(apiKey) {
  return { type: ACTIONS.PERSIST_LOB_API_KEY, apiKey };
}


export function editInput(value) {
  return { type: ACTIONS.EDIT_INPUT, value };
}


export function addNewAddress(address) {
  return { type: ACTIONS.ADD_NEW_ADDRESS, address };
}


export function deleteAddress(index) {
  return { type: ACTIONS.DELETE_ADDRESS, index };
}


export function updatePreviewImage(data) {
  const value = { preview: { data } };
  return { type: ACTIONS.EDIT_INPUT, value };
}
