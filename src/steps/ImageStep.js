import csjs from 'csjs-inject';
import React, { createElement as r } from 'react';

import { loadFileAsDataUrl, loadImageFromData } from '../util.js';
import { Button, Link, Spacer, Step } from '../components/index.js';

export default class ImageStep extends React.Component {

  render () {
    const image = this.props.postcard.image;
    const disabled = !this.isValid();

    const img = image.data.length ? r('div', null,
      r(Spacer, { height: '20px' }),
      r('img', { className: styles.image, src: image.data })
    ) : null;

    return r(Step, { title: 'choose a photo' },
      r(Button, { onClick: this.handleBrowseButtonClick.bind(this) }, 'browse'),
      r('input', { className: styles.input, ref: 'file', type: 'file', accept: 'image/*', onChange: this.handleImageLoad.bind(this) }),
      img,
      r(Spacer),
      r(Link, { onClick: () => this.props.goToStep('back') }, 'back'),
      r(Link, { onClick: () => this.props.goToStep('next'), disabled }, 'next')
    );
  }

  isValid () {
    return this.props.postcard.image.data.indexOf('data:image') === 0;
  }

  handleBrowseButtonClick (e) {
    this.refs.file.click();
  }

  async handleImageLoad (e) {
    this.props.changeImage(this.props.postcard.initialState.image);
    const file = e.target.files[0];
    const data = await loadFileAsDataUrl(file);
    const image = await loadImageFromData(data);
    this.props.changeImage({
      data,
      width: image.width,
      height: image.height
    });
  }

}

export const styles = csjs`
  .input {
    border: none;
    overflow: hidden;
    position: absolute;
    width: 0;
    z-index: -1;
  }

  .image {
    max-height: 300px;
    max-width: 100%;
  }
`;
