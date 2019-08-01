package com.accident.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.accident.dataservice.DataService;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

public class addInformationController extends Controller {
	DataService dataService=DataService.getInstance();
	
	public void index(){
		render("addinformation.html");
	}
	/**
	 * 添加数据
	 */
	public void insertInfoBasic() {
		String param=this.getPara("param");
		JSONObject jo= JSON.parseObject(param);
		Map paramMap=new HashMap();
		for(String key:jo.keySet())
		{
			paramMap.put(key, jo.get(key));
		}
		dataService.insert(paramMap);
		this.renderText("hello world");
	}
	/**
	 * 查询行政区划数据
	 */
	public void getSys_xzqh(){
		List<Record> result=Db.find("SELECT QhCode,QhName FROM sys_xzqh");
		this.renderJson(result);
	}
	/**
	 * 查询选择道路数据
	 */
	public void getSys_road_section(){
		List<Record> result=Db.find("SELECT SectionCode,SectionName,SectionAverageFlowrate,SectionLength,CrossLines FROM sys_road_section WHERE class='0'");
		this.renderJson(result);
	}
	/**
	 * 查询路段路口数据
	 */
	public void getSys_section_cross(){
		String roadName=this.getPara("roadName");
		String crossSecClassCode=this.getPara("crossSecClassCode");
		
		String sqlGetSectionCross="SELECT b.name AS sectionCrossName FROM sys_road_section AS a,sys_section_cross AS b WHERE a.SectionCode=b.roadCode AND a.SectionName='%s' AND b.type='%s'";
		String sql=String.format(sqlGetSectionCross, roadName,crossSecClassCode);
		List<Record> result=Db.find(sql);
		this.renderJson(result);
	}
	/**
	 * 查询事故分类数据
	 */
	public void getAcc_class(){
		List<Record> result=Db.find("SELECT ClassCode,ClassName FROM acc_class");
		this.renderJson(result);
	}
	/**
	 * 查询事故主要原因
	 */
	public void getAcc_cause(){
		List<Record> result=Db.find("SELECT CauseCode,CauseName FROM acc_cause");
		this.renderJson(result);
	}
	/**
	 * 查询天气分类数据
	 */
	public void getAcc_weather(){
		List<Record> result=Db.find("SELECT WeatherCode,WeatherName FROM acc_weather");
		this.renderJson(result);
	}
	/**
	 * 查询天气分类数据
	 */
	public void getAcc_form(){
		List<Record> result=Db.find("SELECT FormCode,FormName FROM acc_form");
		this.renderJson(result);
	}
	/**
	 * 查询事故现场数据
	 */
	public void getAcc_locale(){
		List<Record> result=Db.find("SELECT LocaleCode,LocaleName FROM acc_locale");
		this.renderJson(result);
	}
	/**
	 * 查询地形情况数据
	 */
	public void getAcc_land(){
		List<Record> result=Db.find("SELECT LandCode,LandName FROM acc_land");
		this.renderJson(result);
	}
	/**
	 * 查询路面情况数据
	 */
	public void getAcc_surface(){
		List<Record> result=Db.find("SELECT SurfaceCode,SurfaceName FROM acc_surface");
		this.renderJson(result);
	}
	/**
	 * 查询路面类型数据
	 */
	public void getAcc_sur_class(){
		List<Record> result=Db.find("SELECT SurClassCode,SurClassName FROM acc_sur_class");
		this.renderJson(result);
	}
	/**
	 * 查询道路横断面数据
	 */
	public void getAcc_transect(){
		List<Record> result=Db.find("SELECT TransectCode,TransectName FROM acc_transect");
		this.renderJson(result);
	}
	/**
	 * 查询道路线形数据
	 */
	public void getAcc_linear(){
		List<Record> result=Db.find("SELECT LinearCode,LinearName FROM acc_linear");
		this.renderJson(result);
	}
	/**
	 * 查询道路类型数据
	 */
	public void getAcc_load_class(){
		List<Record> result=Db.find("SELECT LoadClassCode,LoadClassName FROM acc_load_class");
		this.renderJson(result);
	}
	/**
	 * 查询交通控制方式数据
	 */
	public void getAcc_contral(){
		List<Record> result=Db.find("SELECT ContralCode,ContralName FROM acc_contral");
		this.renderJson(result);
	}
	/**
	 * 查询照明条件数据
	 */
	public void getAcc_light(){
		List<Record> result=Db.find("SELECT LightCode,LightName FROM acc_light");
		this.renderJson(result);
	}
	/**
	 * 查询路段所有的事故地点
	 */
	public void getAcc_places(){
		String sectionCrossName=this.getPara("sectionCrossName");
		String sqlSectionCrossName="SELECT AccPlaces FROM info_basic WHERE SectionCrossName='%s' group by AccPlaces";
		String sql=String.format(sqlSectionCrossName,sectionCrossName);
		List<Record> result=Db.find(sql);
		this.renderJson(result);
		
	}
}
