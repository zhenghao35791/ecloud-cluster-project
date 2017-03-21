//登录验证

/*public--rds-tab选项卡切换js代码---开始--*/
$(function(){
    $(".rds-table-wap .rds-tab a").click(function(){
        $(this).addClass('rds-tab-active').siblings().removeClass('rds-tab-active');
        var index = $(this).index();
        number = index;
        $('.rds-table-wap .rds-content').hide();
        kk = ("rds-content-")+index;
        $('#'+kk).show();
    });
    $(".instance-action").click(function(){
        $(".instance-action-1").css("display","none");

    });
//    select 美化 开始
    $("select").selectui({
        // 设置从<option>何处获取占位字符，String或Function，默认`function() {return $(this).text();}`
        label: "value",
        // 是否自动计算宽度，设置为false时可css设置宽度
        autoWidth: true,
        // 是否启用定时检测select当前选中项，当改变时更新文本
        interval: true
    });
//    select 美化结束
    
    //刷新
    $(".backuprefresh-btn").click(
            function(){
                location.reload();
            }
    );
    /*<!-- 备份的滑动框开始 -->*/
    //movebox功能开始
    $('#rds-boxclose').click(function () {
        $('#rds-movebox').animate({'left':'2000px'}, 300);
        $('#rds-movebox').removeClass('visible').addClass('invisible');
        $(document).find('.content-backup').removeClass('check-selected');
    });
    $(document).on('click',".rds-content-3-body .content-backup .backup-id",function(){

        var id= $(this).parent().attr("id");
        //发送详细信息ajax请求
        getBackupDetail(id);
        var _this = $(this);
        $('#rds-movebox').addClass('visible');
        if(_this.parent().hasClass('check-selected')){
            //当前行再次点击box消失
            _this.parent().removeClass("check-selected");
            $('.content-backup').removeClass('check-selected');
            $("#rds-boxclose").click();
            //每次点击的时候，让tab维持在详情页
            $(".tab_vm").removeClass('rds-tab-current');
            $(".tab_vm").removeClass('tab_current');
            $("#0").addClass('rds-tab-current');
            $('.rds-contentsm').hide();
            $('#rds-contentsm-0').show();
        }else{
            //消除兄弟行的的选中状态
            $('.content-backup').removeClass('check-selected');
            //当前行选中增加状态
            _this.parent().addClass("check-selected");
            $('#rds-movebox').animate({'left':$(".db-engine").offset().left-75}, 300);
            $('#rds-movebox').removeClass('invisible').addClass('visible');
            //每次点击的时候，让tab维持在详情页
            $(".tab_vm").removeClass('rds-tab-current');
            $(".tab_vm").removeClass('tab_current');
            $("#0").addClass('rds-tab-current');
            $('.rds-contentsm').hide();
            $('#rds-contentsm-0').show();
        }
    })
        /*<!-- 备份的滑动框结束-->*/
});

//加载备份列表
$(function(){
//	$.fn.jqLoading({ height: 100, width: 240, text: "正在加载，请耐心等待...." });
//	var timer=setTimeout(function(){$.fn.jqLoading("destroy"),alert_redefine('btn-deleteall',"加载超时!");},12000);
	backup_listajax();
	//自动刷新
//	window.setInterval("backup_listajax()", "60000");
	//检测全选按钮
    checkboxOnClick();
});

//搜索框功能
function search_byinstance(){
	$.fn.jqLoading({ height: 100, width: 240, text: "正在加载，请耐心等待...." });
	var timer=setTimeout(function(){$.fn.jqLoading("destroy"),alert_redefine('btn-deleteall',"加载超时!");},12000);

	var instance_name=$("#searchstr").val();
	$.ajax({
        url: "com.cmss.rds.backup.backup",
        type: "get",
        dataType: "json",
        data: {
        	"flag":"GetBackupsbyInstance",
        	"instance_name":instance_name
        },
        success: function (returndata) {
        	console.log("为您服务我们很开心");
            $.fn.jqLoading("destroy");
            clearTimeout(timer);
            var original = returndata.backupList;
            var del_class=new Array();//存储删除备份的class
            var restore_class=new Array();//存储恢复备份的class
            $('.content-backup').remove();//清除显示 的内容
            if(original!=""&&$.parseJSON(original).backups.length!=null){
                backup_pagination($.parseJSON(original).backups.length);
                $.each($.parseJSON(original).backups, function (i, item) {
                	var flag_parent ="";
                    if(item.parent_id==null){
                    	flag_parent="否";
                    }else{
                    	flag_parent="是";
                    }
                    var instance_id=item.instance_id;
                    var created_time=timeFormTransferShort(item.created);
                    var new_backup="<div class='content-backup' style='clear:both' title_my="+item.status+" intance_id="+instance_id+" name="+item.name+" id='"+item.id+"'><input type='checkbox' id='checkbox"+i+"' name='checkboxName' class='backup-box'/><a href='javascript:void(0)' class='backup-id'><p>"+item.name+"</p></a><p class='db-engine'>"+item.status+"</p><p>"+item.datastore.type+"</p><p>"+item.datastore.version+"</p><p>"+created_time+"</p><p>"+flag_parent+"</p><p class='instance_name"+item.id+"'>"+item.instance_name+"</p><p style='width:40px' class='recoverBackup"+item.id+"'><a href='javascript:void(0)'  style='color:#2D92CA'>恢复</a></p><p class='delBackup"+item.id+"' style='width:40px'><a href='javascript:void(0)' style='color:#2D92CA'>删除</a></p></div>";
                    //原来的备份动作按钮组
//     	                <div class='btn-group'><div class='instance-action' >备份动作</div><ul class='instance-dropdown-menu'><a href='rdsRecoveryInstanceFromBackup.html?"+item.id+"'><li class='recoverBackup'>恢复备份</li></a><li class='delBackup"+item.id+"' >删除备份</li></ul></div>
//                    idGetInstanceName(instance_id,item.id,$.parseJSON( original ).backups.length,i);
    	            //append到父元素
    	            $(".rds-content-3-body").append(new_backup);
                    del_class[i]=".delBackup"+item.id;
                    restore_class[i]=".recoverBackup"+item.id;
                    //隐藏显示备份动作
	                var flag=1;
	                $('.rds-content-3-body').on('click','.btn-group .instance-action',function(){
                          if(flag==1){
                              $(this).next().addClass("showDrop");
							  flag=0;
                          }else{
                              $(this).next().removeClass("showDrop");
                              flag=1;
                          }
	                });
    	                 
                })
                //分页
    	        changePage();
                //选择框
                $(document).on('click',".rds-content-3-body .backup-box",function(){
	                  if ($(this).parent().hasClass("checkbackup-selected")) {
	                       $(this).parent().removeClass("checkbackup-selected");
	                  }
	                  else{
	                       $(this).parent().addClass("checkbackup-selected");
	                  }
           		})
           		//动态添加恢复
           		for(var j=0;j<restore_class.length;j++){
           			$(restore_class[j]).on('click',function(event){ 
           				if($(this).parent().attr("title_my")=="COMPLETED"){
               				var id = $(this).parent().attr("id");
               				recoveryBackup(id);
           				}else{
           					alert_redefine('btn-deleteall',"该备份不可用,不能用于恢复！");
           		        }
           			});
           		}
           		//动态添加删除功能
                for(var j=0;j<del_class.length;j++){
                	 $(del_class[j]).on('click',function(event){  
                		$.fn.jqLoading({ height: 100, width: 240, text: "正在处理，请耐心等待...." });
    	                setTimeout(function(){$.fn.jqLoading("destroy");location.reload();},100000);
    	                var id = $(this).parent().attr("id");
                 		var volumeDetach = $($("#template_confirm").html()).clone();
                 		var children_name=get_backup_children(id);
                 		$.fn.jqLoading("destroy");
                 		var mess="";
                 		if(children_name==""){
                 			mess="备份删除后将无法恢复，确认删除吗？";
                 		}else if(children_name.indexOf(']')>0){
                 			mess="将同时删除以下子备份："+children_name+",且删除后将无法恢复,确认删除吗？";
                 		}else{
                 			mess="备份正被占用，无法删除！原因："+children_name;
                 		}
            		    volumeDetach.find(".dialog_msg").html(mess);
            		    var confirm_dialog = new PopupLayer().rebuild({
            		    	trigger: $(document.getElementById('btn-deleteall')),
            		        popupBlk: volumeDetach,
            		        popwidth: "450px",
            		        popheight: "200px"
            		    });
            		    volumeDetach.find('#confirm_ok').click(function(event) {
            		    	confirm_dialog.remove();
            		    	if(mess.indexOf('无法恢复')>0){
            		    		$.fn.jqLoading({ height: 100, width: 240, text: "正在处理，请耐心等待...." });
    		                    setTimeout(function(){$.fn.jqLoading("destroy");location.reload();},100000);
    		                    del_backup(id);
    		                    }
            		    });
            		    volumeDetach.find('#confirm_cancel').click(function() {
//            		    	$.fn.jqLoading("destroy");
//            	            clearTimeout(timer);
            		    	confirm_dialog.remove();
            		    });
     	            });
                }
            }else{
            	console.log("1111");
            	backup_pagination(0);//分页
    	        changePage();
            }
            console.log("o(∩_∩)o");
        }
    })
}

