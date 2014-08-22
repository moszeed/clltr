module.exports = function(grunt) {

    var shims = require("./shims"),
        sharedModules = Object.keys(shims).concat([
            //"polyfill-webcomponents"
        ]);

    grunt.initConfig({

        bowercopy : {

            polymer : {
                options: {
                    destPrefix  : './client/scripts/polymer',
                    clean       : true
                },
                files: {
                    'platform.js'       :   'platform/platform.js',
                    'polymer.js'        :   'polymer/polymer.js'
                }
            },

            libarys: {

                options: {
                    destPrefix  : './client/scripts/libs',
                    clean       : true
                },
                files: {
                    'jquery.js'         :   'jquery/dist/jquery.js',
                    'underscore.js'     :   'underscore/underscore.js',
                    'backbone.js'       :   'backbone/backbone.js'
                }
            }
        },

        browserify : {

            libarys : {
                src: [  //'client/scripts/libs/platform.js',
                        'client/scripts/libs/jquery.js',
                        'client/scripts/libs/underscore.js',
                        'client/scripts/libs/backbone.js',
                        'client/scripts/libs/backbone.template.js',
                        'client/scripts/libs/backbone.dropbox.js'  ],

                dest: 'dist/js/libarys.js',
                options: {
                    require: sharedModules
                }
            },

            app : {
                src         : [ './client/scripts/user.js',
                                './client/scripts/main.js',
                                './client/scripts/router.js',
                                './client/scripts/app.js'],
                dest        : 'dist/js/app.js',
                options: {
                    external: ['jquery', 'backbone', 'underscore'],

                    //add pages
                    require : Object.keys(shims).concat([
                        "./client/scripts/pages/whatis.page.js",
                        "./client/scripts/pages/libary.page.js"
                    ])
                }
            }
        },

        less : {

            "polymers" : {

                options : {
                    paths       : ["client/style"],
                    compress    : true,
                    cleancss    : true
                },

                files : {
                    "dist/style/polymers/polymer.login.css" : "client/style/polymers/polymer.login.less"
                }
            },

            "app" : {

                options : {
                    paths       : ["client/style"],
                    compress    : true,
                    cleancss    : true
                },

                files : {
                    "dist/style/app.css": "client/style/app.less"
                }
            }
        },

        uglify : {

            options : {
                mangle              : false,
                sourceMapRoot       : '/',
                sourceMapPrefix     : 1
            },

            app : {

                options: {
                    sourceMap           : 'dist/js/app.map',
                    sourceMappingURL    : 'app.map'
                },

                files: {
                    'dist/js/app.min.js': ['dist/js/app.js']
                }
            },

            libarys : {

                options: {
                    sourceMap           : 'dist/js/libarys.map',
                    sourceMappingURL    : 'libarys.map'
                },

                files: {
                    'dist/js/libarys.min.js': ['dist/js/libarys.js']
                }
            }
        },

        htmlmin: {

            templates: {

                options: {
                    removeComments      : true,
                    collapseWhitespace  : true
                },

                files: {
                    './dist/index.html'                                     : './client/templates/index.tpl',
                    './dist/templates/polymers/polymer.login.html'          : './client/templates/polymers/polymer.login.tpl',
                    './dist/templates/pages/whatis.html'                    : './client/templates/pages/whatis.tpl',
                    './dist/templates/pages/libary.html'                    : './client/templates/pages/libary.tpl',
                    './dist/templates/widgets/libary.edit.html'             : './client/templates/widgets/libary.edit.tpl',
                    './dist/templates/widgets/libary.tag.html'              : './client/templates/widgets/libary.tag.tpl',
                    './dist/templates/widgets/libary.delete.html'           : './client/templates/widgets/libary.delete.tpl',
                    './dist/templates/pages/snippets/libary.listItem.html'  : './client/templates/pages/snippets/libary.listItem.tpl',
                    './dist/templates/pages/snippets/libary.tagItem.html'   : './client/templates/pages/snippets/libary.tagItem.tpl'
                }
            }
        },

        'http-server': {

            'dev': {
                root: './dist/',
                port: 8282,
                host: "localhost",
                cache: 1,
                showDir : true,
                autoIndex: true,
                defaultExt: "html"
            }
        },

        copy: {
            main: {
                files: [
                    {   expand: true,
                        cwd: 'dist/',
                        src: '**',
                        dest: '../../../Public/clltr/' }
                ]
            }
        },

        watch : {

            libarys : {
                files : ['client/scripts/libs/**/*.js'],
                tasks : ['browserify:libarys', 'uglify:libarys', 'copy']
            },

            app : {
                files : [   '!client/scripts/libs/**/*.js',
                            'client/scripts/*.js',
                            'client/scripts/pages/*.js',
                            'client/scripts/modules/*.js'],
                tasks : ['browserify:app', 'uglify:app', 'copy']
            },

            templates : {
                files : ['./client/templates/**/*.tpl'],
                tasks : ['htmlmin', 'copy']
            },

            lessPoly    : {
                files : ['./client/style/polymers/*.less'],
                tasks : ['less:polymers', 'copy']
            },

            less      : {
                files : ['./client/style/*.less'],
                tasks : ['less:app', 'copy']
            }
        },

        concurrent: {
            serve: ['http-server:dev', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }

    });


    grunt.registerTask('libarys', ['bowercopy:libarys', 'concat:libarys', 'uglify:libarys']);
    grunt.registerTask('polymer', ['bowercopy:polymer', 'concat:polymer']);

    //shortcut
    grunt.registerTask('serve', ['concurrent:serve']);

    //load separate tasks
    require('jit-grunt')(grunt);
};