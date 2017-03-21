/*解析 ConextPath*/
function getContextPath() {
    var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0,index+1);
    
    var protocol = window.location.protocol ;
    if( protocol == "file:" ){
    	result = pathName.split("cloudmaster-css-framework")[0]+"cloudmaster-css-framework" ;//直接浏览器查看文件路径
    	return window.location.protocol+"//"+result;
    }
    return result ;
}

window.Config = window.Config || {
	contextPath:getContextPath(),
	serverPath:window.location.protocol+"//"+window.location.host+getContextPath()
} ;

window.Config.contextPath = window.Config.serverPath ;// 用于解决ie下跨域问题

window.Global = window.Global || window.Config ;


/*******************************************
 @description 打开窗口
 @example
    打开窗口            ： jQuery.open( url , width , height , params ,callback ) ;
    在打开窗口中获取参数 ： var args        = jQuery.dialogAraguments() ;
    获取打开窗口中返回值 ： var returnValue = jQuery.dialogReturnValue() ;
 ******************************************/
if( !jQuery.fn.dialogClose ){
	jQuery.fn.dialogClose = function(){
		window.close() ;
	}
}

jQuery.open = function(){//url,width,height,params,callback,fixParams
	var url , width , height , params , callback , fixParams ;//6
	var args = arguments ;
	var argsLength = args.length ;
	for(var i=argsLength+1 ;i<7;i++){
		args[i-1] = null ;
	}
	url = args[0] ;
	$(args).each(function(index,arg){
		if(index == 0 )return ;
		if( jQuery.isFunction( arg )  ){
			callback = arg ;
		}else if( typeof arg == 'string' || typeof arg == 'number' ){
			if(!width) width = arg ;
			else if(!height) height = arg ;
			else params = arg ;
		}else if(arg === null || arg === "" ){
			//none
		}else if(typeof arg == "object"){
			params = arg ;
		}
	}) ;
	
	url = jQuery.utils.parseUrl(url||"") ;
	
	jQuery.dialogReturnValue("__init__");
	params = params||{} ;
	fixParams = fixParams||{} ;
	if( $.dialog  && (params.showType == 'dialog' || !params.showType ) ){
		var opts = {
			width:width,
			height:height,
			title:params.title||params.Title||fixParams.title||'',
			url:url,
			data:params,
			onload:function(){
				var me = this ;
				if(params.iframe===false || params.iframe === "false"){
					setTimeout(function(){
						//控件初始化
						me.frwDom.uiwidget() ;
						//浏览器兼容
						me.frwDom.browserFix() ;
					},5 ) ;
				}
			},close:function(){
				callback && callback.call(this) ;
			}
		}
		
		opts = $.extend({},opts,params,fixParams) ;
		var _dialog = jQuery.dialog(opts) ;
		return _dialog ;
		
	}else if(!$.browser.msie || params.showType == 'open'){
		
		var win = openCenterWindow(url, width, height);
		window._dialogArguments = params ;
		
		var _callbak = function(){
			if( $.unblock ){$.unblock() ; }
			callback(window);
		}
		try{
			if( jQuery.browser.msie ){
				win.attachEvent("onunload", _callbak );
			}else{
				win.onbeforeunload = _callbak ;
			}
		}catch(e){
			
		}
		return win ;
	} else if( $.browser.msie ){
		_returnValue = showCenterModalDialog(url , width ,height ,params) ;
		jQuery.dialogReturnValue(_returnValue||"") ;
		callback() ;
	}
}

jQuery.dialogAraguments = function(){
	//showmodeldialog
	var args = window.dialogArguments||window.$_dialogArguments ;
	if( args ) return args ;
	var target =  window.opener || window.parent ;
	return target._dialogArguments||target.$_dialogArguments ;
}

jQuery.dialogReturnValue = function(returnValue){
	if(typeof returnValue != 'undefined'){
		if( returnValue == "__init__" || !returnValue   ){
			window.returnValue = null ;
			return ;
		}

		//window.winReturnValue = returnValue ;
		window.returnValue = returnValue ;//showModelDialog

		try{
			if( window.opener.location.href != window.location.href ){ //open
				//fix crossdomain
				try{ window.opener.returnValue = returnValue }catch(e){} ;
			}
		}catch (e){
		}

		if(window.location.href != window.top.location.href ){//no iframe
			//dialog iframe
			$(document.body).dialogReturnValue && $(document.body).dialogReturnValue(returnValue) ;
		}
		
		//dialog iframe
		if( $(".ui-dialog-wrapper:last")[0]){
			$(".ui-dialog-wrapper:last").find("div:first").dialogReturnValue(returnValue) ;
		}
	}else{
		return window.returnValue ;
	}
}

function showCenterModalDialog(URL,dlgWidth,dlgHeight,arg){
    var dlgLeft = (window.screen.width-dlgWidth)/2;
    var dlgTop  = (window.screen.height-dlgHeight)/2;
    var widthTmp = dlgWidth ;
    var form    = "scroll:no;status:no;dialogHeight:" + dlgHeight + "px;dialogWidth:" + widthTmp + "px;dialogLeft:" + dlgLeft + ";dialogTop:" + dlgTop;
    return window.showModalDialog(URL,arg,form);
}

function openCenterWindow(URL,wndWidth,wndHeight){
	var wndLeft = (window.screen.width-wndWidth)/2;
	var wndTop  = (window.screen.height-wndHeight)/2;
	var form    = "width=" + wndWidth + ",height=" + wndHeight + ",left=" + wndLeft + ",top=" + wndTop + ",resizable=yes";
	 return window.open(URL,'',form);        
}

