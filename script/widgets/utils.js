/**
 * Created by luor on 2015/10/30.
 */
(function(){

	Date.prototype.format = function(format) {
		var o = {
			"M+" : this.getMonth() + 1,// Month
			"d+" : this.getDate(),// day
			"h+" : this.getHours(),// hour
			"m+" : this.getMinutes(),// minute
			"s+" : this.getSeconds(),// second
			"q+" : Math.floor((this.getMonth() + 3 / 3)),// quarter
			"S+" : this.getMilliseconds(),// milliseconds
		};
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
		}
		for ( var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	};
	var utils ={
		loading:function(open){
			if(open==="open"){
				var isExsist = $(".spinner").index();
				isExsist!==-1?$(".spinner").show():$("<div class='spinner'><img src='images/loading.gif' class='loading'/></div>").appendTo("body");
			}else if(open==="close"){
				$(".spinner").remove();
			}
		},
		template : function(url,callback){
			var _this = this;
			$.get(url,function(data){
				//_this.undelegateEvents();
				$(_this.el).html("");
				callback(_.template(data));
			});
		},
		clientSize:function(){
			var viewportW = (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth;
			var viewportH = (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight)?document.documentElement.clientHeight: document.body.offsetHeight;
			return {
				w:viewportW,
				h:viewportH
			}
		},
		/**
		 * ajax-get请求获取信息
		 * @param callback---回调函数
		 */
		getData:function(path,data,callback){
			var _this = this;
			var method = 'get';
			var url = path;
			var dataType = "json";
			if(typeof path==='object'){
				url = path.url;
				method = path.method;
				dataType = path.dataType;
			}
			if(typeof data==='function' && callback===undefined){
				callback = data;
				data = {};
			}
			$.ajax({
				url:url,
				type:method,
				data:data,
				dataType:dataType,
				cache:false,
				beforeSend:function(){
					_this.loading('open');
				},
				success:function(result){
					callback(result);
				},
				complete:function(xhr,isSuccess){
					_this.loading('close');
					if(xhr.status===403){
						var page = window.location.hash.replace("#","");
						window.location.href="login.html?"+page;
					}
				},
				error:function(xhr,status,error){
					if(xhr.status===200){
						$.alert("无数据");
					};
//					alert();
				}
			});
		},
		putData:function (url,data,callback){
			this.getData({url:url,method:'put'},data,callback);
		},
		postData:function (url,data,callback){
			this.getData({url:url,method:'post'},data,callback);
		},
		deleteData:function (url,data,callback){
			this.getData({url:url,method:'delete'},data,callback);
		},
		/******************************************
		 *
		 * Util 工具方法
		 * @param form
		 * @returns
		 * 根据form 序列化 成obj形式
		 * "a=1&b=2&c=&d=ss" -->   {a:"1",b:"2",c:"",d:"ss"}
		 *
		 ******************************************/
		serializeObj:function (form){
			//TODO the code for create JobTime
			var str = $(form).serialize();
			str = decodeURIComponent(str);
			var paramset = str.split("&");
			var obj = {};
			for(var i in paramset){
				var keyset = paramset[i].split("=");
				obj[keyset[0]] = keyset[1];
			}
			return obj;
		},
		/*******************************************
		 *
		 * Util 工具方法
		 *
		 * @param obj  {columns,value,update,cancel}
		 * @returns  form
		 * 根据 columns 生成form表单
		 *
		 *******************************************/
		renderForm:function (obj){
			var columns = obj.columns;
			var data = obj.value||{};
			var form = '<form class="popup-form">';
			var newline = obj.newline;
			if(data!=null && !$.isEmptyObject(data)){
				for(var i in columns){
					form +='<div><label>'+columns[i].title+':</label>';
					var editable = columns[i].editable===false?"disabled='disabled'":"";
					var value=data[columns[i].field];
					var input = '<input '+editable+ ' name='+columns[i].field+' value='+value+'>';
					if(columns[i].formatter){
						value =  columns[i].formatter(value,data);
						input = $.trim(value).indexOf("<")===0?value:'<input '+editable+ ' name='+columns[i].field+' value="'+value+'">';
					}
					form+=input+'</div>';
				}
			}else{
				form += "<div>暂无数据</div>";
			}
			var $form = $(form+"</form>");
			if(newline){
				$form.find("div").css({"display":"inline-block","width":"46%"});
				$form.find("div:odd").after("<br>");
			}
			return $form;
		},
		renderTable:function(obj){
			var columns = obj.columns;
			var data = obj.value||{};
			var form = '<table class="node-popup"><tbody>';
			for(var i in columns){
				value = data[columns[i].field]==null?"无":data[columns[i].field];
				if(columns[i].formatter){
					value =  columns[i].formatter(value);
				}
//		var editable = columns[i].editable===false?"disabled='disabled'":"";
				form +='<tr><td>'+columns[i].title+'：</td><td>'+value+'</tr>';
			}
			return $(form+"</tbody></table>");
		},
		/**
		 * JSON转XML
		 * @param json
		 * @returns {String}
		 */
		json2xml:function (json){
			var node="";
			for(var i in json){
				var key =i;
				var value = json[key];
				var tabs = arguments[1]===undefined?"":"&nbsp;&nbsp;&nbsp;&nbsp;";
				node += tabs+"&lt"+key+"&gt";
				if(typeof value==="object"&&value!=null){
					node +="<br/>";
					if(value.length===undefined){
						node+=this.json2xml(value,"tabs");
					}
					for(var i=0;i<value.length;i++){
						if(i!=0){
							node+="&lt/"+key+"&gt<br/>&lt"+key+"&gt<br/>";
						}
						node+=this.json2xml(value[i],"tabs");
					}
				}
				else{
					node+=value;
				}
				node+="&lt/"+key+"&gt<br/>";
			};
			return node;
		}
	};
	if ( typeof define === "function" && define.amd) {
		define( "utils", ['underscore'], function () { return utils; } );
	}
	return utils;
})();