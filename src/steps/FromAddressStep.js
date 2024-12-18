import React from "react";

import {
  Cell,
  Button,
  Link,
  NewAddressModal,
  Spacer,
  Step,
} from "../components/index.js";

export default class FromAddressStep extends React.Component {
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
      <Step title="from address">
        {address.addresses.map((addressOption, index) => {
          const selected = index === address.selectedFromIndex;
          const deleteButtonSpacer = selected ? <Spacer height="10px" /> : null;
          const deleteButton = selected ? (
            <Button onClick={(e) => this.handleClickDeleteAddress(index, e)}>
              delete
            </Button>
          ) : null;
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
              {deleteButtonSpacer}
              {deleteButton}
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
    return this.props.postcard.address.selectedFromIndex >= 0;
  }

  handleClickAddress = (index) => {
    this.props.changeSelectedAddress("from", index);
  };

  handleClickDeleteAddress = (index, e) => {
    e.stopPropagation();
    this.props.deleteAddress(index);
  };

  handleClickNewAddress = () => {
    this.props.changeSelectedAddress("from", -1);
    this.props.showNewAddressModal(true);
  };

  handleClickCancelModal = () => {
    this.props.showNewAddressModal(false);
  };

  handleClickSaveModal = (address) => {
    this.props.addAddress(address);
    const newAddressIndex = this.props.postcard.address.addresses.length;
    this.props.changeSelectedAddress("from", newAddressIndex);
    this.props.showNewAddressModal(false);
  };
}
