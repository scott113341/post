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
      r('input', { className, ref: 'addressName', placeholder: 'name', autoCapitalize: 'words' }),
      r('input', { className, ref: 'addressLine1', placeholder: 'address line 1', autoCapitalize: 'words' }),
      r('input', { className, ref: 'addressLine2', placeholder: 'address line 2', autoCapitalize: 'words' }),
      r('input', { className, ref: 'addressCity', placeholder: 'city', autoCapitalize: 'words' }),
      r('input', { className, ref: 'addressState', placeholder: 'state abbreviation', autoCapitalize: 'characters' }),
      r('input', { className, ref: 'addressZip', placeholder: 'zip', type: 'number' }),

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
