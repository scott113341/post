import React from "react";

import { Link, Spacer, Step } from "../components/index.js";
import { formatPrice } from "../util.js";

export default class SizeStep extends React.Component {
  render() {
    const size = this.props.postcard.size;
    const disabled = !this.isValid();

    return (
      <Step title="postcard size">
        <select
          value={size.selectedIndex}
          onChange={this.handleSizeSelectChange}
        >
          {size.sizes.map((sizeOption, index) => (
            <option key={index} value={index}>
              {`${sizeOption.display} - ${formatPrice(sizeOption.price)}`}
            </option>
          ))}
        </select>

        <Spacer />
        <Link onClick={() => this.props.goToStep("back")}>back</Link>
        <Link onClick={() => this.props.goToStep("next")} disabled={disabled}>
          next
        </Link>
      </Step>
    );
  }

  isValid() {
    return this.props.postcard.size.selectedIndex >= 0;
  }

  handleSizeSelectChange = (e) => {
    this.props.changeSelectedSize(e.target.value);
  };
}
