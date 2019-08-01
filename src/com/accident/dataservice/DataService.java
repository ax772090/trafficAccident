package com.accident.dataservice;

import java.io.IOException;
import java.io.Reader;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class DataService 
{
	private static DataService dataService=null;
	private static SqlSessionFactory sessionFactory=null;
	
	
	private DataService()
	{
		String resource = "mybatis-config.xml";
        Reader reader;
		try 
		{
			reader = Resources.getResourceAsReader(resource);
			SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
	        sessionFactory = builder.build(reader);
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}
	}
	
	public static synchronized DataService getInstance()
	{
		if(dataService==null)
		{
			dataService=new DataService();
		}
		return dataService;
	}
	
	public List query()
	{
		SqlSession session = sessionFactory.openSession();
		List<Object> result= session.selectList("getInfoBasic", "B0012");
		session.close();
		return result;
		/**
         * 映射sql的标识字符串，
         * com.accident.sql.sqlMapper是sqlMapper.xml文件中mapper标签的namespace属性的值，
         * getInfoBasic是select标签的id属性值，通过select标签的id属性值就可以找到要执行的SQL
         */
		//String infobasic="com.accident.sql.sqlMapper.getInfoBasic";
		 //使用SqlSession执行完SQL之后需要关闭SqlSession
		//session.close();
        //return session.selectMap(infobasic, null);
	}
	
	public int insert(Map paramMap)
	{
		SqlSession session = sessionFactory.openSession();
		int value= session.insert("insertInfoBasic", paramMap);//第一个参数为sqlMapper.xml里边的ID值，第二个为传过来的值
		session.commit();
		session.close();
		return value;
	}
}
