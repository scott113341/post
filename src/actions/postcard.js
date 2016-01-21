import * as ACTIONS from './constants';


export function changePreviewSide(side) {
  return { type: ACTIONS.POSTCARD_CHANGE_PREVIEW_SIDE, side };
}


export function nextStep() {
  return { type: ACTIONS.NEXT_STEP };
}


export function editInput(value) {
  return { type: ACTIONS.EDIT_INPUT, value };
}


export function addNewAddress(address) {
  return { type: ACTIONS.ADD_NEW_ADDRESS, address };
}


export function updatePreviewImage(data) {
  const value = { preview: { data } };
  return { type: ACTIONS.EDIT_INPUT, value };
}
