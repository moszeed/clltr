(function() {

    "use strict";

    var Backbone = require('drbx-js-backbone');
    var User     = require('./user.module.js');

    var Router = Backbone.Router.extend({

            routes: {
                '*path': 'default'
            },

            initialize: function(opts) {

                opts = opts || {};

                var that = this;
                    that.on('route:default', function(urlParams) {

                        if (urlParams !== null &&
                            urlParams.indexOf('access_token') !== -1) {
                            Backbone.DrbxJs.Dropbox.AuthDriver.Popup.oauthReceiver();
                            return;
                        }

                        that.changePage(urlParams);
                    });
            },

            changePage: function(page) {

                page = page || 'libary';

                if (!User.isLoggedIn()) {
                    page = 'whatis';
                }

                this.navigate(page);
                this.trigger('changePage');
            },

            getCurrentPage: function() {
                return Backbone.history.fragment;
            }
        });

    module.exports = function() {

        var currentRouter = new Router();
        Backbone.history.start();
        return currentRouter;
    };

})();
