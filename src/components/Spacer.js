import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';


export default class Spacer extends React.Component {

  static propTypes = {
    height: React.PropTypes.string
  };

  render() {
    const { height='30px', ...rest } = this.props;
    const style = { height };

    return r('div', { className: styles.spacer, style, ...rest });
  }

}


const styles = csjs`

  .spacer {
    background: none;
  }

`;
