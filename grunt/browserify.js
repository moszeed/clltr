module.exports = {

    libarys : {
        src     : [
            'backbone_dropbox',
            'backbone_delicious',
            'backbone_template'
        ],
        dest    : './dist/scripts/libarys.js',
        options : {
            require : [
                'backbone',
                'underscore',
                'jquery',
                'when',
                'dropbox'
            ],
            alias   : [
                './client/scripts/libs/backbone.dropbox.js:backbone_dropbox',
                './client/scripts/libs/backbone.delicious.js:backbone_delicious',
                './client/scripts/libs/backbone.template.js:backbone_template'
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
                'backbone_dropbox',
                'backbone_delicious',
                'backbone_template',
                'underscore',
                'jquery',
                'when',
                'dropbox'
            ]
        }
    }
};
