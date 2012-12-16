requirejs.config({
  baseUrl: '../src',
  paths: {
    tests: '../test/tests',
    mocks: '../test/mocks'
  },
  deps: ['tests/DepsRun']
});