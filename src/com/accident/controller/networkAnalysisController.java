package com.accident.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
 
public class networkAnalysisController extends Controller {
	//每条道路的事故数
	//public static final String sqlAccNum="SELECT RoadName,COUNT(*) AS accNum FROM info_basic WHERE HappenTime>='%s' AND HappenTime<='%s' GROUP BY RoadName";
	//所有道路的事故数
	public static final String sqlAccNums="SELECT COUNT(*) AS accNum FROM info_basic AS a,sys_road_section AS b WHERE a.RoadName=b.SectionName AND a.HappenTime>='%s' AND a.HappenTime<='%s'";
	//四条道路的平均流量和长度
	//public static final String sqlParam="SELECT SectionName,SectionAverageFlowrate,SectionLength FROM sys_road_section WHERE SectionName='光明路' OR SectionName='新华北路' OR SectionName='解放北路' OR SectionName='人民路'";

	//每条道路的事故数、平均流量和长度
	public static final String sqlRoad="SELECT a.RoadName,COUNT(*) AS accNum,b.SectionAverageFlowrate,b.SectionLength FROM info_basic as a,sys_road_section as b WHERE a.HappenTime>='%s' AND a.HappenTime<='%s' AND a.RoadName=b.SectionName AND a.RoadName!='其他道路' GROUP BY a.RoadName";
	
	//每个路段的事故数、平均流量、长度。。。。
	public static final String sqlSection="SELECT a.RoadName,a.AccPlaces,b.name AS sectionName,COUNT(*) AS accNumSection,b.aveFlow,b.length FROM info_basic as a,sys_section_cross AS b WHERE a.HappenTime>='%s' AND a.HappenTime<='%s' AND a.SectionCrossName = b.name AND a.NumRoad = b.roadCode AND a.RoadName!='其他道路' AND b.`name`!='其他路段' AND type='1' GROUP BY a.AccPlaces";
	//每个路口的名称、所属道路、事故数、平均流量、长度、车道数
	public static final String sqlCross="SELECT a.RoadName,a.SectionCrossName AS crossName,COUNT(*) AS accNumCross,b.aveFlow,b.length,b.laneNum FROM info_basic as a,sys_section_cross AS b WHERE a.HappenTime>='%s' AND a.HappenTime<='%s' AND a.SectionCrossName = b.name AND a.SectionCrossName!='其他路口' AND type='0' GROUP BY a.SectionCrossName";
	
	public void index(){
		render("networkAnalysis.html");
	}
	/**
	 * 路网中各条道路事故分析
	 */
	public void roadAccident(){
		List data=new ArrayList();
		//getYearAndRoad();
		String startyear=this.getPara("startyear")+"-01-01";
		String endyear=this.getPara("endyear")+"-12-31";
		int time=rangeYear();
		
		//String sqlAccNums="SELECT COUNT(*) AS accNum FROM info_basic WHERE HappenTime>='%s' AND HappenTime<='%s'";
		String sql1=String.format(sqlAccNums, startyear,endyear);
		Number num=Db.queryNumber(sql1);
		int allAccNum=num.intValue();//事故总数Long转int
		
		//String sqlParam="SELECT SectionName,SectionAverageFlowrate,SectionLength FROM sys_road_section WHERE SectionName='光明路' OR SectionName='新华北路' OR SectionName='解放北路' OR SectionName='人民路'";
		String sql=String.format(sqlRoad, startyear,endyear);
		List<Record> records=Db.find(sql);//每条道路的平均流量和长度和事故数
		JSONArray jsonArray=JSONArray.fromObject(records);
		
		//totalKilometres(jsonArray,time);
		double aveaccRate=aveAccRate(jsonArray,allAccNum,time);
		for(int i=0; i<jsonArray.size();i++){
			JSONObject jsonObject=JSONObject.fromObject(jsonArray.get(i));
			JSONObject json=new JSONObject();
			json.put("roadName", jsonObject.getJSONObject("columns").getString("RoadName"));
			json.put("aveFlow", jsonObject.getJSONObject("columns").getDouble("SectionAverageFlowrate"));
			json.put("accNum", jsonObject.getJSONObject("columns").getInt("accNum"));
			double oneaccRate=oneAccRate(jsonObject,time);
			json.put("oneAccRate", oneaccRate);
			json.put("aveAccRate", aveaccRate);
			double[] limit=criticalAccRate(aveaccRate,oneKilometres(jsonObject,time));
			json.put("upperLimit", limit[0]);
			json.put("downLimit", limit[1]);
			json.put("ratioAR", String.format("%.2f", oneaccRate/limit[0]));//结果保留两位小数
			json.put("securityDegree", securityClass(oneaccRate,limit[0],limit[1]));
			data.add(json);
			
		}
		this.renderJson(data);
		
	}
	/**
	 * 路段事故分析
	 */
	public void sectionAccident(){
		List data=new ArrayList();
	
		String startyear=this.getPara("startyear")+"-01-01";
		String endyear=this.getPara("endyear")+"-12-31";
		int time=rangeYear();
		
		String sqlroad=String.format(sqlRoad, startyear,endyear);
		List<Record> records=Db.find(sqlroad);//每条道路的平均流量和长度和事故数
		JSONArray jsonArray=JSONArray.fromObject(records);
		JSONObject jsonRoadName=new JSONObject();//存放每条道路的路名和对应的鉴别指数
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject=JSONObject.fromObject(jsonArray.get(i)); 
			double avedisIndex=aveDisIndex(jsonObject,time);
			String roadName=jsonObject.getJSONObject("columns").getString("RoadName");
			jsonRoadName.put(roadName, avedisIndex);
		}
		
