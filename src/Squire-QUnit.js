define(['Squire'], function(squire) {
    //Thanks to sinon for this
    var qTest = QUnit.test;
    window.test = QUnit.test = function (testName, expected, callback, async) {
        if (arguments.length === 2) {
            callback = expected;
            expected = null;
        }

        return qTest(testName, expected, function(env, assert) {
          if(callback.isSquireCallback) {
            //async calls stop
            if(!async) {
                stop();
            }
            callback.call(this, QUnit.start);
          } else {
            callback.apply(this, arguments);
          }

        }, async);
    };
    return squire;
});