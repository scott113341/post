import blobFromDataUri from 'blueimp-canvas-to-blob';
var fs = require('fs'); // brfs via browserify


export function clone() {
  return Object.assign({}, ...arguments);
}


/**
 * Attempts to load a value from localStorage.
 * @param {string} key The localStorage key.
 * @param defaultValue The default value returned if item is not found.
 * @returns {*}
 */
export function getFromLocalStorage(key, defaultValue=null) {
  const value = localStorage.getItem(key);
  const isStored = value !== null;
  return isStored ? value : defaultValue;
}


export function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}


export function getTemplate(size, side) {
  const fileName = `${size}.${side}`;
  return String(getFile(fileName));

  function getFile(fileName) {
    switch (fileName) {
      case '4x6.front':
        return fs.readFileSync(`${__dirname}/templates/4x6.front.html`);
      case '4x6.back':
        return fs.readFileSync(`${__dirname}/templates/4x6.back.html`);
      case '6x11.front':
        return fs.readFileSync(`${__dirname}/templates/6x11.front.html`);
      case '6x11.back':
        return fs.readFileSync(`${__dirname}/templates/6x11.back.html`);
      default:
        return 'meow';
    }
  }
}


export async function orderPostcard(apiKey, to, from, size, front, back) {
  const LOB_ENDPOINT = 'https://api.lob.com/v1/postcards';

  return new Promise(resolve => {
    try {
      var form = new FormData();
      form.append('to[name]', to.addressName);
      form.append('to[address_line1]', to.addressLine1);
      form.append('to[address_line2]', to.addressLine2);
      form.append('to[address_country]', to.addressCountry);
      form.append('to[address_city]', to.addressCity);
      form.append('to[address_state]', to.addressState);
      form.append('to[address_zip]', to.addressZip);
      form.append('from[name]', from.addressName);
      form.append('from[address_line1]', from.addressLine1);
      form.append('from[address_line2]', from.addressLine2);
      form.append('from[address_country]', from.addressCountry);
      form.append('from[address_city]', from.addressCity);
      form.append('from[address_state]', from.addressState);
      form.append('from[address_zip]', from.addressZip);
      form.append('size', size);
      form.append('front', blobFromDataUri(front), 'front.png');
      form.append('back', blobFromDataUri(back), 'back.png');

      var request = new XMLHttpRequest();
      request.open('POST', LOB_ENDPOINT, true);
      request.setRequestHeader('Authorization', `Basic ${btoa(apiKey+':')}`);
      request.send(form);
    }
    catch (e) {
      console.log('wtfffffffff', e);
    }
  });
}
