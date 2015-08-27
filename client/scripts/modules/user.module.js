(function() {

    "use strict";

    var Helper = require('helper');

    var Backbone = require('drbx-js-backbone');
        Backbone.init({
            client: { key: "38sn4xw32xtxi32" },
            auth  : new Backbone.DrbxJs.Dropbox.AuthDriver.Popup({
                receiverUrl : Helper.getCurrentUrl(),
                rememberUser: true
            })
        });

    var User = {};
        User.Model = Backbone.Model.extend({

            login: function(params) {

                params = params || {};

                if (params.token) {
                    return Backbone.init({
                        client: {
                            token: params.token
                        }
                    });
                }

                return Backbone.login()
                    .then(function() {
                        localStorage.setItem("alreadyAuthenticated", "true");
                    });
            },

            logout: function() {
                localStorage.clear();
            },

            isLoggedIn: function() {

                var isAuthenticated = Backbone.DrbxJs.Client.isAuthenticated();
                if (!isAuthenticated) {
                    if (localStorage.getItem('alreadyAuthenticated')) {
                        this.login();
                        isAuthenticated = true;
                    }
                }

                return isAuthenticated;
            }
        });

        module.exports = new User.Model();
})();
