/**
 * Created by asus on 2016/7/18.
 */
var numRoad,
	roadName,
	startMonth,
	endMonth,
	startYear,
	endYear,
	startofMonth,
	endofMonth,
	durationMonth;
var tempUrl="http://localhost:8080/TrafficAccident/accquery/";
$(function(){

	//初始化查询
	tableInit.init();
	//2、注册增删改事件
    operate.operateInit();
	//initTable();
  //初始化道路名称
	getSys_road_name();

	
	//查询按钮执行
	$("#query").bind("click",initTable);
	
    /*//删除按钮
    $('#btn_delete').on('click',function(){
    	 var ids = $.map($("#tb_accident").bootstrapTable('getSelections'), function (row) {
             return row.AccCode;
         });
    	$("#tb_accident").bootstrapTable('remove', {field: 'AccCode', values: ids});	
    });*/
    //新增按钮
    //初始化Highchart
   /* initHidtogram(null,null,null);*/
    $('.controlChart a').each(function(){
        $(this).click(function(){
            if($(this).text()=="柱状图"){
                $(this).parent().addClass("active").siblings().removeClass("active");
                initHidtogram(null,null,null);
                hidtogramQuery();
            }else if($(this).text()=="饼图"){
                $(this).parent().addClass("active").siblings().removeClass("active");
                pieChartQuery();
            }else {
                $(this).parent().addClass("active").siblings().removeClass("active");
                diagramQuery();
            }
        });
    });
    //最近三十天按钮
    //$("#yue").click(queryYue);
    //统计图查询按钮
    $("#highchartsQuery").click(function(){
    	$('.controlChart a:first').parent().addClass("active").siblings().removeClass("active");
    	hidtogramQuery();
    });
    
    
    
});
//快捷分析
/*$(".kuaiAnalysis").find('button').each(function(){
	$(this).click(function(){
		if($(this).attr('id')=='yue'){
			
		}
	});
	
});*/
//柱状图查询函数
function hidtogramQuery(){
	var url=tempUrl+'monthHidtogram';
	//commonRoadMonth();
	/*if(durationMonth<0){
		alert("查询起始月份不能比查询终止月份大");
	}else if(durationMonth>11){
		alert("查询月份时间段不能超过12个月");
	}else{
		var param='roadName='+roadName+"&startMonth="+startMonth+"&endMonth="+endMonth;
		_ajaxPost(url,param,success_hidtogramQuery,error);
	}*/
	roadName=$("#numRoadChart").find("option:selected").text();
	startMonth=$("#startMonth").val();
	endMonth=$("#endMonth").val();
	var param='roadName='+roadName+"&startMonth="+startMonth+"&endMonth="+endMonth;
	_ajaxPost(url,param,success_hidtogramQuery,error);
	
	/*这个东西好像不怎么好用，少用吧
	 * var m=moment(startMonth);
	var startYear=m.year();
	var startMonth=m.month()+1;
	var aMonth=m.startOf("month");
	var lMonth=m.endOf("month");*/
	/*if(parseInt(endMonth.substring(5,7))-parseInt(startMonth.substring(5,7)))*/

}

//柱状图查询成功函数
function success_hidtogramQuery(data){
	if(data==null||data==""){
		alert("未查询到该时段数据");
	}else{
		hidtogram(data);
	}
}

