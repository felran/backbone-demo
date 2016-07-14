/**
 * Created by luor on 2016/1/15.
 */
define(["backbone","common","utils"],function(Backbone,common,Utils){
    var uniqueView;
    var view = Backbone.View.extend({
        el:".mainview",
        initialize: function (option) {
            this.template = option.html;
            this.render();
        },
        render: function () {
            var _this = this;
            Utils.template.call(this, this.template, function (data) {
                $(_this.el).html(data({title: "menu1sub3"}));
            });
        },
        show:function(){
            this.render();
        }
    });
    return {
        render:function(args){

            if(uniqueView===undefined){
                //var col = new collection;
                //col.fetch({
                //    success:function(){
                        uniqueView = new view({html:args});
                    //}
                //})
            }else{
                uniqueView.show();
            }
        }
    }
});