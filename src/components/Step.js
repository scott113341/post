import React, { createElement as r } from 'react';
import csjs from 'csjs-inject';

export default class Step extends React.Component {

  static propTypes = {
    title: React.PropTypes.string.isRequired,
    children: React.PropTypes.node.isRequired
  };

  render () {
    const { title, children } = this.props;

    return r('div', { className: styles.container },
      r('h1', { className: styles.title }, title),
      children
    );
  }

}

const styles = csjs`

  .container {
    text-align: center;
  }

  .title {
    margin: 10px 0;
    font-size: 22px;
    font-weight: 300;
  }

`;
