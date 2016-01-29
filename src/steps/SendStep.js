import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Cell, Button, Spacer, Spinner, Step } from '../components';
import { drawFront, drawBack, orderPostcard } from '../util';


export default class FromAddressStep extends React.Component {
  
  async componentDidMount() {
    this.props.actions.changeSendingStatus(true);

    const postcard = this.props.postcard;
    const apiKey = postcard.lob.apiKey;
    const to = postcard.address.addresses[postcard.address.selectedToIndex];
    const from = postcard.address.addresses[postcard.address.selectedFromIndex];
    const size = postcard.size.sizes[postcard.size.selectedIndex];
    const sizeName = size.name;
    const frontImg = postcard.image.data;
    const message = postcard.message;
    const dpi = 600;

    const frontData = await drawFront(size, frontImg, dpi);
    const backData = await drawBack(size, message, dpi);
    const res = await orderPostcard(apiKey, to, from, sizeName, frontData, backData);

    this.props.actions.changeSendingStatus(false);
    this.props.actions.changeSentStatus(true);
    if (res.status === 200) {
      this.props.actions.changeResponseStatus('');
    }
    else {
      this.props.actions.changeResponseStatus(res.responseText);
    }
  }

  render() {
    const send = this.props.postcard.send;
    const disabled = !this.isValid();

    const spinner = send.isSending ? r(Spinner) : null;
    const success = this.didSucceed() ? r('p', { className: styles.success }, 'success') : null;
    const error = this.didError() ? r('pre', { className: styles.error }, send.response) : null;

    return r(Step, { title: 'sending postcard' },
      r(Spacer, { height: '20px' }),

      spinner,
      success,
      error,

      r(Spacer),
      r(Button, { text: 'back', onClick: this.handlePreviousClick.bind(this) }),
      r(Button, { text: 'start over', onClick: this.handleNextClick.bind(this), disabled })
    );
  }

  didSucceed() {
    const send = this.props.postcard.send;
    return !send.isSending && send.didSend && !send.response.length;
  }

  didError() {
    const send = this.props.postcard.send;
    return !send.isSending && send.didSend && send.response.length;
  }

  isValid() {
    return this.didSucceed();
  }

  handlePreviousClick() {
    this.props.actions.goToStep('previous');
  }

  handleNextClick() {
    this.props.actions.goToStep(0);
  }

}


const styles = csjs`

  .success {
    color: green;
  }

  .error {
    padding: 5px;
    text-align: left;
    background: #ddd;
    font-family: monospace;
    font-size: 12px;
    white-space: pre-wrap;
  }

`;
