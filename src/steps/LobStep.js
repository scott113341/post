import React from "react";

import { Input, Link, Spacer, Step } from "../components/index.js";

export default class LobStep extends React.Component {
  render() {
    const apiKey = this.props.postcard.lob.apiKey;
    const disabled = !this.isValid();

    return (
      <Step title="lob account">
        <p>enter your lob api key</p>
        <Spacer height="10px" />
        <Input
          value={apiKey}
          onChange={this.handleApiKeyInputChange}
          autoCapitalize="none"
        />
        <Spacer />
        <Link onClick={() => this.props.goToStep("back")}>back</Link>
        <Link onClick={() => this.props.goToStep("next")} disabled={disabled}>
          next
        </Link>
      </Step>
    );
  }

  isValid() {
    return this.props.postcard.lob.apiKey.length === 40;
  }

  handleApiKeyInputChange = (apiKey) => {
    this.props.changeLobApiKey(apiKey);
  };
}
