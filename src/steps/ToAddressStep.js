import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Cell, Button, Input, Modal, Spacer, Step } from '../components';


export default class ToAddressStep extends React.Component {

  render() {
    const address = this.props.postcard.address;
    const disabled = !this.isValid();

    const modal = address.showModal ? r(Modal, { title: 'new address' },
      r('input', { className: styles.modalInput, ref: 'addressName', placeholder: 'name' }),
      r('input', { className: styles.modalInput, ref: 'addressLine1', placeholder: 'address line 1' }),
      r('input', { className: styles.modalInput, ref: 'addressLine2', placeholder: 'address line 2' }),
      r('input', { className: styles.modalInput, ref: 'addressCity', placeholder: 'city' }),
      r('input', { className: styles.modalInput, ref: 'addressState', placeholder: 'state' }),
      r('input', { className: styles.modalInput, ref: 'addressZip', placeholder: 'zip', type: 'number' }),

      r(Spacer),
      r(Button, { text: 'cancel', onClick: this.handleClickCancelNewAddress.bind(this) }),
      r(Button, { text: 'save', onClick: this.handleClickSaveNewAddress.bind(this) })
    ) : null;

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
    this.props.actions.editInput({ address: { selectedToIndex: index }});
  }

  handleClickNewAddress() {
    this.props.actions.editInput({ address: { selectedToIndex: -1 }});
    this.props.actions.editInput({ address: { showModal: true }});
  }

  handleClickSaveNewAddress() {
    this.props.actions.addNewAddress({
      addressName: this.refs.addressName.value,
      addressLine1: this.refs.addressLine1.value,
      addressLine2: this.refs.addressLine2.value,
      addressCountry: 'US',
      addressCity: this.refs.addressCity.value,
      addressState: this.refs.addressState.value,
      addressZip: this.refs.addressZip.value
    });
    const newAddressIndex = this.props.postcard.address.addresses.length - 1;
    this.props.actions.editInput({ address: { selectedToIndex: newAddressIndex }});
    this.props.actions.editInput({ address: { showModal: false }});
  }

  handleClickCancelNewAddress() {
    console.log('cancel');
    this.props.actions.editInput({ address: { showModal: false }});
  }

  handlePreviousClick() {
    this.props.actions.goToStep('previous');
  }

  handleNextClick() {
    this.props.actions.goToStep('next');
  }

}


const styles = csjs`

  .modalInput {
    width: 100%;
  }

`;
