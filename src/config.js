'use strict';

module.exports = {
  PORT: process.env.PORT || 80,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000/',
  DB_URL: process.env.DATABASE_URL
    || 'postgresql://spaceuser:password@localhost/spaced-repitition',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}
