define(['backbone','jquery','nav',"menus","common","utils"],function(Backbone,$,Nav,Menu,common,Utils){
    var router = Backbone.Router.extend({
        routes:{
            "app/:nodes":"openPage",
            "app/:nodes/:pages" : "openPage"
        },
        //路由---模板页面,及相应控制器 配置
        config:{
            /**---------------------
             ** 系统监视路由配置
             **--------------------*/
            "menu1":{
                "template":"app/menu1/sub1.html",
                "controller":"menu1sub1"
            },
            "menu1/sub1":{
                "template":"app/menu1/sub1.html",
                "controller":"menu1sub1"
            },
            "menu1/sub2":{
                "template":"app/menu1/sub2.html",
                "controller":"menu1sub2"
            },
            "menu1/sub3":{
                "template":"app/menu1/sub3.html",
                "controller":"menu1sub3"
            },
            "menu2":{
                "template":"app/menu2/sub1.html",
                "controller":"menu2sub1"
            },
            "menu2/sub1":{
                "template":"app/menu2/sub1.html",
                "controller":"menu2sub1"
            },
            "menu2/sub2":{
                "template":"app/menu2/sub2.html",
                "controller":"menu2sub2"
            },
            "menu2/sub3":{
                "template":"app/menu2/sub3.html",
                "controller":"menu2sub3"
            },
            "menu3":{
                "template":"app/menu3/sub1.html",
                "controller":"menu3sub1"
            },
            "menu3/sub1":{
                "template":"app/menu3/sub1.html",
                "controller":"menu3sub1"
            },
            "menu3/sub2":{
                "template":"app/menu3/sub2.html",
                "controller":"menu3sub2"
            },
            "menu3/sub3":{
                "template":"app/menu2/sub3.html",
                "controller":"menu3sub3"
            },
            /**---------------------
             ** hash无法匹配情况下 的路由配置
             **--------------------*/
            "otherwise":{
                "template":"app/menu1/sub1.html",
                "controller":"menu1sub1"
            }
        },
        menus:new Menu(),
        initialize:function(){
            var _this = this;
            _this.menus.fetch({
                success: function () {
                    _this.nav = new Nav(_this.menus);
                    var node = window.location.hash.replace("#app/","");
                    _this.openPage(node.split("/")[0],node.split("/")[1]);
                }
            });
        },
        //路由触发---切换页面
        openPage:function(node,page){
            if(this.nav) {
                //渲染菜单
                this.nav.render(node,page);
                //根据路由渲染界面
                var hash = page==undefined?node:node+"/"+page;
                var result = this.config[hash]||this.config.otherwise;
                var controller = result.controller;
                var template = result.template;
                require([controller], function (ctrl) {
                	ctrl.render(template);
                });

            }
        }
    });
    return {
        start:function() {
            new router();
        }
    };

});