//饼图查询函数
function pieChartQuery(){
	var url=tempUrl+'monthPie';
	//commonRoadMonth();
	/*if(durationMonth<0){
		alert("查询起始月份不能比查询终止月份大");
	}else if(durationMonth>11){
		alert("查询月份时间段不能超过12个月");
	}else{
		var param='roadName='+roadName+"&startMonth="+startMonth+"&endMonth="+endMonth;
		_ajaxPost(url,param,success_pieChartQuery,error);
	}*/
	roadName=$("#numRoadChart").find("option:selected").text();
	startMonth=$("#startMonth").val();
	endMonth=$("#endMonth").val();
	var param='roadName='+roadName+"&startMonth="+startMonth+"&endMonth="+endMonth;
	_ajaxPost(url,param,success_pieChartQuery,error);
	
}
//饼图查询成功执行函数
function success_pieChartQuery(data){
	if(data==null||data==""){
		alert("未查询到该时段数据");
	}else{
		pieChart(data);
	}
}
function pieChart(data){
	/*var roadArray=new Array();//存放所有的路的名字，以及每条路存在多少条记录
	for(var i=0;i<data.length;i++)
	{
		var item=data[i];
		var roadName=item.RoadName;
		roadArray.push(roadName);
	
	}*/
	/*var road={};//存放所有的路的名字，以及每条路存在多少条记录
	for(var i=0;i<data.length;i++)
	{
		var item=data[i];
		var roadName=item.RoadName;
		var roadNum=item.Num;
		road[roadName]=roadNum;
		if(road[roadName]==null)
		{
			road[roadName]=1;
		}
		else
		{
			road[roadName]=road[roadName]+1;
		}
	}*/
	var _title=$("#numRoadChart").find("option:selected").text()+' '+$("#startMonth").val()+' 至 '+$("#endMonth").val()+' 交通事故数统计表';
	$('#chart').highcharts({
	      chart: {
	          plotBackgroundColor: null,
	          plotBorderWidth: null,
	          plotShadow: false
	      },
	      title: {
	          text: _title
	      },
	      tooltip: {
	          pointFormat: '{series.name}: <b>{point.y} 起</b>'
	      },
	      plotOptions: {
	          pie: {
	              allowPointSelect: true,
	              cursor: 'pointer',
	              dataLabels: {
	                  enabled: true,
	                  color: '#000000',
	                  connectorColor: '#000000',
	                  format: '<b>{point.name}</b>: {point.y} 起'
	              }
	          }
	      },
	      series: [{
	          type: 'pie',
	          name: '交通事故数',
	          data: data
	        	  /*[
	              {name:'Firefox', y:45.0},
	              ['IE',       26.8],
	              {
	                  name: 'Chrome',
	                  y: 12.8,
	                  sliced: true,
	                  selected: true
	              },
	              ['Safari',    8.5],
	              ['Opera',     6.2],
	              ['Others',   0.7]
	          ]*/
	      }]
	  });
	
}
//折线图查询函数
function diagramQuery(){
	var url=tempUrl+'monthDiagram';
	/*commonRoadMonth();
	if(durationMonth<0){
		alert("查询起始月份不能比查询终止月份大");
	}else if(durationMonth>11){
		alert("查询月份时间段不能超过12个月");
	}else{
		var param='roadName='+roadName+"&startMonth="+startMonth+"&endMonth="+endMonth;
		_ajaxPost(url,param,success_diagramQuery,error);
	}*/
	
	roadName=$("#numRoadChart").find("option:selected").text();
	startMonth=$("#startMonth").val();
	endMonth=$("#endMonth").val();
	var param='roadName='+roadName+"&startMonth="+startMonth+"&endMonth="+endMonth;
	_ajaxPost(url,param,success_diagramQuery,error);
	
}
//折线图查询成功执行函数
function success_diagramQuery(data){
	if(data==null||data==""){
		alert("未查询到该时段数据");
	}else{
		diagram(data);
	}
}
//曲线图
function diagram(data){
	
	var road={};//存放所有的路的名字，以及每条路存在多少条记录
	for(var i=0;i<data.length;i++)
	{
		var item=data[i];
		var roadName=item.RoadName;
		if(road[roadName]==null)
		{
			road[roadName]=1;
		}
		else
		{
			road[roadName]=road[roadName]+1;
		}
	}
	
	var dateArray=new Array();//用来存放记录中所有的日期
	for(var i=0;i<data.length;i++)
	{
		var item=data[i];
		var happenTime=item.HappenTime;
		if($.inArray(happenTime,dateArray)==-1)//等于-1，表示数组中不存在该元素
		{
			dateArray.push(happenTime);
		}
	}
	dateArray.sort();//对数组里面的日期进行排序
	
	var records=new Array();//这个是结果数组，最终显示在图表上
	var record=null;//结果数组中的一条记录
	
	for(var i in road)//i就是路的名字
	{
		record=new Object();
		record.name=i;//给每条路添加一个属性name,并给属性赋值为i，即路的名字
		records.push(record);
	}
	
	for(var i=0;i<records.length;i++)
	{
		var obj=records[i];
		var roadName=obj.name;
		var numArr=new Array();
		for(var j=0;j<dateArray.length;j++)
		{
			numArr.push(findRecordNum(roadName,dateArray[j],data));
		}
		obj.data=numArr;
	}
	
	var _xAxis={categories: dateArray};
	var _yAxis=records;
	var _title=$("#numRoadChart").find("option:selected").text()+' '+$("#startMonth").val()+' 至 '+$("#endMonth").val()+' 交通事故数统计表';
	
	initDiagram(_xAxis,_yAxis,_title);
	
}

