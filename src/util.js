export function clone () {
  return Object.assign({}, ...arguments);
}

/**
 * Attempts to load a JSON value from localStorage.
 * @param {string} key The localStorage key.
 * @param defaultValue The default value returned if item is not found.
 * @returns {*}
 */
export function getFromLocalStorage (key, defaultValue = null) {
  var value = localStorage.getItem(key);
  try {
    value = JSON.parse(value);
  }
  catch (e) {}
  const isStored = value !== null;
  return isStored ? value : defaultValue;
}

/**
 * Formats a number into US dollars.
 * @param {number} price The amount to be formatted.
 * @returns {string}
 */
export function formatPrice (price) {
  return `$${price.toFixed(2)}`;
}

export async function orderPostcard (apiKey, to, from, size, front, back) {
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
      form.append('use_type', 'operational');
      form.append('size', size);
      form.append('front', new Blob([front], { type: 'text/plain' }), 'front.html');
      form.append('back', new Blob([back], { type: 'text/plain' }), 'back.html');

      var request = new XMLHttpRequest();
      request.addEventListener('load', requestFinished);
      request.open('POST', LOB_ENDPOINT, true);
      request.setRequestHeader('Authorization', `Basic ${btoa(apiKey + ':')}`);
      request.send(form);

      function requestFinished (e) {
        resolve(e.target);
      }
    }
    catch (e) {
      console.log(e);
    }
  });
}

export async function loadImageFromData (data) {
  return new Promise(resolve => {
    var img = new Image();
    img.src = data;
    img.onload = () => resolve(img);
  });
}

export function loadFileAsDataUrl (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export function promisify(fn, thisArg = null) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn.call(thisArg, ...args, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  };
}
