
(function($){
	//格式化字符串函数(数组长度超过10会有问题，数组长度超过10采用字面量的形式)
	$.extend({
		format : function(source,args){
			var result = source;
			if(typeof(args) == "object"){
				if(args.length==undefined){
					for (var key in args) {
						if(args[key]!=undefined){
							var reg = new RegExp("({" + key + "})", "g");
							result = result.replace(reg, args[key]);
						}
						else
						{
							var reg = new RegExp("({" + key + "})", "g");
							result = result.replace(reg, " ");
						}
					}
				}else{
					for (var i = 0; i < args.length; i++) {
						if (args[i] != undefined) {
							var reg = new RegExp("({[" + i + "]})", "g");
							result = result.replace(reg, args[i]);
						}
						else
						{
							var reg = new RegExp("({[" + i + "]})", "g");
							result = result.replace(reg, " ");
						}
					}
				}
			}
			return result;
		}
	}),
	//为jquery扩展一个getUrlParam方法
	$.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);

/**
* Ajax post 不带参数
 * url
 * funcSucc
 * funcError
 */
/*function _ajaxpost(url,funcSucc,funcError){
	$.ajax({
		type:"post",
		url:url,
		dataType:"json",
		success:funcSucc,
		error:funcError,
		beforeSend:function(){
			NProgress.start();
		},
		complete:function(){
			NProgress.done();
		}
	});
}*/
/**
 * Ajax post 带参数
 * url
 * data
 * funcSucc
 * funcError
 */
function _ajaxPost(url,param,funcSucc,funcError){
	$.ajax({
		type:"post",
		url:url,
		data:param,
		success:funcSucc,
		error:funcError/*,
		beforeSend:function(){
			NProgress.start();
		}*//*,
		complete:function(){
			NProgress.done();
		}*/
	});
}
/**
 * Ajax post 跨域请求
 * url
 * funcSucc
 * funcError
 */
/*function _ajaxPost(url,data,funcSucc,funcError){
	$.ajax({
		type:"post",
		url:url,
		dataType:"JSONNP",
		success:function(data){
			funcSucc(data);
		},
		error:function(){
			NProgress.done();
			funcError();
		},
		beforeSend:function(){
			NProgress.start();
		},
		complete:function(){
			NProgress.done();
		},
	});
}
*/
