import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Cell, Button, Input, NewAddressModal, Spacer, Step } from '../components';


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
      r(Button, { text: 'back', onClick: this.handlePreviousClick.bind(this) }),
      r(Button, { text: 'next', onClick: this.handleNextClick.bind(this), disabled })
    );
  }

  isValid() {
    return this.props.postcard.address.selectedToIndex >= 0;
  }

  handleClickAddress(index) {
    this.props.actions.changeSelectedAddress('to', index);
  }

  handleClickNewAddress() {
    this.props.actions.changeSelectedAddress('to', -1);
    this.props.actions.showNewAddressModal(true);
  }

  handleClickCancelModal() {
    console.log('cancel');
    this.props.actions.showNewAddressModal(false);
  }

  handleClickSaveModal(address) {
    this.props.actions.addAddress(address);
    const newAddressIndex = this.props.postcard.address.addresses.length;
    this.props.actions.changeSelectedAddress('to', newAddressIndex);
    this.props.actions.showNewAddressModal(false);
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
