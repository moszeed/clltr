(function() {

    "use strict";

    var Dropbox = require('dropbox');

    var DropboxClient = new Dropbox.Client({
            sandbox : true,
            key     : "PIeHUCRgOHA=|GJO1JsMEz4yHrW0LSClzuVu7X3oi8v2dtYzJwgVmFw=="
        });

        DropboxClient.authDriver(new Dropbox.Drivers.Popup({
            receiverUrl : "https://dl.dropboxusercontent.com/u/42532033/clUrlLib/oauth_receiver.html",
            rememberUser: true
        }));


    var User = {};

        User.isLoggedIn = function() {
            return DropboxClient.isAuthenticated();
        };

        User.logout = function() {
            localStorage.clear();
            Router.changePage('whatis');
        };

        User.login = function() {

            DropboxClient.authenticate(function(error, client) {
                if (error) throw new Error(error);
                localStorage.setItem("alreadyAuthenticated", "true");
                Router.changePage('libary');
            });
        };


    window.User             = User;
    window.DropboxClient    = DropboxClient;
})();