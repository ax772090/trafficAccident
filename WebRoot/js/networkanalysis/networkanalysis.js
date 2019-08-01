var startyear=null;
var endyear=null;
var roadtype=null;
var tempUrl="http://localhost:8080/TrafficAccident/networkanalysis/";
$(function(){
	getYearAndRoadType();
	choiceRoadType();
	//$("#blackPointRoad").change(choiceRoadType);
});
//
function getYearAndRoadType(){
	startyear=$("#startYear").val();
	endyear=$("#endYear").val();
	roadtype=$("#blackPointRoad").find("option:selected").text();
}
//选择道路类型，判断是道路、路段还是路口
function choiceRoadType(){
	getYearAndRoadType();
	/*startyear=$("#startYear").val();
	endyear=$("#endYear").val();
	roadtype=$("#blackPointRoad").find("option:selected").text();*/
	if(roadtype=="道路事故"){
		roadAccident();
	}else if(roadtype=="路段事故"){
		sectionAccident();
	}else{
		crossAccident();
	}
}
//道路事故
function roadAccident(){
	var url=tempUrl+'roadAccident';
	var param='startyear='+startyear+"&endyear="+endyear+"&roadtype="+roadtype;
	_ajaxPost(url,param,success_roadAccident,error);
	
}
//路段事故
function sectionAccident(){
	var url=tempUrl+'sectionAccident';
	var param='startyear='+startyear+"&endyear="+endyear+"&roadtype="+roadtype;
	_ajaxPost(url,param,success_sectionAccident,error);
}
//路口事故
function crossAccident(){
	var url=tempUrl+'crossAccident';
	var param='startyear='+startyear+"&endyear="+endyear+"&roadtype="+roadtype;
	_ajaxPost(url,param,success_crossAccident,error);
}
//道路事故成功后执行函数
function success_roadAccident(data){
	$("#blackPointTable").html();//清空表格里边的数据
	var content="";
	var temp="";
	var thead="";
	thead='<thead>'+
			'<tr>'+
				'<th>序号</th>'+
				'<th>道路名称</th>'+
				'<th>平均日交通量<br>(辆/天)</th>'+
				'<th>累计事故数<br>(起)</th>'+
				'<th>该道路事故率<br>(次/亿车公里)</th>'+
				'<th>路网平均事故率<br>(次/亿车公里)</th>'+
				'<th>临界事故率上限<br>(次/亿车公里)</th>'+
				'<th>临界事故率下限<br>(次/亿车公里)</th>'+
				'<th>事故率比</th>'+
				'<th>道路安全等级</th>'+
			'</tr>'+
		 '</thead>';
	for ( var i = 0; i < data.length; i++) {
		var id=i+1;
		var roadName=data[i].roadName;
		var aveFlow=data[i].aveFlow;
		var accNum=data[i].accNum;
		var oneAccRate=data[i].oneAccRate.toFixed(2);
		var aveAccRate=data[i].aveAccRate.toFixed(2);
		var upperLimit=data[i].upperLimit.toFixed(2);
		var downLimit=data[i].downLimit.toFixed(2);
		var ratioAR=data[i].ratioAR;
		var securityDegree=data[i].securityDegree;
		var a=securityDegree=="危险路段"?'dangerRoad':
				securityDegree=="安全路段"?'safeRoad':'normalRoad';
		temp='<tr>'+
					'<td>'+id+'</td>'+
					'<td>'+roadName+'</td>'+
					'<td>'+aveFlow+'</td>'+
					'<td>'+accNum+'</td>'+
					'<td>'+oneAccRate+'</td>'+
					'<td>'+aveAccRate+'</td>'+
					'<td>'+upperLimit+'</td>'+
					'<td>'+downLimit+'</td>'+
					'<td>'+ratioAR+'</td>'+
					'<td class="'+a+'">'+securityDegree+'</td>'+
			'</tr>';
		content+=temp;
	}
	content=thead+'<tbody>'+content+'</tbody>';
	$("#blackPointTable").html(content);
}
//路段事故成功后执行函数
function success_sectionAccident(data){
	$("#blackPointTable").html();//清空表格里边的数据
	var content="";
	var temp="";
	var thead="";
	thead='<thead>'+
			'<tr>'+
				'<th>序号</th>'+
				'<th>道路名称</th>'+
				'<th>事故地点</th>'+
				'<th>所属路段</th>'+
				'<th>路段交通流量<br>(辆/日)</th>'+
				'<th>事故数<br>(起)</th>'+
				'<th>路段长度<br>(Km)</th>'+
				'<th>黑点鉴别指数</th>'+
				'<th>该路鉴别指数</th>'+
				'<th>是否是黑点(段)</th>'+
			'</tr>'+
		 '</thead>';
	for ( var i = 0; i < data.length; i++) {
		var id=i+1;
		var roadName=data[i].roadName;
		var aveFlow=data[i].aveFlow;
		var length=data[i].length;
		var accNumSection=data[i].accNumSection;
		var accPlace=data[i].accPlace;
		var sectionDisIndex=data[i].sectionDisIndex.toFixed(4);
		var avedisIndex=data[i].avedisIndex.toFixed(4);
		var sectionName=data[i].sectionName;
		var compareDisIndex=data[i].compareDisIndex;
		var a=compareDisIndex?'blackPoint':'notBlackPoint';
		temp='<tr>'+
					'<td>'+id+'</td>'+
					'<td>'+roadName+'</td>'+
					'<td>'+accPlace+'</td>'+
					'<td>'+sectionName+'</td>'+
					'<td>'+aveFlow+'</td>'+
					'<td>'+accNumSection+'</td>'+
					'<td>'+length+'</td>'+
					'<td>'+sectionDisIndex+'</td>'+
					'<td>'+avedisIndex+'</td>'+
					'<td style="text-align:center;vertical-align:middle;"><span class="'+ a +'"></span></td>'+
			'</tr>';
		content+=temp;
	}
	content=thead+'<tbody>'+content+'</tbody>';
	$("#blackPointTable").html(content);
}
//路口事故成功后执行函数
function success_crossAccident(data){
	$("#blackPointTable").html();//清空表格里边的数据
	var content="";
	var temp="";
	var thead="";
	thead='<thead>'+
			'<tr>'+
				'<th>序号</th>'+
				'<th>路口名</th>'+
				'<th>路口事故数<br>(起)</th>'+
				'<th>路口车道数</th>'+
				'<th>总车道数</th>'+
				'<th>路口平均交通流量<br>(辆/天)</th>'+
				'<th>平均交通流量<br>(辆/天)</th>'+
				'<th>路口长度<br>(100m)</th>'+
				'<th>黑点鉴别指数(平均值)</th>'+
				'<th>路口黑点鉴别指数<br>(实际值)</th>'+
				'<th>是否是黑点</th>'+
			'</tr>'+
		 '</thead>';
	for ( var i = 0; i < data.length; i++) {
		var id=i+1;
		var crossName=data[i].crossName;
		var accNumCross=data[i].accNumCross;
		var laneNum=data[i].laneNum;
		var totallaneNum=data[i].totallaneNum;
		var aveFlow=data[i].aveFlow;
		var aveFlowCross=data[i].aveFlowCross.toFixed(2);
		var length=data[i].length;
		var allCrossDisIndex=data[i].allCrossDisIndex.toFixed(5);
		var crossDisIndex=data[i].crossDisIndex.toFixed(5);
		var compareDisIndex=data[i].compareDisIndex;
		var a=compareDisIndex?'blackPoint':'notBlackPoint';
		temp='<tr>'+
					'<td>'+id+'</td>'+
					'<td>'+crossName+'</td>'+
					'<td>'+accNumCross+'</td>'+
					'<td>'+laneNum+'</td>'+
					'<td>'+totallaneNum+'</td>'+
					'<td>'+aveFlow+'</td>'+
					'<td>'+aveFlowCross+'</td>'+
					'<td>'+length+'</td>'+
					'<td>'+allCrossDisIndex+'</td>'+
					'<td>'+crossDisIndex+'</td>'+
					'<td style="text-align:center;vertical-align:middle;"><span class="'+ a +'"></span></td>'+
			'</tr>';
		content+=temp;
	}
	content=thead+'<tbody>'+content+'</tbody>';
	$("#blackPointTable").html(content);
}


function error(data)
{
	alert("失败");
}