/*******************************************
 @description 转化form表单元素为JSON对象（也可以为div）
 @example
    var json = $(formSelector).toJson() ;
 ******************************************/
jQuery.fn.toJson = function(beforeExtend,afterExtend,params) {
	var me = jQuery(this) ;
	beforeExtend = beforeExtend||{} ;
	afterExtend = afterExtend||{} ;
	params = params||{} ;
	var a = {};
	
	/*var json = {};
	jQuery.map(me.find(":input").serializeArray(), function(n, i) {
		json[n['name']] = n['value'];
	});
	return json;*/
	
	//text hidden password
	me.find("input[type=text],input[type=hidden],input[type=password]").each( function(){
		_add(this.name||this.id,this.value) ;
	} ) ;
	me.find("textarea").each( function(){
		_add(this.name||this.id,this.value) ;
	} ) ;
	
	//radio
	me.find("input[type=radio]").filter(":checked").each( function(){
		_add(this.name||this.id,this.value) ;
	} ) ;
	
	//checkbox
	var temp_cb = "" ;
	me.find("input[type=checkbox]").filter(":checked").each( function(){
		if (temp_cb.indexOf(this.name ) == -1) {
			temp_cb += (this.name) + ",";
		}
	} ) ;
	jQuery( temp_cb.split(",") ).each( function(){
		var tempValue = [] ;
		jQuery("input[name='" + this + "']:checked").each(function(i) {
			tempValue.push( this.value ) ;
		});
		_add(this ,tempValue.join(",")) ;
	} ) ;
	
	//select
	me.find('select').each( function(){
		var multi = $(this).attr('multiple')  ;
		var val = [] ;
		jQuery(this).find('option:selected').each(function(){
			if(this.value)val.push( this.value ) ;
		});
		
		if( val.length == 0 ){
			val.push(this.value||"") ;
		}
		
		if(multi && params.mulSelectSplit ){
			_add(this.name||this.id,"'"+val.join("','")+"'") ;
		}else{
			_add(this.name||this.id,val.join(',')) ;
		}
	} ) ;
	
	return $.extend(beforeExtend , a , afterExtend) ;
	
	function _add(key,value){
		if(key == "__ValidatorRules") return ;
		
		if(!key || !jQuery.trim(key)) return ;
		
		value = value||'' ;
		a[key] = value ;
	}
}


/********************************
 *************jQuery.utils*******
 *********************************/
jQuery.utils = {
	//解析URL
	parseUrl: function (url,params) {
        params = params || {};
        url = jQuery.trim(url);
        if (url.startWith("~")) {
            url = url.substring(1);
            url = Config.contextPath + url;
        }

        //url = url.replace("~",Config.contextPath) ;
        url = url.replace("{host}", getHost());
        url = url.replace("{port}", getPort());
        
        for (var o in params) {
            url = url.replace("{" + o + "}", params[o]);
        }

        if (new RegExp("^(http|https)://").test(url)) {
            var urlObject = parseUrlInternal(url);
            if ((urlObject.host + ":" + urlObject.port == window.location.host) || urlObject.host == window.location.host) {
                url = url.replace(new RegExp("^(http|https)://[^/]+/"), window.location.protocol + "//" + window.location.host + "/");
            }
        }

		return url ;
		
		function getHost(){
			var host = window.location.host ;
			return host.split(":")[0] ;
		}
		
		function getPort(){
			return window.location.port ;
		}
		
		 function parseUrlInternal(url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {},
         seg = a.search.replace(/^\?/, '').split('&'),
         len = seg.length, i = 0, s;
                    for (; i < len; i++) {
                        if (!seg[i]) { continue; }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1')
            };
        }
	},
	scrollContent:function(header,content,footer){
		$(document.body).attr("scroll","no").css("overflow","hidden");
		
		var header 	= content||".header" ;
		var footbtn = footbtn||".footbtn" ;
		var content = content||".content" ;
		
		var h = header===false?0:$(header).outerHeight() ;
		var f = footer===false?0:$(footbtn).outerHeight() ;
		
		var contentHeight =  $(document.body).height() -  h - f - 5;
		
		if($.browser.msie){
			$(content).width($(document.body).width()-5) ;
		}
		
		$(content).height(contentHeight).css({'overflow-x':'hidden','overflow-y':'auto'}) ;
	},scriptPath:function(scriptName){
		var _scriptRoot = window.defaultScriptRoot||"~/statics/scripts" ;
		var _themeRoot  = window.defaultThemeRoot||"~/statics/themes" ;
		var _defaultTheme = window.defaultTheme||"mobile" ;
		
		if(scriptName == "plugin"||scriptName == "plugins") return jQuery.utils.parseUrl(_scriptRoot+"/plugins/") ;
		if(scriptName == "upload") return jQuery.utils.parseUrl(_scriptRoot+"/plugins/") ;
		if( scriptName == 'jqueryui.css' ) return  jQuery.utils.parseUrl(_themeRoot+"/"+_defaultTheme+"/jquery-ui.css") ;
		var path = "" ;
		$("script,link").each(function(){
			if(path) return ;
			var src = this.src||this.href ;
			if(src &&  src.toLowerCase().indexOf(scriptName.toLowerCase())!=-1 ){
				path = src.substring(0, src.toLowerCase().indexOf(scriptName.toLowerCase()));
				var A = path.lastIndexOf("/");
				if (A > 0)
					path = path.substring(0, A + 1);
				return ;
			}
		}) ;
		return path ;
	}
};
