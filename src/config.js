'use strict';

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DB_URL: process.env.DATABASE_URL
    || 'postgres://uuebabrshbxpyf:97fe1044dc16e7f68c1ee88dd2b49c868790b0de1389ff802b173f9bf0469e21@ec2-107-20-185-16.compute-1.amazonaws.com:5432/d7d77m4ii61kc0',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}

// https://goofy-mayer-40411d.netlify.com