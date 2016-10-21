import React, { createElement as r } from 'react';
import csjs from 'csjs-inject';

import { headerBackgroundColor } from '../styles/constants';

export default class Header extends React.Component {

  render () {
    return r('header', { className: styles.header },
      r('h1', { className: styles.text }, 'post')
    );
  }

}

const styles = csjs`

  .header {
    padding: 5px 0;
    background: ${headerBackgroundColor};
  }

  .text {
    font-size: 18px;
    text-align: center;
    color: white;
  }

`;
