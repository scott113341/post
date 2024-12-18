import React from "react";
import csjs from "csjs-inject";

export default class Spacer extends React.Component {
  static propTypes = {
    height: React.PropTypes.string,
  };

  render() {
    const { height = "30px", ...rest } = this.props;
    const style = { height };

    return <div className={styles.spacer} style={style} {...rest} />;
  }
}

const styles = csjs`
  .spacer {
    background: none;
  }
`;
