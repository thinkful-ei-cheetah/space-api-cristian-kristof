'use strict';

const whitelist = ['http://localhost:3000', 'https://goofy-mayer-40411d.netlify.com'];

module.exports = function origin(origin, callback) {
  if (whitelist.indexOf(origin) !== -1 || !origin) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};