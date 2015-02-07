(function() {

    "use strict";

    var $               = require('jquery');
    var _               = require('underscore');
    var when            = require('when');

    var User            = require('./user.module.js');

    var Backbone        = require('backbone');
        Backbone.setClient(User.getDbClient());


    var List = module.exports;
        List.Model = Backbone.Model.extend({

            embedlyUrl  : "https://api.embed.ly/1/extract?key=35550e76c44048aa92ca559f77d2fd1e&format=json&url=",
            defaults    : {

                url             : null,
                name            : null,
                type            : null,
                tags            : [],
                height          : null,
                provider        : null,
                providerUrl     : null,
                media_id        : null,
                description     : null,
                previewImageUrl : null,
                favicon_url     : null,
                created         : null
            },

            validate    : function() {

                return !this.store;
            },

            formatData  : function(pageData) {

                pageData = pageData || {};

                var params = {
                    name            : pageData.title || this.get('url'),
                    description     : pageData.description || '',
                    type            : pageData.type || null,
                    provider        : pageData.provider_name,
                    providerUrl     : pageData.provider_url,
                    previewImageUrl : null,
                    favicon_url     : pageData.favicon_url || null,
                    created         : Date.now()
                };

                //sort other media types
                if (pageData.media && pageData.type === 'html') {

                    if (pageData.media.type === 'video') {

                        params.type = 'video';

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

                if (params.type === 'html') {
                    params.type = 'link';
                }

                return params;
            },

            setSoundcloudData : function() {

                var that = this;

                if (that.get('url').indexOf('soundcloud') === -1) {
                    return true;
                }

                return when.promise(function(resolve, reject) {
                    $.get('http://api.soundcloud.com/resolve.json?url='+
                        that.get('url') + '/tracks&client_id=c19250610bdd548e84df2c91e09156c9' , function (result) {

                            that.set({
                                media_id        : result.id             || null,
                                previewImageUrl : result.artwork_url    || null
                            });

                            resolve();
                        });
                });
            },

            refresh   : function() {

                var that = this;

                return when.promise(function(resolve, reject) {

                    $.ajax({
                        url: that.embedlyUrl + that.get('url'),
                        success : function(data) {

                            //set formatted data
                            that.set(that.formatData(data));

                            var promises = [];

                            //try to get soundcloud data
                            if (that.get('type') === 'audio') {
                                promises.push(that.setSoundcloudData());
                            }

                            when.all(promises)
                                .done(function() {
                                    resolve(data);
                                });
                        },
                        error : function(err) {
                            console.log('fail to load from: ' + that.get('url'));
                            console.log('ERR: ', err);
                            resolve();
                        }
                    });
                });
            }
        });

        List.Collection = Backbone.Collection.extend({

            model       : List.Model,

            refresh     : function(filter) {

                var that = this;

                return when.promise(function(resolve, reject) {

                    that.reset();
                    that.fetch({
                        filter  : filter,
                        update  : true,
                        success : resolve,
                        error   : reject
                    });
                });
            },

            initialize  : function(params) {

                _.bindAll(this, 'refresh');

                params = params || {};

                if (!params.store) {
                    throw new Error('no store name given');
                }

                this.store = params.store;

                var that = this;
                    that.on('add', function(model) {
                        model.store = that.store;
                    });
            },

            save : function() {

                var that = this;
                    that.each(function(model) {
                        model.store = that.store;
                        model.save();
                    });
            }
        });

})();
