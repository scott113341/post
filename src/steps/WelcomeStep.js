import React, { createElement as r } from 'react';

import { Link, Spacer, Step } from '../components/index.js';

export default class WelcomeStep extends React.Component {

  render () {
    console.log(this);

    return r(Step, { title: 'welcome to post' },
      r(Spacer, { height: '10px' }),
      r('p', null, 'the easiest way to send postcards to people'),
      r(Spacer, { height: '10px' }),
      r('p', null,
        'requires a ',
        r('a', { href: 'https://dashboard.lob.com/#/register', target: '_blank', rel: 'nofollow' }, 'lob account')
      ),

      r(Spacer),
      r(Link, { to: '/lob-setup' }, 'next')
    );
  }

}
