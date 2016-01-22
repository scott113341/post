import blobFromDataUri from 'blueimp-canvas-to-blob';


export function clone() {
  return Object.assign({}, ...arguments);
}


/**
 * Attempts to load a JSON value from localStorage.
 * @param {string} key The localStorage key.
 * @param defaultValue The default value returned if item is not found.
 * @returns {*}
 */
export function getFromLocalStorage(key, defaultValue=null) {
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
export function formatPrice(price) {
  return `$${price.toFixed(2)}`;
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
      request.addEventListener('load', requestFinished);
      request.open('POST', LOB_ENDPOINT, true);
      request.setRequestHeader('Authorization', `Basic ${btoa(apiKey+':')}`);
      request.send(form);

      function requestFinished(e) {
        resolve(e.target);
      }
    }
    catch (e) {
      console.log('wtfffffffff', e);
    }
  });
}


export async function drawFront(size, imgData, dpi) {
  try {
    const { width, height } = size;

    var canvas = document.createElement('canvas');
    canvas.width = width * dpi;
    canvas.height = height * dpi;

    var ctx = canvas.getContext('2d');
    const img = await rotateImageToLandscape(imgData);

    const trimSides = (img.width / img.height) > (width / height);
    const sHeight = trimSides ? img.height : (height / width * img.width);
    const sWidth =  trimSides ? (width / height * img.height) : img.width;
    const sx = trimSides ? ((img.width - sWidth) / 2) : 0;
    const sy = trimSides ? 0 : ((img.height - sHeight) / 2);
    const dx = 0;
    const dy = 0;
    const dWidth = width * dpi;
    const dHeight = height * dpi;
    ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

    return canvas.toDataURL();
  }

  catch (e) {
    console.log('wtffffff', e);
  }
}


export async function drawBack(size, dpi) {
  const { width, height } = size;

  var canvas = document.createElement('canvas');
  canvas.width = width * dpi;
  canvas.height = height * dpi;

  return canvas.toDataURL();
}


export async function rotateImageToLandscape(data) {
  try {
    return new Promise(async resolve => {
      // return loaded image if already landscape
      var img = await loadImageFromData(data);
      if (img.width >= img.height) return resolve(img);

      // make a canvas with switched width/height
      var canvas = document.createElement('canvas');
      canvas.width = img.height;
      canvas.height = img.width;

      // draw image on rotated canvas
      var ctx = canvas.getContext('2d');
      ctx.save();
      ctx.translate(canvas.width, canvas.height/canvas.width);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(img, 0, 0);
      ctx.restore();

      // render and return loaded image
      const rotatedData = canvas.toDataURL();
      const rotatedImg = await loadImageFromData(rotatedData);
      return resolve(rotatedImg);
    });
  }
  catch (e) {
    console.log('error!!!!!!!!!!!!!', e);
  }
}


export async function loadImageFromData(data) {
  console.log('loadImageFromData');
  return new Promise(resolve => {
    var img = new Image();
    img.src = data;
    img.onload = async () => {
      console.log('img loaded');
      resolve(img);
    }
  });
}
