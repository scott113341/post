import React from "react";
import csjs from "csjs-inject";

import { buttonBackgroundColor } from "../styles/constants";

const Button = (props) => <button className={styles.button} {...props} />;

const styles = csjs`
  .button {
    margin: 0 4px;
    border: none;
    padding: 3px 12px;
    background: ${buttonBackgroundColor};
    color: white;
    font-size: 18px;
    font-weight: 300;
    cursor: pointer;
  }

  .button:disabled {
    background: gray;
    cursor: default;
  }
`;

export default Button;