//获取道路名称数据
function getSys_road_name(){
	var url=tempUrl+"getSys_road_section";
	_ajaxPost(url,null,success_road_name,error);
}
/*//获取选择道路数据
function getChoice_road_name(){
	var url=tempUrl+"getChoice_road_section";
	_ajaxPost(url,null,successChoice_road_name,error);
}*/
//道路名称数据获取成功执行函数
function success_road_name(data){
	$("#numRoad").html("");
	$("#numRoadChart").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].SectionCode+'">'+data[i].SectionName+'</option>';
	}
	$("#numRoad").html(content);
	$("#numRoadChart").html(content+='<option value="all">'+"全部道路"+'</option>');

	
	//初始化加载柱状图
	hidtogramQuery();
	
}
//快捷分析---最近一周

//统计图查询最近三十天
function yueAnalysis(){
	roadName=$("#numRoadChart option:selected").text();
	var url=tempUrl+"queryAnalysis";
	var nowDate=getTime("YYYY-MM-DD");
	var monthAgo=getTime("YYYY-MM-DD",24*30);
	var param='roadName='+roadName+"&nowDate="+nowDate+"&monthAgo="+monthAgo;
	/*var param='param='+"RoadName='"+roadName+"' and HappenTime>='"+monthAgo+"' and HappenTime<='"+nowDate+"'";*/
	_ajaxPost(url,param,success_queryYue,error);
}
//最近三十天查询成功后操作
function success_queryYue(data){
	console.log(data);
	yueHidtogram(data);
}
function yueHidtogram(data){
	
}
//快捷分析----近一年
function yearAnalysis(){
	roadName=$("#numRoadChart option:selected").text();
	var url=tempUrl+"queryAnalysis";
	var nowDate=getTime("YYYY-MM-DD");
	var monthAgo=getTime("YYYY-MM-DD",24*365);
	var param='roadName='+roadName+"&endMonth="+nowDate+"&startMonth="+monthAgo;
	/*var param='param='+"RoadName='"+roadName+"' and HappenTime>='"+monthAgo+"' and HappenTime<='"+nowDate+"'";*/
	_ajaxPost(url,param,success_yearAnalysis,error);
}
function success_yearAnalysis(data){
	if(data==null||data==""){
		alert("未查询到该时段数据");
	}else{
		hidtogram(data);
		/*pieChart(data);
		diagram(data);*/
	}
}


