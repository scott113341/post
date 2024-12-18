import csjs from "csjs-inject";
import React from "react";

import { Button, Link, Spacer, Step } from "../components/index.js";
import renderBack from "../lib/render-back";
import renderFront from "../lib/render-front";

export default class PreviewStep extends React.Component {
  constructor(props) {
    super(props);

    this.state = { frontRender: null, backRender: null };

    const { address, image, message, preview } = this.props.postcard;
    const size =
      this.props.postcard.size.sizes[this.props.postcard.size.selectedIndex];
    const fromAddress = address.addresses[address.selectedFromIndex];
    const toAddress = address.addresses[address.selectedToIndex];

    renderFront({ image, size, isPreview: true, scale: 300 }).then((blob) => {
      const url = URL.createObjectURL(blob);
      this.setState({ frontRender: url });
    });

    renderBack({
      size,
      message,
      fromAddress,
      toAddress,
      isPreview: true,
      scale: 300,
    }).then((blob) => {
      const url = URL.createObjectURL(blob);
      this.setState({ backRender: url });
    });
  }

  render() {
    const { preview } = this.props.postcard;

    const styles = csjs`
      .render {
        border: 1px solid black;
        box-sizing: border-box;
        width: 400px;
        max-width: 100%;
        height: 100%;
        max-height: 400px;
      }
      
      .sideLabel {
        font-style: italic;
      }
    `;

    const isRendered = !!(this.state.frontRender && this.state.backRender);
    const renderImageUrl =
      preview.side === "front" ? this.state.frontRender : this.state.backRender;

    return (
      <Step title="preview postcard">
        <Spacer height="5px" />
        {isRendered ? (
          <div>
            <img
              src={renderImageUrl}
              className={styles.render}
              alt={`${preview.side} preview render`}
            />
            <Spacer height="5px" />
            <div>
              <p className={styles.sideLabel}>{preview.side}</p>
              <Spacer height="5px" />
              <Button onClick={this.handleFlipClick}>flip</Button>
            </div>
            <Spacer />
            <Link onClick={() => this.props.goToStep("back")}>back</Link>
            <Link onClick={() => this.props.goToStep("next")}>send</Link>
          </div>
        ) : (
          <p className={styles.sideLabel}>rendering...</p>
        )}
      </Step>
    );
  }

  handleFlipClick = () => {
    const newSide =
      this.props.postcard.preview.side === "front" ? "back" : "front";
    this.props.changeSelectedPreviewSide(newSide);
  };
}
