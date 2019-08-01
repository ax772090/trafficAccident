package com.accident.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Array;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.time.DateUtils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jfinal.core.Controller;
import com.jfinal.kit.StrKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

public class accqueryController extends Controller {
	public void index(){
		render("accquery.html");
	}
	/*服务器端分页查询*/
	public void query(){
		/*第一种方式*/
		int pageNumber=Integer.parseInt(this.getPara("pageNumber"));
		int pageSize=Integer.parseInt(this.getPara("pageSize"));
		String numRoad=this.getPara("numRoad");
		String keywords=getPara("keywords");
		
		StringBuilder sb=new StringBuilder();
		if(StrKit.notBlank(keywords)){
			sb.append(" FROM info_basic WHERE AccPlaces LIKE '%").append(keywords).append("%'").append(" ORDER BY HappenTime DESC");
					
		}else{
			sb.append(" FROM info_basic WHERE RoadName='").append(numRoad).append("'").append(" ORDER BY HappenTime DESC");
					
		}
        
		Page<Record> result=Db.paginate(pageNumber, pageSize, "SELECT IndexCode,AccCode,HappenTime,AccLon,AccLat,PersonHarm,PersonDeath,AccPlaces",sb.toString());
		
		setAttr("total", result.getTotalRow());
		setAttr("rows", result.getList());
		renderJson();
		
		
		
		/*List<Record> list=result.getList();
		int total=result.getTotalRow();
		JSONObject jsonObj=new JSONObject();
		jsonObj.put("rows", list);
		jsonObj.put("total", total);
		this.renderJson(jsonObj);*/
		/*第二种方式*/
		/*String numRoad=this.getPara("numRoad");
		List<Record> result=Db.find("SELECT RoadName,AccCode FROM info_basic WHERE RoadName=?", numRoad);
		
		int total=result.size();
		
		JSONObject jsonobj=new JSONObject();
		jsonobj.put("rows", result);
		jsonobj.put("total", total);*/
		/*String jsonstring=jsonobj.toJSONString();*/

		
	}
	//添加
	public void accAdd(){
		String param=this.getPara("param");
		JSONObject jsonObject=JSONObject.parseObject(param);
		String accCode=(String) jsonObject.get("AccCode");
		String happenTime=(String) jsonObject.get("HappenTime");
		double accLon=Double.parseDouble(jsonObject.get("AccLon").toString());
		double accLat=Double.parseDouble(jsonObject.get("AccLat").toString());
		int personHarm=Integer.parseInt(jsonObject.get("PersonHarm").toString());
		int personDeath=Integer.parseInt(jsonObject.get("PersonDeath").toString());
		String accPlaces=(String) jsonObject.get("AccPlaces");
		Record record=new Record()
		        .set("AccCode", accCode)
				.set("HappenTime", happenTime)
				.set("AccLon", accLon)
				.set("AccLat", accLat)
				.set("PersonHarm", personHarm)
				.set("PersonDeath", personDeath)
				.set("AccPlaces", accPlaces);
		Db.save("info_basic", record);
		
		
		this.renderJson("success", "添加成功");
	}
	//删除
	public void accDelete(){
		
		String param=this.getPara("param");
		JSONArray jsonArray=JSONArray.parseArray(param);
		for (int i = 0; i < jsonArray.size(); i++) {
			String accCode=(String) jsonArray.getJSONObject(i).get("AccCode");
			Db.deleteById("info_basic", "AccCode", accCode);
			
		}

		this.renderJson("success", "删除成功");
	}
	//更新
	public void accUpdate(){
			
			String param=this.getPara("param");
			JSONObject jsonObject=JSONObject.parseObject(param);
			String accCode=(String) jsonObject.get("AccCode");
			String happenTime=(String) jsonObject.get("HappenTime");
			double accLon=Double.parseDouble(jsonObject.get("AccLon").toString());
			double accLat=Double.parseDouble(jsonObject.get("AccLat").toString());
			int personHarm=Integer.parseInt(jsonObject.get("PersonHarm").toString());
			int personDeath=Integer.parseInt(jsonObject.get("PersonDeath").toString());
			String accPlaces=(String) jsonObject.get("AccPlaces");
			
			Record record=new Record();
			record=Db.findById("info_basic", "AccCode", accCode)
					.set("HappenTime", happenTime)
					.set("AccLon", accLon)
					.set("AccLat", accLat)
					.set("PersonHarm", personHarm)
					.set("PersonDeath", personDeath)
					.set("AccPlaces", accPlaces);
			Db.update("info_basic","AccCode", record);//第二个参数为主键
			this.renderJson("success", "更新成功");
			
		}
	//柱状图月查询
	public void monthHidtogram(){
		String sqlParam=null;
		String roadName=this.getPara("roadName");
		String startMonth=this.getPara("startMonth")+"-01";
		String endMonth=this.getPara("endMonth")+"-31";
		String s2=null;
		String s1=null;
		String s3=null;		
		if(roadName.equals("全部道路")){
			s1="SELECT DATE_FORMAT(HappenTime,'%m') AS HappenTime,COUNT(*) AS Num FROM info_basic AS a";
			s2=" WHERE a.HappenTime>='%s' and a.HappenTime<='%s'";
			s2= String.format(s2, startMonth,endMonth);
			s3=" GROUP BY DATE_FORMAT(HappenTime,'%m')";
		}else{
			s1="SELECT a.RoadName,DATE_FORMAT(HappenTime,'%m') AS HappenTime,COUNT(*) AS Num FROM info_basic AS a";
			s2=" WHERE a.RoadName='%s' and a.HappenTime>='%s' and a.HappenTime<='%s'";
			s2= String.format(s2,roadName, startMonth,endMonth);
			s3=" GROUP BY RoadName,DATE_FORMAT(HappenTime,'%m')";
		}
		/*String s2=" WHERE HappenTime>='%s' and HappenTime<='%s'";*/
		
		/*s2= String.format(s2, startMonth,endMonth);*/
		sqlParam=s1+s2+s3;
			//sqlParam=String.format("SELECT RoadName,DATE_FORMAT(HappenTime,'%Y-%m') AS HappenTime,COUNT(*) AS num FROM info_basic WHERE HappenTime>='%s' and HappenTime<='%s' GROUP BY RoadName,DATE_FORMAT(HappenTime,'%Y-%m')",startMonth,endMonth);
		/*}else{
			sqlParam=String.format("SELECT * FROM info_basic WHERE RoadName='%s' and HappenTime>='%s' and HappenTime<='%s' ",roadName,startMonth,endMonth);
		}*/
		List<Record> result=Db.find(sqlParam);
		this.renderJson(result);
		
		
		
	}
	
