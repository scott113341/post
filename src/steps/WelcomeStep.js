import React from "react";

import { Link, Spacer, Step } from "../components/index.js";

export default class WelcomeStep extends React.Component {
  render() {
    return (
      <Step title="welcome to post">
        <Spacer height="10px" />
        <p>the easiest way to send postcards to people</p>
        <Spacer height="10px" />
        <p>
          requires a{" "}
          <a
            href="https://dashboard.lob.com/#/register"
            target="_blank"
            rel="nofollow"
          >
            lob account
          </a>
        </p>
        <Spacer />
        <Link onClick={() => this.props.goToStep("next")}>next</Link>
      </Step>
    );
  }
}
