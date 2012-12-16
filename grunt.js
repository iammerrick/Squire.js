module.exports = function(grunt) {

  grunt.initConfig({
    lint: {
      all: [
        'grunt.js',
        'src/Squire.js',
        'test/config.js',
        'test/tests/**/*.js'
      ]
    },
    jshint: {
      options: {
        bitwise: false,
        curly: true,
        eqeqeq: true,
        forin: false,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: false,
        plusplus: false,
        regexp: false,
        undef: true,
        strict: false,
        trailing: true,
        browser: true,
        node: true,
        es5: true
      },
      globals: {
        define: true,
        requirejs: true,
        require: true,
        describe: true,
        it: true,
        mocha: true,
        chai: true
      }
    },
    mocha: {
      files: ['test/tests.html']
    },
    watch: {
      files: ['<config:lint.all>'],
      tasks: ['lint']
    }
  });
  
  grunt.loadNpmTasks('grunt-mocha');
  
  /**
   * Register the default task!
   */
  grunt.registerTask('default', 'watch');

};
