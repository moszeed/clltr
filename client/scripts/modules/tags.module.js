(function() {

    "use strict";

    var User            = require('./user.module.js');
    var _               = require('underscore');
    var Backbone        = require('backbone');
        Backbone.setDropboxClient(User.getDbClient());

    var Tags = module.exports;

        Tags.Model = Backbone.Model.extend({

            store       : 'tags',
            defaults    : {
                name        : null,
                description : null,
                totalCount  : null
            }
        });

        Tags.Collection = Backbone.Collection.extend({

            store       : 'tags',
            model       : Tags.Model,
            comparator  : 'name',

            refresh : function() {

                var that = this;
                    that.reset();

                return this.fetch({
                    update  : true,
                    success : function() {
                        that.unshift({
                            name : 'all'
                        });
                    }
                });
            }
        });

})();
