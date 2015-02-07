(function() {

    "use strict";


    var when    = require('when');
    var Helper  = require('./helper.module.js');

    var Dropbox     = require('backbone_dropbox');
        Dropbox.init({
            client  : { key : "slx7xwupbtv0chg" },
            auth    : new Dropbox._Dropbox.AuthDriver.Popup({
                receiverUrl     : Helper.getCurrentUrl(),
                rememberUser    : true
            })
        });

    var Backbone    = Dropbox.Backbone;


    var User = module.exports;

        User.getDbClient = function() {

            if (!User.isLoggedIn()) {
                throw new Error('not logged in');
            }

            return Dropbox._Client;
        };

        User.isLoggedIn = function() {

            var isAuthenticated = Dropbox._Client.isAuthenticated();
            if (!isAuthenticated) {
                if (localStorage.getItem('alreadyAuthenticated')) {
                    User.login();
                    isAuthenticated = true;
                }
            }

            return isAuthenticated;
        };

        User.logout = function() {

            localStorage.clear();
        };

        User.login = function() {

            return when.promise(function(resolve, reject) {

                Dropbox._Client.authenticate(function(error, client) {
                    if (error) reject(error);
                    else {
                        localStorage.setItem("alreadyAuthenticated", "true");
                        resolve();
                    }
                });
            });
        };
})();
