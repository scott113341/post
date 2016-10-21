import React, { createElement as r } from 'react';

import { Input, Link, Spacer, Step } from '../components/index.js';

export default class LobStep extends React.Component {

  render() {
    const apiKey = this.props.postcard.lob.apiKey;
    const disabled = !this.isValid();

    console.log(this);

    return r(Step, { title: 'lob account' },
      r('p', null, 'enter your lob api key'),
      r(Spacer, { height: '10px' }),
      r(Input, { value: apiKey, onChange: this.handleApiKeyInputChange.bind(this), autoCapitalize: 'none' }),

      r(Spacer),
      r(Link, { to: '/' }, 'back'),
      r(Link, { to: '/size', disabled }, 'next')
    );
  }

  isValid() {
    return this.props.postcard.lob.apiKey.length === 40;
  }

  handleApiKeyInputChange(apiKey) {
    this.props.changeLobApiKey(apiKey);
  }

}
