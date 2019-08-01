/**
 * Created by asus on 2016/7/13.
 */
var $sectionCrossName=$("#sectionCrossName");
var $sectionCross=$("#sectionCross");
var $accPlaces=$("#accPlaces");
var qhCode,
	numRoad,
	accCode,
	happenTime,
	startInvestTime,
	endInvestTime,
	duLon,
	minLon,
	secLon,
	duLat,
	minLat,
	secLat,
	accLon,
	accLat,
	oneWayRoad,
	twoWayRoad,
	personDeath,
	personHarm,
	vehicleDamage,
	noVehicleDamage,
	economicLoss,
	classCode,
	causeCode,
	weatherCode,
	formCode,
	localeCode,
	landCode,
	surfaceCode,
	surClassCode,
	transectCode,
	crossSecClassCode,
	linearCode,
	loadClassCode,
	contralCode,
	lightCode,
	remarks,
	writeUnit,
	writeTime,
	writePerson,
	tabVerify,
	test;
var tempUrl="http://localhost:8080/TrafficAccident/addinformation/";

$(function(){
   $("#save").click(function(e){
	   if(!required()){
		  return false;
	   }
   });
   getSys_xzqh();
   getSys_road_name();
   $("#numRoad").change(changAccCode);
   $("#sectionCross").change(changAccCode);
   $("#sectionCrossName").change(changeAccPlace);
   getAcc_class();
   getAcc_cause();
   getAcc_weather();
   getAcc_form();
   getAcc_locale();
   getAcc_land();
   getAcc_surface();
   getAcc_sur_class();
   getAcc_transect();
   getAcc_linear();
   getAcc_load_class();
   getAcc_contral();
   getAcc_light();
});
//保存录入数据
function saveClick(){
    var param=getParam();
    param='param='+param;
    var url=tempUrl+"insertInfoBasic";
    _ajaxPost(url,param,success,error);
}
//获取行政区划数据
function getSys_xzqh(){
	var url=tempUrl+"getSys_xzqh";
	_ajaxPost(url,null,success_xzqh,error);
}
//获取选择道路数据
function getSys_road_name(){
	var url=tempUrl+"getSys_road_section";
	_ajaxPost(url,null,success_road_name,error);
}
function changAccCode(){
	$("#accCode").val($("#numRoad option:selected").attr("value"));
	
	roadName=$("#numRoad").find("option:selected").text();
	crossSecClassCode=$("#sectionCross").val();
	var url=tempUrl+"getSys_section_cross";
	var param='roadName='+roadName+"&crossSecClassCode="+crossSecClassCode;
	_ajaxPost(url,param,success_changAccCode,error);
	
}
//选择道路改变之后回调函数
function success_changAccCode(data){
	
	$("#sectionCrossName").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option>'+data[i].sectionCrossName+'</option>';
	}
	$("#sectionCrossName").html(content);
	$("#sectionCrossName").click();
	changeAccPlace();
}
//获取事故分类数据
function getAcc_class(){
	var url=tempUrl+"getAcc_class";
	_ajaxPost(url,null,success_Acc_class,error);
}
//获取事故原因数据
function getAcc_cause(){
	var url=tempUrl+"getAcc_cause";
	_ajaxPost(url,null,success_Acc_cause, error);
}
//获取天气分类数据
function getAcc_weather(){
	var url=tempUrl+"getAcc_weather";
	_ajaxPost(url,null, success_Acc_weather, error);
}
//获取事故形态数据
function getAcc_form(){
	var url=tempUrl+"getAcc_form";
	_ajaxPost(url,null, success_Acc_form, error);
}
//获取事故现场数据
function getAcc_locale(){
	var url=tempUrl+"getAcc_locale";
	_ajaxPost(url,null, success_Acc_locale, error);
}
//获取地形数据
function getAcc_land(){
	var url=tempUrl+"getAcc_land";
	_ajaxPost(url,null, success_Acc_land, error);
}
//获取路面情况数据
function getAcc_surface(){
	var url=tempUrl+"getAcc_surface";
	_ajaxPost(url, null,success_Acc_surface, error);
}
//获取路面类型数据
function getAcc_sur_class(){
	var url=tempUrl+"getAcc_sur_class";
	_ajaxPost(url,null, success_Acc_sur_class, error);
}
//获取道路横断面数据
function getAcc_transect(){
	var url=tempUrl+"getAcc_transect";
	_ajaxPost(url,null, success_Acc_transect, error);
}
//获取道路线形数据
function getAcc_linear(){
	var url=tempUrl+"getAcc_linear";
	_ajaxPost(url,null, success_Acc_linear, error);
}
//获取道路类型数据
function getAcc_load_class(){
	var url=tempUrl+"getAcc_load_class";
	_ajaxPost(url, null,success_Acc_load_class, error);
}
//获取交通控制方式数据
function getAcc_contral(){
	var url=tempUrl+"getAcc_contral";
	_ajaxPost(url,null, success_Acc_contral, error);
}
//获取照明条件数据
function getAcc_light(){
	var url=tempUrl+"getAcc_light";
	_ajaxPost(url,null, success_Acc_light, error);
}
//行政区划数据获取成功执行函数
function success_xzqh(data){
	$("#qhCode").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].QhCode+'">'+data[i].QhName+'</option>';
	}
	$("#qhCode").html(content);
}
//选择道路数据获取成功执行函数
function success_road_name(data){
	$("#numRoad").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].SectionCode+'">'+data[i].SectionName+'</option>';
	}
	$("#numRoad").html(content);
	//初始化时给事故编号赋值
	$("#accCode").val($("#numRoad option:selected").attr("value"));
	changAccCode();
}
//事故分类数据获取成功执行函数
function success_Acc_class(data){
	$("#classCode").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].ClassCode+'">'+data[i].ClassName+'</option>';
	}
	$("#classCode").html(content);
}
//事故原因数据获取成功执行函数
function success_Acc_cause(data){
	$("#causeCode").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].CauseCode+'">'+data[i].CauseName+'</option>';
	}
	$("#causeCode").html(content);
}
//天气分类数据获取成功执行函数
function success_Acc_weather(data){
	$("#weatherCode").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].WeatherCode+'">'+data[i].WeatherName+'</option>';
	}
	$("#weatherCode").html(content);
}
//事故形态数据获取成功执行函数
function success_Acc_form(data){
	$("#formCode").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].FormCode+'">'+data[i].FormName+'</option>';
	}
	$("#formCode").html(content);
}
//事故现场数据获取成功执行函数
function success_Acc_locale(data){
	$("#localeCode").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].LocaleCode+'">'+data[i].LocaleName+'</option>';
	}
	$("#localeCode").html(content);
}
//地形数据获取成功执行函数
function success_Acc_land(data){
	$("#landCode").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].LandCode+'">'+data[i].LandName+'</option>';
	}
	$("#landCode").html(content);
}
//路面情况数据获取成功执行函数
function success_Acc_surface(data){
	$("#surfaceCode").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].SurfaceCode+'">'+data[i].SurfaceName+'</option>';
	}
	$("#surfaceCode").html(content);
}
//路面类型数据获取成功执行函数
function success_Acc_sur_class(data){
	$("#surClassCode").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].SurClassCode+'">'+data[i].SurClassName+'</option>';
	}
	$("#surClassCode").html(content);
}
//道路横断面数据获取成功执行函数
function success_Acc_transect(data){
	$("#transectCode").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].TransectCode+'">'+data[i].TransectName+'</option>';
	}
	$("#transectCode").html(content);
}
//道路线形数据获取成功执行函数
function success_Acc_linear(data){
	$("#linearCode").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].LinearCode+'">'+data[i].LinearName+'</option>';
	}
	$("#linearCode").html(content);
}
//道路类型数据获取成功执行函数
function success_Acc_load_class(data){
	$("#loadClassCode").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].LoadClassCode+'">'+data[i].LoadClassName+'</option>';
	}
	$("#loadClassCode").html(content);
}
//交通控制方式数据获取成功执行函数
function success_Acc_contral(data){
	$("#contralCode").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].ContralCode+'">'+data[i].ContralName+'</option>';
	}
	$("#contralCode").html(content);
}
//照明条件数据获取成功执行函数
function success_Acc_light(data){
	$("#lightCode").html("");
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].LightCode+'">'+data[i].LightName+'</option>';
	}
	$("#lightCode").html(content);
}