function checkboxOnClick() {
    var a=[];
    $("input[type=checkbox]").click(function() {
        if($('.backup-box').is(':checked')) {
            $("this").css("color","red");
        }});
}

/*<!-- wy -->*/
//批量删除
function deleteall(){
	var inputs = document.getElementsByName("checkboxName");
	var flag=true;//判断有没有选择checkbox的标志位
	var j=-1;//del_id的元素编号
	var del_id=new Array();//存储待删除备份的id
	var del_name=new Array();//存储待删除备份的名称
	if(inputs.length==0){
		alert_redefine('btn-deleteall',"请先选择需要删除的备份!");
	}else{
		for(var i=0; i< inputs.length; i++)
	    {
	   		if(inputs[i].checked){
        		var id=$("#checkbox"+i).parent().attr("id");//根据checkbox的id找出备份的id
        		var name=$("#checkbox"+i).parent().attr("name");//备份的名称
        		del_id[++j]=id;
        		del_name[j]=name;
        		flag=false;
        	}else{
        		if(flag&&(i==inputs.length-1)){
        			alert_redefine('btn-deleteall',"请先选择需要删除的备份!");
        		}else{
        			continue;
        		}
        	}
	    }
	}
   	
	//判断是否有删除项，并然用户确认后，批量删除
	if(j>-1){
			var volumeDetach = $($("#template_confirm").html()).clone();
		    volumeDetach.find(".dialog_msg").html("备份删除后将无法恢复，确认删除吗？" );
		    var confirm_dialog = new PopupLayer().rebuild({
		    	trigger: $(document.getElementById('btn-deleteall')),
		        popupBlk: volumeDetach,
		        popwidth: "450px",
		        popheight: "200px"
		    });
		    volumeDetach.find('#confirm_ok').click(function(event) {
		    	confirm_dialog.remove();
		    	$.fn.jqLoading({ height: 100, width: 240, text: "正在处理，请耐心等待...." });
                setTimeout(function(){$.fn.jqLoading("destroy");location.reload();},100000);
                var backupNameStr="";var backupIdStr="";
                for(var i=0; i<=j; i++){
                	backupIdStr+=del_id[i]+",";
                	backupNameStr+=del_name[i]+",";     				
    			}	
                
                $.ajax({
        	        url: "com.cmss.rds.backup.backup",
        	        type: "get",
        	        dataType: "json",
        	        async: false,//同步处理，确保信息的返回
        	        data: {
        	        	"flag":"delAllCheckedBackups",
        	        	"backup_id":backupIdStr,
        	        	"backup_name":backupNameStr
        	        },
        	        success: function (returndata) {
        	        	$.fn.jqLoading("destroy");
        	        	var backupAlreadyDel=returndata.backupAlreadyDel;
        	        	var backupHaveChildren=returndata.backupHaveChildren;
        	        	var backupRunningName=returndata.backupRunningName;
        	        	//添加提示信息
        	        	if(backupAlreadyDel!=""&&backupAlreadyDel!=null){
        	        		backupAlreadyDel="备份"+backupAlreadyDel+"已删除!<br/>";
        	        	}else{
        	        		backupAlreadyDel="";
        	        	}
        	        	if(backupHaveChildren!=""&&backupHaveChildren!=null){
        	        		backupHaveChildren=backupHaveChildren="备份"+backupHaveChildren+"为父备份,暂不支持批量删除,请逐个进行删除!<br/>";
        	        	}else{
        	        		backupHaveChildren="";
        	        	}
        	        	if(backupRunningName!=""&&backupRunningName!=null){
        	        		backupRunningName="备份"+backupRunningName+"正被占用,无法删除!<br/>";
        	        	}else{
        	        		backupRunningName="";
        	        	}
        	        	//弹框提示
       					var volumeDetach = $($("#template_confirm").html()).clone();
                    	var mess=backupAlreadyDel+backupHaveChildren+backupRunningName;
                    	volumeDetach.find(".dialog_msg").html(mess);
               		    var confirm_dialog_2 = new PopupLayer().rebuild({
               		    	trigger: $(document.getElementById('btn-deleteall')),
               		        popupBlk: volumeDetach,
               		        popwidth: "450px",
               		        popheight: "200px"
               		    });
               		    volumeDetach.find('#confirm_ok').click(function(event) {
               		    	confirm_dialog_2.remove();
               		    	window.location.href='rdsBackup.html';//刷新界面
               		    });
               		    volumeDetach.find('#confirm_cancel').click(function() {
               		    	confirm_dialog_2.remove();
               		    	window.location.href='rdsBackup.html';//刷新界面
               		    });
        	        }
        	    });
                
		    });
		    volumeDetach.find('#confirm_cancel').click(function() {
		    	$.fn.jqLoading("destroy");
		    	confirm_dialog.remove();
		    });
	}
}
//checkbox全选函数
function selectalls() 
{
    var inputs = document.getElementsByName("checkboxName");
   	if(document.getElementById("backupfirstid").checked){
   		for(var i=0; i< inputs.length; i++)
   	    {inputs[i].checked =true;}
        $(".rds-content-3-body .backup-box").parent().addClass("check-selected");
   	}else{
   		for(var i=0; i< inputs.length; i++)
   	    {inputs[i].checked =false; }
   		$(".rds-content-3-body .backup-box").parent().removeClass("check-selected");
   	}
}
//获取备份内的子备份
function get_backup_children(backup_id){
	var children_name="";
	$.ajax({
        url: "com.cmss.rds.backup.backup",
        type: "get",
        dataType: "json",
        async: false,//同步处理，确保信息的返回
        data: {
        	"flag":"getChildBackup",
        	"backup_id":backup_id
        },
        success: function (returndata) {
        	var childrenBackup=returndata.BackupChildren;
        	if($.parseJSON(childrenBackup).backups!=null){
        		if($.parseJSON(childrenBackup).backups.length!=0){
	        		$.each($.parseJSON(childrenBackup).backups, function (i, item) {
	        			children_name=children_name+"["+item.name+"]";
		        	});
	        	}
        	}else if($.parseJSON(childrenBackup).unprocessableEntity!=null){
        		children_name="unprocessableEntity";
        	}else{
        		children_name=childrenBackup+"";
        	}
        }
	});
	return children_name;
}

