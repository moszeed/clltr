(function() {

    "use strict";

    var User            = require('./user.module.js');

    var when            = require('when');
    var _               = require('underscore');
    var Backbone        = require('backbone');
        Backbone.setClient(User.getDbClient());

    var Tags = module.exports;

        Tags.Model = Backbone.Model.extend({

            store       : 'tags',
            defaults    : {
                name        : null,
                description : null
            }
        });

        Tags.Collection = Backbone.Collection.extend({

            store       : 'tags',
            model       : Tags.Model,

            comparator  : 'name',

            getAsList   : function() {
                return this.map(function(tagItem) {
                    return tagItem.attributes;
                });
            },

            refresh     : function() {

                var that = this;
                    that.reset();

                return when.promise(function(resolve, reject) {
                    that.fetch({
                        update  : true,
                        success : function() {
                            resolve();
                        }
                    });
                });
            }
        });

})();
