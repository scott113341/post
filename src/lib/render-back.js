import csjs from 'csjs';
import getCss from 'csjs/get-css';
import React from 'react';

import resetCss from '../styles/reset-css.js';

export default function renderBack ({ size, message, fromAddress = null, toAddress = null, isPreview = false, scale = 100, ...props }) {
  const showAddresses = fromAddress && toAddress && isPreview;
  const d = v => (v * scale).toFixed(6);
  const px = size.floatBox[0];
  const py = size.floatBox[1];

  const styles = csjs`
    .container {
      box-sizing: border-box;
      height: ${d(size.height)}px;
      padding: ${d(0.2)}px;
      position: absolute;
      width: ${d(size.width)}px;
    }

    .textContainer {
      font-family: '${message.font}';
      font-size: ${d(message.fontSize / 100)}px;
      height: 100%;
      overflow: hidden;
      text-overflow: clip;
    }

    .floatBox {
      float: right;
      height: 100%;
      shape-outside: polygon(${px}% ${py}%, 100% ${py}%, 100% 100%, ${px}% 100%);
      -webkit-shape-outside: polygon(${px}% ${py}%, 100% ${py}%, 100% 100%, ${px}% 100%);
      width: 100%;
    }

    .addressContainer {
      border: ${d(0.01)}px solid black;
      display: ${showAddresses ? 'block' : 'none'};
      font-size: ${d(message.fontSize / 100)}px;
      height: ${d(size.addressHeight)}px;
      left: ${d(size.addressLeft)}px;
      position: absolute;
      top: ${d(size.addressTop)}px;
      width: ${d(size.addressWidth)}px;
    }

    .addressText {
      font-family: 'Open Sans';
      position: absolute;
      text-transform: uppercase;
    }

    .fromAddress extends .addressText {
      font-size: ${d(11 / 100)}px;
      left: ${d(size.addressesLeft)}px;
      top: ${d(0.266)}px;
    }

    .toAddress extends .addressText {
      font-size: ${d(14 / 100)}px;
      left: ${d(size.addressesLeft)}px;
      top: ${d(1.339)}px;
    }

    .postage extends .addressText {
      background: #aaa;
      border: ${d(0.01)}px solid black;
      height: ${d(0.639)}px;
      left: ${d(size.postageLeft)}px;
      top: ${d(0.181)}px;
      text-align: center;
      width: ${d(0.78)}px;
    }
  `;

  const messageText = message.content.split('\n').map((m, i) => <span key={i}>{m}<br/></span>);
  const fromAddressText = fromAddress ? formatAddress(fromAddress) : '';
  const toAddressText = toAddress ? formatAddress(toAddress) : '';

  return (
    <div>
      <div id="fake"></div>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans" />
      <style dangerouslySetInnerHTML={{ __html: resetCss }} />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={d(size.width)}
        height={d(size.height)}
        viewBox={`0 0 ${d(size.width)} ${d(size.height)}`}
        {...props}>
        <foreignObject width={d(size.width)} height={d(size.height)}>
          <style dangerouslySetInnerHTML={{ __html: getCss(styles) }} />
          <div xmlns="http://www.w3.org/1999/xhtml">
            <div className={styles.container}>
              <div className={styles.textContainer}>
                <div className={styles.floatBox}></div>
                {messageText}
              </div>
              <div className={styles.addressContainer}>
                <div className={styles.postage}></div>
                <div className={styles.fromAddress}>{fromAddressText}</div>
                <div className={styles.toAddress}>{toAddressText}</div>
              </div>
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

function formatAddress (a) {
  return (
    <div>
      <p>{a.addressName}</p>
      <p>{`${a.addressLine1}${a.addressLine2 ? `\n${a.addressLine2}` : ''}`}</p>
      <p>{`${a.addressCity}, ${a.addressState} ${a.addressZip}`}</p>
    </div>
  );
}
