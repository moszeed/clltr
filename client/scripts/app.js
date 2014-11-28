(function() {

    "use strict";

    var $               = require('jquery');
    var _               = require('underscore');
    var when            = require('when');
    var Backbone        = require('backbone');
        Backbone.$      = $;

    var Router          = require('./modules/router.module.js').init();
        Router.httpsCheck();

    var App = module.exports;

        App.View = Backbone.View.extend({

            initialize : function() {
                $('#impressumLink').on('click', function() {
                    Router.changePage('impressum');
                });
            }
        });

        $(document).ready(function() {
            new App.View();
        });
})();
