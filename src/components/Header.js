import React from "react";
import csjs from "csjs-inject";

import { headerBackgroundColor } from "../styles/constants";

export default class Header extends React.Component {
  render() {
    return (
      <header className={styles.header}>
        <h1 className={styles.text}>post</h1>
      </header>
    );
  }
}

const styles = csjs`
  .header {
    padding: 5px 0;
    background: ${headerBackgroundColor};
  }

  .text {
    font-size: 18px;
    text-align: center;
    color: white;
  }
`;
