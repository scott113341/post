import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Cell, Button, NewAddressModal, Spacer, Step } from '../components';


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
        const deleteButton = selected ? r(Button, { text: 'delete', onClick: this.handleClickDeleteAddress.bind(this, index) }) : null;
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
      r(Button, { text: 'back', onClick: this.handlePreviousClick.bind(this) }),
      r(Button, { text: 'next', onClick: this.handleNextClick.bind(this), disabled })
    );
  }

  isValid() {
    return this.props.postcard.address.selectedFromIndex >= 0;
  }

  handleClickAddress(index) {
    this.props.actions.changeSelectedAddress('from', index);
  }

  handleClickDeleteAddress(index, e) {
    e.stopPropagation();
    this.props.actions.deleteAddress(index);
  }

  handleClickNewAddress() {
    this.props.actions.changeSelectedAddress('from', -1);
    this.props.actions.showNewAddressModal(true);
  }

  handleClickCancelModal() {
    this.props.actions.showNewAddressModal(false);
  }

  handleClickSaveModal(address) {
    this.props.actions.addAddress(address);
    const newAddressIndex = this.props.postcard.address.addresses.length;
    this.props.actions.changeSelectedAddress('from', newAddressIndex);
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
