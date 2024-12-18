import csjs from "csjs-inject";
import React from "react";

import { orderPostcard } from "../util.js";
import { Link, Spacer, Spinner, Step } from "../components/index.js";
import renderBack from "../lib/render-back";
import renderFront from "../lib/render-front";

export default class SendStep extends React.Component {
  async componentDidMount() {
    this.props.changeSendingStatus(true);

    const postcard = this.props.postcard;
    const { address, image, message } = postcard;
    const size = postcard.size.sizes[postcard.size.selectedIndex];
    const fromAddress = address.addresses[address.selectedFromIndex];
    const toAddress = address.addresses[address.selectedToIndex];
    const apiKey = postcard.lob.apiKey;

    const frontData = await renderFront({
      image,
      size,
      isPreview: false,
    });
    const backData = await renderBack({
      size,
      message,
      fromAddress,
      toAddress,
      isPreview: false,
    });
    const res = await orderPostcard(
      apiKey,
      toAddress,
      fromAddress,
      size.name,
      size.uspsClass,
      frontData,
      backData,
    );

    this.props.changeSendingStatus(false);
    this.props.changeSentStatus(true);
    if (res.status === 200) this.props.changeResponseStatus("");
    else this.props.changeResponseStatus(res.responseText);
  }

  render() {
    const send = this.props.postcard.send;
    const disabled = !this.isValid();

    return (
      <Step title="sending postcard">
        <Spacer height="15px" />
        {send.isSending ? <Spinner /> : null}
        {this.didSucceed() ? <p className={styles.success}>success</p> : null}
        {this.didError() ? (
          <pre className={styles.error}>{send.response}</pre>
        ) : null}
        <Spacer />
        <Link onClick={() => this.props.goToStep("back")}>back</Link>
        <Link onClick={() => this.props.goToStep(0)} disabled={disabled}>
          start over
        </Link>
      </Step>
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
    background: #ddd;
    font-family: monospace;
    font-size: 12px;
    padding: 5px;
    text-align: left;
    white-space: pre-wrap;
  }
`;
