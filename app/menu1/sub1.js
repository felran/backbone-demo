/**
 * Created by luor on 2016/1/15.
 */
define(['jquery','backbone','common','utils','datatables','dialog'],function($,Backbone,common,Utils){
	var uniqueView=undefined;
	var model =  Backbone.Model.extend({
	});
	var collection = Backbone.Collection.extend({
		model:model,
		url:common.mockData._get_plan,
		parse:function(data){
			return data;
		}
	});
	var view = Backbone.View.extend({
		el:".mainview",
		model:new model(),
		//collection:new collection,
		events:{
			"click #addData":"createDialog",
			"click #refreshTable":"refreshPlan",
			"click .drop":"dropLine",
			"click #createBtn":"createPlan",
			"click #resetBtn":"resetPlan"
		},
		initialize:function(option){
			this.template = option.html;
			this.collection = option.collection;
			this.listenTo(this.collection,"add",this.addView);
			this.listenTo(this.collection,"remove",this.removeView);
			this.listenTo(this.collection,"reset",this.renderTable);
			this.render(this.collection);
		},
		render:function(values){
			var _this = this;
			Utils.template.call(this,this.template,function(data){
				$(_this.el).html(data({title:"表格示例页面"}));
				//添加showTable根据传入的Arrays结果渲染表格
				_this.renderTable(values);
			});
		},
		renderTable:function(values){
			var data = values!==undefined?values.toJSON():this.collection.toJSON();
			var height = $(this.el).height();
			this.datatable = $("#table").DataTable({
				"destroy":true,
				"stateSave":true,
				"searching":false,
				"scrollCollapse":false,
				"lengthChange":false,
				"ordering":false,
				"paging":false,
				"data": data,
				"columns": [
					{data:'id',title:'ID',width:'15%'},
					{data:'name',title:'name',width:'15%'},
					{data:'time',title:'time',width:'20%'},
					{data:'color',title:'color',width:'10%'},
					{data:'text',title:'text',width:'20'},
					{data:'groupId',title:'groupId',width:'10%'},
					{data:'operator',title:'操作',width:'10%'}
				],
				"columnDefs":[
					{
						"render":function(value,type,row){
							return "<div style='background-color:"+value+";width:100%;height:20px;'></div>";
						},
						"targets":[3]
					},
					{
						"render":function(value,type,row){
							return 	"<i title='移除' class='red drop glyphicon glyphicon-remove'></i>";
						},
						"targets":[6]
					}
				]
			});
		},
		//刷新表格
		refreshPlan:function(){
			this.collection.fetch({reset:true});
		},
		//新建记录-弹出窗口
		createDialog:function(){
			$("#dialog").removeClass("hide").dialog({
				title:"弹窗示例",
				draggable:true
			});
		},
		//点击确认--新增数据时，触发collection add事件
		createPlan:function(){
			var obj = Utils.serializeObj($("#dialog form"));
			obj.id = Math.floor(Math.random()*1000);
			obj.time = new Date().toISOString();
			this.collection.add(obj);
		},
		//重置
		resetPlan:function(){
			$("#dialog form input,#dialog form select").val("");
		},
		//删除列时--触发collection remove事件
		dropLine:function(e){
			var row = this.getRow(e);
			this.collection.remove(row);
			this.datatable.row( $(e.currentTarget).parents('tr') ).remove().draw();
		},
		//collection add事件回调函数，在表格中新增列
		addView:function(model){
			var obj = model.toJSON();
			this.datatable.row.add(obj).draw();
			$("#dialog").dialog("close");
		},
		//collection remove事件回调函数，在表格中删除列
		removeView:function(){
			alert("remove success");
		},
		getRow:function(e){
			var i = $(e.currentTarget);
			var rowIndex = i.parent().parent().index();
			var row = this.datatable.data()[rowIndex];
			return row;
		},
		show:function(){
			this.render(this.collection);
		}
	});

	return {
		render:function(args){
			/**
			 * 类似单例模式 ，防止view被多次实例化，导致event事件多次监听
			 */
			if(uniqueView===undefined){
				var col = new collection;
				/**
				 * collection 数据获取后再new view.改进之前view中提交请求的方式，防止多次执行
				 */
				col.fetch({
					cache:false,
					success:function(){
						uniqueView = new view({html:args,collection:col});
					}
				});
			}else{
				uniqueView.show();
			}

		}
	};
});