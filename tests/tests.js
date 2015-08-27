(function() {

    "use strict";

    require('phantomjs-polyfill');
    require('es6-promise').polyfill();

    var test = require('tape');
    var _    = null;

    var Backbone = null;
    var User     = null;
    var Items    = null;
    var Lists    = null;

    //set a generated dropbox token, from the developer console, here !
    var token = "";

    test('is token available', function(t) {
        if (token === null) {
            t.end('please set a generated dropbox token');
        } else {
            t.end();
        }
    });

    //testing require
    test('require', function(t) {

        try {
            Backbone = require('drbx-js-backbone');
            User     = require('../client/scripts/modules/user.module.js');
            Items    = require('../client/scripts/modules/items.module.js');
            Lists    = require('../client/scripts/modules/lists.module.js');
            _        = require('underscore');
        }
        catch(err) {
            t.end(err);
            return;
        }

        t.end();
    });

    test('login to dropbox', function(t) {

        User.login({ token: token })
            .then(function() {
                t.ok(true, 'dropbox login');
                t.end();
            })
            .catch(t.end);
    });

    test('delete old test data (cache folder, .json)', function(t) {

        var promises = [];
        ['/cache', '/lists', '/items'].forEach(
            function deleteFile(file) {

                var metaDataResponse = function(responseMeta) {
                    if (!responseMeta.isRemoved) {
                        console.log('==> delete ' + file);
                        return Backbone.DrbxJs.remove(file);
                    }
                };

                promises.push(
                    Backbone.DrbxJs.metadata(file)
                        .then(metaDataResponse)
                );
            }
        );

        Promise.all(promises)
            .then(function() {
                t.ok(true, 'all deleted');
                t.end();
            })
            .catch(t.end);
    });

    test('items create items (webpage)', function(t) {

        var updateResponse = function() { t.ok(true, 'update called'); };
        var syncResponse   = function() { t.ok(true, 'sync called'); };

        var ItemsCollection = new Items.Collection();
            ItemsCollection.listenTo(ItemsCollection, 'update', updateResponse);
            ItemsCollection.listenTo(ItemsCollection, 'sync', syncResponse);

        var promises  = [];
        var urlsToAdd = ["www.google.de", "www.github.com", "www.microsoft.com", "www.apple.com"];
            urlsToAdd.forEach(function(url) {
                console.log('--> ' + url);
                promises.push(ItemsCollection.addAndGetData({ url: url }));
            });

            Promise.all(promises)
                .then(function() {
                    t.ok(true, 'all items (webpage) added');
                })
                .then(function() {
                    t.ok(ItemsCollection.models.length !== 0, 'collection has items');
                    return ItemsCollection.save();
                })
                .then(function() {
                    t.ok(true, 'all items (webpage) saved');
                    t.end();
                })
                .catch(t.err);
    });

    test('items create items (image)', function(t) {

        var updateResponse = function() { t.ok(true, 'update called'); };
        var syncResponse   = function() { t.ok(true, 'sync called'); };

        var ItemsCollection = new Items.Collection();
            ItemsCollection.listenTo(ItemsCollection, 'update', updateResponse);
            ItemsCollection.listenTo(ItemsCollection, 'sync', syncResponse);

        var urlsToAdd = [
            "http://www.reactiongifs.com/r/cfni.gif",
            "http://www.reactiongifs.com/r/kdyea.gif",
            "https://33.media.tumblr.com/f49703e1a5d7f0dd673293a86040aee8/tumblr_ndooy1Ndld1r34310o1_500.gif",
            "https://pbs.twimg.com/media/B09eAM0IUAAcTGf.png",
            "https://pbs.twimg.com/media/CHpbWtIUYAEMOo_.jpg",
            "https://pbs.twimg.com/media/B3TpeCkCIAAAUqL.jpg"
        ];

        var itemsFetched = function() {

            var promises = [];
            urlsToAdd.forEach(function(url) {
                console.log('--> ' + url);
                promises.push(ItemsCollection.addAndGetData({ url: url }));
            });

            Promise.all(promises)
                .then(function() {
                    t.ok(true, 'all items (image) added');
                })
                .then(ItemsCollection.save)
                .then(function() {
                    t.ok(true, 'all items (image) saved');
                    t.end();
                })
                .catch(function(err) {
                    console.log(err);
                });
        };

        ItemsCollection.fetch()
            .then(itemsFetched)
            .catch(function(err) {
                t.fail('fetch failed');
                t.end(err);
            });
    });

    test('items create items (video)', function(t) {

        var updateResponse = function() { t.ok(true, 'update called'); };
        var syncResponse   = function() { t.ok(true, 'sync called'); };

        var ItemsCollection = new Items.Collection();
            ItemsCollection.listenTo(ItemsCollection, 'update', updateResponse);
            ItemsCollection.listenTo(ItemsCollection, 'sync', syncResponse);

        var urlsToAdd = [
            "https://www.youtube.com/watch?v=SGRy6YeLnZw",
            "https://www.youtube.com/watch?v=Q5Rv9HU4qcE",
            "http://vimeo.com/87880445"
        ];

        var itemsFetched = function() {

            var promises = [];
            urlsToAdd.forEach(function(url) {
                console.log('--> ' + url);
                promises.push(ItemsCollection.addAndGetData({ url: url }));
            });

            Promise.all(promises)
                .then(function() {
                    t.ok(true, 'all items (video) added');
                })
                .then(ItemsCollection.save)
                .then(function() {
                    t.ok(true, 'all items (video) saved');
                    t.end();
                })
                .catch(function(err) {
                    console.log(err);
                });
        };

        ItemsCollection.fetch()
            .then(itemsFetched)
            .catch(function(err) {
                t.fail('fetch failed');
                t.end(err);
            });
    });

    test('list create', function(t) {


        var updateResponse = function() { t.ok(true, 'update called'); };
        var syncResponse   = function() { t.ok(true, 'sync called'); };

        var ListsCollection = new Lists.Collection();
            ListsCollection.listenTo(ListsCollection, 'update', updateResponse);
            ListsCollection.listenTo(ListsCollection, 'sync', syncResponse);

        var ItemsCollection = new Items.Collection();

        var itemsFetched = function() {

            var listTypes = _.uniq(ItemsCollection.pluck('type'));
                console.log(listTypes);
                listTypes.forEach(function(listType) {

                    if (listType === null) {
                        t.fail('listType === null');
                    }

                    ListsCollection.add({
                        "name"       : listType,
                        "description": listType + ' description text'
                    });
                });

            return ListsCollection.save();
        };

        ItemsCollection.fetch()
            .then(itemsFetched)
            .then(function() {
                t.ok(true, 'all lists created');
                t.end();
            })
            .catch(function(err) {
                console.log(err);
            });
    });

    test('list add items', function(t) {

        var ListsCollection = new Lists.Collection();
        var ItemsCollection = new Items.Collection();

        var fetchPromises = [
            ListsCollection.fetch(),
            ItemsCollection.fetch()
        ];

        var addResponse = function() {
            t.ok(true, 'all saved');
            ListsCollection.each(function(model) {
                t.ok(model.get('totalCount') !== 0, 'items counted');
            });
        };

        var allFetched = function() {

            t.ok(ItemsCollection.length !== 0, 'items available');
            t.ok(ListsCollection.length !== 0, 'lists available');

            ItemsCollection.each(function(model) {

                var pickedParams = model.pick('type');
                if (!pickedParams) t.end('no pickedParams available');

                var list = ListsCollection.findWhere({ "name": pickedParams.type });
                if (!list) t.end('list not available');

                model.addListById(list.get('id'));
                list.refreshTotalCount(model.collection);
            });

            return ItemsCollection.save()
                .then(ListsCollection.save);
        };


        Promise.all(fetchPromises)
            .then(allFetched)
            .then(addResponse)
            .then(function() {
                t.ok(true, 'all items added to lists');
                t.end();
            })
            .catch(t.end);

    });

})();
