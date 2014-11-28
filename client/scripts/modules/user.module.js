(function() {

    "use strict";

    var Dropbox = require('dropbox');
    var when    = require('when');
    var Helper  = require('./helper.module.js');

    var DropboxClient = new Dropbox.Client({
            key     : "slx7xwupbtv0chg",
            sandbox : true
        });

        DropboxClient.authDriver(new Dropbox.AuthDriver.Popup({
            receiverUrl     : Helper.getCurrentUrl(),
            rememberUser    : true
        }));


    var User = module.exports;

        User.getDbClient = function() {

            if (!User.isLoggedIn()) {
                throw new Error('not logged in');
            }

            return DropboxClient;
        };

        User.isLoggedIn = function() {

            var isAuthenticated = DropboxClient.isAuthenticated();
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
                DropboxClient.authenticate(function(error, client) {
                    if (error) reject(error);
                    else {
                        localStorage.setItem("alreadyAuthenticated", "true");
                        resolve();
                    }
                });
            });
        };

        //exports.DropboxClient = DropboxClient;
})();
