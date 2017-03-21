//自动执行的代码
window.onload = getConfig();
//删除select的所有option
function delAllItems_all(select_id)
{
	var child=document.getElementById(select_id);
	for(var i=child.options.length-1; i>=0; i--)
{child.remove(i);}
}

//获取数据库版本
function Get_datastore_versions(){
	  $.ajax({
	  	url: "com.cmss.rds.backup.backup",
	  	type: "get",
	 	dataType: "json",
	  	data: {"flag":"GetDatastoreVersions",
	  		   "datastore_name":$("#rds_DBtype").find("option:selected").text()},
	      success: function (returndata) {
	    	  delAllItems_all("rds_DBversion");//删除下拉框的option
	    	  var datastoreVersions=returndata.datastoreVersions;
	    	  if($.parseJSON(datastoreVersions).versions.length==0){
		    		var objOption = document.createElement("OPTION");
		            objOption.text= "暂无数据库实例类型"; 
		            objOption.value="0";
		            objOption.select=true;
		            document.getElementById("rds_DBversion").options.add(objOption);
		    	}
		    	else{
		    		$.each($.parseJSON(datastoreVersions).versions, function (i, item) {
						var objOption = document.createElement("OPTION");
			            objOption.text= item.name; 
			            objOption.value=item.name;
			            objOption.select=true;
			            document.getElementById("rds_DBversion").options.add(objOption);
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
	    	delAllItems_all("rds_DBtype");//删除下拉框的option
	    	var datastoreList=returndata.datastoreList;
	    	if($.parseJSON(datastoreList).datastores==null||$.parseJSON(datastoreList).datastores.length==0){
	    		var objOption = document.createElement("OPTION");
	            objOption.text= "暂无数据库"; 
	            objOption.value="0";
	            objOption.select=true;
	            document.getElementById("rds_DBtype").options.add(objOption);
	            var objOption = document.createElement("OPTION");
	            objOption.text= "暂无数据库实例类型"; 
	            objOption.value="0";
	            objOption.select=true;
	            document.getElementById("rds_DBversion").options.add(objOption);
	    	}
	    	else{
	    		$.each($.parseJSON(datastoreList).datastores, function (i, item) {
					var objOption = document.createElement("OPTION");
		            objOption.text= item.name; 
		            objOption.value=item.id;
		            objOption.select=true;
		            document.getElementById("rds_DBtype").options.add(objOption);
	    		});
	    	    Get_datastore_versions();
	    	}
	      }
	 })
};
//展示参数组
function getConfig(){
    $.ajax({
        url: "com.cmss.rds.config.createConfig",
        type: "get",
        dataType: "json",
        data: {
        },
        success: function (returndata) {
            var original = returndata.configs;
            $_content = $("#rds-content-4-body");
            Config_pagination($.parseJSON( original ).configurations.length);
            console.log($.parseJSON( original ).configurations.length);
             console.log(original);          
            // console.log(original.configurations);
            // console.log($.parseJSON( original ));           
            // console.log($.parseJSON( original ).configurations);
            $.each($.parseJSON( original ).configurations, function (i, item) {
                var new_instance="<div class='config-instance config-border' style='' id="+item.id+" title="+item.name+"><input type='checkbox' class='instance-box' name='config_checkbox_name'/> <a href='rdsConfigDisplay.html?"+item.id+"' class='instance-id'><p id='double-width'>"+item.name+"</p></a><p id='double-width'>"+item.datastore_name+""+' '+""+item.datastore_version_name+"</p><p id='double-width'>"+item.description+"</p></div>";
                $_content.append(new_instance);
            })
            //分页
            changePage();
            $(document).on('click',"#rds-content-4-body .instance-box",function(){
                if ($(this).parent().hasClass("check-selected")) {
                    $(this).parent().removeClass("check-selected");
                }
                else{
                    $(this).parent().addClass("check-selected");
                }
            })//click
        }//success 结束括号
    })//ajax结束括号
}
//删除参数组
function delete_configs(){
    var flag = true;
    var length=($("#rds-content-4-body").children().length);
    var configArray = [];
    for(i=0;i<length;i++){
        if($("#rds-content-4-body").children().eq(i).hasClass("check-selected")){
            var id = $("#rds-content-4-body").children().eq(i).attr('id');
            //append 的动态div里面有title属性是参数组名称
            var name = $("#rds-content-4-body").children().eq(i).attr('title');
            console.log("选中的参数组名称为： "+id);
            configArray.push(id);
            //!!!!!注意 现在扫出来，含着title,i0是title
            flag = false;
        }//if
    }//for
    if(flag){
        alert_redefine('delete-configs',"请选择一个参数组");
    }
    else{
        // 删除参数组的弹框
        var volumeDetach = $($("#template_confirm").html()).clone();
        volumeDetach.find(".dialog_msg").html("确认删除参数组吗？" );
        var confirm_dialog = new PopupLayer().rebuild({
            trigger: $(document.getElementById('rds-content-4-body')),
            popupBlk: volumeDetach,
            popwidth: "450px",
            popheight: "200px"
        });

        volumeDetach.find('#confirm_ok').click(function(event) {
            confirm_dialog.remove();
            $.fn.jqLoading({ height: 100, width: 240, text: "正在加载中，请耐心等待...." });
            for(i=0;i<configArray.length;i++){

                $.ajax({
                    url: "com.cmss.rds.config.deleteEdit",
                    type: "get",
                    dataType: "json",
                    data: {
                        "id":configArray[i],
                    },
                    success: function (returndata) {
                    	if(returndata.jsonString!==''){
                            alert_redefine('delete-configs',"删除失败，原因为："+returndata.jsonString);
                            $.fn.jqLoading("destroy");
                    	}
                    	else{
                            setTimeout(function(){$.fn.jqLoading("destroy");
                            window.location.href='rdsConfig.html';},1000);
                    	}
                        //alert_redefine('confirm-deleteConfig',"成功删除了id为"+configArray[i]+"的参数组");
                    }
                })//ajax
            }//for
        });
        volumeDetach.find('#confirm_cancel').click(function() {
            $.fn.jqLoading("destroy");
            confirm_dialog.remove();
        });//confirm delete click function

    }//else
}//function

//获取选择的参数组id，为比较惨数组准备
function getArray(id){
    configJson = [];
    jsonArray = [];
    $.ajax({
        url: "com.cmss.rds.config.configDisplay",
        type: "get",
        dataType: "json",
        async: false,
        data: {
            "id":id
        },
        success: function (returndata) {
            var original = returndata.jsonstring;
            $.each($.parseJSON(original), function (idx, item) {
                var name="<p>"+item.name+"</p>"
                $(".firstLine").append(name);
                var jslength=0;
                //获得values里面的数组，
                for(var js2 in item.values){
                    jslength++;
                }
                var description = item.description;

                $.each((item.values), function (i, item2) {
                    jsonArray.push(i);
                    jsonArray.push(item2);

                })
            })
            configJson="{";
            for(i=0;i<jsonArray.length;i++)
            {
                configJson +="\"" + jsonArray[i] +"\"" + ":" + jsonArray[i+1] + ",";
                i++;
            }
            configJson = configJson.substring(0,configJson.lastIndexOf(','));
            configJson += "}";
        }//success
    })//ajax
    //return configJson;
    return(configJson);
}

//创建参数组
function addConfig(){
    var label_mingcheng = $("#label_mingcheng").val();
//    var label_peizhi = $("#label_peizhi").val();
    var rds_DBtype = $("#rds_DBtype  option:selected").text();
    var rds_DBversion = $("#rds_DBversion  option:selected").text();
    var label_des = $("#label_des").val();

    $.fn.jqLoading({ height: 100, width: 240, text: "正在加载中，请耐心等待...." });
    setTimeout(function(){$.fn.jqLoading("destroy");window.location.href='rdsConfig.html';},1000);
    $.ajax({
        url: "com.cmss.rds.config.createConfig",
        type: "post",
        dataType: "json",
        data: {
            "label_mingcheng":$("#label_mingcheng").val(),//数据库引擎版本
            //"label_peizhi":$("#label_peizhi").val(),//数据库引擎版本
            "rds_DBtype":$("#rds_DBtype").val(),//数据库引擎版本
            "rds_DBversion":$("#rds_DBversion").val(),//数据库引擎版本
            "label_des":$("#label_des").val(),//数据库引擎版本
        },
        success: function (returndata) {
        	/*$.fn.jqLoading("destroy");
            $('.config-instance').remove();

        	getConfig();*/
            //Config_pagination($.parseJSON( original ).configurations.length);

        // 返回信息为：{"configuration": {"datastore_name": "mysql", "updated": "2016-01-18T10:38:27", "values": {}, "name": "test", "created": "2016-01-18T10:38:27", "datastore_version_name": "5.5", "instance_count": 0, "id": "55242728-0372-4f63-957b-17c032772624", "datastore_version_id": "02953ff5-031f-439d-8a05-503d6ab8ae5c", "description": "test6"}}
        }
    })
}

//比较参数组
function compare_configs(){
    if($(".check-selected").length==2){
        var volumeDetach = $($("#template_compare_config").html()).clone();
        var confirm_dialog = new PopupLayer().rebuild({
            trigger: $("#compare-configs"),
            popupBlk: volumeDetach,
            popwidth: "650px",
            popheight: "150px"
        });
        //volumeDetach.find(".dialog_msg").html(str);

        var id1 = $(".check-selected").eq(0).attr("id");
        var id2 = $(".check-selected").eq(1).attr("id");
        var name1 = $(".check-selected").eq(0).attr("title");
        var name2 = $(".check-selected").eq(1).attr("title");

        $.ajax({
            url: "com.cmss.rds.config.configDisplay",
            type: "post",
            dataType: "json",
            data: {
                "id1":getArray(id1),
                "id2":getArray(id2),
            },
            success: function (returndata) {
                var result=returndata.jsonstring;
                var array = new Array();
                array = result;
                array=(array.split("]"));
                volumeDetach.find(".dialog_msg .dialog_msg_table").append("<tr class='config-instance configLi' id='config_firstLine'><td id='config_image'><div class='compare_width'>"+""+"</div></td><td class='config_name'><div class='compare_width'>"+name1+"</div></td><td class='config_name'><div class='compare_width'>"+name2+"</div></td></tr>");
                for(var i=0;i<array.length-1;i++){
                    //console.log(array[i]);
                    var name = array[i].slice(1).split(",") ;
                    var tempFirst = (name[0].split("=["));
                    var tempSecond = (name[1]);
                    var new_instance="<tr class='config-instance configLi'><td class='config_name'><div class='compare_width'>"+tempFirst[0]+"</div></td><td><div class='compare_width'>"+tempFirst[1]+"</div></td><td><div class='compare_width'>"+tempSecond+"</div></td></tr>"
                    volumeDetach.find(".dialog_msg .dialog_msg_table").append(new_instance);
                }
            }//success
        })//ajax

        volumeDetach.find('#confirm_ok').click(function() {
            confirm_dialog.remove();
        })
        volumeDetach.find('#confirm_cancel').click(function() {
            confirm_dialog.remove();
        })
    }//IF
    else{
        alert_redefine('compare-configs',"请选择两个参数进行比较");
    }
}

//创建参数组调用
function create_configs(){
    var volumeDetach = $($("#template_create_config").html()).clone();
    var confirm_dialog = new PopupLayer().rebuild({
        trigger: $("#create-configs"),
        popupBlk: volumeDetach,
        popwidth: "600px",
        popheight: "150px"
    });
	Get_datastore_list();

    //调用表单验证
    validateCreateConfigForm();
    volumeDetach.find('#confirm_cancel').click(function() {
        $.fn.jqLoading("destroy");
        confirm_dialog.remove();
    });
}

//创建参数组 表单验证
function validateCreateConfigForm() {
    $(document).ready(function () {
        var	validator = $("#create_config_form").validate({
            rules: {
                label_mingcheng: {
                    required: true,
                    minlength: 3,
                    maxlength: 30
                },
               
                label_des: {
                    required: true,
                    minlength: 5,
                    maxlength: 256
                }
            },
            messages: {
                label_mingcheng: {
                    required: '请输入参数组名称',
                    minlength: '参数组名不能小于3个字符',
                    maxlength: '参数组名不能超过30个字符'
                },
              
                label_des: {
                    required: '请输入参数组描述',
                    minlength: '参数组描述不能小于5个字符',
                    maxlength: '参数组描述不能超过256个字符'
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
                addConfig();
                $(".modal-close").click();
            }
        });
    });
}

//分页1
function Config_pagination(num) {
    var itemsOnPage = 10;
    $("#Config_pagination").pagination({
        items:num,
        itemsOnPage: itemsOnPage,
        cssStyle: 'light-theme',
        onInit: changePage,
        onPageClick: changePage
    });
}

//分页2
function changePage(){
    var itemsOnPage = 10;
    var page_index = $("#Config_pagination").pagination('getCurrentPage') -1;
    $(".rds-content-1-body .config-instance").hide();
    for(var i = page_index * itemsOnPage; i < page_index * itemsOnPage + itemsOnPage; i++){
        $(".rds-content-1-body .config-instance:eq(" + i + ")").show();
    }
}

//提示框模版
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
    volumeDetach.find('#confirm_cancel').click(function(event) {
        confirm_dialog.remove();
    });
}

//全选功能
//checkbox全选函数
function selectalls()
{
    var inputs = document.getElementsByName("config_checkbox_name");
    if(document.getElementById("config_first_checkbox").checked){
        for(var i=0; i< inputs.length; i++)
        {inputs[i].checked =true;}
        $("#rds-content-4-body .instance-box").parent().addClass("check-selected");
    }else{
        for(var i=0; i< inputs.length; i++)
        {inputs[i].checked =false; }
        $("#rds-content-4-body .instance-box").parent().removeClass("check-selected");
    }
}