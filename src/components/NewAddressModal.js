import csjs from 'csjs-inject';
import React, { createElement as r } from 'react';

import { Button, Modal, Spacer } from './index.js';

export default class NewAddressModal extends React.Component {

  static propTypes = {
    show: React.PropTypes.bool.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired
  };

  render () {
    const className = styles.input;

    return this.props.show ? r(Modal, { title: 'new address' },
      r('input', { className, ref: 'addressName', placeholder: 'name', autoComplete: 'shipping name' }),
      r('input', { className, ref: 'addressLine1', placeholder: 'address line 1', autoComplete: 'shipping address-line1' }),
      r('input', { className, ref: 'addressLine2', placeholder: 'address line 2', autoComplete: 'shipping address-line2' }),
      r('input', { className, ref: 'addressCity', placeholder: 'city', autoComplete: 'shipping address-level2' }),
      r('input', { className, ref: 'addressState', placeholder: 'state abbreviation', autoCapitalize: 'characters', autoComplete: 'shipping address-level1' }),
      r('input', { className, ref: 'addressZip', placeholder: 'zip', type: 'number', autoCapitalize: 'characters', autoComplete: 'shipping postal-code' }),
      r(Spacer),
      r(Button, { onClick: this.handleCancelClick.bind(this) }, 'cancel'),
      r(Button, { onClick: this.handleSaveClick.bind(this) }, 'save')
    ) : null;
  }

  handleCancelClick () {
    this.props.onCancel();
  }

  handleSaveClick () {
    this.props.onSave({
      addressName: this.refs.addressName.value,
      addressLine1: this.refs.addressLine1.value,
      addressLine2: this.refs.addressLine2.value,
      addressCountry: 'US',
      addressCity: this.refs.addressCity.value,
      addressState: this.refs.addressState.value,
      addressZip: this.refs.addressZip.value
    });
  }

}

export const styles = csjs`
  .input {
    width: 100%;
  }
`;
