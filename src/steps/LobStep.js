import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Button, Input, Spacer, Step } from '../components';


export default class LobStep extends React.Component {

  render() {
    const apiKey = this.props.postcard.lob.apiKey;
    const disabled = !this.isValid();

    return r(Step, { title: 'lob account' },
      r('p', null, 'enter your lob api key'),

      r(Input, { value: apiKey, onChange: this.handleInputChange.bind(this) }),

      r(Spacer),
      r(Button, { text: 'back', onClick: this.handlePreviousClick.bind(this) }),
      r(Button, { text: 'next', onClick: this.handleNextClick.bind(this), disabled })
    );
  }

  isValid() {
    return this.props.postcard.lob.apiKey.length === 40;
  }

  handleInputChange(value) {
    this.props.actions.editInput({ lob: { apiKey: value }});
  }

  handlePreviousClick() {
    this.props.actions.previousStep();
  }

  handleNextClick() {
    this.props.actions.persistLobApiKey(this.props.postcard.lob.apiKey);
    this.props.actions.nextStep();
  }

}


const styles = csjs`



`;
