$(function(){
	
	$.ajax({
		type:"post",
		url:"http://localhost:8080/TrafficAccident/test/getTestRoadName",
		dataType:"json",
		success:funcSucc,
		error:funcError,
		beforeSend:function(){
			NProgress.start();
		},
		complete:function(){
			NProgress.done();
		}
	});
	
	
	
	
	
	
	/*$("#girdlist").jqGrid({
			url:"http://localhost:8080/TrafficAccident/getHello",
	        datatype:"json", //数据来源，本地数据
	        mtype:"POST",//提交方式
	        height:400,//高度，表格高度。可为数值、百分比或'auto'
	        //width:1000,//这个宽度不能为百分比
	        autowidth:true,//自动宽
	        shrinkToFit: true,
	        autoScroll: true,
	        pgbuttons: false,
	        pginput:false,
	        colNames:['添加日期', '手机号码', '银行卡号','备注','操作'],
	        colModel:[
	            //{name:'id',index:'id', width:'10%', align:'center' },
	            {name:'createDate',index:'createDate', width:'20%',align:'center'},
	            {name:'phoneNo',index:'phoneNo', width:'15%',align:'center'},
	            {name:'cardNo',index:'cardNo', width:'20%', align:"center"},
	            {name:'remark',index:'remark', width:'35%', align:"left", sortable:false},
	            {name:'del',index:'del', width:'10%',align:"center", sortable:false}
	        ],
	        colNames:['编码号', '编码名称'],
	        colModel:[
	  	            //{name:'id',index:'id', width:'10%', align:'center' },
	  	            {name:'BodyCode',index:'BodyCode', width:'20%',align:'center'},
	  	            {name:'BodyName',index:'BodyName', width:'15%',align:'center'},
	  	         
	  	        ],
	        rownumbers:true,//添加左侧行号，第一列为自增序号
	        //altRows:true,//设置为交替行表格,默认为false
	        //sortname:'createDate',//第一次加载排序字段
	        //sortorder:'asc',
	        viewrecords: true,//是否在浏览导航栏显示记录总数
	        sortorder : "desc",
	        caption : "JSON 实例",
	        rowNum:2,//每页显示记录数
	        rowList:[2,4,6],//用于改变显示行数的下拉列表框的元素数组。
	        jsonReader:{
	            id: "blackId",//设置返回参数中，表格ID的名字为blackId
	            repeatitems : false
	        },
	        pager:'#gridPager',
	        emptyrecords: "Nothing to display"
 
	});
	$("#girdlist").jqGrid('navGrid', '#gridPager', {edit : false,add : false,del : false},{},{},{},{multipleSearch:true});*/
});