//初始化表格
var tableInit={
		init:function(){
			getSys_road_name();
			//先销毁表格  
		    $('#tb_accident').bootstrapTable('destroy');
		    numRoad= $("#numRoad").find("option:selected").text();
		  //绑定table的viewmodel
	        this.myViewModel = new ko.bootstrapTableViewModel({
	        	 url:"http://localhost:8080/TrafficAccident/accquery/query",           //请求后台的url
	             method: 'post',                      //请求方式（*）
	             contentType: "application/x-www-form-urlencoded",//操你大爷，必须加他，如果想用request.form 方式,这个是发送到服务器的编码类型
	             toolbar: '#toolbar',                //工具按钮用哪个容器
	             striped: true,                      //是否显示行间隔色
	             cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	             pagination: true,                   //是否显示分页（*）
	             paginationLoop:false,				//设置为 true 启用分页条无限循环的功能。
	             sortable: false,                     //是否启用排序
	             sortOrder: "asc",   				//排序方式
	             pageNumber:1,                       //如果设置了分页，首页页码
	             pageSize: 10,                       //每页的记录行数（*）
	             //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  
	             //设置为limit可以获取limit, offset, search, sort, order  
	             queryParamsType:'undefined',
	             queryParams: function (params){
	         	 var temp = {   //这里的键的名字和控制器的变量名必须一致，这边改动，控制器也需要改成一样的
	     	    		pageNumber: params.pageNumber,  //这里可以修改bootstrap-table.js源码文件（*） 
	     	            pageSize: params.pageSize,  	
	     	            numRoad:numRoad,
	     	           keywords:$("#keywords").val()
	         	        };
	         	  return temp;
	             },
	             sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
	             pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
	             search: false,                         //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
	             //strictSearch: false,					//设置为 true启用 全匹配搜索，否则为模糊搜索
	             showColumns: true,                  //是否显示所有的列
	             showRefresh: true,                  //是否显示刷新按钮,默认就是true
	             /*showPaginationSwitch:true,	*/		//是否显示 数据条数选择框
	             showExport:true,					//是否显示导出
	             exportDataType:'basic',				// basic(当前页), all(所有), selected(选中的)
	             showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
	             cardView: false,                    //是否显示详细视图
	             detailView: false,                   //是否显示父子表,将它设置为true，在每行的前面即可看到一个“+”形状的图标
	             clickToSelect: true,                //是否启用点击选中行
	             minimumCountColumns: 2,             //最少允许的列数
	             height: 540,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
	             uniqueId: "AccCode",                //每一行的唯一标识，一般为主键列
	        });
	        ko.applyBindings(this.myViewModel, document.getElementById("tb_accident"));
		}
};
//操作
var operate={
		operateInit:function(){
			this.operateAdd();
	        this.operateUpdate();
	        this.operateDelete();
	        this.accModel = {
	        	
	        		IndexCode: ko.observable(),
	        		AccCode: ko.observable(),
	        		HappenTime: ko.observable(),
	        		AccLon: ko.observable(),
	        		AccLat: ko.observable(),
	        		PersonHarm: ko.observable(),
	        		PersonDeath: ko.observable(),
	        		AccPlaces: ko.observable()
	            };  
		},
		//新增
	    operateAdd: function(){
	        $('#btn_add').on("click", function () {
	            $("#myModal").modal().on("shown.bs.modal", function () {
	                var oEmptyModel = {
	                	IndexCode: ko.observable(),
                		AccCode: ko.observable(),
    	        		HappenTime: ko.observable(),
    	        		AccLon: ko.observable(),
    	        		AccLat: ko.observable(),
    	        		PersonHarm: ko.observable(),
    	        		PersonDeath: ko.observable(),
    	        		AccPlaces: ko.observable()
	                };
	                ko.utils.extend(operate.accModel, oEmptyModel);
	                ko.applyBindings(operate.accModel, document.getElementById("myModal"));
	                operate.operateSave();
	            }).on('hidden.bs.modal', function () {
	                ko.cleanNode(document.getElementById("myModal"));
	            });
	        });
	    },
	  //修改
	    operateUpdate: function () {
	        $('#btn_edit').on("click", function () {
	        	var arrselectedData = tableInit.myViewModel.getSelections();
	        	if (!operate.operateCheck(arrselectedData)) { return; }
	            $("#myModal").modal().on("shown.bs.modal", function () {
	                //将选中该行数据有数据Model通过Mapping组件转换为viewmodel
	                ko.utils.extend(operate.accModel, ko.mapping.fromJS(arrselectedData[0]));
	                ko.applyBindings(operate.accModel, document.getElementById("myModal"));
	                operate.operateSave();
	            }).on('hidden.bs.modal', function () {
	                //关闭弹出框的时候清除绑定(这个清空包括清空绑定和清空注册事件)
	                ko.cleanNode(document.getElementById("myModal"));
	            });
	        });
	    },
	    //删除
	    operateDelete: function () {
	        $('#btn_delete').on("click", function () {
	            var arrselectedData = tableInit.myViewModel.getSelections();
	            if(arrselectedData.length<=0){
	        		alert("请至少选择一行数据");
	            }else{
	            	var url= tempUrl+"accDelete";
	            	var param='param='+JSON.stringify(arrselectedData);
	            	_ajaxPost(url,param,successDelete,error);
	            }
	           
	        });
	    },
	  //保存数据
	    operateSave: function () {
	        $('#btn_submit').on("click", function () {
	            //取到当前的viewmodel
	            var oViewModel = operate.accModel;
	            //将Viewmodel转换为数据model
	            var oDataModel = ko.toJS(oViewModel);
	            var param='param='+JSON.stringify(oDataModel);
	            var funcName = oDataModel.IndexCode?"accUpdate":"accAdd";//有AccCode就是更新操作，没有就是添加操作
	            var url= tempUrl+funcName;
	            //var param={dataModel:oDataModel};
	            
	           _ajaxPost(url,param,successSave,error);
	          /*  $.ajax({
	                url: tempUrl+"funcName",
	                type: "post",
	                data: oDataModel,
	                success: function (data, status) {
	                    alert(status);
	                    tableInit.myViewModel.refresh();
	                }
	            });*/
	        });
	    },
	  //数据校验
	    operateCheck:function(arr){
	        if (arr.length <= 0) {
	            alert("请至少选择一行数据");
	            return false;
	        }
	        if (arr.length > 1) {
	            alert("只能编辑一行数据");
	            return false;
	        }
	        return true;
	    }
};
function successSave(data){
	alert(data.success);
	tableInit.myViewModel.refresh();

}
function successDelete(data)
{
	alert(data.success);
	tableInit.myViewModel.refresh();
	
}

