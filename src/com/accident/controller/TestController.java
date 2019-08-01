package com.accident.controller;

import java.util.List;

import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

public class TestController extends Controller {
	public void index(){
		render("test.html");
	}
	public void getTestRoadName()
	{
		Page<Record> result=Db.paginate(1, 10, "SELECT *"," FROM info_basic WHERE RoadName=?","光明路");
		this.renderJson(result);
	}
}
