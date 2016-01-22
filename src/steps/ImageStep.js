import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Button, Input, Spacer, Step } from '../components';
import { formatPrice } from '../util';


export default class ImageStep extends React.Component {

  render() {
    const image = this.props.postcard.image;
    const disabled = !this.isValid();

    const img = image.data.length ? r('img', { className: styles.image, src: image.data }) : null;

    return r(Step, { title: 'choose a photo' },
      r('input', { type: 'file', accept: 'image/*', onChange: this.handleImageLoad.bind(this) }),
      img,

      r(Spacer),
      r(Button, { text: 'back', onClick: this.handlePreviousClick.bind(this) }),
      r(Button, { text: 'next', onClick: this.handleNextClick.bind(this), disabled })
    );
  }

  isValid() {
    return this.props.postcard.image.data.indexOf('data:image/jpeg;base64') === 0;
  }

  handleImageLoad(e) {
    this.props.actions.editInput({ image: { data: '' }});
    var reader = new FileReader();
    var file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = upload => {
      this.props.actions.editInput({ image: { data: upload.target.result }});
    };
  }

  handlePreviousClick() {
    this.props.actions.previousStep();
  }

  handleNextClick() {
    this.props.actions.nextStep();
  }

}


const styles = csjs`

  .image {
    max-width: 100%;
    max-height: 300px;
  }

`;
