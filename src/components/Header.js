import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';


export default class Header extends React.Component {

  render() {
    return r('header', { className: styles.header },
      r('h1', { className: styles.text }, 'post')
    );
  }

}


const styles = csjs`

  .header {
    padding: 5px 0;
    background: gray;
  }

  .text {
    font-size: 18px;
    text-align: center;
    color: white;
  }

`;
