import React from 'react';
import { createElement as r } from 'react';
import csjs from 'csjs';
import classNames from 'classnames';


export default class NewAddressModal extends React.Component {

  static propTypes = {
    onCancel: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired,
  };

  handleClick() {
    this.props.onClick();
  }

  render() {
    const modal = address.showModal ? r(Modal, { title: 'new address' },
      r('input', { className: styles.modalInput, ref: 'addressName', placeholder: 'name' }),
      r('input', { className: styles.modalInput, ref: 'addressLine1', placeholder: 'address line 1' }),
      r('input', { className: styles.modalInput, ref: 'addressLine2', placeholder: 'address line 2' }),
      r('input', { className: styles.modalInput, ref: 'addressCity', placeholder: 'city' }),
      r('input', { className: styles.modalInput, ref: 'addressState', placeholder: 'state' }),
      r('input', { className: styles.modalInput, ref: 'addressZip', placeholder: 'zip', type: 'number' }),

      r(Spacer),
      r(Button, { text: 'cancel', onClick: this.handleClickCancelNewAddress.bind(this) }),
      r(Button, { text: 'save', onClick: this.handleClickSaveNewAddress.bind(this) })
    ) : null;
  }

}


const styles = csjs`

  .backdrop {
    display: flex;
    flex-direction: column;
    justify-content: center;

    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.8);
    pointer-events: none;
  }

  .modal {
    position: relative;
    box-sizing: border-box;
    margin: 0 auto;
    padding: 10px;
    width: 90%;
    background: white;
    pointer-events: all;
  }

  .title {
    padding-bottom: 5px;
    border-bottom: 1px solid gray;
    margin-bottom: 12px;
  }

`;
