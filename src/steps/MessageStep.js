import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Button, Input, Spacer, Step } from '../components';


export default class MessageStep extends React.Component {

  render() {
    const message = this.props.postcard.message;

    return r(Step, { title: 'write message' },
      r('textarea', { className: styles.textarea, value: message.content, onChange: this.handleInputChange.bind(this) }),

      r(Spacer),
      r(Button, { text: 'back', onClick: this.handlePreviousClick.bind(this) }),
      r(Button, { text: 'next', onClick: this.handleNextClick.bind(this) })
    );
  }

  handleInputChange(e) {
    this.props.actions.editInput({ message: { content: e.target.value }});
  }

  handlePreviousClick() {
    this.props.actions.goToStep('previous');
  }

  handleNextClick() {
    this.props.actions.goToStep('next');
  }

}


const styles = csjs`

  .textarea {
    width: 100%;
    height: 200px;
  }

`;
