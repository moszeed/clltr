(function() {

    "use strict";

    var _               = require('underscore');
    var Backbone        = require('backbone');
        Backbone.setDropboxClient(DropboxClient);

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