// 备份列表返回
function backup_listajax(){
	console.log("欢迎来到备份页面");
	$("#rds-content-select").val("所有的备份");
	  $.ajax({
        url: "com.cmss.rds.backup.backup",
        type: "get",
        dataType: "json",
        data: {
        	"flag":"BackupList"
        },
        success: function (returndata) {
        	console.log("为您服务我们很开心");
            var original = returndata.backupList;
            var del_class=new Array();//存储删除备份的class
            var restore_class=new Array();//存储恢复备份的class
            $('.content-backup').remove();//清除显示 的内容
            if($.parseJSON(original).backups.length!=null){
                backup_pagination($.parseJSON(original).backups.length);
                $.each($.parseJSON(original).backups, function (i, item) {
                	var flag_parent ="";
                    if(item.parent_id==null){
                    	flag_parent="否";
                    }else{
                    	flag_parent="是";
                    }
                    var instance_id=item.instance_id;
                    var created_time=timeFormTransferShort(item.created);
                    var new_backup="<div class='content-backup' style='clear:both' title_my="+item.status+" intance_id="+instance_id+" name="+item.name+" id='"+item.id+"'><input type='checkbox' id='checkbox"+i+"' name='checkboxName' class='backup-box'/><a href='javascript:void(0)' class='backup-id'><p>"+item.name+"</p></a><p class='db-engine'>"+item.status+"</p><p>"+item.datastore.type+"</p><p>"+item.datastore.version+"</p><p>"+created_time+"</p><p>"+flag_parent+"</p><p class='instance_name"+item.id+"'>"+item.instance_name+"</p><p style='width:40px' class='recoverBackup"+item.id+"'><a href='javascript:void(0)'  style='color:#2D92CA'>恢复</a></p><p class='delBackup"+item.id+"' style='width:40px'><a href='javascript:void(0)' style='color:#2D92CA'>删除</a></p></div>";
                    //原来的备份动作按钮组
//     	                <div class='btn-group'><div class='instance-action' >备份动作</div><ul class='instance-dropdown-menu'><a href='rdsRecoveryInstanceFromBackup.html?"+item.id+"'><li class='recoverBackup'>恢复备份</li></a><li class='delBackup"+item.id+"' >删除备份</li></ul></div>
//                    idGetInstanceName(instance_id,item.id,$.parseJSON( original ).backups.length,i);
    	            //append到父元素
    	            $(".rds-content-3-body").append(new_backup);
                    del_class[i]=".delBackup"+item.id;
                    restore_class[i]=".recoverBackup"+item.id;
                    //隐藏显示备份动作
	                var flag=1;
	                $('.rds-content-3-body').on('click','.btn-group .instance-action',function(){
                          if(flag==1){
                              $(this).next().addClass("showDrop");
							  flag=0;
                          }else{
                              $(this).next().removeClass("showDrop");
                              flag=1;
                          }
	                });
    	                 
                })
                //分页
    	        changePage();
                //选择框
                $(document).on('click',".rds-content-3-body .backup-box",function(){
	                  if ($(this).parent().hasClass("checkbackup-selected")) {
	                       $(this).parent().removeClass("checkbackup-selected");
	                  }
	                  else{
	                       $(this).parent().addClass("checkbackup-selected");
	                  }
           		})
           		//动态添加恢复
           		for(var j=0;j<restore_class.length;j++){
           			$(restore_class[j]).on('click',function(event){ 
           				if($(this).parent().attr("title_my")=="COMPLETED"){
               				var id = $(this).parent().attr("id");
               				recoveryBackup(id);
           				}else{
           					alert_redefine('btn-deleteall',"该备份不可用,不能用于恢复！");
           		        }
           			});
           		}
           		//动态添加删除功能
                for(var j=0;j<del_class.length;j++){
                	 $(del_class[j]).on('click',function(event){  
                		$.fn.jqLoading({ height: 100, width: 240, text: "正在处理，请耐心等待...." });
    	                setTimeout(function(){$.fn.jqLoading("destroy");location.reload();},100000);
    	                var id = $(this).parent().attr("id");
                 		var volumeDetach = $($("#template_confirm").html()).clone();
                 		var children_name=get_backup_children(id);
                 		$.fn.jqLoading("destroy");
                 		var mess="";
                 		if(children_name==""){
                 			mess="备份删除后将无法恢复，确认删除吗？";
                 		}else if(children_name.indexOf(']')>0){
                 			mess="将同时删除以下子备份："+children_name+",且删除后将无法恢复,确认删除吗？";
                 		}else{
                 			mess="备份正被占用，无法删除！原因："+children_name;
                 		}
            		    volumeDetach.find(".dialog_msg").html(mess);
            		    var confirm_dialog = new PopupLayer().rebuild({
            		    	trigger: $(document.getElementById('btn-deleteall')),
            		        popupBlk: volumeDetach,
            		        popwidth: "450px",
            		        popheight: "200px"
            		    });
            		    volumeDetach.find('#confirm_ok').click(function(event) {
            		    	confirm_dialog.remove();
            		    	if(mess.indexOf('无法恢复')>0){
            		    		$.fn.jqLoading({ height: 100, width: 240, text: "正在处理，请耐心等待...." });
    		                    setTimeout(function(){$.fn.jqLoading("destroy");location.reload();},100000);
    		                    del_backup(id);
    		                    }
            		    });
            		    volumeDetach.find('#confirm_cancel').click(function() {
//            		    	$.fn.jqLoading("destroy");
//            	            clearTimeout(timer);
            		    	confirm_dialog.remove();
            		    });
     	            });
                }
            }else{
            	backup_pagination(0);
            }
            console.log("o(∩_∩)o");
//            $.fn.jqLoading("destroy");
//            clearTimeout(timer);
        }
    })
}

