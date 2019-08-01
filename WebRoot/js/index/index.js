var graphicsLayer,graphicsLayerFlash;

$(function(){
	getInfoBasicData();
	//getImage();
});


function getInfoBasicData(){
	var url="http://localhost:8080/TrafficAccident/getInfoBasic";
	_ajaxPost(url,null,success,error);
}

function success(data)
{
	gisInfoBasicData(data);
}

function error(data)
{
	alert("数据获取失败");
}

function getImage(){
	getLineImage();
}

function gisInfoBasicData(data){
	graphicsLayer =new esri.layers.GraphicsLayer();
	graphicsLayerFlash =new esri.layers.GraphicsLayer();
	var lastFlashNum = 1;//显示N条距离当前时间最近发生的事故
	var accLngLat;
	require(["js/coordTransform.js","esri/layers/GraphicsLayer","esri/graphic", "esri/InfoTemplate","esri/geometry/Point","esri/Color","esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleLineSymbol","dojo/domReady!"],
			function(coordtransform,GraphicsLayer,Graphic,InfoTemplate,Point,Color,SimpleMarkerSymbol,SimpleLineSymbol){
		 var gisInforTemplate=new InfoTemplate();
		  var symbol = new SimpleMarkerSymbol(
	              SimpleMarkerSymbol.STYLE_CIRCLE,
	              8,
	              new SimpleLineSymbol(
	                      SimpleLineSymbol.STYLE_SOLID,
	                      new Color([0, 0, 255, 0.5]),
	                      0.5
	              ),
	              new Color([0, 0, 255])
	      );
		  var symbolLast = new SimpleMarkerSymbol(
	              SimpleMarkerSymbol.STYLE_CIRCLE,
	              12,
	              new SimpleLineSymbol(
	                      SimpleLineSymbol.STYLE_SOLID,
	                      new Color([0, 0, 255, 0.5]),
	                      4
	              ),
	              new Color([255, 0, 0])
	      );
		  //其他发生的事故
		  for(var i=lastFlashNum;i<data.length;i++){
			  accLngLat=coordtransform.wgs84togcj02(data[i].AccLon, data[i].AccLat);
			  var pt = new Point(accLngLat[0],accLngLat[1]);
			  var attr={
					  "AccLon_NAME":data[i].AccLon,
					  "AccLat_NAME":data[i].AccLat,
					  "HappenTime_NAME":data[i].HappenTime,
					  "AccPlaces_NAME":data[i].AccPlaces,
					  "PersonDeath_NAME":data[i].PersonDeath,
					  "PersonHarm_NAME":data[i].PersonHarm
			  };

			  gisInforTemplate.setTitle("道路 :"+data[i].RoadName);
			  gisInforTemplate.setContent("<b>经度：</b>${AccLon_NAME}<br/>"+
										  "<b>纬度：</b>${AccLat_NAME}<br/>"+
										  "<b>事故发生时间：</b>${HappenTime_NAME}<br/>"+
										  "<b>事故地点：</b>${AccPlaces_NAME}<br/>"+
										  "<b>死亡人数：</b>${PersonDeath_NAME}<br/>"+
										  "<b>受伤人数：</b>${PersonHarm_NAME}");
			  
			  var graphic = new Graphic(pt, symbol, attr, gisInforTemplate);
			  graphicsLayer.add(graphic);
		  }
		  //距离最近发生的事故 
		  for(var i=0;i<lastFlashNum;i++){
			  accLngLat=coordtransform.wgs84togcj02(data[i].AccLon, data[i].AccLat);
			  var pt = new Point(accLngLat[0],accLngLat[1]);
			  var attr={
					  "AccLon_NAME":data[i].AccLon,
					  "AccLat_NAME":data[i].AccLat,
					  "HappenTime_NAME":data[i].HappenTime,
					  "AccPlaces_NAME":data[i].AccPlaces,
					  "PersonDeath_NAME":data[i].PersonDeath,
					  "PersonHarm_NAME":data[i].PersonHarm
			  };
			  
			  gisInforTemplate.setTitle("道路 :"+data[i].RoadName);
			  gisInforTemplate.setContent("<b>经度：</b>${AccLon_NAME}<br/>"+
										  "<b>纬度：</b>${AccLat_NAME}<br/>"+
										  "<b>事故发生时间：</b>${HappenTime_NAME}<br/>"+
										  "<b>事故地点：</b>${AccPlaces_NAME}<br/>"+
										  "<b>死亡人数：</b>${PersonDeath_NAME}<br/>"+
										  "<b>受伤人数：</b>${PersonHarm_NAME}");
			  
			  var graphic = new Graphic(pt, symbolLast, attr, gisInforTemplate);
			  graphicsLayerFlash.add(graphic);
			 /* map.graphics.add(graphic);*/
		  }		  
		  map.addLayer(graphicsLayer); 
		  map.addLayer(graphicsLayerFlash); 
		  
	});
	//点闪烁效果
	function doFlash(){
		if(graphicsLayerFlash.visible){
			graphicsLayerFlash.hide();
		}else{
			graphicsLayerFlash.show();
		}
		setTimeout(doFlash,500);
	}
	doFlash();
	/*//wgs84转国测局坐标
	function wgs84togcj02(accLng,accLat){
		return coordtransform.wgs84togcj02(accLng,accLat);
		
	}*/
}

/*function getLineImage(){
	var toolbar;
	require(["esri/toolbars/draw", "esri/graphic","esri/Color","esri/symbols/SimpleLineSymbol", "dojo/domReady!"],
			function(Draw,Graphic,Color,SimpleLineSymbol){
		    map.on("load",function(evt){
			createToolbar();
			var mp= esri.geometry.webMercatorToGeographic(evt.mapPoint);
			console.log("经度"+mp.x.toFixed(7));
			console.log("纬度"+mp.y.toFixed(7));
		}); 
		function createToolbar(){
			toolbar=new Draw(map);
			toolbar.activate(Draw.LINE);
			map.hideZoomSlider();
			toolbar.on("draw-end",addToMap);
		}
		function addToMap(){
			var symbol;
	        toolbar.deactivate();
	        symbol = new SimpleLineSymbol(
	        		SimpleLineSymbol.STYLE_SOLID,
                    new Color([0, 0, 255, 0.5]),
                    0.5
                    );
	        var graphic = new Graphic(evt.geometry, symbol);
	        map.graphics.add(graphic);
		}
	});

}*/

/*require([
         "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol",
         "esri/Color", "esri/InfoTemplate", "esri/graphic", ... 
       ], function(Point, SimpleMarkerSymbol, Color, InfoTemplate, Graphic, ... ) {
         var pt = new Point(xloc,yloc,map.spatialReference)
         var sms = new SimpleMarkerSymbol().setStyle(
           SimpleMarkerSymbol.STYLE_SQUARE).setColor(
           new Color([255,0,0,0.5]));
         var attr = {"Xcoord":evt.mapPoint.x,"Ycoord":evt.mapPoint.y,"Plant":"Mesa Mint"};
         var infoTemplate = new InfoTemplate("Vernal Pool Locations","Latitude: ${Ycoord} <br/>
           Longitude: ${Xcoord} <br/>
           Plant Name:${Plant}");
         var graphic = new Graphic(pt,sms,attr,infoTemplate);
         ...
       });*/
