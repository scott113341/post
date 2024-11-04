import csjs from 'csjs-inject';
import React from 'react';

import '../styles/global.js';

import { Header } from '../components/index.js';

export const StepLayout = props => {
  return (
    <div>
      <Header />
      <div className={styles.container}>
        {props.children}
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

export default StepLayout;
