/**
 * Created by luor on 2016/1/16.
 */
(function($,drag){
    var common = {
        open:function(dom,option){
            var _this = this;
            var content = $(dom).find(".modal-body").index()===-1?option.content:$(dom).find(".modal-body").html();
            var template ='<div class="modal-dialog">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                    '<h4 class="modal-title">' + option.title + '</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                    content +
                '</div>'+
                '</div><!-- /.modal-content -->' +
                '</div><!-- /.modal-dialog -->';

            var skin = option.skin || "";
            var width = parseInt(option.width || 500);

            $(dom).addClass("myDialog " + skin).html(template).find(".modal-dialog").css({width: width + "px"});
            if(option.footer){
                var button = '';
                var obj = {};
                for(var i in option.footer){
                    var name = option.footer[i].name;
                    var className = option.footer[i].className?option.footer[i].className:"";
                    var closeBtn = option.footer[i].closeBtn?'data-dismiss="modal"':'';
                    var callback = option.footer[i].callback?option.footer[i].callback:'';
                    button +='<button type="button" name="btn'+i+'" class="btn '+className+'" '+closeBtn+'>'+name+'</button>';
                    obj["btn"+i] = callback;
                }
                var footer = $('<div class="modal-footer"></div>');
                footer.append(button);
                $(dom).find(".modal-content").append(footer);
                $(dom).find(".modal-footer button").on("click",function(e){
                    var callback = obj[$(this).attr("name")];
                    if(callback){
                        callback.call(this);
                    };
                });

            }
            if(typeof option.closeFunc === 'function'){
                $(dom).find(".nodal-header .close").on("click", function () {
                    option.closeFunc();
                });
            }
            if (option.draggable) {
                new drag($(dom).find(".modal-header,.modal-footer")[0], $(dom)[0], {
                    opacity: 100, keepOrigin: false
                });
            }
            //$(dom).css({
            //    width:this.AtCenter().w,
            //    height:this.AtCenter().h,
            //});
            if(option.backdrop){
                $("body").append('<div class="modal-backdrop"></div>');
            }
            $(".modal-backdrop").css({
                width:this.AtCenter().w,
                height:this.AtCenter().h,
            });
            $(dom).css({
                left: (this.AtCenter().w- width) / 2,
                top: option.top||0
            });
            if(option.createFrom){
                $(dom).appendTo("body");
            }
            $(dom).removeClass("hide").css("display","none").fadeIn(100);

            $(dom).find("button[data-dismiss='modal']").on("click", function () {
                var clean = option.createFrom?true:false;
                _this.drop(dom,clean);
            });
            return $(dom);
        },
        drop:function(dom,clean) {
            $(dom).fadeOut(100);
            $(".modal-backdrop").remove();
            if(clean){
                $(dom).remove();
            }
        },
        AtCenter:function() {
            var viewportW = (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth;
            var viewportH = (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight;
            return {
                w:viewportW,
                h:viewportH
            }
        }
    }
    $.fn.extend({
        dialog:function(option){
            var _this = this;
            var settings = {
                title:$(_this).attr("data-title"),
                content:$(_this).html(),
                backdrop:true,
                top:100,
                draggable:true
                //skin:"myDialog",
            }
            if(typeof option==="object" ||option==="open" ||!option) {
                common.open(_this,$.extend(settings, option));
            }else if(option==="close"){
                common.drop(_this);
            }
        }
    });
    $.extend({
        dialog:function(options){
            var dialog = $("<div></div>").html(options.content);
            var settings = {
                title:"&nbsp;&nbsp;",
                //draggable:true,
                content:dialog.html(),
                width:options.width,
                top:options.top
            }
            if(typeof options==="object" ||options==="open" ||!options) {
                var dom = common.open(dialog,settings);
            }
            return dom;
        },
        alert:function(content,callback){
            var alert = $("<div></div>");
            var title = "<i class='glyphicon glyphicon-question-sign'></i>&nbsp;&nbsp;提示";
            var settings = {
                title:title,
                closeFunc:callback,
                content:content,
                createFrom:"js",
                top:common.AtCenter().h/2-200,
                footer:[{
                    name:"确定",
                    closeBtn:true,
                    className:"btn-primary",
                    callback:function(){
                        callback?callback():null;
                    }
                }]
            }
            common.open(alert,settings);
        },
        confirm:function(title,content,callback){
            var alert = $("<div></div>");
            var title = title||"提示";
            title="<i class='glyphicon glyphicon-question-sign'></i>&nbsp;&nbsp;"+title
            var settings = {
                title:title,
                content:content,
                //draggable:true,
                top:common.AtCenter().h/2-200,
                footer:[{
                    name:"确定",
                    closeBtn:true,
                    className:"btn-primary",
                    callback:function(){
                        callback(true);
                    }
                },{
                    name:"取消",
                    closeBtn:true,
                    className:"btn-warning",
                    callback:function(){
                        callback(false);
                    }
                }],
                createFrom:"js"
            }
            common.open(alert,settings);
        }
    })
})(jQuery,drag);