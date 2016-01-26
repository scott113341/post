import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';

import { Button, Spacer, Step } from '../components';


export default class WelcomeStep extends React.Component {

  render() {
    return r(Step, { title: 'welcome to post' },
      r(Spacer, { height: '10px' }),
      r('p', null, 'the easiest way to send postcards to people'),
      r(Spacer, { height: '10px' }),
      r('p', null,
        'requires a ',
        r('a', { href: 'https://dashboard.lob.com/#/register', target: '_blank' }, 'lob account')
      ),

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
