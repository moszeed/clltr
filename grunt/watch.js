module.exports = {

    libarys : {
        files : ['client/scripts/libs/**/*.js'],
        tasks : ['browserify:libarys', 'uglify:libarys']
    },

    app : {
        files : [   '!client/scripts/libs/**/*.js',
                    'client/scripts/*.js',
                    'client/scripts/pages/*.js',
                    'client/scripts/modules/*.js'],
        tasks : ['browserify:app', 'uglify:app']
    },

    templates : {
        files : ['./client/templates/**/*.tpl'],
        tasks : ['htmlmin']
    },

    lessPoly    : {
        files : ['./client/style/polymers/*.less'],
        tasks : ['less:polymers']
    },

    less      : {
        files : ['./client/style/*.less'],
        tasks : ['less:app']
    }
};
