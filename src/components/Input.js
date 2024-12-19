import React from "react";

export default class Input extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  };

  render() {
    const props = { ...this.props, onChange: this.handleChange };
    return <input {...props} />;
  }

  handleChange = (e) => {
    this.props.onChange(e.target.value);
  };
}
