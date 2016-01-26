import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Button, Spacer, Step } from '../components';


export default class WelcomeStep extends React.Component {

  render() {
    return r(Step, { title: 'welcome' },
      r('p', null, 'welcome to post!  you can send postcards to your grandma.'),
      r(Spacer),
      r(Button, { text: 'next', onClick: this.handleNextClick.bind(this) })
    );
  }

  handleNextClick() {
    this.props.actions.goToStep('next');
  }

}


const styles = csjs`



`;
