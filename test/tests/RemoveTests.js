define(['Squire'], function(Squire) {
  describe('issue #34', function() {
    var expect = chai.expect,
        injector = new Squire(),
        mock,
        cleanRemoveWrapper = function() {
          injector.clean();
          injector.remove();
        };

    beforeEach(function(done) {
      injector
        .mock('mocks/Shirt', {
          color: 'Blue',
          size: 'Small'
        })
        .require(['mocks/Shirt'], function(_mock) {
          mock = _mock;
          done();
        });
    });

    it('should not throw exception', function() {
      expect(cleanRemoveWrapper).to.not.throw();
    });

    it('should STILL not throw exception', function() {
      expect(cleanRemoveWrapper).to.not.throw();
    });
  });
});