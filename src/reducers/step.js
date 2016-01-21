import format from 'string-template';
var fs = require('fs'); // brfs via browserify

import * as ACTIONS from '../actions/constants';
import { clone, getFromLocalStorage } from '../util';


const initialState = {
  step: 0,
  steps: [
    {
      name: 'welcome'
    }
  ]
};


export default function postcard(state=initialState, action) {
  switch (action.type) {
    case ACTIONS.RESET:
      return clone(initialState);

    case ACTIONS.EDIT_FIELD:
      return clone(state, { [action.field]: action.value });

    default:
      return state;
  }
}


export function stepValid(state, stepName) {
  const { size, previewSide } = state.postcard;
  const fileName = `${size}.${previewSide}`;
  var template = '';

  switch (fileName) {
    case '4x6.front':
      template = fs.readFileSync(`${__dirname}/../templates/4x6.front.html`);
      break;
    case '4x6.back':
      template = fs.readFileSync(`${__dirname}/../templates/4x6.back.html`);
      break;
    case '6x11.front':
      template = fs.readFileSync(`${__dirname}/../templates/6x11.front.html`);
      break;
    case '6x11.back':
      template = fs.readFileSync(`${__dirname}/../templates/6x11.back.html`);
      break;
    default:
      template = 'meow';
  }

  template = String(template);
  return format(template, state);
}
