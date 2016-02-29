(function() {

	"use strict";

    var embedlyUrl = "https://api.embed.ly/1/extract?key=35550e76c44048aa92ca559f77d2fd1e&format=json&url=";

    var request  = require("xhr");
    var _        = require("underscore");

    var Helper   = require('helper');
    var Backbone = require("drbx-js-backbone");


    var PromiseCache = {};

    var activateCache = true;
    var saveContent   = true;

	var Items = module.exports;

        Items.Model = Backbone.Model.extend({

            defaults: {

                name       : null,
                description: null,
                provider   : null,
                providerUrl: null,
                type       : 'link',
                created    : null,
                listId     : [],
                tags       : [],
                height     : null,


                url     : null,
                urlCache: null,

                faviconUrl     : null,
                faviconUrlCache: null,

                previewImageUrl     : null,
                previewImageUrlCache: null
            },

            initialize: function() {

                _.bindAll(this,
                    "addListById", "formatEmbedlyData",
                    "refreshData", "getUrlData", "setFaviconToCache",
                    "setPreviewImageToCache", "setImageToCache"
                );
            },

            /**
             * [getUrlData description]
             * @param  {[type]} url [description]
             * @return {[type]}     [description]
             */
            getUrlData: function(url) {

                return new Promise(function(resolve, reject) {

                    if (!url || url === null) {
                        throw new Error('no url given');
                    }

                    // call embedly, to get url data
                    request({ uri: embedlyUrl + url, json: true},
                        function requestResponse(err, response, body) {
                            if (err) reject(err);
                            else { resolve(body); }
                        });
                });
            },

            /**
             * [setFileToUrl description]
             * @param {[type]} url  [description]
             * @param {[type]} path [description]
             */
            setFileToUrl: function(url, path) {

                if (!url) throw new Error('no url given');
                if (!path) throw new Error('no path given');

                if (PromiseCache['setFileToUrl' + path]) {
                    return Promise.resolve();
                }

                PromiseCache['setFileToUrl' + path] = new Promise(
                    function(resolve, reject) {

                        var saveUrlError = function(err) {
                            console.log(err);
                            reject(err);
                        };

                        var saveUrl = function() {
                            return Backbone.DrbxJs.saveUrl(url, path)
                                .then(resolve)
                                .catch(saveUrlError);
                        };

                        // look if file is already available
                        PromiseCache['setFileToUrl' + path] = Backbone.DrbxJs.metadata(path)
                            .then(function getResponseMeta(responseMeta) {
                                if (responseMeta.isRemoved) {
                                    saveUrl();
                                } else {
                                    resolve();
                                }
                            })
                            .catch(saveUrl);
                    }
                );

                return PromiseCache['setFileToUrl' + path];
            },


            /**
             * CACHE FUNCTIONS
             */

            /**
             * [setFaviconToCache description]
             * @param {[type]} params [description]
             */
            setFaviconToCache: function(params) {

                // exist url to favicon
                // and a site provider for identification
                if (!params.faviconUrl ||
                    !params.provider) {
                    return Promise.resolve(params);
                }

                // set to params
                params.faviconUrlCache = '/cache/' + params.provider + '.ico';

                // cache it
                return this.setFileToUrl(params.faviconUrl, params.faviconUrlCache)
                    .then(function() {
                        return params;
                    });
            },

            /**
             * [setImageToCache description]
             * @param {[type]} params [description]
             */
            setImageToCache: function(params) {

                var that = this;
                if (params.type !== 'image' &&
                    params.type !== 'video') {
                    return Promise.resolve(params);
                }

                var imageFilename = Helper.getFilenameFromUrl(that.get('url'));
                params.urlCache = '/cache/images/' + params.provider + '/' + Date.now() + '_' + imageFilename;

                return this.setFileToUrl(that.get('url'), params.urlCache)
                    .then(function() {
                        return params;
                    });
            },

            /**
             * [setPreviewImageToCache description]
             * @param {[type]} params [description]
             */
            setPreviewImageToCache: function(params) {

                //add preview image to cache
                if (params.type !== 'video' ||
                    !params.previewImageUrl) {
                    return Promise.resolve(params);
                }

                params.previewImageUrlCache = '/cache/images/' + params.provider + '/' + Date.now() + '_' + params.name;

                return this.setFileToUrl(params.previewImageUrl, params.previewImageUrlCache)
                    .then(function() {
                        return params;
                    });
            },


            formatEmbedlyData: function(pageData) {

                pageData = pageData || {};

                //set default pageData
                var params = {
                    name       : pageData.title || this.get('url'),
                    type       : pageData.type || 'link',
                    description: pageData.description || '',
                    provider   : pageData.provider_name,
                    providerUrl: pageData.provider_url,
                    faviconUrl : pageData.favicon_url || null,
                    created    : Date.now()
                };

                if (pageData.type === 'html') {
                    params.type = 'link';
                }

                if (pageData.type === 'error') {
                    params.type = 'link';
                }

                //sort other media types
                if (pageData.media && pageData.type === 'html') {

                    if (pageData.media.type === 'video') {

                        params.name = Helper.getFilenameFromUrl(this.get('url'));
                        params.type = 'video';

                        if (params.provider === 'YouTube') {
                            params.name = params.name.substring(params.name.lastIndexOf('=') + 1);
                        }

                        //get preview url
                        if (pageData.images.length !== 0) {
                            params.previewImageUrl = pageData.images[0].url;
                        }

                    }

                    if (pageData.media.type === 'photo') {
                        params.type     = 'image';
                        params.height   = pageData.media.height || null;
                    }

                    if (pageData.media.type === 'rich') {
                        if (this.get('url').indexOf('soundcloud') !== -1) {
                            params.type = 'audio';
                        }
                    }
                }

                if (pageData.type === 'image') {

                    if (pageData.media.type === 'photo') {
                        params.type     = 'image';
                        params.height   = pageData.media.height || null;
                    }
                }

                return params;
            },

            refreshData: function(opts) {

                opts = opts || {};

                if (!opts.activateCache) opts.activateCache = activateCache;
                if (!opts.saveContent) opts.saveContent = saveContent;

                var that = this;
                return this.getUrlData(this.get('url'))
                    .then(function(data) {

                        var formattedData = that.formatEmbedlyData(data);

                        //first data
                        that.set(formattedData);

                        var promises = [];

                        if (opts.activateCache) {
                            promises.push(that.setFaviconToCache(formattedData));
                            promises.push(that.setPreviewImageToCache(formattedData));
                        }

                        if (opts.saveContent) {
                            promises.push(that.setImageToCache(formattedData));
                        }

                        return Promise.all(promises)
                            .then(function(responseData) {
                                var setData = _.extend(
                                    responseData[0], responseData[1], responseData[2]
                                );

                                //update data
                                that.set(setData);
                            })
                            .then(function() {
                                return that;
                            })
                            .catch(function(err) {
                                console.log('cache fail');
                                console.log(err);
                            });
                    });
            },

            addListById: function(listId) {

                if (!listId && listId.length === 0) {
                    throw new Error('no listId');
                }

                var listIds = this.get('listId');
                if (_.indexOf(listIds, listId) === -1) {
                    listIds.push(listId);
                    this.set({ 'listId': listIds });
                }
            }
        });

        Items.Collection = Backbone.Collection.extend({

            url  : 'items',
            model: Items.Model,

            revision: null,

            initialize: function() {

                _.bindAll(this, 'save', 'cachedFetch');

                this.listenTo(this, 'sync', function() {
                    this.saveToStorage();
                }.bind(this));
            },

            addAndGetData: function(params, opts) {

                params = params || {};
                opts   = opts || {};

                var model = this.add(params);

                return model.refreshData(opts);
            },

            search: function(inputString) {

                return _.compact(this.map(
                    function(listItem) {
                        if (listItem.get('url').indexOf(inputString) !== -1 ||
                            listItem.get('name').indexOf(inputString) !== -1 ||
                            listItem.get('description').indexOf(inputString) !== -1) {
                            return listItem;
                        }
                    }
                ));
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

                var clltrStorageItems = localStorage.getItem('clltr_storage_items');
                if (clltrStorageItems) {
                    clltrStorageItems = JSON.parse(clltrStorageItems);
                }

                return clltrStorageItems;
            },

            saveToStorage: function() {

                var uid = Backbone.DrbxJs.Client._credentials.uid;

                // save to storage
                localStorage.setItem('clltr_storage_items', JSON.stringify({
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
