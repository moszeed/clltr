(function() {

    "use strict";

    var $ = require('jquery');
        $.ajaxPrefilter(function(options) {
            options.async = true;
        });

    var Backbone      = require('drbx-js-backbone');
        Backbone.View = require('backbone-template');

    var User   = require('./scripts/modules/user.module.js');
    var Router = require('./scripts/modules/router.module.js')();
        Router.httpsCheck();

    var App = module.exports;

        App.Main = Backbone.View.extend({

            el: 'body #main',

            initialize: function() {
                this.listenTo(Router, 'changePage', this.render);
                this.render();
            },

            render: function(page) {

                page = page || Router.getCurrentPage() || null;
                if (page === null) {
                    throw new Error('no page given');
                }

                this.template({
                    path: './templates/pages/' + page + '.html'
                });
            }
        });

        App.View = Backbone.View.extend({

            el: 'body',

            events: {

                'click button.login': function() {

                    User.login()
                        .then(function() {
                            Router.changePage('libary');
                        });
                },

                'click #logout': function() {
                    User.logout();
                    Router.changePage('whatis');
                }
            },

            initialize: function() {
                this.vMain = new App.Main();
            }
        });

        App.current = new App.View();

})();
