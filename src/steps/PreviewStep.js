import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';
import classNames from 'classnames';

import { Button, IFrame, Input, Spacer, Spinner, Step } from '../components';
import { drawFront, drawBack } from '../util';


export default class PreviewStep extends React.Component {

  async componentDidMount() {
    const dpi = 100;
    const size = this.props.postcard.size;
    const selectedSize = size.sizes[size.selectedIndex];
    const frontImg = this.props.postcard.image.data;

    const frontData = await drawFront(selectedSize, frontImg, dpi);
    const backData = await drawBack(selectedSize, dpi);
    this.props.actions.editInput({ preview: { frontData, backData } });
  }

  render() {
    const preview = this.props.postcard.preview;
    const disabled = !this.isValid();

    const spinner = this.isLoading() ? r(Spinner) : null;

    const frontClassNames = classNames({
      [styles.image]: true,
      [styles.hide]: preview.side !== 'front'
    });
    const frontImg = r('img', { className: frontClassNames, src: preview.frontData });

    const backClassNames = classNames({
      [styles.image]: true,
      [styles.hide]: preview.side !== 'back'
    });
    const backImg =  r('img', { className: backClassNames, src: preview.backData });

    const sideLabel = !this.isLoading() ? r('p', { className: styles.sideLabel }, preview.side) : null;

    return r(Step, { title: 'preview postcard' },
      spinner,
      frontImg,
      backImg,
      r(Spacer, { height: '5px' }),
      sideLabel,
      r(Spacer, { height: '5px' }),
      r(Button, { text: 'flip', onClick: this.handleFlipClick.bind(this) }),

      r(Spacer),
      r(Button, { text: 'back', onClick: this.handlePreviousClick.bind(this) }),
      r(Button, { text: 'send', onClick: this.handleNextClick.bind(this), disabled })
    );
  }

  handleFlipClick() {
    const newSide = this.props.postcard.preview.side === 'front' ? 'back' : 'front';
    this.props.actions.editInput({ preview: { side: newSide }});
  }

  handlePreviousClick() {
    this.props.actions.previousStep();
  }

  async handleNextClick() {
    this.props.actions.nextStep();
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
    width: 100%;
  }

  .hide {
    display: none;
  }

  .sideLabel {
    font-style: italic;
  }

`;