	//饼图月查询
	public void monthPie(){
		String sqlParam=null;
		String roadName=this.getPara("roadName");
		String startMonth=this.getPara("startMonth")+"-01";
		String endMonth=this.getPara("endMonth")+"-31";
		String s2=null;
		String s3=null;
		String s1=null;
		if(roadName.equals("全部道路")){
			s1="SELECT a.RoadName AS name,COUNT(*) AS y FROM info_basic AS a,sys_road_section AS b";
			s2=" WHERE a.HappenTime>='%s' and a.HappenTime<='%s' and a.RoadName=b.SectionName ";
			s2= String.format(s2, startMonth,endMonth);
			s3=" GROUP BY RoadName";
		}else{
			s1="SELECT DATE_FORMAT(HappenTime, '%Y-%m') AS name,COUNT(*) AS y FROM info_basic AS a,sys_road_section AS b";
			s2=" WHERE a.RoadName='%s' and a.HappenTime>='%s' and a.HappenTime<='%s' and a.RoadName=b.SectionName ";
			s2= String.format(s2,roadName, startMonth,endMonth);
			s3=" GROUP BY RoadName,DATE_FORMAT(HappenTime,'%Y-%m')";

		}
		sqlParam=s1+s2+s3;
		List<Record> result=Db.find(sqlParam);
		this.renderJson(result);
	}
	//折线图月查询
	public void monthDiagram(){
		String sqlParam=null;
		String roadName=this.getPara("roadName");
		String startMonth=this.getPara("startMonth")+"-01";
		String endMonth=this.getPara("endMonth")+"-31";
		String s2=null;
		String s1=null;
		String s3=null;
		if(roadName.equals("全部道路")){
			s1="SELECT a.RoadName,DATE_FORMAT(HappenTime,'%Y-%m') AS HappenTime,COUNT(*) AS Num FROM info_basic AS a,sys_road_section AS b";
			s2=" WHERE HappenTime>='%s' and HappenTime<='%s' and a.RoadName=b.SectionName AND a.RoadName!='其他道路' ";
			s2= String.format(s2, startMonth,endMonth);
			s3=" GROUP BY RoadName,DATE_FORMAT(HappenTime,'%Y-%m') ORDER BY DATE_FORMAT(HappenTime,'%Y-%m')";
		}else{
			s1="SELECT a.RoadName,DATE_FORMAT(HappenTime,'%Y-%m') AS HappenTime,COUNT(*) AS Num FROM info_basic AS a,sys_road_section AS b";
			s2=" WHERE a.RoadName='%s' and a.HappenTime>='%s' and a.HappenTime<='%s' and a.RoadName=b.SectionName ";
			s2= String.format(s2,roadName, startMonth,endMonth);
			s3=" GROUP BY RoadName,DATE_FORMAT(HappenTime,'%Y-%m') ORDER BY DATE_FORMAT(HappenTime,'%Y-%m')";
		}
		
		sqlParam=s1+s2+s3;
		List<Record> result=Db.find(sqlParam);
		this.renderJson(result);
	}
	
	/*统计图最近30天*/
	public void queryAnalysis(){
		/*String roadName=this.getPara("roadName");
		String nowDate=this.getPara("nowDate");
		String monthAgo=this.getPara("monthAgo");
		String sqlParam= String.format("SELECT * FROM info_basic WHERE RoadName='%s' and HappenTime>='%s' and HappenTime<='%s' ",roadName,monthAgo,nowDate);
		List<Record> result=Db.find(sqlParam);
		this.renderJson(result);*/
		
		monthHidtogram();
	}
	/**
	 * 查询道路名称数据
	 */
	public void getSys_road_section(){
		List<Record> result=Db.find("SELECT SectionCode,SectionName,SectionAverageFlowrate,SectionLength,CrossLines FROM sys_road_section WHERE class='0'");
		this.renderJson(result);
	}
	/**
	 * 查询选择道路数据
	 *//*
	public void getChoice_road_section(){
		List<Record> result=Db.find("SELECT SectionCode,SectionName,SectionAverageFlowrate,SectionLength,CrossLines FROM sys_road_section");
		this.renderJson(result);
	}*/
}
