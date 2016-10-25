import React, { createElement as r } from 'react';

import resetCss from '../styles/reset-css.js';

export default function renderFront ({ image, size, isPreview = false, scale = 100, ...props }) {
  const img = image;
  const { width, height } = size;
  const d = v => (v * scale).toFixed(6);

  const rotate = width < height;

  var trimSides, degrees, scaled, translate;
  if (rotate) {
    trimSides = (img.width / img.height) < (height / width);
    degrees = [90, img.height / 2, img.height / 2];
    scaled = trimSides ? (d(height) / img.width) : (d(width) / img.height);
    translate = trimSides ? [-((scaled * img.height - d(width)) / 2), 0] : [0, -((scaled * img.width - d(height)) / 2)];
  }
  else {
    trimSides = (img.width / img.height) > (width / height);
    degrees = [0];
    scaled = trimSides ? (d(height) / img.height) : (d(width) / img.width);
    translate = trimSides ? [-((scaled * img.width - d(width)) / 2), 0] : [0, -((scaled * img.height - d(height)) / 2)];
  }

  return (
    <div>
      <style>{resetCss}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={d(width)}
        height={d(height)}
        viewBox={`0 0 ${d(width)} ${d(height)}`}
        {...props}>

        <image
          width={img.width}
          height={img.height}
          transform={`translate(${translate.join(' ')}) scale(${scaled}) rotate(${degrees.join(' ')})`}
          xlinkHref={img.data}>
        </image>

      </svg>
    </div>
  );
}
