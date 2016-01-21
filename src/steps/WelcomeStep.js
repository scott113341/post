import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Button, Step } from '../components';
import stepStyles from '../styles/step';


export default class WelcomeStep extends React.Component {

  render() {
    console.log(this);

    return r(Step, { title: 'welcome' },
      r('p', null, 'welcome to post!  you can send postcards to your grandma.'),
      r('br'),
      r('br'),
      r(Button, { text: 'next', onClick: this.handleNextClick.bind(this) })
    );
  }

  handleNextClick() {
    console.log('meowwwwwwww');
    console.log(this);
    this.props.actions.nextStep();
  }

}


const styles = csjs`



`;
