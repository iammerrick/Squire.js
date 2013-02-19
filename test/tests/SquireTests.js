/*jshint expr:true */
define(['Squire'], function(Squire) {
  describe('Squire', function() {
    describe('constructor', function() {
      it('should create an instance of Squire', function() {
        var squireInstance = new Squire();
        squireInstance.should.be.an.instanceof(Squire);
      });

      it('should throw an error if a context doesn\'t exist', function() {
        var create = function() {
          new Squire('not-real');
        };
        create.should.Throw();
      });
    });
    
    describe('run', function() {
      var instance = new Squire();
      it('should execute this test using run', instance.run(['mocks/Shirt'], function(Shirt) {
        Shirt.color.should.equal('Red');
      }));
    });

    describe('require', function() {
      
      it('should require my specified dependencies', function(done) {
        var squire = new Squire();
        squire.require(['mocks/Shirt'], function(Shirt) {
          Shirt.should.exist;
          done();
        });
      });

      it('should require a relative module', function(done) {
        var squire = new Squire();
        squire
          .mock(['mocks/Shirt'], {
            color: 'Blue',
            size: 'Unknown'
          })
          .require(['mocks/Formal'], function(Formal) {
            Formal.shirt.color.should.equal('Blue');
            done();
          });

        squire.remove();
      });

      it('should mock one of multiple dependencies', function(done) {
        var squire = new Squire();
        squire
          .mock(['mocks/Pant'], {
            type: 'None'
          })
          .require(['mocks/FullyDressed'], function(FullyDressed) {
            FullyDressed.shirt.color.should.equal('Red');
            FullyDressed.pant.type.should.equal('None');
            done();
          });
      });

      it('should return my mocks to me using a magic module', function(done) {
        var squire = new Squire();
        squire
          .mock('mocks/Shirt', {
            color: 'Cyan'
          })
          .require(['mocks/Outfit', 'mocks'], function(Outfit, mocks) {
            mocks.mocks['mocks/Shirt'].color.should.equal('Cyan');
            done();
          });
      });

      it('should return my dependencies to me using a magic module', function(done) {
        var squire = new Squire();
        squire
          .store('mocks/Shirt')
          .require(['mocks/Outfit', 'mocks'], function(Outfit, mocks) {
            mocks.store['mocks/Shirt'].color.should.equal('Red');
            done();
          });
      });

      it('should call any onRequired hooks', function(done) {
        var squire = new Squire();
        squire.onRequired(function() {
          done();
        });

        squire.require(['mocks/Shirt'], function (shirt) {});
      });
      
      it('should call onRequired hooks with the proper arguments', function(done) {
        var squire = new Squire();
        squire.onRequired(function(dependencies, values) {
          
          dependencies.should.be.an('array');
          values.should.be.an('array');
          
          dependencies.should.deep.equal(['mocks/Shirt']);
          
          values.should.deep.equal([{
            color: 'Red',
            size: 'Large'
          }]);
          
          done();
        });
      
        squire.require(['mocks/Shirt'], function (shirt) {});
      });
    });
    
    describe('store', function(){
        it('should store the requested module', function(done){
          var squire = new Squire();
          squire
            .store('mocks/Shirt')
            .require(['mocks/Outfit', 'mocks'], function(Outfit, mocks){
                mocks.store['mocks/Shirt'].color.should.equal('Red');
                done();
            });
        });
        it('should store all modules by array', function(done){
          var squire = new Squire();
          squire
            .store(['mocks/Shirt','mocks/Pant'])
            .require(['mocks/FullyDressed', 'mocks'], function(FullyDressed, mocks){
                mocks.store['mocks/Shirt'].should.not.be.null;
                mocks.store['mocks/Pant'].should.not.be.null;
                done();
            });
        });
    });

    describe('mock', function() {
      it('should mock my dependency', function(done) {
        var squire = new Squire();
        squire
          .mock('mocks/Shirt', {
            color: 'Blue',
            size: 'Small'
          })
          .require(['mocks/Outfit'], function(Outfit) {
            Outfit.shirt.color.should.equal('Blue');
            done();
          });
      });

      it('should allow a function as a dependency', function(done) {
        var squire = new Squire();
        squire
          .mock('mocks/Shirt', function() {
            return function() {
              return 'Winter Blue';
            };
          })
          .require(['mocks/Outfit'], function(Outfit) {
            Outfit.shirt().should.equal('Winter Blue');
            done();
          });

      });

      it('should mock my cjs dependency', function(done) {
        var squire = new Squire();
        squire
          .mock('mocks/Shirt', {
            color: 'Purple',
            size: 'Medium'
          })
          .require(['mocks/CJSOutfit'], function(Outfit) {
            Outfit.shirt.color.should.equal('Purple');
            done();
          });
      });

      it('should not mock the dependency for other requires', function(done) {
        var squire = new Squire();
        squire
          .mock('mocks/Shirt', {
            color: 'Purple',
            size: 'Medium'
          })
          .require(['mocks/CJSOutfit'], function(Outfit) {
            require(['mocks/CJSOutfit'], function(NotTheMock) {
              NotTheMock.shirt.color.should.equal('Red');
              done();
            });
          });
      });

      it('should accept and object literal as an argument', function(done) {
        var squire = new Squire();
        squire
          .mock({
            'mocks/Shirt' : {
              color: 'Silver',
              size: 'Small'
            }
          })
          .require(['mocks/Outfit'], function(Outfit) {
            Outfit.shirt.color.should.equal('Silver');
            done();
          });
      });
    });


   describe('CJS with reference', function() {
      var squire = new Squire();
       squire
        .mock({
          'mocks/Shirt' : {
            color: 'Silver',
            size: 'Small'
          }
        });
      afterEach(function(done) {
        squire.clean();
        squire
        .mock({
          'mocks/Shirt' : {
            color: 'Orange',
            size: 'Small'
          }
        });
        done();
      });
      it('Should use supplied mock', squire.run(['mocks/RefOutfit'], function(CJS) {
        CJS.shirt.color.should.equal('Silver');
      }));
      it('should be using a different mock', squire.run(['mocks/RefOutfit'], function(CJS) {
        CJS.shirt.color.should.equal('Orange');
      }));

    });

    describe('shared squire', function() {
      var squire = new Squire();
      squire.mock('mocks/Shirt', {
        color: 'Green',
        size: 'XLarge'
      });

      it('should have a Green shirt', function(done) {
        squire.require(['mocks/Outfit'], function(Outfit) {
          Outfit.shirt.color.should.equal('Green');
          done();
        });
      });

      it('should have an XLarge shirt size', function(done) {
        squire.require(['mocks/Formal'], function(Outfit) {
          Outfit.shirt.size.should.equal('XLarge');
          done();
        });
      });

      it('should clean up the mocks if asked', function(done) {
        squire.clean();
        squire.require(['mocks/Shirt'], function(Shirt) {
          Shirt.color.should.equal('Red');
          done();
        });
      });
    });

    describe('clean', function() {
      it('should not mock the requested module', function(done) {
        var squire = new Squire();
        squire.mock('mocks/Shirt', {
          color: 'Clear',
          size: '?'
        });

        squire
          .clean('mocks/Shirt')
          .require(['mocks/Outfit'], function(Outfit) {
            Outfit.shirt.color.should.equal('Red');
            done();
          });
      });

      it('should remove all mocks when called without args', function(done) {
        var squire = new Squire();
        squire.mock('mocks/Shirt', {
          color: 'Sky Blue'
        });
        squire.clean();

        squire.require(['mocks/Shirt'], function(Shirt) {
          Shirt.color.should.equal('Red');
          done();
        });

      });

      it('should not mock the requested module by array', function(done) {
        var squire = new Squire();
        squire.mock('mocks/Shirt', {
          color: 'Clear',
          size: '?'
        });
        squire.mock('mocks/Pant', {
            type: 'Cowboy',
        });
        squire
          .clean(['mocks/Shirt'])
          .require(['mocks/FullyDressed'], function(FullyDressed) {
            FullyDressed.shirt.color.should.equal('Red');
            FullyDressed.pant.type.should.equal('Cowboy');
            done();
          });
      });
    });

  });
});
