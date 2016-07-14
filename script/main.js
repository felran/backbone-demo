/**
 * Created by luor on 2015/10/30.
 */
require.config({
    paths:{
    	/* 插件    */
        jquery:"libs/jquery-1.10.2.min",
        backbone:"libs/backbone-min",
        underscore:"libs/underscore",
        datatables:"libs/jquery.dataTables.min",
        /* 自定义 js 公有库    */
        utils:"widgets/utils",
        common:"widgets/common",
        showtable:"widgets/showtable",
        dialog:"widgets/dialog",
        drag:"widgets/draggable",
        /* 页面逻辑操作js类   */
        menus:"model/menus",
        nav:"view/nav",
        router:"router/route",
        /**各页面模块 controller */
        menu1sub1:"../app/menu1/sub1",
        menu1sub2:"../app/menu1/sub2",
        menu1sub3:"../app/menu1/sub3",
        menu2sub1:"../app/menu2/sub1",
        menu2sub2:"../app/menu2/sub2",
        menu2sub3:"../app/menu2/sub3",
        menu3sub1:"../app/menu3/sub1",
        menu3sub2:"../app/menu3/sub2",
        menu3sub3:"../app/menu3/sub3"
    },
    shim:{
        "backbone":{
            deps:["underscore"],
            exports:"Backbone"
        },
        "dialog":{
            deps:["jquery","drag"],
        },
        "datatables":{
        	deps:["jquery"]
        },
        "showtable":{
        	deps:["jquery","datatables"]
        }
    }
});

require(['backbone','router','utils','common','jquery','dialog'],function(Backbone,route,Utils,common,$){
	// _.templateSettings = {
	// 	interpolate:/\{\{(.+?)\}\}/g
	// };
    // $("#dialog").dialog();
    this.window.onresize = function(){
        var height = Utils.clientSize().h;
        if(height>=1040){
            $("#nav").css("height","115px");
        }else{
            $("#nav").css("height","105px");
        }
    };
    route.start();
    Backbone.history.start();
});