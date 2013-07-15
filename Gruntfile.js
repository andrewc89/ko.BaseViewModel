module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    jshint: {
        all: ["lib/*.js"]
    },
    uglify: {
      options: {
        mangle: false
      },
      default: {
        files: {
            "dist/ko.BaseViewModel.min.js": ["lib/ko.dirtyFlag.js", "lib/ko.BaseViewModel.js"]
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  // Default task(s).
  grunt.registerTask("default", ["uglify", "jshint"]);

};
