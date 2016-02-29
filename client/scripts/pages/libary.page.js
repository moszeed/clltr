(function() {

    "use strict";

    var $        = require('jquery');
    var _        = require('underscore');
    var Backbone = require('drbx-js-backbone');
    var Helper   = require('helper');

    // get needed modules
    var User   = require('../modules/user.module.js');
    var Lists  = require('../modules/lists.module.js');
    var Items  = require('../modules/items.module.js');

    // load collections
    var cItems = new Items.Collection();
    var cLists = new Lists.Collection();

    // preload templates
    Backbone.View.preLoadTemplates([
        './templates/pages/libary/libary.list.html'
    ])

    // API Urls
    var ApiGetFileUrl   = Backbone.DrbxJs.Client._urls.getFile + "/";
    var ApiGetThumbnail = Backbone.DrbxJs.Client._urls.thumbnails + "/";

    // check if allowed to view this page
    if (!User.isLoggedIn()) {
        throw new Error('not logged in');
    }


    /**
     * [getDeltaData description]
     * @return {[type]} [description]
     */
    function getDeltaData() {

        return Backbone.DrbxJs.delta();
    }

    /**
     * [getVideoUrl description]
     * @param  {[type]} model     [description]
     * @param  {[type]} thumbnail [description]
     * @return {[type]}           [description]
     */
    function getDropboxFileApiUrl(filename, thumbnail) {

        var drbxFilePath       = ApiGetFileUrl;
        var drbxFilePathParams = '?access_token=' + Backbone.DrbxJs.Client._oauth._token;

        return drbxFilePath + filename + drbxFilePathParams;
    }

    /**
     * [getFaviconUrl description]
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    function getFaviconUrl(model) {

        var drbxFilePath       = ApiGetFileUrl;
        var drbxFilePathParams = '?access_token=' + Backbone.DrbxJs.Client._oauth._token;

        if (model.get('faviconUrlCache')) {
            return  drbxFilePath +
                    Backbone.DrbxJs.Client._urlEncodePath(model.get('faviconUrlCache')) +
                    drbxFilePathParams;
        }

        return model.get('faviconUrl') || './images/favicon.ico';
    }

    /**
     * [getFaviconUrl description]
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    function getImageUrl(model, thumbnail) {

        var drbxFilePath       = ApiGetFileUrl;
        var drbxFilePathParams = '?access_token=' + Backbone.DrbxJs.Client._oauth._token;

        var fileName = model.get('url');

        // handle images
        if (model.get('type') === 'image') {
            if (model.get('urlCache')) {
                fileName = model.get('urlCache');
            }
        }

        // handle videos
        if (model.get('type') === 'video') {

            if (model.get('urlCache')) {
                fileName = model.get('urlCache');
            }

            if (model.get('previewImageUrl')) {
                 fileName = model.get('previewImageUrl');
            }

            if (model.get('previewImageUrlCache')) {
                fileName = model.get('previewImageUrlCache')
            }
        }

        // currently partly disabled, dropbox has problems with files without .file-type
        if (thumbnail) {
            if (Helper.getFileTypeFromPath(fileName)) {
                drbxFilePath       = ApiGetThumbnail;
                drbxFilePathParams += '&size=l';
            }
        }

        return  drbxFilePath + fileName + drbxFilePathParams;
    }



    /**
     * [isElementInViewport description]
     * @param  {[type]}  el [description]
     * @return {Boolean}    [description]
     */
    function isElementInViewport(el) {

        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

        var r, html;
        if ( !el || 1 !== el.nodeType ) { return false; }
        html = document.documentElement;
        r = el.getBoundingClientRect();

        return ( !!r
          && r.bottom >= 200
          && r.right >= 100
          && r.top <= html.clientHeight + 200
          && r.left <= html.clientWidth
        );
    }

    /**
     * [doBounce description]
     * @param  {[type]} element  [description]
     * @param  {[type]} times    [description]
     * @param  {[type]} distance [description]
     * @param  {[type]} speed    [description]
     * @return {[type]}          [description]
     */
    function doBounce(element, times, distance, speed) {

        for(var i = 0; i < times; i++) {
            element.animate({marginTop: '-='+distance}, speed)
                .animate({marginTop: '+='+distance}, speed);
        }
    }

    /**
     * [saveUrl description]
     * @param  {[type]} url         [description]
     * @param  {[type]} listId      [description]
     * @param  {[type]} saveContent [description]
     * @return {[type]}             [description]
     */
    function saveUrl(url, listId, saveContent) {

        if (!url) throw new Error('no url given');
        if (!listId) throw new Error('no listId given');

        var itemParams = {
            url   : url,
            listId: [listId]
        };

        var itemOpts = {
            saveContent: saveContent || true
        };

        return cItems.addAndGetData(itemParams, itemOpts)
            .then(function(model) {
                return model.save();
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    //
    // Item Editor/Detail
    //

    var ItemEditor = {};
        ItemEditor.current = null;

        ItemEditor.View = Backbone.View.extend({

            className: 'item_editor hidden',

            events: {

                'click a': function(el) {
                    el.preventDefault();
                },

                'click .edit_icon'            : 'activateEditMode',
                'click label[for="edit_icon"]': 'activateEditMode',

                'click a.remove': function() {
                    cItems.get(this.itemId).destroy();
                },

                'keyup :input': _.debounce(function(el) {

                    var $target = $(el.target);
                    var $parent = $target.parent();

                    var model = cItems.get(this.itemId);
                    var key   = $parent.attr('class').split(' ')[1];

                    model.set(key, $target.val().trim());
                    model.save();

                }, 300)
            },

            activateEditMode: function() {

                var $a = this.$el.find('a');
                var $disabledItems = this.$el.find(':disabled');
                if ($disabledItems.length === 0) {
                    this.$el.find(':input').attr('disabled', true);
                    $a.css('display', 'none');
                    return;
                }

                $a.css('display', 'block');
                $disabledItems.removeAttr('disabled');
            },


            initialize: function() {

            },

            prepare: function(listId) {
                this.listId = listId;
                var $list = Libary.current.$el.find('.list.' + this.listId);
                this.$el.insertAfter($list);
            },

            render: function(model) {

                this.itemId = model.id;
                this.template({
                    path   : './templates/pages/libary/libary.itemEditor.html',
                    params : model.attributes,
                    success: function() {
                        this.$el.removeClass('hidden');
                    }.bind(this)
                });
            }
        });

        ItemEditor.openEditorByItemModel = function(model) {

            var listId = model.get('listId')[0];

            if (ItemEditor.current) {
                if (ItemEditor.current.listId !== listId) {
                    ItemEditor.current.remove();
                    ItemEditor.current = null;
                }
            }

            if (!ItemEditor.current) {
                ItemEditor.current = new ItemEditor.View();
                ItemEditor.current.prepare(listId);
            }

            Libary.current.$el.find('.listItem').removeClass('active');

            var $list = Libary.current.$el.find('.list.' + listId);
            var $item = $list.find('.listItem.' + model.id);
            if ($item.length !== 0) {
                $item.addClass('active');
            }

            var $itemEditor = ItemEditor.current;
                $itemEditor.render(model);
        };

    //
    // Item Search
    //

    var Search = {};

        Search.View = Backbone.View.extend({

            el     : '#head #search_results',
            itemTpl: _.template(
                '<div id="<%= id%>" class="searchItem">' +
                    '<span class="url"><%= url%></span>' +
                    '<span class="description"><%= description %></span>' +
                '</div>'
            ),

            events: {

                'click .searchItem': function(el) {
                    Libary.Events.trigger('itemSelected', $(el.currentTarget).attr('id'));
                    this.hide();
                },

                'click button': function() {

                    var $addNewItem = this.$el.find('.add_new_item');

                    var urlToAdd    = $('#actions .search').val();
                    var listId      = $addNewItem.find('.list select').val();
                    var contentSave = $addNewItem.find('.content_save input').val();

                    saveUrl(urlToAdd, listId, contentSave);

                    this.hide();
                }
            },

            hide: function() {
                this.$el.css('display', 'none');
            },

            refresh: function(searchString) {

                var $addItem = this.$el.find('.add_new_item');
                    $addItem.css('display', 'none');

                var searchResults = cItems.search(searchString);
                if (searchResults.length === 0) {
                    $addItem.css('display', 'block');
                }

                var resultFields  = _.map(searchResults,
                    function(searchItem) {
                        return this.itemTpl({
                            id         : searchItem.get('id'),
                            url        : searchItem.get('url'),
                            description: searchItem.get('description')
                        });
                    }.bind(this)
                );

                this.$el.find('.results').html(resultFields.join(''));
                this.$el.css('display', 'block');
            },

            render: function() {
                this.template({
                    path   : './templates/pages/libary/libary.search.html',
                    params : {
                        'lists': cLists.toJSON()
                    }
                });
            }
        });

    //
    // Head
    //

    var Head = {};

        Head.View = Backbone.View.extend({

            el    : '#head',
            events: {

                'keyup #actions .search': function(el) {

                    var searchString = $(el.target).val();
                    if (searchString.length >= 1) {
                        Search.current.refresh(searchString);
                    } else {
                        Search.current.hide();
                    }
                }
            }
        });


    //
    // Sidebar
    //

    var Sidebar = {};

        Sidebar.View = Backbone.View.extend({

            el: '#sidebar',

            events: {

                'click #lists .listItem': function(el) {

                    var $target = $(el.target);

                    var value = $target.attr('id');
                    if (!value) {
                        value = $target.parent().attr('id');
                    }

                    this.scrollToList(value);
                },

                'click #add_list': function() {

                    cLists.add({
                        name       : 'New List',
                        description: null,
                        position   : cLists.length + 1
                    });
                }
            },

            scrollToList: function(listId) {

                var $lists = $('#libary #lists');
                var $list = $lists.children('.list.' + listId);

                if (!isElementInViewport($list[0])) {
                    $lists.animate({
                        scrollLeft: $list.position().left
                    }, 500);
                }

                doBounce($list.find('.head'), 2, '10px', 200);
            },

            initialize: function() {
                this.listenTo(cLists, 'sync', this.render);
            },

            render: function() {

                var $empty_lists = this.$el.find('#empty_lists div');
                    $empty_lists.html('');

                var $list = this.$el.find('#lists');
                    $list.html('');

                cLists.each(function(listItem) {
                    if (listItem.get('totalCount') !== 0) {
                        $list.append(
                            '<div id="' + listItem.get('id') + '" class="listItem">' +
                                '<div class="listIcon"></div>' +
                                '<span>' + listItem.get('name') + '</span>' +
                            '</div>'
                        );
                    }
                });
            }
        });


    //
    // Libary
    //

    var Libary = {};

        Libary.vItem = Backbone.View.extend({

            events: {

                'click .url': function(el) {

                    el.preventDefault();
                    var win = window.open(this.model.get('url'), '_blank');
                        win.focus();
                    return false;
                },

                'click': function() {

                    if (ItemEditor.current) {
                        if (ItemEditor.current.itemId === this.model.id) {
                            ItemEditor.current.remove();
                            ItemEditor.current = null;
                            this.$el.removeClass('active');
                            return true;
                        }
                    }

                    ItemEditor.openEditorByItemModel(this.model);
                }
            },

            className: function() {
                return 'listItem ' + this.model.get('type') + ' ' + this.model.get('id');
            },

            loadSrcByUserViewPort: function() {

                var $img = this.$el.find('.loader');
                if ($img.length !== 0) {
                    if (isElementInViewport(this.$el[0])) {

                        var $nImg = $(document.createElement('img'));
                            $nImg.addClass('media_content');
                            $nImg.one('load', function() {
                                $img.replaceWith($nImg);
                            });

                            $nImg.attr('src', getImageUrl(this.model, true));
                    }
                }
            },

            initialize: function() {

                _.bindAll(this, 'loadSrcByUserViewPort');

                // refresh item on change
                this.listenTo(this.model, 'sync', function() {
                    this.render();
                    this.loadSrcByUserViewPort();
                }.bind(this));
            },

            render: function() {

                var type = this.model.get('type');
                if (type === null) {
                    type = 'link';
                }

                var typeName = type + 'Item';
                var fullPath = './templates/pages/libary/libary.' + typeName + '.html';

                this.$el.removeClass('locked');
                if (!this.model.get('id')) {
                    this.$el.addClass('locked');
                }

                var params   = _.extend({}, this.model.toJSON(), {
                    'faviconUrl'    : getFaviconUrl(this.model),
                    'dateFormated'  : Helper.timeConverter(this.model.get('created')),
                    'name_truncated': Helper.truncate(this.model.get('name'), 100),
                    'urlCache'      : getDropboxFileApiUrl(this.model.get('urlCache'))
                });

                return new Promise(function(resolve, reject) {
                    this.template({
                        path   : fullPath,
                        params : params,
                        success: function() {
                            resolve();
                        }
                    });
                }.bind(this));
            }
        });

        Libary.vList = Backbone.View.extend({

            items: [],

            className: function() {
                return 'list ' + this.model.get('id');
            },

            events: {

                'click .optionsItem.position .arrow_right' : function() {

                    var currentPosition = this.model.get('position');
                    if (currentPosition !== 1) {

                        var previousPosition = currentPosition - 1;
                        var previousModel = cLists.findWhere({
                            'position': previousPosition
                        })

                        previousModel.set('position', currentPosition);
                        this.model.set('position', previousPosition);
                        cLists.trigger('refresh');

                        this.model.save();
                    }
                },

                'click .optionsItem.position .arrow_left': function() {

                    var currentPosition = this.model.get('position');
                    if (currentPosition !== parseInt(cLists.length, 10)) {

                        var nextPosition = currentPosition + 1;
                        var previousModel = cLists.findWhere({
                            'position': nextPosition
                        })

                        previousModel.set('position', currentPosition);

                        this.model.set('position', nextPosition);
                        this.model.save().then(function() {
                            cLists.trigger('refresh');
                        })
                    }
                },

                'click .listOptions.options_icon': function() {
                    $(this.$el.find('.options')).slideToggle(300);
                },

                'click .options a': function(el) {
                    el.preventDefault();
                },

                'click .options a.remove': function() {

                    var listId = this.model.get('id');
                    var items  = cItems.models.filter(function(model) {
                        return _.indexOf(model.get('listId'), listId) !== -1;
                    });

                    if (items.length !== 0) {
                        alert('list not empty');
                        return true;
                    }

                    this.model.destroy();
                },

                'keyup .options :input': _.debounce(
                    function(el) {

                        var $parent = $(el.target).parent();

                        var target  = $parent.attr('class').split(' ')[1];
                        var value   = $(el.target).val();

                        this.model.set(target, value);
                        this.model.save();
                    }, 300
                )
            },

            initialize: function() {

                this.listenTo(this.model, 'change:name', this.refreshHead);
                this.listenTo(this.model, 'change:description', this.refreshHead);

                this.render();
            },

            checkItems: function() {
                _.each(this.items, function($item) {
                    $item.loadSrcByUserViewPort();
                }.bind(this));
            },

            addItem: function(model) {

                var $item = new Libary.vItem({ model: model });
                    $item.$el.prependTo(this.$el.find('.content'));

                this.items.push($item);

                return $item.render();
            },

            loadItems: function() {

                var $content = this.$el.find('.content');
                    $content.css('display', 'none');

                var promiseContainer = [];

                this.items = [];

                // append items to list
                _.each(cItems.models, function(mItem) {

                    if (!_.contains(mItem.get('listId'), this.model.get('id'))) {
                        return true;
                    }

                    promiseContainer.push(this.addItem(mItem));

                }.bind(this));

                // wait until all has loaded
                // then check if in viewport to load content
                // to avoid unnecessary loading of images
                Promise.all(promiseContainer)
                    .then(function() {
                        this.checkItems();
                    }.bind(this))


                $content.css('display', 'block');
            },

            refreshHead: function() {

                var $head = this.$el.find('.head');
                    $head.find('.listName').html(this.model.get('name'));
                    $head.find('.listDescription').html(this.model.get('description'));
            },

            render: function() {

                this.template({
                    path   : './templates/pages/libary/libary.list.html',
                    params : _.extend({}, this.model.toJSON(), {
                        'position_reversed': (this.model.collection.length + 1) -this.model.get('position')
                    }),
                    success: function() {

                        this.loadItems();

                        // activate scrolling check
                        this.$el.find('.content').off()
                            .on('scroll', _.debounce(function() {
                                this.checkItems();
                            }.bind(this), 100));

                    }.bind(this)
                });
            }
        });

        Libary.vLists = Backbone.View.extend({

            el: '#libary #lists',

            lists: {},

            initialize: function() {

                _.bindAll(this, 'checkLists', 'addList', 'removeList');

                this.listenTo(cLists, 'update', this.render);
                this.listenTo(cLists, 'refresh', function() {
                    this.render(true);
                }.bind(this));


                this.listenTo(cItems, 'add', function(model) {

                    var addedTolists = model.get('listId');
                    _.each(addedTolists, function(listId) {
                        this.lists[listId].addItem(model);
                    }.bind(this));
                }.bind(this));

                this.listenTo(cItems, 'remove', function(model) {

                    var removeFromLists = model.get('listId');
                    _.each(removeFromLists, function(listId) {

                        var foundItem = _.find(this.lists[listId].items, function(itemView) {
                            return itemView.model.get('id') === model.get('id');
                        });

                        foundItem.remove();

                    }.bind(this));

                    ItemEditor.current.remove();
                    ItemEditor.current = null;
                });

                this.$el.off().on('scroll', this.checkLists);
            },

            checkLists: _.debounce(function() {

                _.each(this.lists, function(list) {
                    list.checkItems();
                });
            }, 500),


            addList: function(mList) {

                if (!this.lists[mList.get('id')]) {

                    if (!mList.get('position')) {
                        var keyPos = mList.collection.models.indexOf(mList);
                        mList.set('position', parseInt(keyPos, 10) + 1);
                        mList.save();
                    }

                    var vList = new Libary.vList({ model: mList });
                        vList.$el.appendTo(this.$el);

                    this.lists[mList.get('id')] = vList;
                }
            },

            removeList: function(mList) {

                if (this.lists[mList.get('id')]) {
                    var $list = this.lists[mList.get('id')];
                        $list.remove();

                    delete this.lists[mList.get('id')];
                }
            },

            render: function(cleanReset) {

                if (cleanReset) {
                    this.lists = {};
                    cLists.sort();
                    this.$el.html('');
                }

                cLists.each(function(mList) {
                    this.addList(mList);
                }.bind(this));
            }
        });

        // initialize views
        Head.current    = new Head.View();
        Search.current  = new Search.View();
        Sidebar.current = new Sidebar.View();
        Libary.current  = new Libary.vLists();

        // get delta data for revision numbers
        getDeltaData()

            // refresh revision numbers
            .then(function(deltaData) {

                var itemsChanges = _.filter(deltaData.changes, { path: '/items' });
                if (itemsChanges.length === 1) {
                    cItems.revision = itemsChanges[0].stat._json.revision;
                }

                var listsChanges = _.filter(deltaData.changes, { path: '/lists' });
                if (listsChanges.length === 1) {
                    cLists.revision = listsChanges[0].stat._json.revision;
                }
            })
            // load content
            .then(function() {

                // get content from cache or fetch it
                var loadClist  = cLists.cachedFetch({ silent: true });
                var loadCItems = cItems.cachedFetch({ silent: true });

                // first list fetch silent to know when to start
                // fetching items
                return Promise.all([loadClist, loadCItems])
                    .then(function() {

                        Search.current.render();
                        Libary.current.render();
                        Sidebar.current.render();
                    });
            })
            .catch(function(err) {
                throw new Error(err);
            });

})();
