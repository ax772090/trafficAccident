package com.accident.controller;

import java.util.List;

import com.accident.model.AccImage;
import com.accident.util.MyUtil;
import com.jfinal.core.Controller;

public class ImageController extends Controller 
{
	/**
	 * 获取最新的交通事故图片
	 */
	public void getNewestImage()
	{
		List<AccImage> images= MyUtil.getNewestImage();
		this.renderJson(images);
	}
}
