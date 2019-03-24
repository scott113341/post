import csjs from 'csjs-inject';
import React, { createElement as r } from 'react';
import Frame from 'react-frame-component';

import { Button, IFrame, Link, Spacer, Step } from '../components/index.js';
import renderBack from '../lib/render-back';
import renderFront from '../lib/render-front';

export default class PreviewStep extends React.Component {

  render () {
    const { address, image, message, preview  } = this.props.postcard;
    const size = this.props.postcard.size.sizes[this.props.postcard.size.selectedIndex];
    const fromAddress = address.addresses[address.selectedFromIndex];
    const toAddress = address.addresses[address.selectedToIndex];

    const scale = 300 / 100 / size.width;
    const topBottom = -(size.height * 100 - size.height * 100 * scale) / 2;
    const leftRight = -(size.width  * 100 - size.width  * 100 * scale) / 2;
    const styles = csjs`
      .frame {
        border: 1px solid black;
        margin: ${topBottom}px ${leftRight}px;
        transform: scale(${scale}, ${scale});
      }
    
      .sideLabel {
        font-style: italic;
      }
    `;

    const render = preview.side === 'front'
      ? renderFront({ image, size, isPreview: true })
      : renderBack({ size, message, fromAddress, toAddress, isPreview: true });

    return r(Step, { title: 'preview postcard' },
      r(Spacer, { height: '5px' }),
      r(Frame, { className: styles.frame, width: size.width * 100, height: size.height * 100 }, render),
      r(Spacer, { height: '5px' }),
      r('div', null,
        r('p', { className: styles.sideLabel }, preview.side),
        r(Spacer, { height: '5px' }),
        r(Button, { onClick: this.handleFlipClick.bind(this) }, 'flip')
      ),
      r(Spacer),
      r(Link, { to: '/to' }, 'back'),
      r(Link, { to: '/send' }, 'send')
    );
  }

  handleFlipClick () {
    const newSide = this.props.postcard.preview.side === 'front' ? 'back' : 'front';
    this.props.changeSelectedPreviewSide(newSide);
  }

}
