(function() {

    "use strict";

    var $             = require('jquery');
    var Backbone      = require('backbone');
        Backbone.View = require('backbone-template');

    var Widget = module.exports;

        Widget.Content = Backbone.View.extend({

            id    : "widgetContent",
            render: function(widget, params) {

                params = params || {};
                return new Promise(function(resolve) {
                    this.template({
                        path   : './templates/widgets/' + widget + '.widget.html',
                        params : params,
                        success: function() {
                            resolve();
                        }
                    });
                }.bind(this));
            }
        });

        Widget.View = Backbone.View.extend({

            id    : 'widget',
            events: {
                'click .close': function() {
                    this.remove();
                }
            },

            render: function(widget, params) {

                $('#widget').remove();

                this.vWidgetContent = new Widget.Content();
                this.$el.html("<div id='widgetOverlay'></div>");
                this.vWidgetContent.$el.appendTo(this.$el);
                this.$el.css('display', 'block');
                this.$el.appendTo('body');

                return this.vWidgetContent.render(widget, params);
            }
        });

})();
