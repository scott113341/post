import React from 'react';
import { createElement as r } from 'react';

import { clone } from '../util';


export default class Input extends React.Component {

  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired
  };

  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    let props = clone(this.props, { onChange: this.handleChange.bind(this) });
    return r('input', props);
  }

}
