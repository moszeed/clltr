//load shims, and add optional requires
var shims = require("../shims"),
    sharedModules = Object.keys(shims).concat([
        //"polyfill-webcomponents"
    ]);

module.exports = {

    libarys : {
        src     : [
			'client/scripts/libs/backbone.template.js',
            'client/scripts/libs/backbone.dropbox.js'
        ],
        dest    : './dist/scripts/libarys.js',
        options : {
            require : [
                'backbone',
                'underscore',
                'jquery',
                'when',
                'dropbox'
            ]
        }
    },


    app : {
        src     : [
            './client/scripts/app.js'
        ],
        dest    : './dist/scripts/app.js',
        options : {
            require     : [
                './client/scripts/pages/whatis.page.js',
                './client/scripts/pages/libary.page.js',
                './client/scripts/pages/impressum.page.js'
            ],
            external	: [
                'backbone',
                'underscore',
                'jquery',
                'when',
                'dropbox'
            ]
        }
    }
};
