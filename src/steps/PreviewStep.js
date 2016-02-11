import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';
import classNames from 'classnames';

import { Button, IFrame, Input, Spacer, Spinner, Step } from '../components';
import { drawFront, drawBack } from '../util';


export default class PreviewStep extends React.Component {

  async componentDidMount() {
    const { size, preview, address } = this.props.postcard;
    const selectedSize = size.sizes[size.selectedIndex];
    const frontImg = this.props.postcard.image.data;
    const message = this.props.postcard.message;

    if (!preview.frontData.length) {
      const frontData = await drawFront(selectedSize, frontImg, 100);
      this.props.actions.changePreviewImage('front', frontData);
    }

    if (!preview.backData.length) {
      const fromAddress = address.addresses[address.selectedFromIndex];
      const toAddress = address.addresses[address.selectedToIndex];
      const backData = await drawBack(selectedSize, message, 100, fromAddress, toAddress);
      this.props.actions.changePreviewImage('back', backData);
    }
  }

  render() {
    const preview = this.props.postcard.preview;
    const disabled = !this.isValid();

    const spinner = this.isLoading() ? r(Spinner) : null;

    const frontClassNames = classNames({
      [styles.image]: true,
      [styles.hide]: preview.side !== 'front' || this.isLoading()
    });
    const frontImg = r('img', { className: frontClassNames, src: preview.frontData });

    const backClassNames = classNames({
      [styles.image]: true,
      [styles.hide]: preview.side !== 'back' || this.isLoading()
    });
    const backImg =  r('img', { className: backClassNames, src: preview.backData });

    const sideGroup = !this.isLoading() ?
      r('div', null,
        r(Spacer, { height: '5px' }),
        r('p', { className: styles.sideLabel }, preview.side),
        r(Spacer, { height: '5px' }),
        r(Button, { text: 'flip', onClick: this.handleFlipClick.bind(this) })
      )
      : null;

    return r(Step, { title: 'preview postcard' },
      r(Spacer, { height: '20px' }),
      spinner,
      frontImg,
      backImg,

      sideGroup,

      r(Spacer),
      r(Button, { text: 'back', onClick: this.handlePreviousClick.bind(this) }),
      r(Button, { text: 'send', onClick: this.handleNextClick.bind(this), disabled })
    );
  }

  handleFlipClick() {
    const newSide = this.props.postcard.preview.side === 'front' ? 'back' : 'front';
    this.props.actions.changeSelectedPreviewSide(newSide);
  }

  handlePreviousClick() {
    this.props.actions.goToStep('previous');
  }

  handleNextClick() {
    this.props.actions.goToStep('next');
  }

  isLoading() {
    return !this.isValid();
  }

  isValid() {
    const preview = this.props.postcard.preview;

    return (
      preview.frontData.length &&
      preview.backData.length
    );
  }
}


const styles = csjs`

  .image {
    box-sizing: border-box;
    border: 1px solid black;
    max-width: 100%;
    max-height: 300px;
  }

  .hide {
    display: none;
  }

  .sideLabel {
    font-style: italic;
  }

`;
