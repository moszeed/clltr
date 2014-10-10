(function() {

    "use strict";

    var $           = require('jquery');
    var _           = require('underscore');
    var when        = require('when');
    var Backbone    = require('backbone');
        Backbone.$  = $;

    var List    = require('../modules/list.module.js');
    var Tags    = require('../modules/tags.module.js');
    var Helper  = require('../modules/helper.module.js');

    var Libary = module.exports;

        Libary.Events = _.extend({}, Backbone.Events);


        Libary.Head = Backbone.View.extend({

            el      : '#main.libary #head',
            events  : {

                'click #logout' : function() {

                    User.logout();
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


        Libary.ListItem = Backbone.View.extend({

            events      : {

                'click .addTag' : function() {
                    new Libary.TagWidget({
                        model   : this.model
                    });
                },

                'click .tags span .delete' : function(events) {

                    var tags    = this.model.get('tags');
                        tags.splice($(events.target).parent().attr('class'), 1);

                    this.model.save('tags', tags);
                },

                'click .edit' : function() {
                    new Libary.EditWidget({
                        model : this.model
                    });
                },

                'click .control .delete' : function() {
                    new Libary.DeleteWidget({
                        model : this.model
                    });
                },

                'click .name' : function() {
                    var win = window.open(this.model.get('url'), '_blank');
                        win.focus();
                }
            },

            className   : 'list_item',

            setFavicon  : function() {

                var that = this;
                var $img = this.$el.find('.favicon img');
                if ($img.length === 1) {
                    $img.attr('src', "http://g.etfv.co/" + that.model.get('url'));
                }
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
            },

            render      : function() {

                var that = this;

                    that.template({
                        path    : './templates/pages/snippets/libary.listItem.html',
                        params  : _.extend({}, that.model.attributes, {
                            dateFormated : Helper.timeConverter(that.model.get('created'))
                        }),
                        success : function() {
                            that.setFavicon();
                        }
                    });
            }
        });

        Libary.List = Backbone.View.extend({

            el          : '#main.libary #libary',
            addItem     : function(model) {

                var listItem = new Libary.ListItem({model:model});
                    listItem.$el.prependTo(this.$el);
                    listItem.render();
            },

            initialize  : function() {

                var that = this;

                    that.listenTo(that.collection, 'reset', function() {
                        that.$el.html('');
                    });

                    that.listenTo(that.collection, 'add', function(model) {
                        that.addItem(model);
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

                        var filter = {};
                        if (tagName !== void 0 &&
                            tagName !== 'all') {
                            filter = {
                                tags : tagName
                            };
                        }

                        that.vTags.setTagActive(tagName);
                        that.cList.refresh(filter);
                    });

            }

        });

})();
