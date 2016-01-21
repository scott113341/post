import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';
import classNames from 'classnames';

import { Button, IFrame, Input, Step } from '../components';
import { getTemplate, orderPostcard } from '../util';


export default class PreviewStep extends React.Component {

  componentDidMount() {
    this.drawFront();
    this.drawBack();
  }

  render() {
    console.log('render');
    const preview = this.props.postcard.preview;
    const disabled = !this.isValid();

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

    return r(Step, { title: 'preview postcard' },
      frontImg,
      backImg,
      r('br'),
      r('p', { className: styles.sideLabel }, preview.side),
      r('br'),
      r(Button, { text: 'flip', onClick: this.handleFlipClick.bind(this) }),

      r('br'),
      r('br'),
      r(Button, { text: 'send', onClick: this.handleNextClick.bind(this), disabled })
    );
  }

  handleFlipClick() {
    const newSide = this.props.postcard.preview.side === 'front' ? 'back' : 'front';
    console.log('newSide', newSide);
    this.props.actions.editInput({ preview: { side: newSide }});
    console.log('here');
    console.log(this.props.postcard.preview.side);
  }

  async handleNextClick() {
    if (this.isValid()) {
      const apiKey = this.props.postcard.lob.apiKey;
      const to = this.props.postcard.address.addresses[this.props.postcard.address.selectedToIndex];
      const from = this.props.postcard.address.addresses[this.props.postcard.address.selectedFromIndex];
      const size = this.props.postcard.size.sizes[this.props.postcard.size.selectedIndex].name;
      const front = this.props.postcard.preview.frontData;
      const back = this.props.postcard.preview.backData;

      const res = await orderPostcard(apiKey, to, from, size, front, back);
      console.log('yay');
      console.log(res);
    }
  }

  isValid() {
    const preview = this.props.postcard.preview;

    return (
      preview.frontData.length &&
      preview.backData.length
    );
  }

  async drawFront() {
    console.log('drawFront');

    const size = this.props.postcard.size;
    const selectedSize = size.sizes[size.selectedIndex];
    const { width, height } = selectedSize;
    const dpi = 300;

    var canvas = document.createElement('canvas');
    canvas.width = width * dpi;
    canvas.height = height * dpi;

    var ctx = canvas.getContext('2d');
    const imgData = this.props.postcard.image.data;
    const img = await rotateImageToLandscape(imgData);

    console.log(img.width, 'x', img.height);
    const trimSides = (img.width / img.height) > (width / height);
    console.log('trimSides', trimSides);
    const sHeight = trimSides ? img.height : (height / width * img.width);
    const sWidth =  trimSides ? (width / height * img.height) : img.width;
    const sx = trimSides ? ((img.width - sWidth) / 2) : 0;
    const sy = trimSides ? 0 : ((img.height - sHeight) / 2);
    const dx = 0;
    const dy = 0;
    const dWidth = width * dpi;
    const dHeight = height * dpi;
    console.log({ sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight });
    ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

    const data = canvas.toDataURL();
    this.props.actions.editInput({ preview: { frontData: data } });
    return data;
  }

  async drawBack(renderAddresses) {
    console.log('drawBack');

    const size = this.props.postcard.size;
    const selectedSize = size.sizes[size.selectedIndex];
    const { width, height } = selectedSize;
    const dpi = 300;

    var canvas = document.createElement('canvas');
    canvas.width = width * dpi;
    canvas.height = height * dpi;

    const data = canvas.toDataURL();
    this.props.actions.editInput({ preview: { backData: data } });
    return data;
  }

}


async function loadImageFromData(data) {
  console.log('loadImageFromData');
  return new Promise(resolve => {
    var img = new Image();
    img.src = data;
    img.onload = async () => {
      console.log('img loaded');
      resolve(img);
    }
  });
}


async function rotateImageToLandscape(data) {
  try {
    return new Promise(async resolve => {
      console.log('gonna try rotating', data);
      var img = await loadImageFromData(data);
      console.log('loadedddddddddddd');

      console.log('wxh', img.width, img.height);
      if (img.width >= img.height) return resolve(img);

      var canvas = document.createElement('canvas');
      canvas.width = img.height;
      canvas.height = img.width;

      console.log(img);

      var ctx = canvas.getContext('2d');
      ctx.save();
      ctx.translate(canvas.width, canvas.height/canvas.width);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(img, 0, 0);
      ctx.restore();

      const rotatedData = canvas.toDataURL();
      console.log('rotatedData', rotatedData);
      const rotatedImg = await loadImageFromData(rotatedData);
      return resolve(rotatedImg);
    });
  }
  catch (e) {
    console.log('error!!!!!!!!!!!!!', e);
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
