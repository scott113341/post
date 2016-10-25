import csjs from 'csjs-inject';

import * as c from './constants.js';

export default csjs`

  html {
    font-family: ${c.font};
    font-size: ${c.fontSize};
  }

  input {
    border: 1px solid #ddd;
    box-sizing: border-box;
    font-size: ${c.fontSize};
    text-align: center;
    width: 100%;
  }

  select {
    font-size: ${c.fontSize};
    border-color: inherit;
  }

  a, a:visited {
    color: ${c.linkColor};
  }

`;
