(function() {

    "use strict";

    var $               = require('jquery');
    var _               = require('underscore');
    var Backbone        = require('backbone');
        Backbone.$      = $;
        Backbone.setDropboxClient(DropboxClient);

    var List = module.exports;

        List.Model = Backbone.Model.extend({

            embedlyUrl    : "https://api.embed.ly/1/extract?key=35550e76c44048aa92ca559f77d2fd1e&format=json&url=",

            _getDataByPageMunch : function(callback) {

                var that = this;
                $.get(this.embedlyUrl + this.get('url'), function(data) {
                    that.save({
                        name        : data.title,
                        description : data.description,
                        created     : Date.now()
                    });

                    callback();
                });
            },

            store    : 'list',
            defaults : {
                url         : null,
                name        : null,
                tags        : null,
                description : null,
                favicon_url : null,
                created     : null
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
                model._getDataByPageMunch(function() {
                    that.add(model);
                    $('.loadingIndicator').css('visibility', 'hidden');
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