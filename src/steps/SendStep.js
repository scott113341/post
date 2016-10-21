import csjs from 'csjs-inject';
import React, { createElement as r } from 'react';

import { Link, Spacer, Spinner, Step } from '../components/index.js';
import { drawFront, drawBack, orderPostcard } from '../util.js';

export default class FromAddressStep extends React.Component {

  async componentDidMount() {
    this.props.changeSendingStatus(true);

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

    this.props.changeSendingStatus(false);
    this.props.changeSentStatus(true);
    if (res.status === 200) {
      this.props.changeResponseStatus('');
    }
    else {
      this.props.changeResponseStatus(res.responseText);
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
      r(Link, { to: '/preview' }, 'back'),
      r(Link, { to: '/', disabled }, 'start over')
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

}

export const styles = csjs`
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
