;(function() {

    var Template = {};
        Template._promises  = {};
        Template._templates = {};


    function getTemplate(path) {
        var promise = Template._promises[path] || $.get(path);
        Template._promises[path] = promise;
        return promise;
    }


    //preload templates
    Backbone.View.preLoadTemplates = function(templates) {

        if (templates !== void 0) {
            _(templates).each(function(template) {

                if (Template._templates[template] === void 0) {
                    getTemplate(template);
                }
            });
        }
    };

    //make template function available in views
    Backbone.View.prototype.template = function(params) {

        params          = params            || {};
        params.params   = params.params     || {};
        params.success  = params.success    || function() {};

        if (params.path === void 0) {
            throw Error('no path given');
        }

        var that = this;
        function displayTpl() {
            that.$el.html(Template._templates[params.path](params.params));
            params.success();
        }

        //use precompiled if available
        if (Template._templates[params.path] !== void 0) {
            displayTpl();

            //if promise exist remove
            if (Template._promises[params.path] !== void 0) {
                delete Template._promises[params.path];
            }
            return true;
        }

        //load template
        getTemplate(params.path)
            .done(function(tpl) {
                Template._templates[params.path] = _.template(tpl);
                displayTpl();
            })
            .fail(function() {
                throw Error('fail to get template');
            });
    };

})();