//删除备份
 function del_backup(backup_id){
	 $.ajax({
	        url: "com.cmss.rds.backup.backup",
	        type: "get",
	        dataType: "json",
	        data: {
	        	"flag":"delBackup",
	        	"backup_id":backup_id
	        },
	        success: function (returndata) {
	        	$.fn.jqLoading("destroy");
	        	location.reload();
	        }
    })
 }
//根据实例id获取名字
function idGetInstanceName(instance_id,backup_id,length,i){
	var instance_name="";
	$.ajax({
        url: "com.cmss.rds.backup.backup",
        type: "get",
        dataType: "json",
        data: {
        	"flag":"instanceDetail",
        	"instance_id":instance_id
        },
        success: function (returndata) {
            var original = returndata.instanceDetail;
            if($.parseJSON( original ).instance!=null){
            	instance_name=$.parseJSON( original ).instance.name;
                $(".instance_name"+backup_id).append(instance_name);
            }else{
            	$(".instance_name"+backup_id).append("已删除");
            }
            if(length==i+1){
            	$.fn.jqLoading("destroy");
            }
        }
    })
}
//转换时间格式2015-07-28T07:27:54变为2015-07-28
function timeFormTransferShort(time){
	//下一行注释部分是将转换时间格式2015-07-28T07:27:54变为2015年07月28日 07:27
// 		var Newtime=time.substring(0,time.indexOf('-'))+"年"+time.substring(time.indexOf('-')+1,time.lastIndexOf('-'))+"月"+time.substring(time.lastIndexOf('-')+1,time.indexOf('T'))+"日 "+time.substring(time.indexOf('T')+1,time.lastIndexOf(':'));
	
	var Newtime=time.substring(0,time.indexOf('T'));
	return Newtime;
}

//提示框
function alert_redefine(btn_id,str){
	var volumeDetach = $($("#template_alert").html()).clone();
    volumeDetach.find(".dialog_msg").html(str);
    var confirm_dialog = new PopupLayer().rebuild({
    	trigger: $(document.getElementById(btn_id)),
        popupBlk: volumeDetach,
        popwidth: "450px",
        popheight: "200px"
    });
    volumeDetach.find('#alert_ok').click(function(event) {
    	confirm_dialog.remove();
    });
    volumeDetach.find('#confirm_cancel').click(function() {
    	confirm_dialog.remove();
    });
}
/*<!--rds-tab选项卡切换js代码---开始-->*/
$(function(){
    $(".rds-table-wap .rds-tab a").click(function(){
        $(this).addClass('rds-tab-active').siblings().removeClass('rds-tab-active');
    });
    
	$(function(){
	    $(".rds-tabtitle .tab_vm").click(function(){
	        $(".tab_vm").removeClass('rds-tab-current');
	        $(this).addClass('rds-tab-current');
	        var index = $(this).attr("id");
	        number = index;
	        $('.rds-contentsm').hide();
	        kk = ("rds-contentsm-")+index;
	        $('#'+kk).show();
	    });
	});
  //过滤
	//分页

	function backup_pagination_unuseable(num) {
		var itemsOnPage = 10;
	    $("#backup_pagination").pagination({
	        items:num,
	        itemsOnPage: itemsOnPage,
	        cssStyle: 'light-theme',
	        onInit: changePage_unuseable,
	        onPageClick: changePage_unuseable
	    });
	};

	function changePage_unuseable(){
		var itemsOnPage = 10;
		var page_index = $("#backup_pagination").pagination('getCurrentPage') -1;
	    $(".rds-content-3-body .content-backup[title_my!='COMPLETED']").hide();
	    for(var i = page_index * itemsOnPage; i < page_index * itemsOnPage + itemsOnPage; i++){
	        $(".rds-content-3-body .content-backup[title_my!='COMPLETED']:eq(" + i + ")").show();
	    }
	}
	function backup_pagination_useable(num) {
		var itemsOnPage = 10;
	    $("#backup_pagination").pagination({
	        items:num,
	        itemsOnPage: itemsOnPage,
	        cssStyle: 'light-theme',
	        onInit: changePage_useable,
	        onPageClick: changePage_useable
	    });
	};

	function changePage_useable(){
		var itemsOnPage = 10;
		var page_index = $("#backup_pagination").pagination('getCurrentPage') -1;
	    $(".rds-content-3-body .content-backup[title_my='COMPLETED']").hide();
	    for(var i = page_index * itemsOnPage; i < page_index * itemsOnPage + itemsOnPage; i++){
	        $(".rds-content-3-body .content-backup[title_my='COMPLETED']:eq(" + i + ")").show();
	    }
	}
    $("#rds-content-select").change(
            function(){
            	var options=$("#rds-content-select option:selected");  //获取选中的项
                var textVal = options.text();
                if(textVal=="不可用的备份"){
                    backup_pagination_unuseable($(".content-backup[title_my!='COMPLETED']").length);
                    $(".content-backup[title_my='COMPLETED']").css("display","none");
                    $(".content-backup[title_my!='COMPLETED']").css("display","block");
                    changePage_unuseable();
                }
                else if(textVal=="可用的备份"){
                    backup_pagination_useable($(".content-backup[title_my='COMPLETED']").length);
                    $(".content-backup[title_my='COMPLETED']").css("display","block");
                    $(".content-backup[title_my!='COMPLETED']").css("display","none");
                    changePage_useable();
                }
                else{
                	var checks = document.getElementsByName("checkboxName")
                	backup_pagination(checks.length);
                    $(".content-backup").css("display","block");
                	changePage();
                }
            }
    );        
});
/*<!--rds-tab选项卡切换js代码---结束-->*/


