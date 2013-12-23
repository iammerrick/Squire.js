module.exports = function(grunt) {

  grunt.initConfig({
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
      files: [
        'Gruntfile.js',
        'src/Squire.js',
        'test/config.js',
        'test/tests/**/*.js'
      ]
    },
    mocha: {
      files: ['test/tests.html', 'test/tests-with-main.html']
    },
    watch: {
      test: {
        files: ['test/**/*', 'src/**/*'],
        tasks: ['jshint', 'mocha']
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  /**
   * Register the default task!
   */
  grunt.registerTask('default', ['jshint', 'mocha']);

};
