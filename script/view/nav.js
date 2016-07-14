/**
 * Created by luor on 2015/10/30.
 */
define(["jquery","underscore","backbone","common"],function($,_,Backbone,common){
    var appView = Backbone.View.extend({
        el: "#main-nav",
        template: _.template($("#nav_temp").html()),
        initialize: function (model) {
            this.model = model;
        },
        //渲染一级菜单
        render: function (value, page) {
            $(this.el).html(this.template({menus: this.model.values()}));
            if (!value) {
                value = this.model.values()[0].name;
            }
            var liDom = $(this.el).find("li[name=" + value + "]");
            liDom.addClass("active").siblings().removeClass("active");
            this.renderSub(value, page);
        },
        //渲染二级菜单
        renderSub: function (node, page) {
            var menus = this.model.values();
            var model = [];
            for (var i in menus) {
                if (menus[i].name === node) {
                    page = page || menus[i].children[0].name;
                    model = menus[i].children;
                    break;
                };
            }
            $("#sidebar").html(_.template($("#sidebar_temp").html(), {key: node, menus: model}));
            $("#sidebar").find("li[name=" + page + "]").addClass("active").siblings().removeClass("active");
        }
    });
    return appView;
});