import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Button, Input, Step } from '../components';
import { formatPrice } from '../util';


export default class ImageStep extends React.Component {

  render() {
    const image = this.props.postcard.image;
    const disabled = !this.isValid();

    const img = image.data.length ? r('img', { className: styles.image, src: image.data }) : null;

    return r(Step, { title: 'choose photo' },
      r('p', null, 'choose a photo'),

      r('input', { type: 'file', accept: 'image/jpeg', onChange: this.handleImageLoad.bind(this) }),

      r('br'),
      r('br'),

      img,

      r('br'),
      r('br'),
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

  handleNextClick() {
    if (this.isValid()) this.props.actions.nextStep();
  }

}


const styles = csjs`

  .image {
    max-width: 100%;
    max-height: 300px;
  }

`;
