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
      r(Spacer, { height: '10px' }),
      r(Input, { value: apiKey, onChange: this.handleApiKeyInputChange.bind(this), autoCapitalize: 'none' }),

      r(Spacer),
      r(Button, { text: 'back', onClick: this.handlePreviousClick.bind(this) }),
      r(Button, { text: 'next', onClick: this.handleNextClick.bind(this), disabled })
    );
  }

  isValid() {
    return this.props.postcard.lob.apiKey.length === 40;
  }

  handleApiKeyInputChange(apiKey) {
    this.props.actions.changeLobApiKey(apiKey);
  }

  handlePreviousClick() {
    this.props.actions.goToStep('previous');
  }

  handleNextClick() {
    this.props.actions.goToStep('next');
  }

}


const styles = csjs`



`;
