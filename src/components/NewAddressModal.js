import csjs from "csjs-inject";
import React from "react";
import { Button, Modal, Spacer } from "./index.js";

export default class NewAddressModal extends React.Component {
  static propTypes = {
    show: React.PropTypes.bool.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
  };

  render() {
    if (!this.props.show) return null;

    const className = styles.input;

    return (
      <Modal title="new address">
        <input
          className={className}
          ref="addressName"
          placeholder="name"
          autoComplete="shipping name"
        />
        <input
          className={className}
          ref="addressLine1"
          placeholder="address line 1"
          autoComplete="shipping address-line1"
        />
        <input
          className={className}
          ref="addressLine2"
          placeholder="address line 2"
          autoComplete="shipping address-line2"
        />
        <input
          className={className}
          ref="addressCity"
          placeholder="city"
          autoComplete="shipping address-level2"
        />
        <input
          className={className}
          ref="addressState"
          placeholder="state abbreviation"
          autoCapitalize="characters"
          autoComplete="shipping address-level1"
        />
        <input
          className={className}
          ref="addressZip"
          placeholder="zip"
          type="number"
          autoCapitalize="characters"
          autoComplete="shipping postal-code"
        />
        <Spacer />
        <Button onClick={this.handleCancelClick}>cancel</Button>
        <Button onClick={this.handleSaveClick}>save</Button>
      </Modal>
    );
  }

  handleCancelClick = () => {
    this.props.onCancel();
  };

  handleSaveClick = () => {
    this.props.onSave({
      addressName: this.refs.addressName.value,
      addressLine1: this.refs.addressLine1.value,
      addressLine2: this.refs.addressLine2.value,
      addressCountry: "US",
      addressCity: this.refs.addressCity.value,
      addressState: this.refs.addressState.value,
      addressZip: this.refs.addressZip.value,
    });
  };
}

export const styles = csjs`
  .input {
    width: 100%;
  }
`;
