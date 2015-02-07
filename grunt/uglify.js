module.exports = {

    options : {
        mangle              : false,
        compress            : true,
        sourceMapRoot       : '/',
        sourceMapPrefix     : 1
    },

    libarys : {

        options: {
            sourceMap           : 'dist/js/libarys.map',
            sourceMappingURL    : 'libarys.map'
        },

        files: {
            'dist/scripts/libarys.min.js': ['dist/scripts/libarys.js']
        }
    },

    app : {

        options: {
            sourceMap           : 'dist/js/app.map',
            sourceMappingURL    : 'app.map'
        },

        files: {
            'dist/scripts/app.min.js': ['dist/scripts/app.js']
        }
    }
};
