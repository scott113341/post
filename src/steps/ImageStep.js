import csjs from 'csjs-inject';
import React, { createElement as r } from 'react';

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
      r(Link, { to: '/size' }, 'back'),
      r(Link, { to: '/message', disabled }, 'next')
    );
  }

  isValid () {
    return this.props.postcard.image.data.indexOf('data:image') === 0;
  }

  handleBrowseButtonClick (e) {
    this.refs.file.click();
  }

  handleImageLoad (e) {
    this.props.changeImageData('');
    var reader = new FileReader();
    var file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = upload => {
      this.props.changeImageData(upload.target.result);
    };
  }

}

export const styles = csjs`
  .input {
    border: none;
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  .image {
    max-width: 100%;
    max-height: 300px;
  }
`;
