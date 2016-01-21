import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Header, Step } from '../components';
import StepContainer from './StepContainer';

import global from '../styles/global';


export default class AppContainer extends React.Component {

  render() {
    return r('div', null,
      r(Header),
      r(StepContainer)
    );
  }

}


const styles = csjs`



`;
