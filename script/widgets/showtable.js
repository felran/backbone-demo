(function($){
	$.fn.showTable = function(option){

			var options = $.extend({
				"scrollCollapse":false,
				"scrollY":0,
				"lengthChange":false,
				"lengthMenu":[],
				"ordering":false,
				"pageLength":15,
				"serverSide":false,
				"orderColumns":[],
			},option);
			var defs = [];
			var hiddenTargets = [];
			for(var i in options.columns){
				if(options.columns[i].hidden){
					hiddenTargets.push(parseInt(i));
				}
				if(typeof options.columns[i].formatter ==="function"){
					defs.push({"render":options.columns[i].formatter,"targets":parseInt(i)});
				}
			}
			defs.push({"visible":false,targets:hiddenTargets});
			defs.push({"sortable":false,targets:options.orderColumns});
			defs.push({"searchable": false, "orderable": false, "targets": 0});
			var datatable = $(this).DataTable({
				"destroy":true,
				"pagingType" : "full_numbers",
				"searching" : false,
				"lengthChange" : options.lengthChange,
				"lengthMenu":options.lengthMenu||[],
				"scrollCollapse":options.scrollCollapse,
				"scrollY":options.scrollY,
				"autoWidth" : false,
				"ordering":options.ordering,
				"displayStart" : 0,
				"pageLength" : options.pageLength,
				"serverSide":options.serverSide,
				"processing" : true,
				"ajaxSource":options.url,
				"fnServerData":function(sSource,aoData,fnCallback,oSettings){
					aoData = options.conditions||{};
					aoData.rows = oSettings._iDisplayLength;
					aoData.page= aoData.start==0?1:(oSettings._iDisplayStart/aoData.rows) + 1;
					var draw = oSettings.iDraw;
					oSettings.jqXHR=$.ajax({
						"url" : options.url,
						"type" : "get",
						"dataType" : "json",
						"contentType" : 'application/json',
						"cache":false,
						"data" :aoData,
						"success":function(page){
							var data = {};
							data.draw=draw;
							data.recordsTotal = page.pageCount;
							data.recordsFiltered = page.pageCount;
							data.data = page.content;
							if(page instanceof Array){
								data.recordsTotal = page.length;
								data.recordsFiltered = page.length;
								data.data = page;
							}
							fnCallback(data);
						},
						"error" : function(xhr, textstatus, error) {
							// phy.alert({
							// 	content:error
							// });
						}
					});
				},
				"aoColumns" : options.columns,
				"language" : {
					"processing" : "正在加载中......",
					"zeroRecords" : "正在加载中......",
					"emptyTable" : "表中无数据存在",
					"lengthMenu":"每页显示 _MENU_ 条数据",
					"info" : "第 _PAGE_ 页 / 共 _PAGES_ 页  共 _TOTAL_ 条 ",
					"infoEmpty" : "没有记录",
					"paginate" : {
						"first" : "首页",
						"previous" : "上一页",
						"next" : "下一页",
						"last" : "末页"
					}
				},
//			// 添加序号
				"columnDefs" :defs,
				"order" : options.order,
//				"initComplete":function(){
//				/*$("#saTable_length").css("float","right");
//				$("#saTable_length label").css("font-size","80%");*/
//				},
//				"footerCallback":function(row,data,start,end,display){
//		        	if(datatable!=null){
//						datatable.column(0, {
//							search : 'applied',
//							order : 'applied'
//						}).nodes().each(function(cell, i) {
//							cell.innerHTML = i +start + 1;
//						});
//		        	}
//				}
			});
		if(!options.serverSide) {
			datatable.on('order.dt search.dt', function () {
				datatable.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
					cell.innerHTML = i + 1;
				});
			}).draw();
		}
		return datatable;
	};
})(jQuery);