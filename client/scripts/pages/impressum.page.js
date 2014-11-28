(function() {

    "use strict";

    var $           = require('jquery');
    var _           = require('underscore');
    var Backbone    = require('backbone');
        Backbone.$  = $;

    var Impressum = module.exports;

        Impressum.View = Backbone.View.extend({

            el      : '#impressum',
            events  : {
                'click' : function() {
                    document.location = '#libary';
                }
            }

        });

})();
