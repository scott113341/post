import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';


export default class Button extends React.Component {

  static propTypes = {
    text: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired
  };

  handleClick() {
    this.props.onClick();
  }

  render() {
    const { text, onClick, ...rest } = this.props;

    return r('button', { className: styles.button, onClick, ...rest }, text);
  }

}


const styles = csjs`

  .button {
    margin: 0 4px;
    border: none;
    padding: 3px 12px;
    background: cadetblue;
    color: white;
    font-size: 18px;
    font-weight: 300;
  }

  .button:disabled {
    background: gray;
  }

`;
