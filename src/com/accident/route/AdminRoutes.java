package com.accident.route;

import com.accident.controller.IndexController;
import com.jfinal.config.Routes;

public class AdminRoutes extends Routes {

	
	@Override
	public void config() {
		this.add("/",IndexController.class);

	}

}
