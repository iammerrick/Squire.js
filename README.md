# Squire.js

Squire.js is a dependency injector for Require.js users to make mocking dependencies easy!

![Squire.js - The Squire](http://f.cl.ly/items/2e3f3x3b0K132R3c2t06/squire.png)

## API

### constructor

First you have to load Squire in, just like any other Require.js module. Beyond this example the rest of the documentation will assume you already loaded Squire   as a module dependency.

#### Default Configuration

```javascript
define(['Squire'], function(Squire) {
  var injector = new Squire();
});
```

#### Different Context

```javascript
var injector = new Squire('other-requirejs-context');
```

### require(Array dependencies, Function callback)

```javascript
var injector = new Squire();
injector.require(['utilities/Calculator'], function(Calculator) {
  // Calculator has been loaded.
});
```

### mock(String name | Object(name: mock), Object mock)

The mock method lets you pass in mocks to be used for a given modules dependency. The first argument is the module name, the second argument is the mock itself. For multiple mocks you can pass an object, the objects key will be the path and the corresponding value will be used as the mock.

```javascript
var injector = new Squire();

// Key value mocking.
injector.mock(dependencyName, mockForDependency);

// You can pass an object literal as well.
injector.mock(dependencyNameAndMock);
```

```javascript
var injector = new Squire();
injector.mock('CrazyCalculatorDependency', {
    sin: 10
  })
  .require(['utilities/Calculator'], function(Calculator) {
    // The Calculators dependency 'CrazyCalculatorDependency' has been mocked to
    // use the object literal { sin: 10 } that we passed in.
  });
```

### store(String name | Array names)

The store method allows you to get a pointer back to a dependency so you can stub it.

```javascript
var injector = new Squire();
injector
  .store('CrazyCalculatorDependency')
  .require(['utilities/Calculator', 'mocks'], function(Calculator, mocks) {
    // mocks.store.CrazyCalculatorDependency is the Calculators dependency, you can
    // manipulate it or stub it with Sinon now.
  });
```

### clean(Optional (String name | Array names))

The clean method allows you to remove mocks by name from your Squire instance, or remove all mocks.

```javascript
var injector = new Squire();
injector.mock('something', { other: 'mock'});

// You do stuff but want to be able to get the real 'something' now.
injector.clean('something');

// Or a collection of mocks
injector.clean(['something', 'something/else']);
```

Or clean out all the mocks stored in a Squire instance.

```javascript
injector.clean();
```

### remove()

Remove all the dependencies loaded by this instance of Squire.

```javascript
injector.remove();
```

### run()

Run generates a function that will receive a done callback and execute it after your test function is complete. Particularly useful for frameworks where asynchrony is handled with a callback. Here is an example with Mocha.js. Jasmine can offer this callback approach using [Jasmin.Async](http://lostechies.com/derickbailey/2012/08/18/jasmine-async-making-asynchronous-testing-with-jasmine-suck-less/).

```javascript
it('should execute this test using run', injector.run(['mocks/Shirt'], function(Shirt) {
  Shirt.color.should.equal('Red');
}));
```







### Squire-QUnit

Squire-QUnit is a small addon to qunit to make writing tests that use Squire.js a little easier.
It overwrites test and manages all the handling of stop/start for you.
Examples of how to set up qunit to run with AMD and squire.js can be found inside /tests/tests-qunit.html
Note - Your injector will have to be defined as global to your test module

Example usage 

```javascript
define(['Squire-QUnit'], function(Squire) {
  var injector = new Squire();

  test("Squire test", injector.run(['mocks/Shirt'], function(Shirt) {
    equal( Shirt.color, 'Red', "This should be red");
  }));
});

```