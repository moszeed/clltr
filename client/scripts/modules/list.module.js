(function() {

    "use strict";

    var $               = require('jquery');
    var _               = require('underscore');
    var when            = require('when');
    var Backbone        = require('backbone');
        Backbone.$      = $;

    var User            = require('./user.module.js');
        Backbone.setDropboxClient(User.getDbClient());

    var List = module.exports;

        List.Model = Backbone.Model.extend({

            embedlyUrl  : "https://api.embed.ly/1/extract?key=35550e76c44048aa92ca559f77d2fd1e&format=json&url=",

            store       : 'list',
            defaults    : {
                url         : null,
                name        : null,
                type        : null,
                tags        : null,
                description : null,
                previewImageUrl : null,
                favicon_url : null,
                created     : null
            },

            fetchData : function() {

                var that = this;
                return when.promise(function(resolve, reject) {

                    var setData = function(pageData) {

                        pageData = pageData || {};

                        var params = {
                            name            : pageData.title || that.get('url'),
                            description     : pageData.description || '',
                            type            : pageData.type || null,
                            previewImageUrl : null,
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
                                params.type = 'image';
                            }
                        }

                        that.save(params);

                        resolve();
                    };

                    $.ajax({
                        url     : that.embedlyUrl + that.get('url'),
                        error   : setData,
                        success : setData
                    });
                });
            }
        });

        List.Collection = Backbone.Collection.extend({

            store       : 'list',
            model       : List.Model,

            comparator  : 'name',

            addByUrl    : function(url) {

                var that  = this;
                var model = new List.Model();

                if (url.substring(0, 'http'.length)    !== 'http' &&
                    url.substring(0, 'https'.length)   !== 'https') {
                    url = "https://" + url;
                }

                model.set('url', url);

                return model.fetchData()
                    .then(function() {
                        that.add(model);
                    });
            },

            refresh : function(params) {

                var that = this;
                    that.reset();
                    return that.fetch({
                        filter  : params || void 0,
                        update  : true
                    });
            }
        });

})();
