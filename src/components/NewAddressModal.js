import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Button, Modal, Spacer } from './';


export default class NewAddressModal extends React.Component {

  static propTypes = {
    show: React.PropTypes.bool.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired
  };

  render() {
    return this.props.show ? r(Modal, { title: 'new address' },
      r('input', { className: styles.input, ref: 'addressName', placeholder: 'name' }),
      r('input', { className: styles.input, ref: 'addressLine1', placeholder: 'address line 1' }),
      r('input', { className: styles.input, ref: 'addressLine2', placeholder: 'address line 2' }),
      r('input', { className: styles.input, ref: 'addressCity', placeholder: 'city' }),
      r('input', { className: styles.input, ref: 'addressState', placeholder: 'state' }),
      r('input', { className: styles.input, ref: 'addressZip', placeholder: 'zip', type: 'number' }),

      r(Spacer),
      r(Button, { text: 'cancel', onClick: this.handleCancelClick.bind(this) }),
      r(Button, { text: 'save', onClick: this.handleSaveClick.bind(this) })
    ) : null;
  }

  handleCancelClick() {
    this.props.onCancel();
  }

  handleSaveClick() {
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


const styles = csjs`

  .input {
    width: 100%;
  }

`;