function initTable(){
	//先销毁表格  
    $('#tb_accident').bootstrapTable('destroy');
  //初始化表格,动态从服务器加载数据 
    $("#tb_accident").bootstrapTable({
    	
        url:"http://localhost:8080/TrafficAccident/accquery/query",           //请求后台的url
        method: 'post',                      //请求方式（*）
        contentType: "application/x-www-form-urlencoded",//操你大爷，必须加他，如果想用request.form 方式,这个是发送到服务器的编码类型
        toolbar: '#toolbar',                //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        paginationLoop:false,				//设置为 true 启用分页条无限循环的功能。
        sortable: false,                     //是否启用排序
        sortOrder: "asc",   				//排序方式
        pageNumber:1,                       //如果设置了分页，首页页码
        pageSize: 10,                       //每页的记录行数（*）
        //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  
        //设置为limit可以获取limit, offset, search, sort, order  
        queryParamsType:'undefined',
        queryParams: function (params){
    	 var temp = {   //这里的键的名字和控制器的变量名必须一致，这边改动，控制器也需要改成一样的
	    		pageNumber: params.pageNumber,  //这里可以修改bootstrap-table.js源码文件（*） 
	            pageSize: params.pageSize,  	
	            numRoad: $("#numRoad").find("option:selected").text(),
	            keywords:$("#keywords").val()
	            
    	        };
    	  return temp;
        },
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        //strictSearch: true,					//设置为 true启用 全匹配搜索，否则为模糊搜索
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        /*showPaginationSwitch:true,	*/		//是否显示 数据条数选择框
        showExport:true,					//是否显示导出
        exportDataType:'all',				// basic(当前页), all(所有), selected(选中的)
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表,将它设置为true，在每行的前面即可看到一个“+”形状的图标
        clickToSelect: true,                //是否启用点击选中行
        minimumCountColumns: 2,             //最少允许的列数
        height: 540,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "AccCode",                //每一行的唯一标识，一般为主键列
       
        columns: [{
            checkbox: true
        }, {
            field: 'AccCode',
            title: '事故编号',
            align:'center'
        }, {
            field: 'HappenTime',
            title: '事故发生时间',
            align:'center'
        },{
            field: 'AccLon',
            title: '事故经度',
            align:'center'
        },{
            field: 'AccLat',
            title: '事故纬度',
            align:'center'
        },{
            field: 'PersonHarm',
            title: '受伤人数',
            align:'center'
        },{
            field: 'PersonDeath',
            title: '死亡人数',
            align:'center'
        },{
            field: 'AccPlaces',
            title: '事故地点',
            align:'center'
        }],
        onLoadSuccess:function(){
        	$("#keywords").val('');
        },
        onLoadError:function(){
        	alert("数据加载失败");
        }
       /* onClickRow:function(row){
        	alert(row);
        },*/
       /* onCheck:function(row){
        	alert(row);
        }*/
    });
   
};