/*<!--原备份详情页面--------------处理url，ajax动态数据赋值开始-->*/
//转换时间格式2015-07-28T07:27:54变为2015年07月28日 07:27
function timeFormTransfer(time){
	var Newtime=time.substring(0,time.indexOf('-'))+"年"+time.substring(time.indexOf('-')+1,time.lastIndexOf('-'))+"月"+time.substring(time.lastIndexOf('-')+1,time.indexOf('T'))+"日 "+time.substring(time.indexOf('T')+1,time.lastIndexOf(':'));
	return Newtime;
}
//显示信息
function getBackupDetail(id){
	 $.ajax({
        url: "com.cmss.rds.backup.backup",
        type: "get",
        dataType: "json",
        data: {
        	"backup_id":id,
        	"flag":"getBackupDetail",
        },
        success: function (returndata) {
        	var original = returndata.getBackupDetail;
            var item=$.parseJSON( original ).backup;
        	if(item!=null||item!=""){
        		var description="";
                if(item.description==null){
                	description="无";
                }else{
                	description=item.description;
                }
            	//备份--基本信息
            	$("#detail_name").html(item.name);
                $("#ds_name").html(item.name);
                $("#ds_description").html(description);
    			$("#ds_id").html(item.id);
    			$("#ds_storage").html(item.datastore.type);
    			$("#ds_version").html(item.datastore.version);
    			$("#ds_status").html(item.status);
    			$("#ds_address").html(item.locationRef);
    			$("#ds_size").html(item.size+"GB");
    			$("#ds_createTime").html(timeFormTransfer(item.created));
    			$("#ds_updateTime").html(timeFormTransfer(item.updated));
            	$("#ds_dbName").html(item.instance_name);
    			$("#ds_instanceId").html(item.instance_id);
    			
    			//备份--增量备份
    			var parentid=item.parent_id;
    			if(parentid==null){
    				$("#ds_parentBackup").html("无");
    			}else{
    				getParentnameFromid(item.parent_id);
    			}

    			//备份--数据库信息
    			idGetInstanceDetail(item.instance_id);
        	}else{
        		alert_redefine('btn-deleteall',"备份详情展示失败!原因："+original);
        	}
            
        }
    });
}

//查询父备份名称
function getParentnameFromid(id){
	 var name="";
	 $.ajax({
            url: "com.cmss.rds.backup.backup",
            type: "get",
            dataType: "json",
            data: {
            	"backup_id":id,
            	"flag":"getBackupDetail",
            },
            success: function (returndata) {
            	var original = returndata.getBackupDetail;
            	name=$.parseJSON( original ).backup.name;
            	$("#ds_parentBackup").html(name);
            }
	});
}
//根据实例id获取名字
function idGetInstanceDetail(instance_id){
	$.ajax({
        url: "com.cmss.rds.backup.backup",
        type: "get",
        dataType: "json",
        data: {
        	"flag":"instanceDetail",
        	"instance_id":instance_id
        },
        success: function (returndata) {
            var original = returndata.instanceDetail;
            if($.parseJSON( original ).itemNotFound!=null){
    			$("#ds_instanceStatus").html("数据库实例已被删除");
            }else if($.parseJSON( original ).instance!=null){
            	var item=$.parseJSON( original ).instance;
    			$("#ds_instanceStatus").html(item.status);
            }
        }
    })
};
/*<!--原备份详情页面--------------处理url，ajax动态数据赋值结束-->*/


/*<!--创建备份弹出框 开始-->*/
function creat_backup(){
	checkInstanceStatus();
	var volumeDetach = $($("#template_create_backup").html()).clone();
    var confirm_dialog = new PopupLayer().rebuild({
    	trigger: $(document.getElementById('btn-creat_backup')),
        popupBlk: volumeDetach,
        popwidth: "600px",
        popheight: "527px"
    });
    validateCreatContactForm();
    volumeDetach.find('#confirm_cancel').click(function() {
    	$.fn.jqLoading("destroy");
    	confirm_dialog.remove();
    });
}
/*<!--创建备份弹出框 结束-->*/

/*<!-- 创建备份表单验证 开始-->*/

function validateCreatContactForm() {
	var validator1;
	$(document).ready(function () {
	    	validator1 = $("#creatBackup_form").validate({
	        rules: {
	        	form_backup_Name: {
	                required: true,
	                EstringCheck:true,
	                minlength: 2,
	                maxlength: 16
	            }
	        },
	        messages: {
	        	form_backup_Name: {
	        		required: '请输入备份名称',
	                minlength: '名称不能小于2个字符',
	                maxlength: '名称不能超过16个字符',
	                EstringCheck:'只能包括英文字母、数字和下划线'
	            }
	        },
	
	        highlight: function(element, errorClass, validClass) {
	            $(element).addClass(errorClass).removeClass(validClass);
	            $(element).fadeOut().fadeIn();
	        },
	        unhighlight: function(element, errorClass, validClass) {
	            $(element).removeClass(errorClass).addClass(validClass);
	        },
	        errorElement:'div',

            errorPlacement: function(error, element) {
                error.addClass('tooltip tooltip-inner');
                element.after(error);
                var pos = $.extend({}, element.offset(), {
                    width: element.outerWidth()
                    , height: element.outerHeight()
                });
                error.css({display:'block',opacity:'0.8',top:-pos.height/2, left:217+pos.width/8});
            }, 
	        submitHandler: function (form) {
	        	creatNewBackup();
	        	$(".modal-close").click();
	        }
	    });
	});
}//function validateContactForm
/*<!-- 创建备份表单验证 结束 -->*/

