(function() {

    "use strict";

    var $           = require('jquery');
    var _           = require('underscore');
    var Backbone    = require('backbone');
        Backbone.$  = $;

    //get template functions
    require('backbone_template');


    var Main = module.exports;

        Main.View = Backbone.View.extend({

            el          : '#main',
            render      : function(page_name) {

                var that = this;

                    if (page_name           === void 0 ||
                        page_name.length    === 0) {
                        throw new Error('no page_name given');
                    }

                    that.template({
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

})();
