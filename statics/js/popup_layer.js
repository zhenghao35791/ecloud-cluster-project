Function.prototype.binding = function() {
	if (arguments.length < 2 && typeof arguments[0] == "undefined") return this;
	var __method = this,
		args = jQuery.makeArray(arguments),
		object = args.shift();
	return function() {
		return __method.apply(object, args.concat(jQuery.makeArray(arguments)));
	}
}

var Class = function(subclass) {
	subclass.setOptions = function(options) {
		this.options = jQuery.extend({}, this.options, options);
		for (var key in options) {
			if (/^on[A-Z][A-Za-z]*$/.test(key)) {
				$(this).bind(key, options[key]);
			}
		}
	}
	var fn = function() {
		if (subclass._init && typeof subclass._init == 'function') {
			this._init.apply(this, arguments);
		}
	}
	if (typeof subclass == 'object') {
		fn.prototype = subclass;
	}
	return fn;
}

var PopupLayer = new Class({
	options: {
		trigger: null, //触发的元素或id,必填参数
		popupBlk: null,
		popwidth: null,
		popheight: null, //弹出内容层元素或id,必填参数
		closeBtn: ".modal-close", //关闭弹出层的元素或id
		popupLayerClass: "popupLayer", //弹出层容器的class名称
		eventType: "click", //触发事件的类型
		offsets: { //弹出层容器位置的调整值
			x: 0,
			y: -41
		},
		useFx: true, //是否使用特效
		useOverlay: true, //是否使用全局遮罩
		isresize: true, //是否绑定window对象的resize事件
		dodrag: function() {}, //draggable
		center: function() {}, //always in middle
		onBeforeStart: function() {return true;}, //自定义事件
		removeMode : true
	},
	_init: function(options) {
		this.setOptions(options); //载入设置
		if (this.options.popwidth == null) {
			this.options.popwidth = 600 + "px";
			this.options.popheight = 500 + "px";
		}
		this.isSetPosition = this.isDoPopup = this.isOverlay = true; //定义一些开关
		this.popupLayer = $(document.createElement("div")).addClass(this.options.popupLayerClass); //初始化最外层容器
		this.popupLayer.width = this.options.popwidth;
		this.popupLayer.height = this.options.popheight;
		this.trigger = $(this.options.trigger); //把触发元素封装成实例的一个属性，方便使用及理解
		this.popupBlk = $(this.options.popupBlk); //把弹出内容层元素封装成实例的一个属性
		this.closeBtn = $(this.options.closeBtn); //把关闭按钮素封装成实例的一个属性		
		this._construct() //通过弹出内容层，构造弹出层，即为其添加外层容器及底层iframe
		this.trigger.bind(this.options.eventType, function() { //给触发元素绑定触发事件
			if(!this.options.onBeforeStart()) return;      //执行自定义事件
			if (this.isSetPosition) {
				this.setPosition(this.trigger.offset().left + this.options.offsets.x, this.trigger.offset().top + this.trigger.get(0).offsetHeight + this.options.offsets.y);
			}
			this.options.useOverlay ? this._loadOverlay() : null; //如果使用遮罩则加载遮罩元素
			(this.isOverlay && this.options.useOverlay) ? this.overlay.show(): null;
			if (this.isDoPopup && (this.popupLayer.css("display") == "none")) {
				this.options.useFx ? this.doEffects("open") : this.popupLayer.show();
			}
		}.binding(this));
	 this.isresize?$(window).bind("resize",this.doresize.binding(this)):null;
	  if(this.options.closeBtn){  //设定所有close按钮的关闭功能
            var _this=this;
            $(this.options.closeBtn).click(function(){
                _this.close();
                });
         } else {
                    return null;
         }   
	},
	_construct: function() { //构造弹出层
		this.popupBlk.show();
		this.popupLayer.append(this.popupBlk.css({
			opacity: 1
		})).appendTo($(document.body)).css({
			position: "absolute",
			'z-index': 3000,
			width: this.options.popwidth,
			height: this.options.popheight
		});
		this.popupLayer.hide();
		this.center(this.popupLayer);
		this.dodrag(this.popupLayer); //执行拖拽事件

	},
	remove:function(){
		this.close();
		this.popupLayer.remove();
		if(this.overlay==undefined){
            this.popupLayer.remove(); 
        }else{
            if(this.overlay.size()){
                this.overlay.remove();  
            }  
        }
	},
	/**
	 * add by gaojp for rebuild the popup layer on the fly 
	 * @param options
	 */
	rebuild:function(options){
		this.setOptions(options); //载入设置
		this.popupLayer.width = this.options.popwidth;
		this.popupLayer.height = this.options.popheight;
		this.trigger = $(this.options.trigger); //把触发元素封装成实例的一个属性，方便使用及理解
		this.popupBlk = $(this.options.popupBlk); //把弹出内容层元素封装成实例的一个属性
		this.closeBtn = $(this.options.closeBtn); //把关闭按钮素封装成实例的一个属性
		this.isSetPosition = this.isDoPopup = this.isOverlay = true; //定义一些开关
		this._construct() //通过弹出内容层，构造弹出层，即为其添加外层容器及底层iframe
		this.options.useOverlay ? this._loadOverlay() : null; //如果使用遮罩则加载遮罩元素
		if (this.isSetPosition) {
			this.setPosition(this.trigger.offset().left + this.options.offsets.x, this.trigger.offset().top + this.trigger.get(0).offsetHeight + this.options.offsets.y);
		}
		this.options.useOverlay ? this._loadOverlay() : null; //如果使用遮罩则加载遮罩元素
		(this.isOverlay && this.options.useOverlay) ? this.overlay.show(): null;
		if (this.isDoPopup && (this.popupLayer.css("display") == "none")) {
			this.options.useFx ? this.doEffects("open") : this.popupLayer.show();
		}
		this.isresize?$(window).bind("resize",this.doresize.binding(this)):null;		
    if(this.options.closeBtn){  //设定所有close按钮的关闭功能
        var _this=this;
        $(this.options.closeBtn).click(function(){
            _this.remove();
          })
    }else{
        return null;
    }	      
        return this;
	},
	_loadOverlay: function() { //加载遮罩
		pageWidth = ($.support == "6.0") ? $(document).width() - 21 : $(document).width();
		this.overlay ? this.overlay.remove() : null;
		this.overlay = $(document.createElement("div"));
		this.overlay.addClass('overlay');
		this.overlay.css({
			position: "absolute",
			"z-index": 2000,
			left: 0,
			top: 0,
			zoom: 1,
			display: "none",
			width: pageWidth,
			height: '100%'
		}).appendTo($(document.body)).append("<div style='position:absolute;z-index:2001;width:100%;height:100%;left:0;top:0;opacity:0.9;filter:Alpha(opacity=30);background: linear-gradient(rgba(11, 11, 11, 0.3) 0, rgba(11, 11, 11, 0.9) 100%);'></div>")
	},
	doresize: function() {
		if (this.isSetPosition) {
			this.setPosition(this.trigger.offset().left + this.options.offsets.x, this.trigger.offset().top + this.trigger.get(0).offsetHeight + this.options.offsets.y);
		}
	},
	setPosition: function(left, top) { //通过传入的参数值改变弹出层的位置
		this.popupLayer.css({
			left: left,
			top: top
		});
	},
	doEffects: function(way) { //make actions
		var minusHeight = document.documentElement.clientHeight - parseInt(this.popupLayer.height);
		if (way == "open") {
			if (this.options.popwidth != null) {//length and width of dialog
				this.popupLayer.width = this.options.popwidth;
				this.popupLayer.height = this.options.popheight;
			} else { //default length and width
				this.popupLayer.width = 300 + "px";
				this.popupLayer.height = 400 + "px";
			}
			this.popupLayer.show().css({'left':($(document).width() - parseInt(this.popupLayer.width)) / 2,'top':'50px'});//wy修改
		} else {
		        this.popupLayer.remove();
		        if(this.overlay==undefined){
		            this.popupLayer.remove(); 
		        }else{
		            if(this.overlay.size()){
		                this.overlay.remove();  
		            }  
		        }  
		}
	},
	/*recalculatePopupIframe:function(){     //重绘popupIframe
		this.popupIframe.css({position:"absolute",'z-index':-1,left:0,top:0,opacity:0,width:this.popupBlk.get(0).offsetWidth,height:this.popupBlk.get(0).offsetHeight});
	},*/
	close: function() { //关闭方法
	    if(this.overlay==undefined){
	        this.popupLayer.hide(); 
	    }else{
	        if(this.overlay.size()){
	            this.overlay.hide();  
	        }  
	    }  

		this.options.removeMode ? (this.options.useFx ? this.doEffects("close") : this.popupLayer.hide()) : this.popupLayer.hide();
	    
/*		this.options.useOverlay ? $(".overlay").hide() : null;
		this.options.useFx ? this.doEffects("close") : this.popupLayer.hide();*/
	},
	dodrag: function(currentPopupLayer) {
		var _move = false; //移动标记  
		var _x, _y; //鼠标离控件左上角的相对位置  
		currentPopupLayer.find(".drag").click(function() {}).mousedown(function(e) {
			_move = true;
			_x = e.pageX - parseInt(currentPopupLayer.css("left"));
			_y = e.pageY - parseInt(currentPopupLayer.css("top"));
		});
		$(document).mousemove(function(e) {
			if (_move) {
				var x = e.pageX - _x; //移动时根据鼠标位置计算控件左上角的绝对位置  
				var y = e.pageY - _y;
				//only drag in window size
				if (0 < x && x < (window.innerWidth - parseInt(currentPopupLayer.width))) {
					x = e.pageX - _x;
				
				} else if (x < 0) {
					x = 0;
				} 
//				else {
//					x = window.innerWidth-parseInt(currentPopupLayer.width);//wy修改
//				}
				if (0 < y && y < (window.innerHeight - parseInt(currentPopupLayer.height))) {
					y = e.pageY - _y;
				} else if (y < 0) {
					y = 0;
				}
//				else {
//					y = window.innerHeight- parseInt(currentPopupLayer.height);//wy修改
//				}

				currentPopupLayer.css({
					top: y,
					left: x
				}); //控件新位置  
			 window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); 
			}
		}).mouseup(function() {
			_move = false;
		});
		
	},
	center: function(currentPopupLayer) {
		//浏览器窗口大小改变时
		$(window).resize(function() {
			newPosition();
		});
		//浏览器有滚动条时的操作、
		$(window).scroll(function() {
			screenWidth = $(window).width();
			screenHeight = $(window).height();
			scrolltop = $(document).scrollTop();

			x = (screenWidth - parseInt(currentPopupLayer.width)) / 2;
			y = (screenHeight - parseInt(currentPopupLayer.height)) / 2 + scrolltop;

			//only drag in window size

			if (0 < y) {
				y = (screenHeight - parseInt(currentPopupLayer.height)) / 2 + scrolltop;
			} else if (y < 0) {
				y = 0;
			}
			
			currentPopupLayer.css({
				left: x + 'px',
				top: y + 'px'
			});
			$(".overlay").css({
				width: '100%',
				height:'100%'
			});
		});

		function newPosition() {
			screenWidth = $(window).width();
			screenHeight = $(window).height();
			scrolltop = $(document).scrollTop();

			x = (screenWidth - parseInt(currentPopupLayer.width)) / 2;
			y = (screenHeight - parseInt(currentPopupLayer.height)) / 2 + scrolltop;

			//only drag in window size
			if (0 < x && x < (window.innerWidth - parseInt(currentPopupLayer.width))) {
				x = (screenWidth - parseInt(currentPopupLayer.width)) / 2;
			} else if (x < 0) {
				x = 0;
			} else {
				x = window.innerWidth - parseInt(currentPopupLayer.width);
			}
			if (0 < y && y < (window.innerHeight - parseInt(currentPopupLayer.height))) {
				y = (screenHeight - parseInt(currentPopupLayer.height)) / 2 + scrolltop;
			} else if (y < 0) {
				y = 0;
			} else {
				y = window.innerHeight - parseInt(currentPopupLayer.height);
			}

			currentPopupLayer.css({
				left: x + 'px',
				top: y + 'px'
			});
			$(".overlay").css({
				width: '100%',
				height:'100%'
			});
		}

	}

});