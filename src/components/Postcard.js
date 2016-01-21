import React from 'react';
import { createElement as r } from 'react';


export default class IFrame extends React.Component {

  static propTypes = {
    html: React.PropTypes.string.isRequired
  };

  render() {
    return r('iframe', { ref: 'iframe', ...this.props });
  }

  componentDidMount() {
    this.renderFrameContents();
  }

  componentDidUpdate() {
    this.renderFrameContents();
  }

  renderFrameContents() {
    var doc = this.refs.iframe.contentDocument;

    doc.open();
    doc.write(this.props.html);
    doc.close();
  }

}
