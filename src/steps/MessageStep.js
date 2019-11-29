import csjs from 'csjs-inject';
import React, { createElement as r } from 'react';

import { Link, Spacer, Step } from '../components/index.js';

export default class MessageStep extends React.Component {

  render () {
    const message = this.props.postcard.message;

    return r(Step, { title: 'write message' },
      r('textarea', { className: styles.textarea, value: message.content, onChange: this.handleInputChange.bind(this) }),
      r(Spacer),
      r(Link, { onClick: () => this.props.goToStep('back') }, 'back'),
      r(Link, { onClick: () => this.props.goToStep('next') }, 'next')
    );
  }

  handleInputChange (e) {
    this.props.changeMessage(e.target.value);
  }

}

export const styles = csjs`
  .textarea {
    box-sizing: border-box;
    height: 200px;
    width: 100%;
  }
`;
