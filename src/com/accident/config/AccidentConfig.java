package com.accident.config;

import com.accident.controller.ImageController;
import com.accident.controller.IndexController;
import com.accident.controller.OnMapController;
import com.accident.controller.TestController;
import com.accident.controller.accqueryController;
import com.accident.controller.addInformationController;
import com.accident.controller.networkAnalysisController;
import com.accident.model._MappingKit;
import com.accident.route.AdminRoutes;
import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.core.JFinal;
import com.jfinal.ext.handler.FakeStaticHandler;
import com.jfinal.kit.PropKit;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.c3p0.C3p0Plugin;

public class AccidentConfig extends JFinalConfig {

	/**
	 * 配置常量
	 */
	@Override
	public void configConstant(Constants me) {
		// 1、加载少量必要配置，随后可用PropKit.get(...)获取值
		PropKit.use("a_little_config.txt");
		//2、设置开发模式
		me.setDevMode(PropKit.getBoolean("devMode", false));
	}

	/**
	 * 配置处理器
	 */
	@Override
	public void configHandler(Handlers me) {
		//这里是自定义配置启用伪静态，即地址后面必须含有.html
		//me.add(new FakeStaticHandler());

	}

	/**
	 * 配置全局拦截器
	 */
	@Override
	public void configInterceptor(Interceptors me) {
		// TODO Auto-generated method stub
	}

	/**
	 * 配置插件
	 */
	@Override
	public void configPlugin(Plugins me) {
		// 配置C3p0数据库连接池插件
		C3p0Plugin C3p0Plugin = createC3p0Plugin();
		me.add(C3p0Plugin);
		
		// 配置ActiveRecord插件
		ActiveRecordPlugin arp = new ActiveRecordPlugin(C3p0Plugin);
		me.add(arp);
		
		// 所有配置在 MappingKit 中搞定
		_MappingKit.mapping(arp);

	}

	public static C3p0Plugin createC3p0Plugin() {
		return new C3p0Plugin(PropKit.get("jdbcUrl"), PropKit.get("user"), PropKit.get("password").trim());
	}


	/**
	 * 配置路由
	 */
	@Override
	public void configRoute(Routes me) {
		//me.add("/", IndexController.class);// 第三个参数为该Controller的视图存放路径
		me.add(new AdminRoutes());//适合大项目这样配置
		//自定义viewpath
		me.add("/test",TestController.class,"/pages/test");
		me.add("/addinformation", addInformationController.class);
		me.add("/accquery",accqueryController.class);
		me.add("/networkanalysis",networkAnalysisController.class);
		me.add("/image",ImageController.class);
		me.add("/onmap",OnMapController.class);
	}

	/**
	 * 建议使用 JFinal 手册推荐的方式启动项目
	 * 运行此 main 方法可以启动项目，此main方法可以放置在任意的Class类定义中，不一定要放于此
	 */
	public static void main(String[] args) {
		JFinal.start("WebRoot",80,"/",5);
	}

}
