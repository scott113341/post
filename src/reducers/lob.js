import * as ACTIONS from '../actions/constants';
import { clone, getFromLocalStorage } from '../util';


const initialState = {
  apiKey: getFromLocalStorage('LOB_API_KEY', '')
};


export default function values(state=initialState, action) {
  switch (action.type) {
    case ACTIONS.LOB_SET_API_KEY:
      return clone(initialState, { apiKey: action.apiKey });

    default:
      return state;
  }
}
