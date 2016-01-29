import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Button, Input, Spacer, Step } from '../components';
import { formatPrice } from '../util';
import globalStyles from '../styles/global';


export default class SizeStep extends React.Component {

  render() {
    const size = this.props.postcard.size;
    const disabled = !this.isValid();

    return r(Step, { title: 'postcard size' },
      r('select', { value: size.selectedIndex, onChange: this.handleSizeSelectChange.bind(this) },
        size.sizes.map((sizeOption, index) => {
          return r('option', { key: index, value: index },
            `${sizeOption.display} - ${formatPrice(sizeOption.price)}`
          );
        })
      ),

      r(Spacer),
      r(Button, { text: 'back', onClick: this.handlePreviousClick.bind(this) }),
      r(Button, { text: 'next', onClick: this.handleNextClick.bind(this), disabled })
    );
  }

  isValid() {
    return this.props.postcard.size.selectedIndex >= 0;
  }

  handleSizeSelectChange(e) {
    this.props.actions.changeSelectedSize(e.target.value);
  }

  handlePreviousClick() {
    this.props.actions.goToStep('previous');
  }

  handleNextClick() {
    this.props.actions.goToStep('next');
  }

}


const styles = csjs`



`;
