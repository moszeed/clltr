(function() {

    "use strict";


    var $           = require('jquery');
    var Backbone    = require('backbone');
        Backbone.$  = $;

    var User        = require('./user.module.js');
    var Main        = require('./main.module.js');
    var Dropbox     = require('dropbox');

    var Router      = {};

        Router.Main = Backbone.Router.extend({

            routes : {
                '*path' : 'default'
            },

            httpsCheck : function() {

                var parser      = document.createElement('a');
                    parser.href = document.URL;

                if (parser.hostname === 'localhost') {
                    return;
                }

                var port = parser.port;
                if (port !== '') {
                    port = ":" + port;
                }

                var host = parser.hostname + port;
                if (host == window.location.host &&
                    window.location.protocol != "https:") {
                    window.location.protocol = "https";
                }

            },

            getCurrentPage  : function() {
                return Backbone.history.fragment;
            },

            refreshPage     : function() {
                Backbone.history.loadUrl(Backbone.history.fragment);
            },

            changePage      : function(pagename, opts) {

                opts        = opts      || { trigger : true };
                pagename    = pagename  || "whatis";

                if (pagename !== 'impressum') {
                    if (!User.isLoggedIn()) {
                        pagename = "whatis";
                    }
                }

                this.navigate(pagename, opts);
                this.vMain.render(pagename);
            },

            initialize      : function(opts) {

                opts = opts || {};

                var that = this;
                    that.vMain = new Main.View();
                    that.on('route:default', function(pagename) {

                        if (pagename !== null && pagename.indexOf('access_token') !== -1) {
                            Dropbox.AuthDriver.Popup.oauthReceiver();
                            return;
                        }

                        if (that.getCurrentPage() === pagename) {
                            this.vMain.render(pagename);
                            return;
                        }

                        that.changePage(pagename, {});
                    });
            }
        });

        module.exports.init = function(targetView) {

            window.rRouter = new Router.Main();
            Backbone.history.start();

            return window.rRouter;
        };
})();
