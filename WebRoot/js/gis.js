/*function gisMap(){

	require(["esri/map","esri/dijit/HomeButton","esri/dijit/OverviewMap","esri/dijit/Scalebar", "esri/dijit/LocateButton","esri/layers/ArcGISTiledMapServiceLayer",
	            "dojo/domReady!"], function (Map,HomeButton,OverviewMap,Scalebar,LocateButton, ArcGISTiledMapServiceLayer) {
	            var map = new Map("mapDiv", {
	                logo:false,
	                center: [87.35,43.45],
	                zoom:5
	           });
	            var baseServiceUrl = "http://www.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer";

	            //var baseServiceUrl = " http://www.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineStreetColor/MapServer";
	            var baseLayer = new ArcGISTiledMapServiceLayer(baseServiceUrl);
	            map.addLayer(baseLayer);

	            Home键的显示
	            var home=new HomeButton({
	                map:map
	            },"HomeButton");
	            home.startup();
	            鹰眼显示
	            var overviewMapDijit = new OverviewMap({
	                map: map,
	                visible: false

	            });
	            overviewMapDijit.startup();
	            比例尺
	            var scalebar = new Scalebar({
	                map: map,
	                // "dual" displays both miles and kilometers
	                // "english" is the default, which displays miles
	                // use "metric" for kilometers
	                scalebarUnit: "dual"
	            });
	            定位功能
	            geoLocate = new LocateButton({
	                map: map,
	                highlightLocation:true
	            }, "LocateButton");
	            geoLocate.startup();
	        });
}*/
 

function gisInfoBasicData(data){
	var graphicsLayer =new esri.layers.GraphicsLayer();
	var graphicsLayerFlash =new esri.layers.GraphicsLayer();
	var lastFlashNum = 1;//显示N条距离当前时间最近发生的事故
	var accLngLat;
	require(["esri/map","js/coordTransform.js","esri/layers/GraphicsLayer","esri/graphic", "esri/InfoTemplate","esri/geometry/Point","esri/Color","esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleLineSymbol","dojo/domReady!"],
			function(Map,coordtransform,GraphicsLayer,Graphic,InfoTemplate,Point,Color,SimpleMarkerSymbol,SimpleLineSymbol){
		 
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
			  var attr={
					  "AccLon":data[i].AccLon,
					  "AccLat":data[i].AccLat
			  };
			  var gisInforTemplate=new InfoTemplate("编号:"+data[i].RoadName);
			  var pt = new Point(accLngLat[0],accLngLat[1]);
			  var graphic = new Graphic(pt, symbol, attr, gisInforTemplate);
			  graphicsLayer.add(graphic);
		  }
		  //距离最近发生的事故 
		  for(var i=0;i<lastFlashNum;i++){
			  accLngLat=coordtransform.wgs84togcj02(data[i].AccLon, data[i].AccLat);
			  var attr={
					  "AccLon":data[i].AccLon,
					  "AccLat":data[i].AccLat
			  };
			  var gisInforTemplate=new InfoTemplate("编号:"+data[i].RoadName);
			  var pt = new Point(accLngLat[0],accLngLat[1]);
			  var graphic = new Graphic(pt, symbolLast, attr, gisInforTemplate);
			  graphicsLayerFlash.add(graphic);
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
function getLineImage(){
	var toolbar;
	require(["esri/toolbars/draw", "esri/graphic","esri/symbols/SimpleLineSymbol", "dojo/domReady!"],
			funciton(Draw,Graphic,SimpleLineSymbol){
		map.on("click",function(evt){
			createToolbar();
			var mp= esri.geometry.webMercatorToGeographic(evt.mapPoint);
			console.log("经度"+mp.x.toFixed(7));
			console.log("纬度"+mp.y.toFixed(7));
		});
	});
	function createToolbar(){
		toolbar=new Draw(map);
		toolbar.activate(Draw.LINE);
		toolbar.on("draw-end",addToMap);
	}
	function addToMap(){
		var symbol;
        toolbar.deactivate();
        symbol = new SimpleLineSymbol();
        var graphic = new Graphic(evt.geometry, symbol);
        map.graphics.add(graphic);
	}
}