/*<!--原创建备份提交ajax开始-->*/
//查询可用于恢复备份的实例
function checkInstanceStatus(){
    $.ajax({
        url: "com.cmss.rds.instance.instances",
        type: "get",
        dataType: "json",
        data: {
        },
        success: function (returndata) {
            var original = returndata.instances;
			var length=$.parseJSON(original).instances.length;
            if(length==0){
            	var objOption = document.createElement("OPTION");
                objOption.text= "暂未创建实例，请先创建"; 
                objOption.value="0"; 
                objOption.select=true;
                document.getElementById("rds_backup_instances").options.add(objOption);
            }else{
            	var flag=true;//标志位 判断实例是否都不可用
            	$.each($.parseJSON( original ).instances, function (i, item) {
	                if(item.status=="ACTIVE"){//实例可用则显示
	                	flag=false;
	                	var objOption = document.createElement("OPTION");
		                objOption.text= item.name; 
		                objOption.value=item.id; 
		                objOption.select=true;
		                document.getElementById("rds_backup_instances").options.add(objOption);
		                checkParentBackup();
	                }else{
	                	if(i==(length-1)&&flag){//若都不可用，则显示以下信息
	                		var objOption = document.createElement("OPTION");
			                objOption.text= "无可用实例"; 
			                objOption.value="0"; 
			                objOption.select=true;
			                document.getElementById("rds_backup_instances").options.add(objOption);
	                	}
	                }
	            })
            }
        }
    })   
};
//创建备份
function creatNewBackup(){
     //获取输入的备份名称
     var form_backup_Name = $("#form_backup_Name").val();
     //获取需备份实例的id
     var options=$("#rds_backup_instances option:selected");  //获取选中的项
     var instance_id = options.val();
     //获取父备份的id
     options=$("#rds_fatherBackup option:selected");  //获取选中的项
     var fatherBackup_id = options.val();
     //若没有父备份则id赋为空，便于java处理
     if(fatherBackup_id=="请选择备份"||fatherBackup_id=="0"){
     	fatherBackup_id="";
     }
     //获取对备份的描述
     var discription = $("#form_label_Discription").val();
   	 $.fn.jqLoading({ height: 100, width: 240, text: "正在创建，请耐心等待...." });
     setTimeout(function(){$.fn.jqLoading("destroy");location.reload();},100000);
     $.ajax({
         url: "com.cmss.rds.backup.backup",
         type: "post",
         dataType: "json",
         data: {
             //键入传送的参数
             "flag":"CreateBackup",//创建备份的标志
             "backup_Name":form_backup_Name,
             "instance_id":instance_id,
             "fatherBackup_id":fatherBackup_id,
             "discription":discription,
         },
         success: function (returndata) {
         	$.fn.jqLoading("destroy");
         	var create_state=returndata.create_state;
         	if($.parseJSON( create_state ).instanceFault!=null){
         		alert_redefine('label_Discription',"创建失败！失败信息："+$.parseJSON( create_state ).instanceFault.message+"失败代号："+$.parseJSON( create_state ).instanceFault.code);
         	}else{
         		window.location.href='rdsBackup.html';
         	}
         }
     });
};
//查询有无父备份
function checkParentBackup(){
     var options=$("#rds_backup_instances option:selected");  //获取选中的项
     var instance_id = options.val();
     delAllItems("rds_fatherBackup");//删除备份下拉框的option
     if(instance_id=="请选择实例"||instance_id=="0"){
     	var objOption = document.createElement("OPTION");
            objOption.text= "暂无相应父备份"; 
            objOption.value="0"; 
            document.getElementById("rds_fatherBackup").options.add(objOption);
     }else{
     	$.ajax({
        url: "com.cmss.rds.backup.backup",
        type: "get",
        dataType: "json",
        data: {
        	"instance_id":instance_id,
        	"flag":"CheckFatherBackup",
        },
        success: function (returndata) {
        	delAllItems("rds_fatherBackup");
        	var original = returndata.fatherBackup;
			//判断是否有父备份，有则全列出
            if($.parseJSON( original ).backups.length==0){
            	var objOption = document.createElement("OPTION");
                objOption.text= "暂无相应父备份"; 
                objOption.value="0"; 
                document.getElementById("rds_fatherBackup").options.add(objOption);
            }else{
            	$.each($.parseJSON( original ).backups, function (i, item) {
	                var objOption = document.createElement("OPTION");
	                objOption.text= item.name; 
	                objOption.value=item.id; 
	                document.getElementById("rds_fatherBackup").options.add(objOption);
	            })
            }
        	
        }
	});
   }
 };

//删除select的所有option
function delAllItems(select_id)
{
	var child=document.getElementById(select_id);
	for(var i=child.options.length-1; i>0; i--)
			{child.remove(i);}
}
//删除select的所有option
function delAllItems_all(select_id)
{
	var child=document.getElementById(select_id);
	for(var i=child.options.length-1; i>=0; i--)
			{child.remove(i);}
}
/*<!--原创建备份提交ajax结束-->*/

/*<!-- 恢复备份表单验证 开始-->*/
	
