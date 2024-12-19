import React from "react";
import { connect } from "react-redux";

import "../styles/global.js";

import * as postcard from "../store/postcard.js";
import * as steps from "../steps";
import StepLayout from "../layouts/StepLayout";

const STEPS = [
  steps.WelcomeStep,
  steps.LobStep,
  steps.SizeStep,
  steps.ImageStep,
  steps.MessageStep,
  steps.FromAddressStep,
  steps.ToAddressStep,
  steps.PreviewStep,
  steps.SendStep,
];

export const StepRouter = (props) => {
  const { stepIndex } = props.postcard;
  const stepComponent = STEPS[stepIndex];
  const stepElement = React.createElement(stepComponent, props);

  return <StepLayout>{stepElement}</StepLayout>;
};

const mapStateToProps = (state) => ({
  postcard: state.postcard,
});

const postcardActions = Object.keys(postcard).reduce((a, c) => {
  if (typeof postcard[c] === "function") {
    return Object.assign(a, { [c]: postcard[c] });
  } else {
    return a;
  }
}, {});

export default connect(mapStateToProps, postcardActions)(StepRouter);
