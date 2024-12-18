import React from "react";

import {
  Cell,
  Link,
  NewAddressModal,
  Spacer,
  Step,
} from "../components/index.js";

export default class ToAddressStep extends React.Component {
  render() {
    const address = this.props.postcard.address;
    const disabled = !this.isValid();

    const modal = (
      <NewAddressModal
        show={address.showModal}
        onCancel={this.handleClickCancelModal}
        onSave={this.handleClickSaveModal}
      />
    );

    return (
      <Step title="to address">
        {address.addresses.map((addressOption, index) => {
          const selected = index === address.selectedToIndex;
          return (
            <Cell
              key={index}
              onClick={() => this.handleClickAddress(index)}
              selected={selected}
            >
              <p>{addressOption.addressName}</p>
              <p>{addressOption.addressLine1}</p>
              <p>{addressOption.addressLine2}</p>
              <p>{`${addressOption.addressCity}, ${addressOption.addressState} ${addressOption.addressZip}`}</p>
            </Cell>
          );
        })}

        <Cell onClick={this.handleClickNewAddress} last>
          <p>new address</p>
        </Cell>

        {modal}

        <Spacer />
        <Link onClick={() => this.props.goToStep("back")}>back</Link>
        <Link onClick={() => this.props.goToStep("next")} disabled={disabled}>
          next
        </Link>
      </Step>
    );
  }

  isValid() {
    return this.props.postcard.address.selectedToIndex >= 0;
  }

  handleClickAddress = (index) => {
    this.props.changeSelectedAddress("to", index);
  };

  handleClickNewAddress = () => {
    this.props.changeSelectedAddress("to", -1);
    this.props.showNewAddressModal(true);
  };

  handleClickCancelModal = () => {
    this.props.showNewAddressModal(false);
  };

  handleClickSaveModal = (address) => {
    this.props.addAddress(address);
    const newAddressIndex = this.props.postcard.address.addresses.length;
    this.props.changeSelectedAddress("to", newAddressIndex);
    this.props.showNewAddressModal(false);
  };
}
