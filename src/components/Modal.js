import React, { createElement as r } from 'react';
import csjs from 'csjs-inject';

export default class Modal extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    onClick: React.PropTypes.func,
    title: React.PropTypes.string.isRequired
  };

  handleClick () {
    this.props.onClick();
  }

  render () {
    const { children, title } = this.props;

    return r('div', { className: styles.backdrop },
      r('div', { className: styles.modal },
        r('h1', { className: styles.title }, title),
        children
      )
    );
  }

}

const styles = csjs`

  .backdrop {
    display: flex;
    flex-direction: column;
    justify-content: center;

    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.8);
    pointer-events: none;
  }

  .modal {
    position: relative;
    box-sizing: border-box;
    margin: 0 auto;
    padding: 10px;
    width: 90%;
    max-width: 500px;
    background: white;
    pointer-events: all;
  }

  .title {
    padding-bottom: 5px;
    border-bottom: 1px solid gray;
    margin-bottom: 12px;
  }

`;
