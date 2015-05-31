requirejs = require('requirejs');
requirejs.config({
  baseUrl: 'src',
  paths: {
    tests: '../test/tests',
    mocks: '../test/mocks'
  }
});

chai = require('chai');
chai.should();

describe("Using Node", function() {
  var Squire;
  before(function(done){
    requirejs(['Squire'], function(loaded){
      Squire = loaded;
      done();
    });
  });

  require('./tests/SquireTests');

  it("can be required via requirejs", function(){
    var squireInstance = new Squire();
    squireInstance.should.be.an.instanceof(Squire);
  });

  it("should not mess with other requires", function () {
    var squire = new Squire();
    requirejs(['mocks/FullyDressed'],function(clothes){
      clothes.pant.type.should.equal("Jeans");
    });
    squire
    .mock("mocks/Pant", {type: "Shorts"})
    .require(['mocks/FullyDressed'], function (clothes) {
      clothes.pant.type.should.equal("Shorts");
    });
  });
});