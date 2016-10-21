import csjs from 'csjs-inject';

import * as c from './constants.js';

export default csjs`

  html {
    font-family: ${c.font};
    font-size: ${c.fontSize};
  }

  input {
    border: 1px solid #ddd;
    width: 100%;
    text-align: center;
    font-size: ${c.fontSize};
  }

  select {
    font-size: ${c.fontSize};
    border-color: inherit;
  }

  a, a:visited {
    color: ${c.linkColor};
  }

`;
