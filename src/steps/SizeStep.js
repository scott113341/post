import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Button, Input, Step } from '../components';
import { formatPrice } from '../util';


export default class SizeStep extends React.Component {

  render() {
    const size = this.props.postcard.size;
    const disabled = !this.isValid();

    return r(Step, { title: 'postcard size' },
      r('p', null, 'choose an option'),

      r('select', { value: size.selectedIndex, onChange: this.handleSelectChange.bind(this) },
        size.sizes.map((sizeOption, index) => {
          return r('option', { key: index, value: index },
            `${sizeOption.name} - ${formatPrice(sizeOption.price)}`
          );
        })
      ),

      r('br'),
      r('br'),
      r(Button, { text: 'next', onClick: this.handleNextClick.bind(this), disabled })
    );
  }

  isValid() {
    return this.props.postcard.size.selectedIndex >= 0;
  }

  handleSelectChange(e) {
    console.log(e);
    this.props.actions.editInput({ size: { selectedIndex: e.target.value }});
  }

  handleNextClick() {
    if (this.isValid()) this.props.actions.nextStep();
  }

}


const styles = csjs`



`;
