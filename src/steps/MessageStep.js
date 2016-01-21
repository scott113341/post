import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Button, Input, Step } from '../components';


export default class MessageStep extends React.Component {

  render() {
    const message = this.props.postcard.message;
    const disabled = !this.isValid();

    return r(Step, { title: 'write message' },
      r('textarea', { value: message.content, onChange: this.handleInputChange.bind(this) }),
      r('br'),
      r('br'),
      r(Button, { text: 'next', onClick: this.handleNextClick.bind(this), disabled })
    );
  }

  isValid() {
    return this.props.postcard.message.content.length > 0;
  }

  handleInputChange(e) {
    this.props.actions.editInput({ message: { content: e.target.value }});
  }

  handleNextClick() {
    if (this.isValid()) this.props.actions.nextStep();
  }

}


const styles = csjs`



`;
