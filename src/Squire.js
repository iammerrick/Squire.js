define(function() {
  
  /**
   * Utility Functions
   */
   
  var toString = Object.prototype.toString;
  var isArray = function(arr) {
    return toString.call(arr) === '[object Array]';
  };
  
  /**
   * Create a context name incrementor.
   */
  var idCounter = 0;
  var uniqueId = function(prefix) {
    var id = idCounter++;
    return 'context' + id;
  };

  var Squire = function() {
    this.mocks = {};
    this._store = [];
    this.requiredCallbacks = [];
    this.configure.apply(this, arguments);
  };

  /**
   * Hook to call when the require function is called.
   */
  Squire.prototype.onRequired = function(cb) {
    this.requiredCallbacks.push(cb);
  };

  /**
   * Configuration of Squire.js, called from constructor or manually takes the
   * name of a require.js context to configure it.
   */
  Squire.prototype.configure = function(context) {
    var configuration = {};
    var property;

    this.id = uniqueId();

    // Default the context
    if (typeof context === 'undefined') {
      context = '_'; // Default require.js context
    }

    context = requirejs.s.contexts[context];

    if ( ! context) {
      throw new Error('This context has not been created!');
    }

    for (property in context.config) {
      if(property !== 'deps' && context.config.hasOwnProperty(property)) {
        configuration[property] = context.config[property];
      }
    }

    configuration.context = this.id;

    this.load = requirejs.config(configuration);
  };

  Squire.prototype.mock = function(path, mock) {
    var alias;
    if (typeof path === 'object') {
      for (alias in path) {
        this.mock(alias, path[alias]);
      }
    }
    this.mocks[path] = mock;

    return this;
  };

  Squire.prototype.store = function(path) {
    if (path && typeof path === 'string') {
      this._store.push(path);
    } else if(path && isArray(path)) {
      for (var i = 0; i < path.length; i++) {
          this.store(path[i]);
      }
    }
    return this;
  };

  Squire.prototype.require = function(dependencies, callback) {
    var magicModuleName = 'mocks';
    var self = this;
    var path, magicModuleLocation;

    magicModuleLocation = dependencies.indexOf(magicModuleName);

    if (~magicModuleLocation) {
      dependencies.splice(magicModuleLocation, 1);
    }

    for (path in this.mocks) {
      // Require.js code to the next require.
      define(path, this.mocks[path]);
    }

    this.load(dependencies, function() {
      var store = {};
      var args = Array.prototype.slice.call(arguments);
      var dependency;

      if (~magicModuleLocation) {
        for (dependency in self._store) {
          store[self._store[dependency]] = requirejs.s.contexts[self.id].defined[self._store[dependency]];
        }

        args.splice(magicModuleLocation, 0, {
          mocks: self.mocks,
          store: store
        });
      }

      callback.apply(null, args);
      
      self.requiredCallbacks.forEach(function(cb) {
        cb.call(null, dependencies, args);
      });
    });
  };

  Squire.prototype.clean = function(mock) {
    var path;

    if (mock && typeof mock === 'string') {
      requirejs.s.contexts[this.id].undef(mock);
      delete requirejs.s.contexts[this.id].defined[mock];
      delete this.mocks[mock];
    } else if(mock && isArray(mock)) {
      for (var i = 0; i < mock.length; i++) {
        this.clean(mock[i]);
      }
    } else {
      for (path in this.mocks) {
        this.clean(path);
      }
    }

    return this;
  };

  Squire.prototype.remove = function() {
    var path;
    for (path in requirejs.s.contexts[this.id].defined) {
      requirejs.s.contexts[this.id].undef(path);
    }
    delete requirejs.s.contexts[this.id];
  };
  
  Squire.prototype.run = function(deps, callback) {
    var self = this;
    var run = function(done) {
      self.require(deps, function() {
        callback.apply(null, arguments);
        done();
      });      
    };
    
    run.toString = function() {
      return callback.toString();
    };
    
    return run;
  };

  return Squire;
});
