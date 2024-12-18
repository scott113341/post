import csjs from "csjs-inject";
import React from "react";

import { loadFileAsDataUrl, loadImageFromData } from "../util.js";
import { Button, Link, Spacer, Step } from "../components/index.js";

export default class ImageStep extends React.Component {
  render() {
    const image = this.props.postcard.image;
    const disabled = !this.isValid();

    const img = image?.data?.length ? (
      <div>
        <Spacer height="20px" />
        <img className={styles.image} src={image.data} />
      </div>
    ) : null;

    return (
      <Step title="choose a photo">
        <Button onClick={this.handleBrowseButtonClick}>browse</Button>
        <input
          className={styles.input}
          ref={this.setFileInputRef}
          type="file"
          accept="image/*"
          onChange={this.handleImageLoad}
        />
        {img}
        <Spacer />
        <Link onClick={() => this.props.goToStep("back")}>back</Link>
        <Link onClick={() => this.props.goToStep("next")} disabled={disabled}>
          next
        </Link>
      </Step>
    );
  }

  isValid = () => {
    return this.props.postcard.image?.data?.indexOf("data:image") === 0;
  };

  setFileInputRef = (e) => {
    this.fileInput = e;
  };

  handleBrowseButtonClick = () => {
    this.fileInput.click();
  };

  handleImageLoad = async (e) => {
    this.props.changeImage(this.props.postcard.initialState.image);
    const file = e.target.files[0];
    const data = await loadFileAsDataUrl(file);
    const image = await loadImageFromData(data);
    this.props.changeImage({
      data,
      width: image.width,
      height: image.height,
    });
  };
}

export const styles = csjs`
  .input {
    border: none;
    overflow: hidden;
    position: absolute;
    width: 0;
    z-index: -1;
  }

  .image {
    max-height: 300px;
    max-width: 100%;
  }
`;
