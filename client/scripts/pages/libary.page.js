(function() {

    "use strict";

    var $           = require('jquery');
    var _           = require('underscore');
    var when        = require('when');
    var Backbone    = require('backbone');
        Backbone.$  = $;

    var List    = require('../modules/list.module.js');
    var Lists   = require('../modules/lists.module.js');
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
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    var Libary = module.exports;

        Libary.lists = [];


        Libary.taggingSnippet = Backbone.View.extend({

            className : 'taggingSnippet',

            events : {

                'click a' : function() {

                    var $add_new = this.$el.find('.add_new');
                    if ($add_new.css('display') === 'none') {
                        $add_new.css('display', 'block');
                    } else {
                        $add_new.css('display', 'none');
                    }

                }
            },

            initialize: function() {

                var that = this;
                    that.cTags = new Tags.Collection();
                    that.cTags.refresh()
                        .done(function() {
                            that.render();
                        });
            },

            render : function() {

                var that = this;
                    that.template({
                        path    : './templates/snippets/tagging.snippet.html',
                        params  : {
                            'currentTags'   : that.model.get('tags'),
                            'tagList'       : that.cTags.getAsList()
                        }
                    });
            }
        });

        Libary.listingSnippet = Backbone.View.extend({

            className : 'listingSnippet',

            events : {

                'click a' : function() {

                    var $add_new = this.$el.find('.add_new');
                    if ($add_new.css('display') === 'none') {
                        $add_new.css('display', 'block');
                    } else {
                        $add_new.css('display', 'none');
                    }
                },

                'click button' : function(el) {

                    var that = this;

                    var $parent = $(el.target).parent();
                    var $input  = $parent.find('input');

                    var value   = $input.val();
                    if (value && value.length !== 0) {

                        this.cLists.create({
                            'name' : value
                        }, {
                            wait    : true,
                            success : function(listModel) {

                                that.model.set('list', listModel.get('id'));
                                if (!that.model.isNew()) {
                                    that.model.save();
                                }
                                that.render();
                            }
                        });
                    }
                },

                'change select' : function(el) {

                    var $selected = $(el.target).find(':selected');
                    var value = $selected.attr('class');
                    if (value && value !== null) {

                        if (this.model.collection) {
                            console.log('model is already part of store: ' + this.model.collection.store);
                        }
                    }
                }
            },

            initialize: function() {

                var that = this;
                    that.cLists = new Lists.Collection();
                    that.cLists.refresh()
                        .done(function() {
                            that.render();
                        });
            },

            render : function() {

                var that = this;
                    that.template({
                        path    : './templates/snippets/lists.snippet.html',
                        params  : {
                            'lists'         : that.cLists.models,
                            'currentList'   : that.model.store
                        },
                        success : function() {

                            if (that.cLists.length === 0) {
                                that.$el.find('select').prop('disabled', true);
                            }

                            that.$el.find('option.' + that.model.get('list')).prop('selected', true);
                        }
                    });
            }
        });



        Libary.editWidget = Backbone.View.extend({

            className   : 'edit',

            events      : {

                'click .close' : function() {

                    $('#widget').css('display', 'none');
                    $('#widgetContent').html('');
                },

                'change .data textarea' : function(el) {

                    var $target = $(el.target);

                    var that        = this;
                    var className   = $target.attr('class');

                    if (that.model.has(className)) {
                        that.model.save(className, $target.text());
                    }
                },

                'change .data input' : function(el) {

                    var $target = $(el.target);

                    var that        = this;
                    var className   = $target.attr('class');

                    if (that.model.has(className)) {
                        that.model.save(className, $target.val());
                    }
                },

                'change #listing select' : function(el) {

                    var $select = $(el.target);
                    var $option = $select.find(':selected');

                    var oldList = Libary.lists[this.model.store].collection;
                    var newList = Libary.lists[$option.val()].collection;

                    var clonedModel = this.model.clone();

                        this.model.destroy();

                        clonedModel.set('id', null);
                        newList.add(clonedModel);
                        newList.save();

                    var cListItemOld = that.cLists.get(oldList.store);
                        cListItemOld.set('totalCount', cListItemOld.get('totalCount') - 1);

                    var cListItemNew = that.cLists.get(newList.store);
                        cListItemNew.set('totalCount', cListItemNew.get('totalCount') + 1);

                        that.cLists.save();
                }
            },

            initialize : function() {

                _.bindAll(this, 'render');

                var that = this;
                    that.cLists = new Lists.Collection();
                    that.cTags  = new Tags.Collection();

                    //load all lists
                    when.all([that.cLists.refresh(), that.cTags.refresh()])
                        .done(that.render);
            },

            render : function() {

                var that = this;

                var $widgetContent = $('#widgetContent');
                    $widgetContent.html('loading Data for URL.');

                var $widget = $('#widget');
                    $widget.css('display', 'block');

                    that.template({
                        path    : './templates/widgets/libary.edit.html',
                        params  : that.model.attributes,
                        success : function() {

                            var taggingSnippetView = new Libary.taggingSnippet({ model : that.model });
                                taggingSnippetView.$el.appendTo(that.$el.find('#tagging'));

                            var listSnippetView = new Libary.listingSnippet({ model : that.model });
                                listSnippetView.$el.appendTo(that.$el.find('#listing'));

                            $('#widgetContent').html(that.$el);
                        }
                    });
            }
        });

        Libary.addWidget = Backbone.View.extend({

            className : 'add',

            events      : {

                'click #images img' : function(el) {

                    var $target = $(el.target);
                    var $parent = $target.parent();

                    $parent.find('img')
                        .css('border', 'none')
                        .removeClass('selected');

                    $target
                        .css('border', '2px solid #000')
                        .addClass('selected');

                    this.model.set('previewImageUrl', $target.attr('src'));
                },

                'click #buttons .save' : function() {

                    var that = this;

                    var $inputs     = this.$el.find('input');
                    var $textareas  = this.$el.find('textarea');

                        //set input data
                        $inputs.each(function() {
                            var className = $(this).attr('class');
                            if (that.model.has(className)) {
                                that.model.set(className, $(this).val());
                            }
                        });

                        //set data from textareas
                        $textareas.each(function() {
                            var className = $(this).attr('class');
                            if (that.model.has(className)) {
                                that.model.set(className, $(this).text());
                            }
                        });

                    var listId = this.$el.find('#listing select :selected').val();
                    if (listId === null || listId === 'null') {
                        alert('please select a list');
                        return;
                    }

                    var selectedList = Libary.lists[listId];
                    if (!selectedList) {
                        throw new Error('list (' + listId + ') does not exist');
                    }

                    //add to list
                    selectedList.collection.add(that.model);

                    //set new total count
                    var listItem = that.cLists.get(listId);
                        listItem.save({
                            'totalCount' : listItem.get('totalCount') + 1
                        });

                    //save model
                    that.model.save();
                },

                'click #buttons .close' : function() {
                    $('#widget').css('display', 'none');
                    $('#widgetContent').html('');
                }
            },

            initialize : function() {

                _.bindAll(this, 'render');

                var that = this;
                    that.cLists = new Lists.Collection();
                    that.cTags  = new Tags.Collection();

                    //load all lists
                    when.all([that.cLists.refresh(), that.cTags.refresh()])
                        .done(that.render);
            },

            render : function() {

                var that = this;

                var $widgetContent = $('#widgetContent');
                    $widgetContent.html('loading Data for URL.');

                var $widget = $('#widget');
                    $widget.css('display', 'block');

                    that.model.refresh()
                            .done(function(data) {

                                that.template({
                                    path    : './templates/widgets/libary.add.html',
                                    params  : _.extend({}, that.model.attributes, {
                                        images  : data.images || []
                                    }),
                                    success : function() {

                                        var taggingSnippetView = new Libary.taggingSnippet({ model : that.model });
                                            taggingSnippetView.$el.appendTo(that.$el.find('#tagging'));

                                        var listSnippetView = new Libary.listingSnippet({ model : that.model });
                                            listSnippetView.$el.appendTo(that.$el.find('#listing'));

                                        $('#widgetContent').html(that.$el);
                                    }
                                });
                            });
            }
        });

        Libary.deleteWidget = Backbone.View.extend({

            events : {

                'click .close' : function() {
                    $('#widgetContent').html('');
                    $('#widget').css('display', 'none');
                },

                'click .delete' : function() {

                    var that = this;
                    var cLists = new Lists.Collection();
                        cLists.refresh()
                            .done(function() {

                                var mLists = cLists.get(that.model.get('id'));
                                if (mLists) {

                                    var totalCount = mLists.get('totalCount');
                                    if (totalCount === 0 || totalCount === "0") {
                                        mLists.save('totalCount', parseInt(totalCount, 10) - 1);
                                    }
                                }

                                that.model.destroy();

                                $('#widgetContent').html('');
                                $('#widget').css('display', 'none');
                            });


                }
            },

            initialize : function() {

                $('#widgetContent').html('');
                $('#widget').css('display', 'block');

                this.render();
            },

            render : function() {

                var that = this;
                    that.template({
                        path    : './templates/widgets/libary.delete.html',
                        success : function() {
                            $('#widgetContent').html(that.$el);
                        }
                    });
            }
        });


        Libary.editListWidget = Backbone.View.extend({

            className   : 'editList',

            events      : {

                'click #lists ul li button' : function(el) {

                    var $target = $(el.target);
                    var $parent = $target.parent();

                    var model = this.cLists.get($parent.attr('id'));
                    if (model.get('totalCount') !== 0) {
                        alert('list is not empty');
                        return;
                    }

                    model.destroy();
                    this.render();
                },

                'click #lists #create_lists button' : function(el) {

                    var $target = $(el.target);
                    var $parent = $target.parent();

                    var $input  = $parent.find('input');

                    if ($input.val().length !== 0) {

                        var modelWithMaxId = this.cLists.max(function(listItem) {
                            return parseInt(listItem.get('id'), 10);
                        });

                        var model = new Lists.Model({
                            name : $input.val()
                        });

                        model.store = this.cLists.store;
                        this.cLists.add(model);
                        model.save();

                        this.render();
                    }
                },

                'change #lists #available_lists ul li input' : function(el) {

                    var $target = $(el.target);
                    var $parent = $target.parent();

                    var model = this.cLists.get($parent.attr('id'));
                        model.set('name', $target.val());
                        model.save();
                },

                'click .close' : function() {
                    $('#widget').css('display', 'none');
                    $('#widgetContent').html('');
                }
            },

            initialize  : function() {

                var that = this;
                    that.cLists = new Lists.Collection();

                    that.cLists.refresh()
                        .done(function() {
                            that.render();
                        });

                $('#widgetContent').html(that.$el);
            },

            render      : function() {

                var that = this;
                    that.template({
                        path    : './templates/widgets/libary.edit.list.html',
                        params  : {
                            'lists' : that.cLists.models
                        },
                        success : function() {
                            $('#widget').css('display', 'block');
                        }
                    });
            }
        });




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

                        var model = new List.Model();
                            model.set('url', value);

                        new Libary.addWidget({ model : model });
                    }

                }
            }
        });

        Libary.Sidebar = Backbone.View.extend({

            el : '#sidebar',

            events : {
                'click #manage_lists' : function() {
                    new Libary.editListWidget();
                }
            },

            initialize : function() {

                var that = this;

                    that.listenTo(that.collection, 'sync', function() {
                        that.render();
                    });
            },

            render : function() {

                var $empty_lists = this.$el.find('#empty_lists div');
                    $empty_lists.html('');

                var $list = this.$el.find('#lists');
                    $list.html('');

                var that = this;
                    that.collection.each(function(listItem) {
                        if (listItem.get('totalCount') !== 0) {
                            $list.append('<div id="' + listItem.get('id') +'" class="listItem">' +
                            '<div class="listIcon"></div><span>' +
                            listItem.get('name') + '</span></div>');
                        }
                    });
            }
        });


        Libary.ListItem = Backbone.View.extend({

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
                    new Libary.deleteWidget({
                        model : this.model
                    });
                    return false;
                },

                'click .control .edit' : function() {
                    new Libary.editWidget({
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
                            $nImg.addClass('media_content');
                            $nImg.one('load', function() {
                                $img.replaceWith($nImg);
                            });

                            $nImg.attr('src', $img.find('img').data('src'));
                    }
                }
            },

            className   : function() {

                return 'listItem ' + this.model.get('type');
            },

            render      : function() {

                var type = this.model.get('type');
                if (type === null) {
                    type = 'link';
                }

                var typeName = type + 'Item';

                var params = _.extend({}, this.model.attributes, {
                    'dateFormated' : Helper.timeConverter(this.model.get('created')),
                    'name_truncated' : Helper.truncate(this.model.get('name'), 100)
                });

                var that = this;
                    that.template({
                        path    : './templates/pages/snippets/libary.' + typeName + '.html',
                        params  : params,
                        success : function() {
                            that.loadSrcByUserViewPort();
                        }
                    });
            },

            initialize  : function(params) {

                var that = this;

                    that.listenTo(this.model, 'destroy',    that.remove);
                    that.listenTo(this.model, 'sync',       that.render);
                    that.listenTo(this.model, 'change',     that.render);
            }
        });

        Libary.List = Backbone.View.extend({

            className       : 'list',

            listItems       : [],
            scrollCounter   : 0,

            _scrolling : function() {

                if (this.scrollCounter <= 10) {
                    this.scrollCounter++;
                    return;
                }

                this.scrollCounter = 0;
                _.each(this.listItems, function(item) {
                    item.loadSrcByUserViewPort();
                });
            },

            initialize : function() {

                _.bindAll(this, 'refresh', '_scrolling');

                var that = this;
                    that.collection = new List.Collection({
                        store : that.model.get('id')
                    });

                    that.$el.attr('id', that.model.get('id'));

                    that.listenTo(that.collection, 'add', function(model) {
                        that.addItem(model);
                    });
            },

            refresh : function() {

                var that = this;
                    that.listItems = [];
                    that.$el.html(that.defaultTmpl);

                    that.collection.each(function(model) {
                        that.addItem(model);
                    });

                    that.$el.find('.content').off()
                        .on('scroll', that._scrolling);

                    if (that.collection.length !== 0) {
                        that.$el.css('display', 'inline-block');
                    }
            },

            addItem : function(model) {

                var view = new Libary.ListItem({ model : model });
                    view.$el.prependTo(this.$el.find('.content'));
                    view.render();

                    this.listItems.push(view);
            },

            render : function(success) {

                var that = this;

                return when.promise(function(resolve, reject) {
                    that.template({
                        path    : './templates/pages/snippets/libary.list.html',
                        success : function() {
                            that.$el.find('.head .listname').html(that.model.get('name'));
                            that.defaultTmpl = that.$el.html();
                            resolve();
                        }
                    });
                });
            }
        });

        Libary.View = Backbone.View.extend({

            el              : '#main.libary',
            scrollCounter   : 0,


            events : {

                'click #sidebar #lists .listItem' : function(el) {

                    var value = $(el.target).attr('id');
                     if (!value) {
                        value = $(el.target).parent().attr('id');
                     }

                    var $list = $('#libary').find('#' + value);

                    $('#libary').animate({
                        scrollLeft: $list.position().left
                    }, 500);


                    function doBounce(element, times, distance, speed) {
                        for(var i = 0; i < times; i++) {
                            element.animate({marginTop: '-='+distance}, speed)
                                .animate({marginTop: '+='+distance}, speed);
                        }
                    }

                    doBounce($list, 2, '5px', 200);
                }
            },


            _scrolling : function() {

                var that = this;

                if (that.scrollCounter < 10) {
                    that.scrollCounter = ++that.scrollCounter;
                    return;
                }

                that.scrollCounter = 0;

                _.each(Libary.lists, function(list, listName) {

                    if (!list) {
                        return;
                    }

                    var inView = isElementInViewport(list.$el[0]);
                    if (inView === true) {
                        _.each(list.listItems, function(listItem) {
                            listItem.loadSrcByUserViewPort();
                        });
                    }
                });

            },

            _initializeLists : function() {

                var promises = [];

                var that = this;
                    that.cLists.each(function(model) {
                        promises.push(that.addListView(model));
                    });

                    when.all(promises)
                        .done(function() {

                            //enable scrolling event
                            that.$el.find('#libary')
                                .on('scroll', that._scrolling);

                            that.cLists.save();
                        });
            },

            addListView : function(model) {

                var $libary = this.$el.find('#libary');

                var view = new Libary.List({ model : model });
                    view.$el.appendTo($libary);

                    //set to list store
                    Libary.lists[model.get('id')] = view;

                var that = this;

                return view.render()
                        .then(view.collection.refresh)
                        .then(function(collection) {

                            //refresh totalCount
                            that.cLists.get(collection.store).set('totalCount', collection.length);

                            return collection;
                        }, Helper.showError)
                        .then(view.refresh, Helper.showError);
            },

            initialize : function() {

                _.bindAll(this, '_initializeLists');

                var that = this;
                    that.cLists = new Lists.Collection();

                    that.vHead      = new Libary.Head();
                    that.vSidebar   = new Libary.Sidebar({
                        collection : that.cLists
                    });

                    that.cLists
                        .refresh()
                        .done(that._initializeLists, Helper.showError);
            }
        });

})();
