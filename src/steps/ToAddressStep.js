import React, { createElement as r } from 'react';

import { Cell, Link, NewAddressModal, Spacer, Step } from '../components/index.js';

export default class ToAddressStep extends React.Component {

  render() {
    const address = this.props.postcard.address;
    const disabled = !this.isValid();

    const modal = r(NewAddressModal, {
      show: address.showModal,
      onCancel: this.handleClickCancelModal.bind(this),
      onSave: this.handleClickSaveModal.bind(this)
    });

    return r(Step, { title: 'to address' },

      address.addresses.map((addressOption, index) => {
        const selected = index === address.selectedToIndex;
        return r(Cell, { key: index, onClick: this.handleClickAddress.bind(this, index), selected },
          r('p', null, addressOption.addressName),
          r('p', null, addressOption.addressLine1),
          r('p', null, addressOption.addressLine2),
          r('p', null, `${addressOption.addressCity}, ${addressOption.addressState} ${addressOption.addressZip}`)
        );
      }),

      r(Cell, { onClick: this.handleClickNewAddress.bind(this), last: true },
        r('p', null, 'new address')
      ),

      modal,

      r(Spacer),
      r(Link, { to: '/from' }, 'back'),
      r(Link, { to: '/preview', disabled }, 'next')
    );
  }

  isValid() {
    return this.props.postcard.address.selectedToIndex >= 0;
  }

  handleClickAddress(index) {
    this.props.changeSelectedAddress('to', index);
  }

  handleClickNewAddress() {
    this.props.changeSelectedAddress('to', -1);
    this.props.showNewAddressModal(true);
  }

  handleClickCancelModal() {
    console.log('cancel');
    this.props.showNewAddressModal(false);
  }

  handleClickSaveModal(address) {
    this.props.addAddress(address);
    const newAddressIndex = this.props.postcard.address.addresses.length;
    this.props.changeSelectedAddress('to', newAddressIndex);
    this.props.showNewAddressModal(false);
  }

}
