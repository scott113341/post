import React from 'react';
import { createElement as r } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import csjs from 'csjs';

import * as PostcardActions from '../actions/postcard';

import * as steps from '../steps';


class StepContainer extends React.Component {

  static propTypes = {
    postcard: React.PropTypes.object.isRequired
  };

  render() {
    const { stepIndex } = this.props.postcard;
    const stepName = stepOrder[stepIndex];
    const ThisStep = steps[stepName];

    return r('div', { className: styles.stepContainer },
      r(ThisStep, { ...this.props })
    );
  }

}


const stepOrder = [
  'WelcomeStep',
  'LobStep',
  'SizeStep',
  'ImageStep',
  'MessageStep',
  'FromAddressStep',
  'ToAddressStep',
  'PreviewStep',
  'SendStep',
];


const styles = csjs`

  .stepContainer {
    margin: 0 auto;
    padding: 3px 6px 25px;
    max-width: 800px;
  }

`;


function mapStateToProps(state) {
  return {
    postcard: state.postcard
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(PostcardActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StepContainer);
