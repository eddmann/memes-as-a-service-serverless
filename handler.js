'use strict';

const gm = require('gm').subClass({ imageMagick: true });
const fs = require('fs');

const { IMAGES_DIR, TEXT_SIZE, TEXT_PADDING } = process.env;

const parseText = text => (text || '').toUpperCase();
const getImages = () => fs.readdirSync(IMAGES_DIR);
const parseImage = image => getImages().find(file => file.indexOf(image) === 0);
const random = arr => arr[Math.floor(Math.random() * arr.length)];
const randomImage = () => random(getImages());

module.exports.meme = (event, context, callback) => {
  const input = event.queryStringParameters || {};

  const top = parseText(input.top);
  const bottom = parseText(input.bottom);
  const image = parseImage(input.image) || randomImage();

  const meme = gm(`${IMAGES_DIR}${image}`);

  meme.size(function (err, { height }) {
    meme
      .font('./impact.ttf', TEXT_SIZE)
      .fill('white')
      .stroke('black', 2)
      .drawText(0, -(height / 2 - TEXT_PADDING), top, 'center')
      .drawText(0, height / 2 - TEXT_PADDING, bottom, 'center')
      .toBuffer(function (err, buffer) {
        callback(null, {
          statusCode: 200,
          headers: { 'Content-Type': 'image/jpeg' },
          body: buffer.toString('base64'),
          isBase64Encoded: true,
        });
      });
  });
};
