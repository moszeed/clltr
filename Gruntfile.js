module.exports = function(grunt) {

    require('load-grunt-config')(grunt);

    grunt.registerTask('install', ['libarys', 'polymer', 'htmlmin', 'browserify', 'uglify', 'less']);
    grunt.registerTask('libarys', ['bowercopy:libarys', 'uglify:libarys']);
    grunt.registerTask('polymer', ['bowercopy:polymer']);

    //shortcut
    grunt.registerTask('serve', ['concurrent:serve']);

}