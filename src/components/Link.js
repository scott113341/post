import classnames from "classnames";
import csjs from "csjs-inject";
import React from "react";

import { buttonBackgroundColor } from "../styles/constants";

const PostLink = ({ disabled, ...rest }) => {
  const className = classnames({
    [styles.button]: true,
    [styles.disabled]: disabled,
  });
  return <a className={className} {...rest} />;
};

const styles = csjs`
  .button {
    background: ${buttonBackgroundColor};
    border: none;
    color: white !important;
    cursor: pointer;
    font-size: 18px;
    font-weight: 300;
    margin: 0 4px;
    padding: 3px 12px;
    text-decoration: none;
  }

  .disabled {
    background: gray;
    cursor: default;
    pointer-events: none;
  }
`;

export default PostLink;