//柱状图执行函数
function hidtogram(data){
	/*var map={};*/
	var road={};//存放所有的路的名字，以及每条路存在多少条记录
	
	for(var i=0;i<data.length;i++)
	{
		
		var item=data[i];
		var roadName=item.RoadName;
		if(roadName==undefined){
			roadName='全部道路';
		}
			if(road[roadName]==null)
			{
				road[roadName]=1;
			}
			else
			{
				road[roadName]=road[roadName]+1;
			}
		
		
		
	}
	
	var dateArray=new Array();//用来存放记录中所有的日期
	for(var i=0;i<data.length;i++)
	{
		var item=data[i];
		var happenTime=item.HappenTime;
		if($.inArray(happenTime,dateArray)==-1)//等于-1，表示数组中不存在该元素
		{
			dateArray.push(happenTime);
		}
	}
	//dateArray.sort();//对数组里面的日期进行排序
	
	var records=new Array();//这个是结果数组，最终显示在图表上
	var record=null;//数组中的一条记录
	
	for(var i in road)//i就是路的名字
	{
		record=new Object();
		record.name=i;//给每条路添加一个属性name,并给属性赋值为i，即路的名字
		records.push(record);
	}
	
	for(var i=0;i<records.length;i++)
	{
		var obj=records[i];
		var roadName=obj.name;
		var numArr=new Array();
		for(var j=0;j<dateArray.length;j++)
		{
			numArr.push(findRecordNum(roadName,dateArray[j],data));
		}
		obj.data=numArr;
	}
	//月份数字转中文
	var dataChinese=new Array();
	var chineseItem=null;
	for(var i=0;i<dateArray.length;i++)
	{
		var item=dateArray[i];
		chineseItem=monthToChinese(item);
		dataChinese.push(chineseItem);
	
	}
	
	
	var _xAxis={categories: dataChinese};
	
	var _yAxis=records;
	var _title=$("#numRoadChart").find("option:selected").text()+' '+$("#startMonth").val()+' 至 '+$("#endMonth").val()+' 交通事故数统计图';
	
	initHidtogram(_xAxis,_yAxis,_title);

}

//月份数字转中文
function monthToChinese(str){
	switch (str) {
		case '01':
			return '一月';
		case '02':
			return '二月';
		
		case '03':
			return '三月';
			break;
		case '04':
			return '四月';
			break;
		case '05':
			return '五月';
			break;
		case '06':
			return '六月';
	
		case '07':
			return '七月';
			break;
		case '08':
			return '八月';
			break;
		case '09':
			return '九月';
			break;
		case '10':
			return '十月';
			break;
		case '11':
			return '十一月';
			break;
		case '12':
			return '十二月';
			break;
	default:
		break;
	}

}

