/**
 * Created by luor on 2016/1/15.
 */
define(['backbone','utils','common'], function(Backbone,Utils,common){
	var uniqueView;
	var view = Backbone.View.extend({
		el:".mainview",
		initialize:function(option){
			this.template = option.html;
			this.render();
		},
		render:function(){
			var _this = this;
			Utils.template.call(this,this.template,function(data){
				$(_this.el).html(data({title: "menu2sub1"}));
			});
		},
		show:function(){
			this.render();
		}
	});
	return {
		render:function(args){
			if(uniqueView){
				uniqueView.show();
			}else{
				uniqueView = new view({html:args});
			}
		}
	}
});