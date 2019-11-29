import React, { createElement as r } from 'react';

import { Link, Spacer, Step } from '../components/index.js';
import { formatPrice } from '../util.js';

export default class SizeStep extends React.Component {

  render () {
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
      r(Link, { onClick: () => this.props.goToStep('back') }, 'back'),
      r(Link, { onClick: () => this.props.goToStep('next'), disabled }, 'next')
    );
  }

  isValid () {
    return this.props.postcard.size.selectedIndex >= 0;
  }

  handleSizeSelectChange (e) {
    this.props.changeSelectedSize(e.target.value);
  }

}
