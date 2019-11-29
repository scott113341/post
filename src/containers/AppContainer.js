import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';

import StepRouter from './StepRouter';

class AppContainer extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  shouldComponentUpdate () {
    return false;
  }

  render () {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <StepRouter />
        </div>
      </Provider>
    );
  }
}

export default AppContainer;
