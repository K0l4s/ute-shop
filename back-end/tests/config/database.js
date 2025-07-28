const config = require('../../src/config/config.js');

process.env.NODE_ENV = 'test';

module.exports = config.test;