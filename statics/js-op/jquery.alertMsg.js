/**
 * jQuery alertMsg Plugin
 * @version 0.1
 * @author gaojp(gaojianping@cmss.chinamobile.com)
 */
(function($) {
	jQuery.alertMsg = function() {
		var AlertMsg = function() {
			this.msg = $('<div class="alert"><a class="close"  href="javascript:void(0)" >×</a><p id="msg"></p></div>');
			this.msg.children(".close").on("click",function(){
				  $(this).parent().remove();
			});
			$(".messages").css("z-index","10086");
			
			this.setMsg = function(msgStr){
				if(msgStr==null || msgStr == undefined || msgStr == ""){
					  return ;
				}
				this.msg.find("#msg").empty().append(msgStr);
			};
			this.successMsg = function(msgStr){
				this.msg.removeClass("alert-error").addClass("alert-success");
				this.msg.children("#load").remove();
				this.setMsg(msgStr);
				this.delay(3500);
			};
			this.failMsg = function(msgStr){
				this.msg.removeClass("alert-success").addClass("alert-error");
				this.msg.children("#load").remove();
				this.setMsg(msgStr);
				this.delay(5500);
			};
			this.resetMsg = function(resultMsg){
				 if(resultMsg.resultCode == "1"){
					  this.successMsg(resultMsg.msg);
				  }else{
					  this.failMsg(resultMsg.msg);
				  }
			};
			this.close = function(){
				this.msg.children(".close").click();
			};
			this.delay = function(interval){
				this.msg.delay(interval).hide(500,function(){
					$(this).remove();
				 });
			};
			this.erro = function(msgStr) {
				this.msg.removeClass("alert-success").addClass("alert-error");
				this.setMsg(msgStr);
				this.msg.appendTo($(".messages"));
				this.delay(5500);
				return this;
			};
			this.infoWait = function(msgStr){
				var load = '<div class="spinner" id="load"> <div class="double-bounce1"></div> <div class="double-bounce2"></div> </div>';
				this.msg.children(".close").after(load);
				this.msg.addClass("alert-success");
				  this.setMsg(msgStr);
				  this.msg.appendTo($(".messages"));
				  $(".messages").css("z-index","10086");
				  return this;
			}
			this.info = function(msgStr,holder) {
				  //var load = '<div class="spinner"> <div class="double-bounce1"></div> <div class="double-bounce2"></div> </div>';
				  this.msg.removeClass("alert-error").addClass("alert-success");
				  this.setMsg(msgStr);
				  this.msg.appendTo($(".messages"));
				  $(".messages").css("z-index","10086");
				  if(holder == undefined){
					  this.delay(3500);
				 }else{
					 var timeout = 2000;
					 timer = $.timer(timeout, function() {
						 var result = holder();
						 if(result.resultCode=="1"){
							 this.msg.removeClass("alert-error").addClass("alert-success");
						 }else{
							 this.msg.removeClass("alert-success").addClass("alert-error");
						 }
						 this.msg.find("#msg").html(result.msg);
						 if(result.end==true){
							 timer.stop();
							 this.delay(3500);
						 }
					 });
				 }
				  return this;
			};
			this.display = function(resultMsg) {
				  if(resultMsg.resultCode == "1"){
					  this.info(resultMsg.msg);
				  }else{
					  this.erro(resultMsg.msg);
				  }
				  return this;
			}
		};
		return new AlertMsg();
	};
})(jQuery);
