package com.accident.util;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.accident.model.AccImage;

public class MyUtil 
{
	private static final String NEWEST_IMAGE_PATH="E:\\images\\newestImage";
	
	public static List<AccImage> getNewestImage()
	{
		List<AccImage> list=new ArrayList<AccImage>();
		AccImage image;
		
		File dictory=new File(NEWEST_IMAGE_PATH);
		File[] files= dictory.listFiles();
		
		for(File file:files)
		{
			String fileName=file.getName();
			String accCode=StringUtils.split(StringUtils.substring(fileName, 0, StringUtils.lastIndexOf(fileName, ".")), "_")[2];
			image=new AccImage();
			image.setAccCode(accCode);
			image.setImageName(fileName);
			list.add(image);
		}
		
		return list;
	}
}
