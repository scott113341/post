import React from "react";
import csjs from "csjs-inject";

export default class Spinner extends React.Component {
  render() {
    return (
      <div className={styles.spinner}>
        <div className={styles.bar1}></div>
        <div className={styles.bar2}></div>
        <div className={styles.bar3}></div>
        <div className={styles.bar4}></div>
      </div>
    );
  }
}

const styles = csjs`
  .spinner {
    margin: 0 auto;
    width: 70px;
    text-align: center;
  }

  .bar {
    width: 9px;
    height: 18px;
    margin: 0 3px;
    background-color: #333;
    display: inline-block;
    animation: bar 1.6s infinite ease-in-out both;
  }

  .bar1 extends .bar {
    animation-delay: -0.6s;
  }

  .bar2 extends .bar {
    animation-delay: -0.4s;
  }

  .bar3 extends .bar {
    animation-delay: -0.2s;
  }

  .bar4 extends .bar {
    animation-delay: 0s;
  }

  @keyframes bar {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1.0);
    }
  }
`;
