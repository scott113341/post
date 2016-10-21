import csjs from 'csjs-inject';
import React, { createElemet as r } from 'react';
import { connect } from 'react-redux';

import '../static/reset.css';
import '../styles/global.js';

import { Header } from '../components/index.js';
import * as postcard from '../store/postcard.js';

export const StepLayout = props => {
  return (
    <div>
      <Header />
      <div className={styles.container}>
        {React.cloneElement(props.children, props)}
      </div>
    </div>
  );
};

export const styles = csjs`
  .container {
    margin: 0 auto;
    padding: 3px 6px 25px;
    max-width: 800px;
  }
`;

const mapStateToProps = (state) => ({
  postcard : state.postcard
});

const postcardActions = Object.keys(postcard).reduce((a, c) => {
  if (typeof postcard[c] === 'function') return Object.assign(a, { [c]: postcard[c] });
  return a;
}, {});

export default connect(mapStateToProps, postcardActions)(StepLayout);
