/**
 * Created by luor on 2015/10/30.
 */
define(['backbone',"common"],function(Backbone,common){
    var menus = Backbone.Model.extend({
       url:common.mockData._get_menus,
       parse:function(data){
           return data;
       }
    });
    return menus;
});