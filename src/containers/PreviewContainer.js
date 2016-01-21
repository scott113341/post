import React from 'react';
import { createElement as r } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import csjs from 'csjs';

const fs = require('fs'); // brfs via browserify

import * as ValuesActions from '../actions/postcard';
import { IFrame, Postcard } from '../components';
import { getPostcardHTML } from '../reducers/postcard';
import container from '../styles/container';


class StepContainer extends React.Component {

  static propTypes = {
    html: React.PropTypes.string.isRequired
  };

  render() {
    const { html } = this.props;
    return r('div', { className: styles.preview },
      //r(Postcard, { html, className: styles.iframe })
      r(IFrame, { html, className: styles.iframe, scrolling: 'no', frameBorder: '0' })
    );
  }

}


function mapStateToProps(state) {
  return {
    html: getPostcardHTML(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ValuesActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StepContainer);
