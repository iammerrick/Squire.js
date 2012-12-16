mocha.setup('bdd');
chai.should();

require(['tests/SquireTests'], function() {
  mocha.run();
});