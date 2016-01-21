import { combineReducers } from 'redux';

import lob from './lob';
import postcard from './postcard';


const rootReducer = combineReducers({
  lob,
  postcard
});

export default rootReducer;
