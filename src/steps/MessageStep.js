import csjs from "csjs-inject";
import React from "react";

import { Link, Spacer, Step } from "../components/index.js";

export default class MessageStep extends React.Component {
  render() {
    const message = this.props.postcard.message;

    return (
      <Step title="write message">
        <textarea
          className={styles.textarea}
          value={message.content}
          onChange={this.handleInputChange}
        />
        <Spacer />
        <Link onClick={() => this.props.goToStep("back")}>back</Link>
        <Link onClick={() => this.props.goToStep("next")}>next</Link>
      </Step>
    );
  }

  handleInputChange = (e) => {
    this.props.changeMessage(e.target.value);
  };
}

export const styles = csjs`
  .textarea {
    box-sizing: border-box;
    height: 200px;
    width: 100%;
  }
`;
