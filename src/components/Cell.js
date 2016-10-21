import React, { createElement as r } from 'react';
import csjs from 'csjs-inject';
import classNames from 'classnames';

export default class Cell extends React.Component {

  static propTypes = {
    onClick: React.PropTypes.func.isRequired,
    selected: React.PropTypes.bool,
    last: React.PropTypes.bool,
    children: React.PropTypes.node.isRequired
  };

  handleClick () {
    this.props.onClick();
  }

  render () {
    const { onClick, selected, last, children } = this.props;
    const className = classNames({
      [styles.cell]: true,
      [styles.selected]: selected,
      [styles.last]: last
    });

    return r('div', { className, onClick },
      children
    );
  }

}

const styles = csjs`

  .cell {
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
    padding: 10px;
    cursor: pointer;
  }

  .selected extends .cell {
    background: darkseagreen;
  }

  .last {
    border: 1px solid black;
  }

`;
