(function() {

	"use strict";

    var _        = require("underscore");
    var Backbone = require("drbx-js-backbone");

    var Lists = module.exports;

        Lists.Model = Backbone.Model.extend({

            defaults: {
                id         : null,
                name       : null,
                description: null,
                totalCount : 0
            },

            initialize: function() {
                _.bindAll(this, 'refreshTotalCount');
            },

            refreshTotalCount: function(collection) {

                if (!collection) {
                    throw new Error('no collection');
                }

                var filterResult = collection.filter(
                    function filterModelsWithListId(itemModel) {
                        return _.indexOf(itemModel.get('listId'), this.get('id')) !== -1;
                    }.bind(this));

                this.set({ 'totalCount': filterResult.length });
            }
        });

        Lists.Collection = Backbone.Collection.extend({

            url  : 'lists',
            model: Lists.Model,

            comparator: function(model) {
                return model.get('name');
            },

            initialize: function() {
                _.bindAll(this, 'save');
            },

            save: function() {

                if (this.models.length === 0) {
                    return Promise.resolve();
                }

                var responsePromise = null;
                this.each(function(model) {
                    responsePromise = model.save();
                });

                return responsePromise;
            }
        });


})();
