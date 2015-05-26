requirejs = require('requirejs');
requirejs.config({
  baseUrl: '',
  paths: {
    tests: 'test/tests',
    mocks: 'test/mocks'
  }
});

chai = require('chai');
chai.should();
require('./tests/SquireTests');