function validateContactForm(id) {
	var validator1;
	$(document).ready(function () {
	    	validator1 = $("#contact_form").validate({
	        rules: {
	        	label_gb: {
	               // required: true,
	                digits: true,
	                min: 1,
	                max: 5
	            },
	            label_shili: {
	               // required: true,
	                EstringCheck:true,
	                minlength: 2,
	                maxlength: 16
	            },
	            label_admin: {
	               // required: true,
	                EstringCheck:true,
	                root:true,
	                os_admin:true,
	                minlength: 2,
	                maxlength: 16
	            },
	            label_password: {
	               // required: true,
	                EstringCheck:true,
	                minlength: 2,
	                maxlength: 8
	            },
	            label_check: {
	                equalTo: "#label_password"
	            },
	            label_url:{
	            	url:true
	            },
	            label_DBname:{
	            	// required: true,
	            	 EstringCheckAddComma:true,
	                 minlength: 2,
	                 maxlength: 16
	            }
	        },
	        messages: {
	        	label_gb: {
	                required: '请输入数据库实例容量',
	                digits:'必须输入1-5之间正整数',
	                min: '不能小于1GB',
	                max: '不能超过5GB',
	            },
	            label_shili: {
	                required: '请输入数据库实例名称',
	                EstringCheck:'只能包括英文字母、数字和下划线',
	                minlength: '实例名称不能小于2个字符',
	                maxlength: '实例名称不能超过16个字符'
	            },
	            label_admin: {
	                required: '请输入管理员名称',
	                EstringCheck:'只能包括英文字母、数字和下划线',
	                minlength: '管理员名称不能小于2个字符',
	                maxlength: '管理员名称不能超过16个字符'
	            },
	            label_password: {
	                required: '请输入管理员密码',
	                EstringCheck:'只能包括英文字母、数字和下划线',
	                minlength: '管理员密码不能小于2个字符',
	                maxlength: '管理员密码不能超过8个字符'
	            },
	            label_check: {
	                equalTo: "两次输入密码不一致"
	            },
	            label_url:{
	            	url:'必须符合url格式'
	            },
	            label_DBname:{
	            	 required: '请输入数据库名称',
	                 minlength: '数据库名称不能小于2个字符',
	                 maxlength: '数据库名称不能超过16个字符'
	            }
	
	        },
	
	        highlight: function(element, errorClass, validClass) {
	            $(element).addClass(errorClass).removeClass(validClass);
	            $(element).fadeOut().fadeIn();
	        },
	        unhighlight: function(element, errorClass, validClass) {
	            $(element).removeClass(errorClass).addClass(validClass);
	        },
	        errorElement:'div',

            errorPlacement: function(error, element) {
                error.addClass('tooltip tooltip-inner');
                element.after(error);
                var pos = $.extend({}, element.offset(), {
                    width: element.outerWidth()
                    , height: element.outerHeight()
                });
                error.css({display:'block',opacity:'0.8',top:-pos.height/2, left:217+pos.width/8});
            },
	        submitHandler: function (form) {
	        	recovery_backup_to_instance(id);
	        	$(".modal-close").click();
	        }
	    });
	});
}//function validateContactForm

//恢复备份ajax
function recovery_backup_to_instance(id){
  $.fn.jqLoading({ height: 100, width: 240, text: "正在加载中，请耐心等待...." });
  setTimeout(function(){$.fn.jqLoading("destroy");},100000); 
  var class_name=".instance_name"+id;
  var instance_name="";
  var instance_id=$(class_name).parent().attr("intance_id");
  var rds_flavourID="";
  var label_gb="";
  $.ajax({
      url: "com.cmss.rds.backup.backup",
      type: "get",
      dataType: "json",
      data: {
      	"flag":"instanceDetail",
      	"instance_id":instance_id
      },
      success: function (returndata) {
          var original = returndata.instanceDetail;
          if($.parseJSON( original ).instance!=null){
          	instance_name=$.parseJSON( original ).instance.name;
          	rds_flavourID=$.parseJSON( original ).instance.flavor.id;
          	label_gb=$.parseJSON( original ).instance.volume.size;
          	$.ajax({
          	  	url: "com.cmss.rds.backup.backup",
          	  	type: "post",
          	 	dataType: "json",
          	  	data: {
          	      	"flag":"RecoveryInstanceFromBackup",
          	      	"Backup_id":id,
          	        "rds_engine_ver":$("#rds_engine_ver").val(),//数据库引擎版本
//          	        "rds_flavourID":$("#rds_flavourID").val(),//数据库实例类型
//          	        "label_gb":$("#label_gb").val(),//存储容量
//          	        "label_shili":$("#label_shili").val(),//实例
          	        "label_admin":$("#label_admin").val(),//管理员
          	        "label_password":$("#label_password").val(),//密码
          	        "label_check":$("#label_check").val(),//确认密码
          	        "label_url":$("#label_url").val(),//外部链接
          	        "rds_safeGroup":$("#rds_safeGroup").val(),//安全组
          	        "label_DBname":$("#label_DBname").val(),//数据库名称
          	        
          	        "rds_flavourID":rds_flavourID,
          	        "label_shili":instance_name,
          	        "label_gb":label_gb,
          	        
          	        "rds-parameter":$("#rds-parameter").val(),//参数组
          	        "Net_id":$("#rds_networks").val()//网络参数
          	  	},
          	      success: function (returndata) {
          	    	var backup_rec=returndata.RecoveryInstanceFromBackup_state;
          	    	console.log("backup_rec:"+backup_rec);
          	    	$.fn.jqLoading("destroy");
          			if($.parseJSON(backup_rec).forbidden!=null){
          		    	alert_redefine('btn-deleteall',"恢复备份失败!<br/>失败信息:"+$.parseJSON(backup_rec).forbidden.message);
          		    }else if($.parseJSON(backup_rec).instance!=null){
          		      	window.location.href='rdsInstance.html';
          		    } else if($.parseJSON(backup_rec).unauthorized!=null){
          		    	alert_redefine('btn-deleteall',"恢复备份认证失败!<br/>失败信息:"+$.parseJSON(backup_rec).unauthorized.message);
          		    }else{
          		    	alert_redefine('btn-deleteall',"恢复备份失败!原因："+backup_rec);
          		    }
          	      }
          	    })
          }
      }
  })
  
  
  
};
/*<!-- 恢复备份表单验证 结束 -->*/
	
//恢复备份
function recoveryBackup(id){
	//弹框提示
    var class_name=".instance_name"+id;
    var instance_name=$(class_name).text();
	var volumeDetach = $($("#template_confirm").html()).clone();
	volumeDetach.find(".dialog_msg").html("备份恢复将覆盖原有实例："+instance_name+",且操作不可恢复，确认恢复吗？");
	    var confirm_dialog_2 = new PopupLayer().rebuild({
	    	trigger: $(document.getElementById('btn-deleteall')),
	        popupBlk: volumeDetach,
	        popwidth: "450px",
	        popheight: "200px"
	    });
	    volumeDetach.find('#confirm_ok').click(function(event) {
	    	confirm_dialog_2.remove();
	    	recovery_backup_to_instance(id);
	    });
	    volumeDetach.find('#confirm_cancel').click(function() {
	    	confirm_dialog_2.remove();
	    	
	    });
	
	
//	var volumeDetach = $($("#template_recoveryBackup").html()).clone();
//    var confirm_dialog = new PopupLayer().rebuild({
//    	trigger: $(document.getElementById('btn-creat_backup')),
//        popupBlk: volumeDetach,
//        popwidth: "600px",
//        popheight: "527px"
//    });
//    Get_flavor_id();
//    //Get_datastore_list();
//    //Get_networks_list();
    //调用表单验证
//    validateContactForm(id);
//    volumeDetach.find('#confirm_cancel').click(function() {
//    	$.fn.jqLoading("destroy");
//    	confirm_dialog.remove();
//    });
}

