/*
var  domainurlgloabl=null;
function getdomain(){
	
	$.ajax({
		url : '/op-console/domain/getdomain',
		type : "GET",
		dataType : "json",
		success : function(data) {
			domainurlgloabl=data.domain;
			},
		error:function(error){
			
			$.alertMsg().erro("域名获取错误");
		}
	});
}
$(function() {
	$("#login_user").html($.cookie("bcop_uname"));
	getdomain();
});*/