//饼图
/*function pieChart(){
  $('#chart').highcharts({
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
      },
      title: {
          text: 'Browser market shares at a specific website, 2010'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  color: '#000000',
                  connectorColor: '#000000',
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
          }
      },
      series: [{
          type: 'pie',
          name: 'Browser share',
          data: [
              {name:'Firefox', y:45.0},
              ['IE',       26.8],
              {
                  name: 'Chrome',
                  y: 12.8,
                  sliced: true,
                  selected: true
              },
              ['Safari',    8.5],
              ['Opera',     6.2],
              ['Others',   0.7]
          ]
      }]
  });
}*/

/*//折线图
function diagramChart() {
  $('#chart').highcharts({
      title: {
          text: 'Monthly Average Temperature',
          x: -20 //center
      },
      subtitle: {
          text: 'Source: WorldClimate.com',
          x: -20
      },
      xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: {
          title: {
              text: 'Temperature (°C)'
          },
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }]
      },
      tooltip: {
          valueSuffix: '°C'
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
      },
      series: [{
          name: 'Tokyo',
          data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
      }, {
          name: 'New York',
          data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
      }, {
          name: 'Berlin',
          data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
      }, {
          name: 'London',
          data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
      }]
  });
}*/

//柱状图处理函数
function initHidtogram(_xAxis,_series,_title){
	var m_xAxis=null;
	var m_series=null;
	var m_title="";
	if(_xAxis==null){
		m_xAxis={categories: []};
	}else{
		m_xAxis=_xAxis;
	}
	if(_series==null){
		m_series=[];
	}else{
		m_series=_series;
	}
	if(_title==null){
		m_title={text:""};
	}else{
		m_title=_title;
	}
	 $('#chart').highcharts({
	      chart: {
	          type: 'column'
	      },
	      title:{text:m_title}, /*{
	          text: title
	      },*/
	     /* subtitle: {
	          text: 'Source: WorldClimate.com'
	      },*/
	      xAxis:m_xAxis /*{
	    	  categories: [
	    	                '一月',
	    	                '二月',
	    	                '三月',
	    	                '四月',
	    	                '五月',
	    	                '六月',
	    	                '七月',
	    	                '八月',
	    	                '九月',
	    	                '十月',
	    	                '十一月',
	    	                '十二月'
	    	            ]
	      }*/,
	      yAxis: {
	          min: 0,
	          title: {
	              text: '事故数 (/起)'
	          }
	      },
	      tooltip: {
	          /*headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	          '<td style="text-align: right"><b>{point.y} 起</b></td></tr>',
	          '<td style="padding:0"><b>{point.y:.1f} 起</b></td></tr>',
	          footerFormat: '</table>',*/
	    	  pointFormat: '{series.name}: <b>{point.y} 起</b><br>',
	          shared: true,
	          useHTML: true
	      },
	      plotOptions: {
	          column: {
	              pointPadding: 0.2,//表示图表是柱状图
	              borderWidth: 0//粗细
	          }
	      },
	      series: m_series/*[{
	          name: '事故数',
	          data: [1, 31]
	      }]*/
	  });
}
//曲线图处理函数
function initDiagram(_xAxis,_series,_title){
	var m_xAxis=null;
	var m_series=null;
	var m_title="";
	if(_xAxis==null){
		m_xAxis={categories: []};
	}else{
		m_xAxis=_xAxis;
	}
	if(_series==null){
		m_series=[];
	}else{
		m_series=_series;
	}
	if(_title==null){
		m_title={text:""};
	}else{
		m_title=_title;
	}
	
	$('#chart').highcharts({
	      title: {
	          text: m_title,
	          x: -20 //center
	      },
	      xAxis: m_xAxis,
	      yAxis: {
	          title: {
	              text: '事故数 (/起)'
	          },
	          plotLines: [{
	              value: 0,
	              width: 1,
	              color: '#808080'
	          }]
	      },
	      tooltip: {
	          valueSuffix: '起'
	      },
	      legend: {
	          layout: 'vertical',
	          align: 'right',
	          verticalAlign: 'middle',
	          borderWidth: 0
	      },
	      series: m_series
	  });
}

