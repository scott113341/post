import React from 'react';
import { createElement as r } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import csjs from 'csjs';

import * as ValuesActions from '../actions/postcard';
import { Input } from '../components';
import { getPostcardHTML } from '../reducers/postcard';
import container from '../styles/container';


class EditorContainer extends React.Component {

  static propTypes = {
    html: React.PropTypes.string.isRequired
  };

  render() {
    const { html } = this.props;
    return r('div', { className: styles.editor },
      r(Input, { html })
    );
  }

}


console.log('wtf');
console.log(container);
const styles = csjs`

  .editor extends ${container.container} {
    color: red;
  }

`;


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
)(EditorContainer);
