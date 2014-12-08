(function() {

    "use strict";

    var $           = require('jquery');
    var _           = require('underscore');
    var when        = require('when');
    var Backbone    = require('backbone');
        Backbone.$  = $;

    var List    = require('../modules/list.module.js');
    var Tags    = require('../modules/tags.module.js');
    var User    = require('../modules/user.module.js');
    var Helper  = require('../modules/helper.module.js');


    function isElementInViewport (el) {

        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

        var rect = el.getBoundingClientRect();

        return (
            rect.top >= -100 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 200 && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    }


    var Libary = module.exports;

        Libary.Events = _.extend({}, Backbone.Events);


        Libary.Head = Backbone.View.extend({

            el      : '#main.libary #head',
            events  : {

                'click #logout' : function() {

                    User.logout();

                    window.rRouter.changePage('whatis');
                },

                'change input' : function(el) {

                    var $element = $(el.target);
                    var value    = $element.val();
                    if (value.length !== 0) {

                        var $loadingIndicator = $('.loadingIndicator');
                            $loadingIndicator.css('visibility', 'visible');

                        this.collection.addByUrl(value)
                            .done(function() {
                                $loadingIndicator.css('visibility', 'hidden');
                                $element.val('');
                            });
                    }

                }
            }
        });


        Libary.EditWidget = Backbone.View.extend({

            className   : 'editWidget',

            events      : {

                'click .close' : function() {
                    $('.overlay').hide();
                    $('.overlayInner').html('').hide();
                },

                'click .save' : function() {

                    var that = this;
                    _.each(this.model.attributes, function(value, key) {
                        var $input = that.$el.find('input.' + key);
                        if ($input.length === 1) {
                            that.model.set(key, $input.val());
                        } else {

                            var $textarea = that.$el.find('textarea.' + key);
                            if ($textarea.length === 1) {
                                that.model.set(key, $textarea.val());
                            }
                        }
                    });

                    this.model.save();

                    $('.overlay').hide();
                    $('.overlayInner').html('').hide();
                }
            },

            initialize : function() {
                this.render();
            },

            render : function() {

                var $overlay        = $('.overlay');
                var $overlayInner   = $('.overlayInner');

                var that = this;
                    that.template({
                        path    : './templates/widgets/libary.edit.html',
                        params  : this.model.attributes,
                        success : function() {
                            $overlayInner
                                .html(that.$el)
                                .css('display', 'block');
                            $overlay.css('display', 'block');
                        }
                    });
            }
        });

        Libary.DeleteWidget = Backbone.View.extend({

            events : {

                'click .close' : function() {
                    $('.overlay').hide();
                    $('.overlayInner').html('').hide();
                },

                'click .delete' : function() {

                    this.model.destroy();

                    $('.overlay').hide();
                    $('.overlayInner').html('').hide();
                }
            },

            initialize : function() {
                this.render();
            },

            render : function() {
                var $overlay        = $('.overlay');
                var $overlayInner   = $('.overlayInner');

                var that = this;
                    that.template({
                        path    : './templates/widgets/libary.delete.html',
                        success : function() {
                            $overlayInner
                                .html(that.$el)
                                .css('display', 'block');
                            $overlay.css('display', 'block');
                        }
                    });
            }
        });

        Libary.TagWidget = Backbone.View.extend({

            events : {

                'click .close' : function() {
                    $('.overlay').hide();
                    $('.overlayInner').html('').hide();
                },

                'click .set' : function() {

                    var $select = this.$el.find('.possible_tags select');
                    var $input  = this.$el.find('.new_tag input');

                    var value = $select.val();
                    if (value === "null") {
                        value = $input.val();
                        if (value === void 0 || value.length === 0) {
                            alert('no tag selected');
                            return;
                        }
                    }

                    var model = this.collection.findWhere({ name : value });
                    if (model === void 0) {

                        model = new Tags.Model();
                        model.set('name', value);

                        this.collection.create(model);
                        Libary.Events.trigger('refreshTags');
                    }

                    var tags = this.model.get('tags');
                    if (tags === null) {
                        tags = [];
                    }

                    tags.push(model.get('name'));
                    this.model.set('tags', tags);
                    this.model.save();

                    $('.overlay').hide();
                    $('.overlayInner').html('').hide();
                }
            },

            initialize : function(params) {

                this.options = params.options;

                this.collection = new Tags.Collection();
                this.collection.refresh();

                this.render();
            },

            render : function() {

                var $overlay        = $('.overlay');
                var $overlayInner   = $('.overlayInner');

                var that = this;
                    that.template({
                        path    : './templates/widgets/libary.tag.html',
                        params  : {
                            attrs : this.model.attributes,
                            tags : this.collection.models
                        },
                        success : function() {
                            $overlayInner
                                .html(that.$el)
                                .css('display', 'block');
                            $overlay.css('display', 'block');
                        }
                    });
            }
        });



        Libary.TagItem = Backbone.View.extend({

            events      : {

                'click span' : function() {

                    if (confirm('rly delete tag?')) {
                        this.model.destroy();
                    }

                    return false;
                },

                'click' : function(el) {
                    Libary.Events.trigger('refresh', this.model.get('name'));
                }
            },

            className   : 'tag_item',
            render      : function() {
                this.template({
                    path    : './templates/pages/snippets/libary.tagItem.html',
                    params  : this.model.attributes
                });
            }
        });

        Libary.Tags = Backbone.View.extend({

            el          : '#main.libary #tags',

            setTagActive : function(tagName) {

                this.$el.find('.tag_item').css('background-color', 'transparent');

                var $tag = this.$el.find('.' + tagName.replace(new RegExp(' ', 'g'), '_'));
                if ($tag.length !== 0) {
                    $tag.parent().css('background-color', '#DEDEDE');
                } else {
                    this.parent().$el.find('.all').css('background-color', '#DEDEDE');
                }
            },

            addItem     : function(model) {

                var tagItem = new Libary.TagItem({model:model});
                    tagItem.$el.appendTo(this.$el);
                    tagItem.render();
            },

            initialize  : function() {

                var that = this;

                    that.listenTo(that.collection, 'reset', function() {
                        that.$el.html('');
                    });

                    that.listenTo(that.collection, 'destroy', function() {
                        that.collection.refresh();
                    });

                    that.listenTo(Libary.Events, 'refreshTags', function() {
                        that.collection.refresh();
                    });

                    that.listenTo(that.collection, 'sync', function() {
                        _.each(that.collection.models, function(model) {
                            that.addItem(model);
                        });
                    });

                    that.collection.refresh();
            }
        });


        Libary.AudioListItem = Backbone.View.extend({

            events      : {

                'click .name' : function() {
                    var win = window.open(this.model.get('url'), '_blank');
                        win.focus();
                },

                'click .extend_me' : function() {
                    var $extend = this.$el.find('.extend');
                    if ($extend.is(':visible')) {
                        $extend.css('display', 'none');
                    } else {
                        $extend.css('display', 'block');
                    }
                },

                'click .addTag' : function() {
                    new Libary.TagWidget({
                        model   : this.model
                    });
                    return false;
                },

                'click .tags .delete' : function(events) {

                    var tags    = this.model.get('tags');
                        tags.splice($(events.target).parent().attr('class').split(' ')[0], 1);

                    this.model.save('tags', tags);
                    return false;
                },


                'click .control .delete' : function() {
                    new Libary.DeleteWidget({
                        model : this.model
                    });
                    return false;
                },

                'click .control .edit' : function() {
                    new Libary.EditWidget({
                        model : this.model
                    });
                    return false;
                }
            },

            className   : 'list_item audio',
            render      : function() {

                var that = this;
                    that.template({
                        path    : './templates/pages/snippets/libary.listItemAudio.html',
                        params  : this.model.attributes
                    });
            },

            initialize  : function() {

                var that = this;

                    that.listenTo(this.model, 'destroy', function() {
                        that.remove();
                    });

                    that.listenTo(this.model, 'sync', function() {
                        that.render();
                    });

                    that.listenTo(this.model, 'change', function() {
                        that.render();
                    });
            }
        });

        Libary.AudioList = Backbone.View.extend({


            listItems  : [],

            el          : '#main.libary #libary #audios',
            addItem     : function(model) {

                var listItem = new Libary.AudioListItem({model:model});
                    listItem.$el.prependTo(this.$el);
                    listItem.render();

                    this.listItems.push(listItem);
            }
        });


        Libary.VideoListItem = Backbone.View.extend({

            events      : {

                'click' : function() {
                    var win = window.open(this.model.get('url'), '_blank');
                        win.focus();
                },

                'click .addTag' : function() {
                    new Libary.TagWidget({
                        model   : this.model
                    });
                    return false;
                },

                'click .tags .delete' : function(events) {

                    var tags    = this.model.get('tags');
                        tags.splice($(events.target).parent().attr('class').split(' ')[0], 1);

                    this.model.save('tags', tags);
                    return false;
                },


                'click .control .delete' : function() {
                    new Libary.DeleteWidget({
                        model : this.model
                    });
                    return false;
                },

                'click .control .edit' : function() {
                    new Libary.EditWidget({
                        model : this.model
                    });
                    return false;
                }
            },

            loadSrcByUserViewPort : function() {

                var that = this;
                var $img = this.$el.find('.loader');

                if ($img.length !== 0) {
                    if (isElementInViewport(this.$el[0])) {

                        var $nImg = $(document.createElement('img'));
                            $nImg.addClass('content');
                            $nImg.one('load', function() {
                                $img.replaceWith($nImg);
                            });

                            $nImg.attr('src', $img.find('img').data('src'));
                    }
                }
            },

            className   : 'list_item video',
            render      : function() {
                var that = this;
                    that.template({
                        path    : './templates/pages/snippets/libary.listItemVideo.html',
                        params  : _.extend({}, this.model.attributes, {
                            'name_truncated' : Helper.truncate(this.model.get('name'), 100)
                        }),
                        success : function() {
                            that.loadSrcByUserViewPort();
                        }
                    });
            },

            initialize  : function() {

                var that = this;

                    that.listenTo(this.model, 'destroy', function() {
                        that.remove();
                    });

                    that.listenTo(this.model, 'sync', function() {
                        that.render();
                    });

                    that.listenTo(this.model, 'change', function() {
                        that.render();
                    });
            }
        });

        Libary.VideoList = Backbone.View.extend({

            scrollCounter : 0,
            events      : {

                "scroll" : function() {

                    if (this.scrollCounter <= 10) {
                        this.scrollCounter++;
                        return;
                    }

                    this.scrollCounter = 0;
                    _.each(this.listItems, function(item) {
                        item.loadSrcByUserViewPort();
                    });
                }
            },

            listItems  : [],

            el          : '#main.libary #libary #videos',
            addItem     : function(model) {

                var listItem = new Libary.VideoListItem({model:model});
                    listItem.$el.prependTo(this.$el);
                    listItem.render();

                    this.listItems.push(listItem);
            }
        });


        Libary.ImageListItem = Backbone.View.extend({

            events      : {

                'click' : function() {
                    var win = window.open(this.model.get('url'), '_blank');
                        win.focus();
                },

                'click .addTag' : function() {
                    new Libary.TagWidget({
                        model   : this.model
                    });
                    return false;
                },

                'click .tags .delete' : function(events) {

                    var tags    = this.model.get('tags');
                        tags.splice($(events.target).parent().attr('class').split(' ')[0], 1);

                    this.model.save('tags', tags);
                    return false;
                },

                'click .control .delete' : function() {
                    new Libary.DeleteWidget({
                        model : this.model
                    });
                    return false;
                },

                'click .control .edit' : function() {
                    new Libary.EditWidget({
                        model : this.model
                    });
                    return false;
                }
            },

            loadSrcByUserViewPort : function() {

                var that = this;
                var $img = this.$el.find('.loader');

                if ($img.length !== 0) {
                    if (isElementInViewport(this.$el[0])) {

                        var $nImg = $(document.createElement('img'));
                            $nImg.addClass('content');
                            $nImg.one('load', function() {
                                $img.replaceWith($nImg);
                            });

                            $nImg.attr('src', $img.find('img').data('src'));
                    }
                }
            },

            className   : 'list_item image',
            render      : function() {

                var that = this;
                    that.template({
                        path    : './templates/pages/snippets/libary.listItemImage.html',
                        params  : _.extend({}, this.model.attributes, {
                            'name_truncated' : Helper.truncate(this.model.get('name'), 100)
                        }),
                        success : function() {
                            that.loadSrcByUserViewPort();
                        }
                    });
            },

            initialize  : function() {

                var that = this;

                    that.listenTo(this.model, 'destroy', function() {
                        that.remove();
                    });

                    that.listenTo(this.model, 'sync', function() {
                        that.render();
                    });

                    that.listenTo(this.model, 'change', function() {
                        that.render();
                    });
            }
        });

        Libary.ImagesList = Backbone.View.extend({

            scrollCounter : 0,
            events      : {

                "scroll" : function() {

                    if (this.scrollCounter <= 10) {
                        this.scrollCounter++;
                        return;
                    }

                    this.scrollCounter = 0;
                    _.each(this.listItems, function(item) {
                        item.loadSrcByUserViewPort();
                    });
                }
            },

            listItems  : [],

            el          : '#main.libary #libary #images',
            addItem     : function(model) {

                var that = this;
                var listItem = new Libary.ImageListItem({model:model});
                    listItem.$el.prependTo(this.$el);
                    listItem.render();

                this.listItems.push(listItem);
            }
        });



        Libary.LinkListItem = Backbone.View.extend({

            events      : {

                'click' : function() {
                    var $extend = $(this.$el).find('.extend');
                    if ($extend.is(':visible')) {
                        $extend.css('display', 'none');
                    } else {
                        $extend.css('display', 'block');
                    }
                },

                'click .url' : function() {
                    var win = window.open(this.model.get('url'), '_blank');
                        win.focus();
                },

                'click .addTag' : function() {
                    new Libary.TagWidget({
                        model   : this.model
                    });
                    return false;
                },

                'click .tags .delete' : function(events) {

                    var tags    = this.model.get('tags');
                        tags.splice($(events.target).parent().attr('class').split(' ')[0], 1);

                    this.model.save('tags', tags);
                    return false;
                },

                'click .control .delete' : function() {
                    new Libary.DeleteWidget({
                        model : this.model
                    });
                    return false;
                },

                'click .control .edit' : function() {
                    new Libary.EditWidget({
                        model : this.model
                    });
                    return false;
                }
            },

            className   : 'list_item link',
            render      : function() {

                var params = _.extend({}, this.model.attributes, {
                    dateFormated : Helper.timeConverter(this.model.get('created'))
                });

                var that = this;
                    that.template({
                        path    : './templates/pages/snippets/libary.listItemLink.html',
                        params  : params
                    });
            },

            initialize  : function() {

                var that = this;

                    that.listenTo(this.model, 'destroy', function() {
                        that.remove();
                    });

                    that.listenTo(this.model, 'sync', function() {
                        that.render();
                    });

                    that.listenTo(this.model, 'change', function() {
                        that.render();
                    });
            }
        });

        Libary.LinkList = Backbone.View.extend({
            listItems   : [],
            el          : '#main.libary #libary #links',
            addItem     : function(model) {

                var listItem = new Libary.LinkListItem({model:model});
                    listItem.$el.prependTo(this.$el);
                    listItem.render();

                    this.listItems.push(listItem);
            }
        });


        Libary.List = Backbone.View.extend({

            showCategories : function() {


                var all_empty = 0;

                this.vLinksList.$el.css('display', 'inline-block');
                if (this.vLinksList.listItems.length === 0) {
                    this.vLinksList.$el.css('display', 'none');
                    all_empty++;
                }

                this.vImagesList.$el.css('display', 'inline-block');
                if (this.vImagesList.listItems.length === 0) {
                    this.vImagesList.$el.css('display', 'none');
                    all_empty++;
                }

                this.vVideosList.$el.css('display', 'inline-block');
                if (this.vVideosList.listItems.length === 0) {
                    this.vVideosList.$el.css('display', 'none');
                    all_empty++;
                }

                this.vAudiosList.$el.css('display', 'inline-block');
                if (this.vAudiosList.listItems.length === 0) {
                    this.vAudiosList.$el.css('display', 'none');
                    all_empty++;
                }

                this.$el.find('.no_content').css('display', 'none');
                if (all_empty === 4) {
                    this.$el.find('.no_content').css('display', 'block');
                }
            },

            el          : '#main.libary #libary',
            initialize  : function() {

                var that = this;

                    that.vLinksList     = new Libary.LinkList();
                    that.vImagesList    = new Libary.ImagesList();
                    that.vVideosList    = new Libary.VideoList();
                    that.vAudiosList    = new Libary.AudioList();


                    that.listenTo(that.collection, 'sync', this.showCategories);

                    that.listenTo(that.collection, 'add', function(model) {

                        switch(model.get('type')) {

                            case 'image': this.vImagesList.addItem(model); break;
                            case 'video': this.vVideosList.addItem(model); break;
                            case 'audio': this.vAudiosList.addItem(model); break;

                            default:
                                this.vLinksList.addItem(model);
                                break;
                        }
                    });

                    that.listenTo(that.collection, 'reset', function() {
                        that.vLinksList.$el.html('');
                        that.vImagesList.$el.html('');
                        that.vVideosList.$el.html('');
                        that.vAudiosList.$el.html('');
                    });

                    that.collection.refresh();
            }
        });



        Libary.View = Backbone.View.extend({

            el          : '#main.libary',

            initialize  : function() {

                var that = this;

                    that.cList = new List.Collection();
                    that.cTags = new Tags.Collection();

                    that.vHead = new Libary.Head({collection: that.cList});
                    that.vList = new Libary.List({collection: that.cList});
                    that.vTags = new Libary.Tags({collection: that.cTags});

                    that.listenTo(Libary.Events, 'refresh', function(tagName) {


                        that.vList.vImagesList.listItems    = [];
                        that.vList.vVideosList.listItems    = [];
                        that.vList.vLinksList.listItems     = [];
                        that.vList.vAudiosList.listItems    = [];

                        var filter = {};
                        if (tagName !== void 0 &&
                            tagName !== 'all') {
                            filter = {
                                tags : tagName
                            };
                        }

                        that.vList.showCategories();
                        that.vTags.setTagActive(tagName);
                        that.cList.refresh(filter);
                    });
            }
        });

})();
