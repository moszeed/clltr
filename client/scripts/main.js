(function() {

	"use strict";

    var _        = require('underscore');
    var Backbone = require('backbone');

	var Main = {};

        Main.View = Backbone.View.extend({

            el          : '#main',
            render      : function() {

                var that = this;
                var page_name = Router.getCurrentPage();

                this.template({
                    path    : './templates/pages/' + page_name + '.html',
                    success : function() {

                        that.$el
                            .removeClass()
                            .addClass(page_name);

                        that.require = require('./client/scripts/pages/' + page_name.toLowerCase() + '.page.js');
                        that.page    = new that.require.View();

                    }
                });
            }
        });

	window.Main = new Main.View();

})();
