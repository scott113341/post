import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';


export default class Spinner extends React.Component {

  render() {
    return r('div', { className: styles.spinner },
      r('div', { className: styles.bounce1 }),
      r('div', { className: styles.bounce2 }),
      r('div', { className: styles.bounce3 })
    );
  }

}


const styles = csjs`

  .spinner {
    margin: 0 auto;
    width: 70px;
    text-align: center;
  }

  .bounce {
    width: 18px;
    height: 18px;
    background-color: #333;

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }

  .bounce1 extends .bounce {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  .bounce2 extends .bounce {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }

  .bounce3 extends .bounce {}

  @-webkit-keyframes sk-bouncedelay {
    0%, 80%, 100% { -webkit-transform: scale(0) }
    40% { -webkit-transform: scale(1.0) }
  }

  @keyframes sk-bouncedelay {
    0%, 80%, 100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    } 40% {
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
  }

`;
