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

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.registerTask("default", ["uglify", "jshint"]);
  
};
