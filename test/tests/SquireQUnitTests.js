/*jshint expr:true */
define(['Squire-QUnit'], function(Squire) {
  var injector = new Squire();
  //does a qunit test still pass?
  test( "hello test", function() {
    ok( 1 == "1", "Passed!" );
  });

  test("Squire test", injector.run(['mocks/Shirt'], function(Shirt) {
    equal( Shirt.color, 'Red', "This should be red");
  }));
  asyncTest("Squire test async", injector.run(['mocks/Shirt'], function(Shirt) {
    equal( Shirt.color, 'Red', "This should be red");
  }));
  
  module("module1", {
    setup: function() {
      this.env = 1;
    }
  });
  test("a test in the core module", function() {
    equal(this.env, 1, "env should be defined on this");
  });
  test("a test in the core module", injector.run(['mocks/Shirt'], function(Shirt) {
    equal( Shirt.color, 'Red', "This should be red");
    equal(this.env, 1, "env should be defined on this");
  }));
});
