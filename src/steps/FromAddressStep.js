import React, { createElement as r } from 'react';

import { Cell, Button, Link, NewAddressModal, Spacer, Step } from '../components/index.js';

export default class FromAddressStep extends React.Component {

  render() {
    const address = this.props.postcard.address;
    const disabled = !this.isValid();

    const modal = r(NewAddressModal, {
      show: address.showModal,
      onCancel: this.handleClickCancelModal.bind(this),
      onSave: this.handleClickSaveModal.bind(this)
    });

    return r(Step, { title: 'from address' },

      address.addresses.map((addressOption, index) => {
        const selected = index === address.selectedFromIndex;
        const deleteButtonSpacer = selected ? r(Spacer, { height: '10px' }) : null;
        const deleteButton = selected ? r(Button, { onClick: this.handleClickDeleteAddress.bind(this, index) }, 'delete') : null;
        return r(Cell, { key: index, onClick: this.handleClickAddress.bind(this, index), selected },
          r('p', null, addressOption.addressName),
          r('p', null, addressOption.addressLine1),
          r('p', null, addressOption.addressLine2),
          r('p', null, `${addressOption.addressCity}, ${addressOption.addressState} ${addressOption.addressZip}`),
          deleteButtonSpacer,
          deleteButton
        );
      }),

      r(Cell, { onClick: this.handleClickNewAddress.bind(this), last: true },
        r('p', null, 'new address')
      ),

      modal,

      r(Spacer),
      r(Link, { to: '/message' }, 'back'),
      r(Link, { to: '/to', disabled }, 'next')
    );
  }

  isValid() {
    return this.props.postcard.address.selectedFromIndex >= 0;
  }

  handleClickAddress(index) {
    this.props.changeSelectedAddress('from', index);
  }

  handleClickDeleteAddress(index, e) {
    e.stopPropagation();
    this.props.deleteAddress(index);
  }

  handleClickNewAddress() {
    this.props.changeSelectedAddress('from', -1);
    this.props.showNewAddressModal(true);
  }

  handleClickCancelModal() {
    this.props.showNewAddressModal(false);
  }

  handleClickSaveModal(address) {
    this.props.addAddress(address);
    const newAddressIndex = this.props.postcard.address.addresses.length;
    this.props.changeSelectedAddress('from', newAddressIndex);
    this.props.showNewAddressModal(false);
  }

}