//获取当前时间按YYYYMMDDHHiiss/YYYY-MM-DD , time小时以前的时间
function getTime(type,time){
	if(!time){
		if(type=="YYYYMMDDHHiiss"){
			var mydate = new Date();
			var str = ""+mydate.getFullYear();
			str += p((mydate.getMonth()+1));
			str += p(mydate.getDate());
			str += p(mydate.getHours());
			str += p(mydate.getMinutes());
			str += p(mydate.getSeconds());
			return str;
		}else if(type="YYYY-MM-DD"){
		   var mydate = new Date();
		   var str = mydate.getFullYear() + "-";
		   str += p((mydate.getMonth()+1)) + "-";
		   str += p(mydate.getDate());
		   return str;
		}else{
			return alert("你输入的格式不正确");
		}
	}else{
		if(type=="YYYYMMDDHHiiss"){
			var mydate = new Date();
			var bfdate = new Date(mydate.getTime()-3600000*time);
			var str = ""+bfdate.getFullYear();
			str += p((bfdate.getMonth()+1));
			str += p(bfdate.getDate());
			str += p(bfdate.getHours());
			str += p(bfdate.getMinutes());
			str += p(bfdate.getSeconds());
			return str;
		}else if(type="YYYY-MM-DD"){
		   var mydate = new Date();
		   var bfdate = new Date(mydate.getTime()-3600000*time);
		   var str = bfdate.getFullYear() + "-";
		   str += p((bfdate.getMonth()+1)) + "-";
		   str += p(bfdate.getDate());
		   return str;
		}else{
			return alert("你输入的格式不正确");
		}
	}
}
//补0函数
function p(s) {
    return s < 10 ? '0' + s: s;
}
function error(data)
{
	alert("失败");
}
/**
 * HashMap函数
 */
function HashMap()
{
    /** Map 大小 **/
    var size = 0;
    /** 对象 **/
    var entry = new Object();
     
    /** 存 **/
    this.put = function (key , value)
    {
        if(!this.containsKey(key))
        {
            size ++ ;
        }
        entry[key] = value;
    }
     
    /** 取 **/
    this.get = function (key)
    {
        if( this.containsKey(key) )
        {
            return entry[key];
        }
        else
        {
            return null;
        }
    }
     
    /** 删除 **/
    this.remove = function ( key )
    {
        if( delete entry[key] )
        {
            size --;
        }
    }
     
    /** 是否包含 Key **/
    this.containsKey = function ( key )
    {
        return (key in entry);
    }
     
    /** 是否包含 Value **/
    this.containsValue = function ( value )
    {
        for(var prop in entry)
        {
            if(entry[prop] == value)
            {
                return true;
            }
        }
        return false;
    }
     
    /** 所有 Value **/
    this.values = function ()
    {
        var values = new Array(size);
        for(var prop in entry)
        {
            values.push(entry[prop]);
        }
        return values;
    }
     
    /** 所有 Key **/
    this.keys = function ()
    {
        var keys = new Array(size);
        for(var prop in entry)
        {
            keys.push(prop);
        }
        return keys;
    }
     
    /** Map Size **/
    this.size = function ()
    {
        return size;
    }
}
//公共道路、月份处理函数
function commonRoadMonth(){
	roadName=$("#numRoadChart").find("option:selected").text();
	startMonth=$("#startMonth").val();
	endMonth=$("#endMonth").val();
	startYear=parseInt(startMonth.substr(0,4));
	endYear=parseInt(endMonth.substr(0,4));
	startofMonth=parseInt(startMonth.substr(5,2));
	endofMonth=parseInt(endMonth.substr(5,2));
	durationMonth=(endYear-startYear)*12+(endofMonth-startofMonth);
} 
//查找返回记录中道路和时间一一对应的Num
function findRecordNum(roadName,happenTime,data)
{
	for(var i=0;i<data.length;i++)
	{
		var item=data[i];
		if(item.HappenTime==happenTime)
		{
			return item.Num;
		}
	}
	return 0;
}






function error(data)
{
	alert("失败");
}