		String sqlsection=String.format(sqlSection, startyear,endyear);
		List<Record> recordsSection=Db.find(sqlsection);
		JSONArray jsonArraySection=JSONArray.fromObject(recordsSection);
		for (int i = 0; i < jsonArraySection.size(); i++) {
			JSONObject jsonObject=JSONObject.fromObject(jsonArraySection.get(i)); 
			JSONObject json=new JSONObject();
			String roadName=jsonObject.getJSONObject("columns").getString("RoadName");
			json.put("roadName",roadName );
			json.put("accPlace", jsonObject.getJSONObject("columns").getString("AccPlaces"));
			json.put("sectionName", jsonObject.getJSONObject("columns").getString("sectionName"));
			json.put("accNumSection", jsonObject.getJSONObject("columns").getInt("accNumSection"));
			json.put("aveFlow", jsonObject.getJSONObject("columns").getDouble("aveFlow"));
			json.put("length", jsonObject.getJSONObject("columns").getDouble("length"));
			double sectionDI=sectionDisIndex(jsonObject,time);
			json.put("sectionDisIndex", sectionDI);
			json.put("avedisIndex", jsonRoadName.getDouble(roadName));
			json.put("compareDisIndex", sectionDI>jsonRoadName.getDouble(roadName)?1:0);
			data.add(json);
			
		}
		this.renderJson(data);
	}
	/**
	 * 路口事故
	 */
	public void crossAccident(){
		//getYearAndRoad();
		List data=new ArrayList();

		String startyear=this.getPara("startyear")+"-01-01";
		String endyear=this.getPara("endyear")+"-12-31";
		int time=rangeYear();
		
		String sql=String.format(sqlCross, startyear,endyear);
		List<Record> records=Db.find(sql);//每个路口的名称、所属道路、事故数、平均流量、长度、车道数
		JSONArray jsonArrayCross=JSONArray.fromObject(records);
		
		double aveflowCross=aveFlowCross(jsonArrayCross);//平均交通流量
		int totallaneNum=totalLaneNumAccNum(jsonArrayCross)[0];//总车道数
		int totalAccCross=totalLaneNumAccNum(jsonArrayCross)[1];//总事故数
		double allCrossDidIndex=crossDidIndex(totalAccCross,totallaneNum,aveflowCross,time);//所有路口的鉴别指数
		for (int i = 0; i < jsonArrayCross.size(); i++) {
			JSONObject jsonObject=JSONObject.fromObject(jsonArrayCross.get(i)); 
			JSONObject json=new JSONObject();
			json.put("crossName", jsonObject.getJSONObject("columns").getString("crossName"));
			int accnumCross=jsonObject.getJSONObject("columns").getInt("accNumCross");
			json.put("accNumCross", accnumCross);
			int lanenum=jsonObject.getJSONObject("columns").getInt("laneNum");
			json.put("laneNum",lanenum );
			json.put("totallaneNum", totallaneNum);
			double aveflow=jsonObject.getJSONObject("columns").getDouble("aveFlow");
			json.put("aveFlow", aveflow);
			json.put("aveFlowCross", aveflowCross);
			json.put("length", jsonObject.getJSONObject("columns").getInt("length"));
			double crossDI=crossDidIndex(accnumCross,lanenum,aveflow,time);
			json.put("crossDisIndex", crossDI);
			json.put("allCrossDisIndex", allCrossDidIndex);
			json.put("compareDisIndex", crossDI>allCrossDidIndex?1:0);
			data.add(json);
		}
		this.renderJson(data);
	}
	/**
	 * 公共函数
	 */
	public void getYearAndRoad(){
		String startyear=this.getPara("startyear")+"-01-01";
		String endyear=this.getPara("endyear")+"-12-31";
		String roadtype=this.getPara("roadtype");
	}
	public int rangeYear(){
		int startyear=Integer.parseInt(this.getPara("startyear"))-1;
		int endyear=Integer.parseInt(this.getPara("endyear"));
		int year=endyear-startyear;
				
		return year;
	}
	//路网t年内总运行车公里数k
	public static double totalKilometres(JSONArray jsonArray,int time){
		double total=0;
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject=JSONObject.fromObject(jsonArray.get(i));
			double ADT=jsonObject.getJSONObject("columns").getDouble("SectionAverageFlowrate");
			double L=jsonObject.getJSONObject("columns").getDouble("SectionLength");
			double k=ADT*L*365*time;
			total+=k;
		}
		return total; 
	}
	//路网统计年内平均事故率
	public static double aveAccRate(JSONArray jsonArray,int allAccNum,int time){
		double k=totalKilometres(jsonArray,time);
		double accRateA=allAccNum*Math.pow(10, 8)/k;
		return accRateA;
	}
	//每条道路的总运行公里数
	public static double oneKilometres(JSONObject jb,int time){
		double ADT=jb.getJSONObject("columns").getDouble("SectionAverageFlowrate");
		double L=jb.getJSONObject("columns").getDouble("SectionLength");
		double k=ADT*L*365*time;
		return k;
	}
	//每条道路的事故率
	public static double oneAccRate(JSONObject jb,int time){
		//JSONObject jb=JSONObject.fromObject(jb);
		double k=oneKilometres(jb,time);
		int accNum=jb.getJSONObject("columns").getInt("accNum");
		return accNum*Math.pow(10, 8)/k;
		
	}
	//每条道路的临界事故率
	public static double[] criticalAccRate(double aveAccRate,double k){
		//double accRateA=aveAccRate(jb,accNum,time);
		double[] limit=new double[2];
		double temp=Math.pow(10, -8);
		double upperLimit=aveAccRate+1.96*Math.sqrt(aveAccRate/k/temp)+1/2/k/temp;
		double downLimit=aveAccRate-1.96*Math.sqrt(aveAccRate/k/temp)-1/2/k/temp;
		limit[0]=upperLimit;
		limit[1]=downLimit;
		return limit;

	}
	//事故安全度分类 
	public static String securityClass(double oneAccRate,double upper,double down){
		if(oneAccRate>upper){
			return "危险路段";
		}else if(oneAccRate<down){
			return "安全路段";
		}else{
			return "正常路段";
		}
	}
	//每条道路的平均鉴别指数
	public static double aveDisIndex(JSONObject jb,int time){
		double ADT=jb.getJSONObject("columns").getDouble("SectionAverageFlowrate");
		double L=jb.getJSONObject("columns").getDouble("SectionLength");
		int accNum=jb.getJSONObject("columns").getInt("accNum");
		double k=ADT*L*365*time;
		double avedisIndex=accNum*Math.pow(10, 6)/k;
		return avedisIndex;
	}
	//每个路段事故地点的实际鉴别指数
	public static double sectionDisIndex(JSONObject jb,int time){
		double ADT=jb.getJSONObject("columns").getDouble("aveFlow");
		double L=jb.getJSONObject("columns").getDouble("length");
		int accNum=jb.getJSONObject("columns").getInt("accNumSection");
		double k=ADT*L*365*time;
		double sectiondisIndex=accNum*Math.pow(10, 6)/k;
		return sectiondisIndex;
	}
	/**
	 * 计算n个路口的总车道数P和事故总数
	 * @param jsonArray
	 * @return
	 */
	public static int[] totalLaneNumAccNum(JSONArray jsonArray){
		int[] total=new int[2];
		int totalLaneNum=0;//总车道数
		int totalAccCross=0;//总事故数
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject=JSONObject.fromObject(jsonArray.get(i));
			int u=jsonObject.getJSONObject("columns").getInt("accNumCross");
			int p=jsonObject.getJSONObject("columns").getInt("laneNum");
			totalAccCross+=u;
			totalLaneNum+=p;	
		}
		total[0]=totalLaneNum;
		total[1]=totalAccCross;
		return total;
	}
	/**
	 * 	计算n个路口的平均交通流量ADT
	 */
	public static double aveFlowCross(JSONArray jsonArray){
		//int totalAccCross=0;
		int totalLaneNum=0;
		double totalCrossADT=0;
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject=JSONObject.fromObject(jsonArray.get(i));
			//int u=jsonObject.getJSONObject("columns").getInt("accNumCross");
			int p=jsonObject.getJSONObject("columns").getInt("laneNum");
			double crossADT=jsonObject.getJSONObject("columns").getInt("aveFlow");
			//totalAccCross+=u;
			totalLaneNum+=p;
			totalCrossADT+=crossADT*p;
		}
		return totalCrossADT/totalLaneNum;
	}
	/**
	 * 所有路口和每个路口的平均鉴别指数
	 */
	public static double crossDidIndex(int accNum,int laneNum,double ADT,int time){
		return accNum*Math.pow(10, 6)/(365*ADT*time*laneNum);
	}
}
