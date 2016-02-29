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
                position   : null,
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

            revision: null,

            comparator: function(model) {
                return -model.get("position");
            },

            initialize: function() {

                _.bindAll(this, 'save', 'cachedFetch');

                this.listenTo(this, 'sync', function() {
                    this.saveToStorage();
                }.bind(this));
            },

            cachedFetch: function(opts) {

                // get the dropbox user id
                var uid = Backbone.DrbxJs.Client._credentials.uid;

                // get storage data
                var storageData = this.getFromStorage();
                if (storageData && storageData.user === uid &&
                    storageData.revision === this.revision) {
                    this.add(storageData.data, opts);
                    return Promise.resolve();
                }

                return this.fetch(opts)
                    .catch(function(err) {
                        new Error(err);
                    });
            },

            getFromStorage: function() {

                var clltrStorageLists = localStorage.getItem('clltr_storage_lists');
                if (clltrStorageLists) {
                    clltrStorageLists = JSON.parse(clltrStorageLists);
                }

                return clltrStorageLists;
            },

            saveToStorage: function() {

                var uid = Backbone.DrbxJs.Client._credentials.uid;

                // save to storage
                localStorage.setItem('clltr_storage_lists', JSON.stringify({
                    user    : uid,
                    revision: this.revision,
                    data    : _.map(this.models, function(model) { return model.toJSON(); })
                }));
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