//分页

function backup_pagination(num) {
	var itemsOnPage = 10;
    $("#backup_pagination").pagination({
        items:num,
        itemsOnPage: itemsOnPage,
        cssStyle: 'light-theme',
        onInit: changePage,
        onPageClick: changePage
    });
};

function changePage(){
	var itemsOnPage = 10;
	var page_index = $("#backup_pagination").pagination('getCurrentPage') -1;
    $(".rds-content-3-body .content-backup").hide();
    for(var i = page_index * itemsOnPage; i < page_index * itemsOnPage + itemsOnPage; i++){
        $(".rds-content-3-body .content-backup:eq(" + i + ")").show();
    }
}

//获取flavor-id
function Get_flavor_id(){
	  $.ajax({
	  	url: "com.cmss.rds.backup.backup",
	  	type: "get",
	 	dataType: "json",
	  	data: {"flag":"GetFlavorId"},
	      success: function (returndata) {
	    	delAllItems_all("rds_flavourID");//删除下拉框的option
	    	var flavorId=returndata.flavorId;
	    	if($.parseJSON(flavorId).flavors.length==0){
	    		var objOption = document.createElement("OPTION");
	            objOption.text= "暂无数据库实例类型"; 
	            objOption.value="0";
	            objOption.select=true;
	            document.getElementById("rds_flavourID").options.add(objOption);
	    	}
	    	else{
	    		$.each($.parseJSON(flavorId).flavors, function (i, item) {
					var objOption = document.createElement("OPTION");
		            objOption.text= item.name+"(ram:"+item.ram/512*200+"MB,disk:"+item.disk+"GB)"; 
		            objOption.value=item.id;
		            objOption.select=true;
		            document.getElementById("rds_flavourID").options.add(objOption);
	    		});
	    	}
	      }
	 })
};

//获取数据库版本
function Get_datastore_versions(){
	  $.ajax({
	  	url: "com.cmss.rds.backup.backup",
	  	type: "get",
	 	dataType: "json",
	  	data: {"flag":"GetDatastoreVersions",
	  		   "datastore_name":$("#rds_engine").find("option:selected").text()},
	      success: function (returndata) {
	    	  delAllItems_all("rds_engine_ver");//删除下拉框的option
	    	  var datastoreVersions=returndata.datastoreVersions;
	    	  if($.parseJSON(datastoreVersions).versions.length==0){
		    		var objOption = document.createElement("OPTION");
		            objOption.text= "暂无数据库实例类型"; 
		            objOption.value="0";
		            objOption.select=true;
		            document.getElementById("rds_engine_ver").options.add(objOption);
		    	}
		    	else{
		    		$.each($.parseJSON(datastoreVersions).versions, function (i, item) {
						var objOption = document.createElement("OPTION");
			            objOption.text= item.name; 
			            objOption.value=item.name;
			            objOption.select=true;
			            document.getElementById("rds_engine_ver").options.add(objOption);
		    		});
		    	}
	      }
	 })
};

//获取datastoreList
function Get_datastore_list(){
	  $.ajax({
	  	url: "com.cmss.rds.backup.backup",
	  	type: "get",
	 	dataType: "json",
	  	data: {"flag":"GetDatastoreList"},
	      success: function (returndata) {
	    	delAllItems_all("rds_engine");//删除下拉框的option
	    	var datastoreList=returndata.datastoreList;
	    	if($.parseJSON(datastoreList).datastores==null||$.parseJSON(datastoreList).datastores.length==0){
	    		var objOption = document.createElement("OPTION");
	            objOption.text= "暂无数据库"; 
	            objOption.value="0";
	            objOption.select=true;
	            document.getElementById("rds_engine").options.add(objOption);
	            var objOption = document.createElement("OPTION");
	            objOption.text= "暂无数据库实例类型"; 
	            objOption.value="0";
	            objOption.select=true;
	            document.getElementById("rds_engine_ver").options.add(objOption);
	    	}
	    	else{
	    		$.each($.parseJSON(datastoreList).datastores, function (i, item) {
					var objOption = document.createElement("OPTION");
		            objOption.text= item.name; 
		            objOption.value=item.id;
		            objOption.select=true;
		            document.getElementById("rds_engine").options.add(objOption);
	    		});
	    	    Get_datastore_versions();
	    	}
	      }
	 })
};
//获取网络
function Get_networks_list(){
	  $.ajax({
	  	url: "com.cmss.rds.backup.backup",
	  	type: "get",
	 	dataType: "json",
	  	data: {"flag":"GetNetworks"},
	      success: function (returndata) {
	    	delAllItems_all("rds_networks");//删除下拉框的option
	    	var networksList=returndata.networksList;
	    	if($.parseJSON(networksList).networks.length==0){
	    		var objOption = document.createElement("OPTION");
	            objOption.text= "暂无可用网络"; 
	            objOption.value="0";
	            objOption.select=true;
	            document.getElementById("rds_networks").options.add(objOption);
	    	}
	    	else{
	    		$.each($.parseJSON(networksList).networks, function (i, item) {
					var objOption = document.createElement("OPTION");
		            objOption.text= item.name; 
		            objOption.value=item.id;
		            objOption.select=true;
		            document.getElementById("rds_networks").options.add(objOption);
	    		});
	    	}
	      }
	 })
};
//获取网络参数详情
function Get_subnets(subnets_id){
	  $.ajax({
	  	url: "com.cmss.rds.backup.backup",
	  	type: "get",
	 	dataType: "json",
	  	data: {"flag":"GetSubnets",
	  			"subnets_id":subnets_id},
	      success: function (returndata) {
	    	  var result=returndata.subnets;
	    	  var cidr=$.parseJSON(result).subnet.cidr;
	      }
	 })
};