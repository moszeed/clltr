(function() {

    "use strict";

    var User            = require('./user.module.js');

    var when            = require('when');
    var _               = require('underscore');
    var Backbone        = require('backbone');
        Backbone.setClient(User.getDbClient());


    var Lists = module.exports;

        Lists.Model = Backbone.Model.extend({

            store       : 'lists',
            defaults    : {
                id          : null,
                name        : null,
                description : null,
                totalCount  : 0
            }
        });

        Lists.Collection = Backbone.Collection.extend({

            model       : Lists.Model,

            store       : 'lists',
            comparator  : 'name',

            refresh : function() {

                var that = this;
                return when.promise(function(resolve, reject) {
                    that.fetch({
                        reset   : true,
                        success : resolve,
                        error   : reject
                    });
                });
            },

            save : function() {

                var that = this;
                    that.each(function(model) {
                        model.save();
                    });
            }


        });

})();
