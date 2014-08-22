(function() {

    "use strict";

    var _        = require('underscore');
    var Backbone = require('backbone');

	var Router = {};

		Router.Main = Backbone.Router.extend({

			startPage	: 'whatis',
			defaultPage	: 'libary',

            routes : {
                '*path' : 'default'
            },

            getCurrentPage  : function() {
                return Backbone.history.fragment;
            },

            refreshPage     : function() {
                Backbone.history.loadUrl(Backbone.history.fragment);
            },

            _checkLogin     : function(pagename) {

                if (pagename !== this.startPage) {
                    if (!User.isLoggedIn()) {
                        pagename = this.startPage;
                    }
                }

                return pagename;
            },

            changePage      : function(pagename) {

                pagename = pagename || this.defaultPage;

                if (!User.isLoggedIn()) {

                     if (localStorage.getItem('alreadyAuthenticated')) {
                        User.login();
                        return true;
                     }

                     pagename = this.startPage;
                }

                this.navigate(pagename);
                Main.render();
            },

            initialize      : function() {

                var that = this;
                    that.on('route:default', function(pagename) {
                        that.changePage(pagename);
                    });
            }
		});


	window.Router = new Router.Main();
	Backbone.history.start();

})();