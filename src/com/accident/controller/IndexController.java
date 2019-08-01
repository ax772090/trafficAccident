package com.accident.controller;

import java.util.List;

import com.accident.dataservice.DataService;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

public class IndexController extends Controller {
	
	public void index(){
		render("index.html");
	}
	
	public void getInfoBasic()
	{
		List<Record> records= Db.find("SELECT * from info_basic ORDER BY HappenTime DESC");
		this.renderJson(records);
	}
	
	
	public void query()
	{
		DataService dataService=DataService.getInstance();
		dataService.query();
	}
}