function success(data)
{
	alert("成功");
}

function error(data)
{
	alert("失败");
}

function getParam(){
    getParamValue();
    var tempObj={'qhCode':qhCode,'roadName':roadName,'sectionCrossName':sectionCrossName,'accPlaces':accPlaces,'numRoad':numRoad,'accCode':accCode,'happenTime':happenTime,'startInvestTime':startInvestTime,
                'endInvestTime':endInvestTime,'accLon':accLon,'accLat':accLat,'oneWayRoad':oneWayRoad,'twoWayRoad':twoWayRoad,
                'personDeath':personDeath,'personHarm':personHarm,'vehicleDamage':vehicleDamage,'noVehicleDamage':noVehicleDamage,'economicLoss':economicLoss,
                'classCode':classCode,'causeCode':causeCode,'weatherCode':weatherCode,'formCode':formCode,'localeCode':localeCode,
                'landCode':landCode,'surfaceCode':surfaceCode,'surClassCode':surClassCode,'transectCode':transectCode,'crossSecClassCode':crossSecClassCode,
                'linearCode':linearCode,'loadClassCode':loadClassCode,'contralCode':contralCode,'lightCode':lightCode,'remarks':remarks,
                'writeUnit':writeUnit,'writeTime':writeTime,'writePerson':writePerson,'tabVerify':tabVerify,}
    var param=JSON.stringify(tempObj);
    return param;
}
function  getParamValue(){
    qhCode=$("#qhCode").find("option:selected").val();
    roadName=$("#numRoad").find("option:selected").text();
    sectionCrossName=$sectionCrossName.val();
    accPlaces=$accPlaces.val();
    numRoad=$("#numRoad").find("option:selected").val();
    accCode=$("#accCode").val();
    happenTime=$("#happenTime").val();
    startInvestTime=$("#startInvestTime").val();
    endInvestTime=$("#endInvestTime").val();
    accLon= $("#duLon").val();
    /*minLon= $("#minLon").val();
    secLon= $("#secLon").val();*/
    accLat= $("#duLat").val();
    /*minLat= $("#minLat").val();
    secLat= $("#secLat").val();*/
    /*accLon=toDegree(duLon,minLon,secLon).toFixed(7);
    accLat=toDegree(duLat,minLat,secLat).toFixed(7);*/
    if($("#oneTwoRoad").find("option:selected").text()=="单向"){
        oneWayRoad=$("#wayRoad").val();
        twoWayRoad=0;
    }else {
        twoWayRoad=$("#wayRoad").val();
        oneWayRoad=0;
    }
    personDeath=$("#personDeath").val();
    personHarm=$("#personHarm").val();
    vehicleDamage=$("#vehicleDamage").val();
    noVehicleDamage=$("#noVehicleDamage").val();
    economicLoss=$("#economicLoss").val();
    classCode=$("#classCode").find("option:selected").text();
    causeCode=$("#causeCode").find("option:selected").text();
    weatherCode=$("#weatherCode").find("option:selected").text();
    formCode=$("#formCode").find("option:selected").text();
    localeCode=$("#localeCode").find("option:selected").text();
    landCode=$("#landCode").find("option:selected").text();
    surfaceCode=$("#surfaceCode").find("option:selected").text();
    surClassCode=$("#surClassCode").find("option:selected").text();
    transectCode=$("#transectCode").find("option:selected").text();
    crossSecClassCode=$("#sectionCross").find("option:selected").text();
    linearCode=$("#linearCode").find("option:selected").text();
    loadClassCode=$("#loadClassCode").find("option:selected").text();
    contralCode=$("#contralCode").find("option:selected").text();
    lightCode=$("#lightCode").val();
    remarks=$("#remarks").val();
    writeUnit=$("#writeUnit").val();
    writeTime=$("#writeTime").val();
    writePerson=$("#writePerson").val();
    tabVerify=$("#tabVerify").val();

}
/*度分秒转换成度*/
function toDegree(degree,min,secs){
    var deg=parseInt(degree)+parseFloat(min)*1/60+parseFloat(secs)*1/3600;
    return deg;
}
/*事故地点改变*/
function changeAccPlace(){
	$accPlaces.removeAttr("disabled");
	
	if($sectionCross.val()=="0"){//0表示路口
		$accPlaces.val($sectionCrossName.val());
		//选择为路口时事故地点禁止修改
		//$accPlaces.attr("disabled","disabled");
	}else{
		$accPlaces.val("");
		var url=tempUrl+"getAcc_places";
		var param='sectionCrossName='+$sectionCrossName.val();
		_ajaxPost(url,param,success_changeAccPlace,error);
	}
}
/*事故地点改变成功返回函数*/
function success_changeAccPlace(data){
	$("#accPlace_list").html();
	var content="";
	for(var i=0;i<data.length;i++){
		content+='<option value="'+data[i].AccPlaces+'"></option>';
	}
	$("#accPlace_list").html(content);
}
/*required属性*/
function required(){
	var inputRequired=$("input[required]");
	var flag=true;
	for ( var i = 0; i < inputRequired.length; i++) {
		if(inputRequired.eq(i).val()==""){
			inputRequired.eq(i).addClass("voidRequired");
			flag=false;
		}else{
			inputRequired.eq(i).removeClass("voidRequired");
		}
	}
	return flag;
}



