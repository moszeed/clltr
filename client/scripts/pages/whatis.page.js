(function() {

	"use strict";

    var $           = require('jquery');
    var _           = require('underscore');
    var Backbone    = require('backbone');
        Backbone.$  = $;

    var User        = require('../modules/user.module.js');

    var Whatis  = module.exports;
        Whatis.View = Backbone.View.extend({

            el      : '#main.whatis',
            events  : {

                'click #login' : function() {

                    User.login()
                        .done(function() {
                            window.rRouter.navigate('libary', {
                                trigger : true
                            });
                        });
                }
            }
        });

})();
