import csjs from 'csjs';

import * as constants from './constants';


export default csjs`

  html {
    font-family: ${constants.font};
    font-size: ${constants.fontSize};
  }

  input {
    border: 1px solid #ddd;
    width: 100%;
    text-align: center;
    font-size: ${constants.fontSize};
  }

  select {
    font-size: ${constants.fontSize};
    border-color: inherit;
  }

`;
