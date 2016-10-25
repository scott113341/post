import csjs from 'csjs-inject';
import React, { createElement as r } from 'react';
import ReactDomServer from 'react-dom/server';

import { orderPostcard } from '../util.js';
import { Link, Spacer, Spinner, Step } from '../components/index.js';
import renderBack from '../lib/render-back';
import renderFront from '../lib/render-front';

export default class SendStep extends React.Component {

  async componentDidMount () {
    this.props.changeSendingStatus(true);

    const postcard = this.props.postcard;
    const { address, image, message, preview  } = postcard;
    const size = postcard.size.sizes[postcard.size.selectedIndex];
    const fromAddress = address.addresses[address.selectedFromIndex];
    const toAddress = address.addresses[address.selectedToIndex];
    const apiKey = postcard.lob.apiKey;
    const sizeName = size.name;

    const frontData = ReactDomServer.renderToStaticMarkup(renderFront({ image, size }));
    const backData = ReactDomServer.renderToStaticMarkup(renderBack({ size, message, fromAddress, toAddress }));
    const res = await orderPostcard(apiKey, toAddress, fromAddress, sizeName, frontData, backData);

    this.props.changeSendingStatus(false);
    this.props.changeSentStatus(true);
    if (res.status === 200) this.props.changeResponseStatus('');
    else this.props.changeResponseStatus(res.responseText);
  }

  render () {
    const send = this.props.postcard.send;
    const disabled = !this.isValid();

    const spinner = send.isSending ? r(Spinner) : null;
    const success = this.didSucceed() ? r('p', { className: styles.success }, 'success') : null;
    const error = this.didError() ? r('pre', { className: styles.error }, send.response) : null;

    return r(Step, { title: 'sending postcard' },
      r(Spacer, { height: '15px' }),
      spinner,
      success,
      error,
      r(Spacer),
      r(Link, { to: '/preview' }, 'back'),
      r(Link, { to: '/', disabled }, 'start over')
    );
  }

  didSucceed () {
    const send = this.props.postcard.send;
    return !send.isSending && send.didSend && !send.response.length;
  }

  didError () {
    const send = this.props.postcard.send;
    return !send.isSending && send.didSend && send.response.length;
  }

  isValid () {
    return this.didSucceed();
  }

}

export const styles = csjs`
  .success {
    color: green;
  }

  .error {
    background: #ddd;
    font-family: monospace;
    font-size: 12px;
    padding: 5px;
    text-align: left;
    white-space: pre-wrap;
  }
`;
