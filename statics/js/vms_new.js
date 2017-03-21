function getData(url, data, postType, callback_fail) {
    var defer = $.Deferred();
    if (!postType) {
        postType = "GET";
    }
    $.ajax({
        url: url,
        type: postType,
        async: true,
        data: data,
        success: function(data) {
            if (data.error) {
                console.log("data.error, url: " + url);
                console.log(data.message);
            } else if(data.no_data){
				console.log("no data, url: " + url);
				defer.reject();
			} else {
                defer.resolve(data);
            }
        },
        error: function(data) {
            console.log(data.status);
            console.log(data.responseText);
            console.log("error, " + url);
            if(callback_fail == undefined){
            	/*$.alertMsg().erro("系统错误!");*/
            }else{
            	callback_fail();
            }
        }
    });
    return defer.promise();
}

function nullable(data) {
    if (!data && typeof(data) != "undefined") {
        return "";
    } else {
        return data;
    }
}

function toDate(timeStamp) {
    var date = new Date();
    date.setTime(timeStamp);
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + (date.getHours()) + ":" + (date.getMinutes()) + ":" + (date.getSeconds());
}

function createVm() {
    /*$.when(getData("/op-console/vm/create",{"vmName":"gaojp_vm","templateId":"09a5d85605a411e59bbb6c92bf046950","pwd":"12345678",
		"count":"1"},"POST")).done(function(vmData){
		console.log(vmData);
	});*/
    window.open(domainurlgloabl+"product/buy/vm");
}

function getVmState(state) {
    var detail_state = "";
    if (state == 1) {
        detail_state = '<ins id="vmStatusIns" class="stop"></ins><span> 创建中</span>';
    } else if (state == 2) {
        detail_state = '<ins id="vmStatusIns" class="stop"></ins><span>运行中 </span>';
    } else if (state == 3) {
        detail_state = '<ins id="vmStatusIns" class="stop"></ins><span> 已删除 </span>';
    } else if (state == 4) {
        detail_state = '<ins id="vmStatusIns" class="end"></ins><span> 已停止 </span>';
    } else if (state == 5) {
        detail_state = '<ins id="vmStatusIns" class="stop"></ins><span> 暂停中 </span>';
    } else if (state == 6) {
        detail_state = '<ins id="vmStatusIns" class="stop"></ins><span> 已暂停 </span>';
    } else if (state == 7) {
        detail_state = '<ins id="vmStatusIns" class="stop"></ins><span> 备份中 </span>';
    } else if (state == 8) {
        detail_state = '<ins id="vmStatusIns" class="restore"></ins><span> 恢复中 </span>';
    } else if (state == 9) {
        detail_state = '<ins id="vmStatusIns" class="stop"></ins><span> 操作失败 </span>';
    } else if (state == 999) {
        detail_state = '<ins id="vmStatusIns" class="stop"></ins><span> 初始状态 </span>';
    }
    return detail_state;
}

function getNovncUrl(obj) {
    var vmId = $(obj).attr("vmId");
    $.when(getData("/op-console/vm/novnc", {
        "vmId": vmId
    })).done(function(data) {
        var url = data.novnc_url;
        window.open(url);
    })
}

function getVmState_list(state) {
    var detail_state = "";
    if (state == 1) {
        detail_state = '<i class="stop"></i> 创建中';
    } else if (state == 2) {
        detail_state = '<i class="stop"></i>运行中 ';
    } else if (state == 3) {
        detail_state = '<i class="stop"></i> 已删除 ';
    } else if (state == 4) {
        detail_state = '<i class="end"></i> 已停止 ';
    } else if (state == 5) {
        detail_state = '<i class="stop"></i> 暂停中 ';
    } else if (state == 6) {
        detail_state = '<i class="stop"></i> 已暂停 ';
    } else if (state == 7) {
        detail_state = '<i class="stop"></i> 备份中 ';
    } else if (state == 8) {
        detail_state = '<i class="restore"></i> 恢复中 ';
    } else if (state == 9) {
        detail_state = '<i class="stop"></i> 操作失败 ';
    } else if (state == 999) {
        detail_state = '<i class="stop"></i> 初始状态 ';
    }
    return detail_state;
}


function buildCcommonMsg(trigger_obj, title, msg, callback, overlay,callback_before) {
    var commonMsg = $($("#template_commonMsg").html()).clone();
    commonMsg.find("#dialog_title span").html(title);
    commonMsg.find("#dialog_msg").html(msg);
    if (overlay == undefined) {
        overlay = true;
    }
    var popup = new PopupLayer().rebuild({
        //trigger: "#commonMsg_trigger",
        trigger: trigger_obj,
        popupBlk: commonMsg,
        popwidth: "450px",
        popheight: "200px",
        useOverlay: overlay
    });
    popup.popupBlk.find("#commonMsg_ok").on("click", function() {
        callback();
        popup.remove();
    });
    popup.popupBlk.find("#commonMsg_cancel").on("click", function() {
        popup.remove();
    });
    if (callback_before != undefined) {
    	callback_before(popup.popupBlk);
    }
}


function dataRefresh(vmId) {
    //刷新列表中虚拟机的数据；
    //开启监控？
    $.when(getData("/op-console/vm/detail", {
        "vmId": vmId
    })).done(function(vmData) {
        $("#" + vmId + "_state").html(getVmState_list(vmData.state));
        $("#" + vmId).attr("vm_name",vmData.name);
        $("#" + vmId).attr("vm_state",vmData.state);
    });
    //listPage(currentPage);
}

function actVms(actType) {
    var vmIds = getCBValues("items");
    //获取虚拟机状态，去顶是否可以执行操作
    var actionStr = actTypeStr(actType);
    var expectState = "";
    if (actType == "2") {
        expectState = "2";
    } else if (actType == "3") {
        expectState = "6";
    } else if (actType == "4") {
        expectState = "2";
    } else if (actType == "1") {
        expectState = "4";
    } else if (actType == "5") {
        expectState = "2";
    }
    if (vmIds != "") {
        //var msg = "确定对选中的云主机执行" + actionStr + "操作？</br> --已经过滤不适合当前操作的云主机</br>";
        var msg = "需要对云主机执行状态检查，点击确定后对检查通过的虚拟机执行"+actionStr+"操作</br>";
        var actVmIds = [];
        vmIds.split(",").forEach(function(vmid) {
        	msg += "<span id='"+vmid+"'>"+$("#" + vmid).attr("vm_id") + "：正在检查...</span></br>";
        });
      
        var popup = buildCcommonMsg("#act_suspend", "提示", msg, function() {
            actVmIds.forEach(function(vmId) {
            	//检查虚拟机
                var info = $.alertMsg().infoWait("正在提交...");
                $.when(getData("/op-console/vm/action", {
                    "vmId": vmId,
                    "actType": actType
                }, "POST")).done(function(data) {
                    //$.alertMsg().display(data.resultMsg);
                    info.resetMsg(data.resultMsg);
                    dataRefresh(vmId);
                });
            });
        },true,function(popup){
        	vmIds.split(",").forEach(function(vmid) {
        		$.when(getData("/op-console/vm/queryVm", { "vmId": vmid},"GET",function(){
             	   popup.find("#"+vmid).html(vmid+"：虚拟机查询失败");;
                })).done(function(data) {
           		  if(data.resultMsg.resultCode=="1"){
           			  $("#" + vmid + "_state").html(getVmState_list(data.vm.state));
           			  $("#" + vmid).attr("vm_name",data.vm.name);
             	          $("#" + vmid).attr("vm_state",data.vm.state);
             	          if(data.vm.state == expectState){
             	        	 popup.find("#"+vmid).html(vmid+"：OK");;
             	        	  actVmIds.push(vmid);
             	          }else{
             	        	 popup.find("#"+vmid).html(vmid+"：不适合执行"+actionStr+"操作");;
             	          }
           		  }else{
           			popup.find("#"+vmid).html(vmid+"：虚拟机查询失败");;
           		  }
               });
        	});
        });
    } else {
        var poptip = buildCcommonMsg("#commonMsg_trigger", "提示", "请先选择云主机!", function() {});
    }
}

function vmAction(obj, actType) {
    var vmId = $(obj).attr("vmId");
    var title = "提示";
    var msg = "确定对云主机执行" + actTypeStr(actType) + "操作？</br> 云主机：" + vmId;
    var popup = buildCcommonMsg($(obj), title, msg, function() {
        var info = $.alertMsg().infoWait("正在提交...");
        $.when(getData("/op-console/vm/action", {
            "vmId": vmId,
            "actType": actType
        }, "POST")).done(function(data) {
            info.resetMsg(data.resultMsg);
            dataRefresh(vmId);
        });
    });
}

function deleteVm(obj) {
    var vmId = $(obj).attr("vmId");
    /*var title = "云主机操作";
	var msg = "确定对云主机执行删除操作？</br> 云主机："+vmId;
	var popup = buildCcommonMsg($(obj),title,msg,function(){
		var info = $.alertMsg().infoWait("正在提交...");
		$.when(getData("/op-console/vm/delete",{"vmId":vmId}, "POST")).done(function(data){
			info.resetMsg(data.resultMsg);
			console.log(currentPage);
			listPage(0);
		});
	});*/
    window.open(domainurlgloabl+"usercenter/orderDetail?instanceid=" + vmId);
}

function actTypeStr(actType) {
    if (actType == 101) {
        trContent = '删除';
    } else if (actType == 1) {
        trContent = '启动';
    } else if (actType == 2) {
        trContent = '暂停';
    } else if (actType == 3) {
        trContent = '恢复';
    } else if (actType == 4) {
        trContent = '关闭';
    } else if (actType == 5) {
        trContent = '重启';
    }
    return trContent;
}
function listEip(index, callback){
	$.when(getData("/op-console/vm/eip/list", {"page":index, "size":5 })).done(function(data) {
        var content = ''; //'<tr><td colspan="2">没有数据</td></tr>';
        if (data.resultList && data.resultList.length > 0) {
            data.resultList.forEach(function(eip, index) {
                content += '<tr><td><input type="radio" id="' + eip.id + '" name="eip_sel" value="' + eip.name + '" ></td>';
                content += '<td>' + eip.name + '</td>';
                content += '<td>' + nullable(eip.bandwidthSize) + '</td>';
                content += '</tr>';
            });
            $("#eipList_table tbody").empty().append(content);
            callback(data.totalItems);
        }
    });
}

function eip_bind_pop(vmData) {
    var eipBind = $($("#template_eipBind").html()).clone();
    eipBind.find("#eipBind_ok").attr("vmId", vmData.id);
    var eipBind_dialog = new PopupLayer().rebuild({
        trigger: "#eipBind",
        popupBlk: eipBind,
        popwidth: "650px",
        popheight: "400px"
    });
    eipBind.find('#eipBind_ok').click(function(event) {
        eip_bind(event, eipBind_dialog, vmData)
    });
    eipBind.find('#eipBind_cancel').click(function() {
        eipBind_dialog.remove();
    });
    initPaging("eipBindListPage",listEip);
}

function eip_unbind_pop(vmData) {
    var eipUnBind = $($("#template_eipUnBind").html()).clone();
    $("body").append(eipUnBind);
    var eipUnBind_dialog = new PopupLayer().rebuild({
        trigger: "#eipUnBind",
        popupBlk: eipUnBind,
        popwidth: "450px",
        popheight: "200px"
    });
    eipUnBind.find('#eipUnBind_ok').click(function(event) {
        eip_Unbind(event, eipUnBind_dialog, vmData)
    });
    eipUnBind.find('#eipUnBind_cancel').click(function() {
        eipUnBind_dialog.remove();
    });
    eipUnBind.find(".dialog_msg").html("确定解绑此公网IP？</br>云主机名称：" + vmData.id + "</br>公网IP：" + vmData.publicIp);
    eipUnBind.find("#eipUnBind_ok").attr("vmId", vmData.id).attr("eip", vmData.publicIp);
}


function eip_bind(event, popup, vmData) {
    var vmId = $(event.target).attr("vmid");
    var eip = $("input[name='eip_sel']:checked").val();
    if(eip==undefined){
    	var popup = buildCcommonMsg("#commonMsg_trigger", "提示", "请先选择", function() {},false);
    	return ;
    }
    var info = $.alertMsg().infoWait("正在提交...");
    $.when(getData("/op-console/vm/eip/bind", {
        "vmId": vmId,
        "elasticipId": eip
    }, "POST")).done(function(data) {
    	handleNetwork(vmData);
        info.resetMsg(data.resultMsg);
    }).always(function(){
    	popup.remove();
    });
}

function eip_Unbind(event, popup, vmData) {
    var eip = $(event.target).attr("eip");
    var vmId = $(event.target).attr("vmid");
    var info = $.alertMsg().infoWait("正在提交...");
    $.when(getData("/op-console/vm/eip/unbind", {
        "vmId": vmId,
        "elasticipId": eip
    }, "POST")).done(function(data) {
    	handleNetwork(vmData);
        info.resetMsg(data.resultMsg);
    });
    popup.remove();
}

function handleNetwork(vmData) {
    $.when(getData("/op-console/vm/eip", {
        "vmId": vmData.id
    })).done(function(data) {
        $("#detail_bandwidth").empty();
        $("#detail_publicIp").empty();
        if (nullable(data.vm.publicIp) == "") {
            $("#eipBind").show();
            $("#eipUnBind").hide();
            $("#eipBind").attr("vmId", data.vm.id);
            $("#eipBind").unbind("click").bind("click", function() {
                eip_bind_pop(data.vm)
            });
        } else {
            $.when(getData("/op-console/vm/eip/detail", {
                "elasticipId": data.vm.publicIp
            })).done(function(eipData) {
                if (eipData.eip != undefined && eipData.eip != "null") {
                    $("#detail_bandwidth").html(nullable(eipData.eip.bandwidthSize) + "Mbps");
                    $("#detail_publicIp").html(nullable(eipData.eip.name));
                    $("#eipUnBind").attr("vmId", data.id).attr("eip", eipData.eip.name);
                    $("#eipUnBind").show();
                    $("#eipBind").hide();
                    $("#eipUnBind").unbind("click").bind("click", function() {
                        eip_unbind_pop(data.vm)
                    });
                }
            });
        }
    });
}

function handleSG(vmData) {
    $("#btn_sgModify").unbind("click").bind("click", function(event) {
        sg_modify_pop(event.target, vmData);
    });
    $("#detail_sg_table").find("tbody").empty();
    $.when(getData("/op-console/vm/sg/list", {
        "vmId": vmData.id
    })).done(function(data) {
    	if(data.sgList!=null){
    		data.sgList.forEach(function(sg) {
                var trContent = '<tr><td>' + sg.id + '</td><td>' + sg.name + '</td></tr>';
                $("#detail_sg_table").find("tbody").append(trContent);
            });
    	}
    });
}
function listSgs(index, callback){
	$("#sgModify_table").find("tbody").empty();
	var vmId = $("#tab_vm_monitor").attr("vmId");
	$.when(getData("/op-console/vm/sg/listall", {"page":index, "size":5}),
			getData("/op-console/vm/sg/list", {"vmId": vmId})).done(function(allData, selectData) {
			allData.resultList.forEach(function(sg) {
	        var checked = "";
	        
	        selectData.sgList.forEach(function(_sg){
	        	if(sg.id == _sg.id){
	        		 checked = "checked";
	        		 return ;
	        	}
	        });
	        var trContent = '<tr><td><input type="checkbox" ' + checked + ' value="' + sg.id + '" name="sg_items"></td><td>' + sg.id + '</td><td>' + sg.name + '</td></tr>';
	        $("#sgModify_table").find("tbody").append(trContent);
	    });
	    callback(allData.totalItems);
	});
}
function sg_modify_pop(obj, vmData) {
    var sgModify = $($("#template_sgModify").html()).clone();
    sgModify.find("#sgModify_ok").attr("vmId", vmData.id);
    $("#btn_sgModify").attr("vmId", vmData.id);
    var vmId = $(obj).attr("vmId");
    var sgModify_dialog = new PopupLayer().rebuild({
        trigger: "#btn_sgModify",
        popupBlk: sgModify,
        popwidth: "700px",
        popheight: "400px"
    });
    sgModify.find('#sgModify_ok').click(function(event) {
        sg_modify(event.target, sgModify_dialog, vmData)
    });
    sgModify.find('#sgModify_cancel').click(function() {
        sgModify_dialog.remove();
    });
    initPaging("sgListPage",listSgs);
}

function sg_modify(obj, popup, vmData) {
    var vmId = $(obj).attr("vmid");
    var sgids = getCBValues("sg_items");
    var info = $.alertMsg().infoWait("正在提交...");
    $.when(getData("/op-console/vm/sg/update", {
        "vmId": vmId,
        "sgids": sgids
    }, "POST")).done(function(data) {
        handleSG(vmData);
        popup.remove();
        info.resetMsg(data.resultMsg);
    });
}

function handleBackup(vmData) {
    $("#vmBackup_list").empty();
    $.when(getData("/op-console/vm/backup/list", {
        "vmId": vmData.id
    })).done(function(data) {
        data.backupList.forEach(function(backup) {
            var vmBackup = $($("#template_vmBackup_list").html()).clone();
            $("#vmBackup_list").append(vmBackup);
            vmBackup.find("#vmBackup_id").html(backup.id);
            vmBackup.find("#vmBackup_createTime").html(backup.createTime);
            var btn_ok = vmBackup.find("#vmBackup_restore");
            btn_ok.attr("vmid", vmData.id)
                .attr("vmBackupId", backup.id).attr("vmBackupId", backup.id)
                .unbind("click").bind("click", function() {
                    vmBackup_restore(btn_ok, vmData);
                });
            var btn_delete = vmBackup.find("#vmBackup_delete");
            btn_delete.attr("vmid", vmData.id)
                .attr("vmBackupId", backup.id)
                .unbind("click").bind("click", function() {
                    vmBackup_delete(btn_delete, vmData);
                });
            $("#vmBackup_list").append(vmBackup);
        });
    });
}

function vmBackup_restore(obj, vmData) {
    var vmId = $(obj).attr("vmId");
    var vmBackupId = $(obj).attr("vmBackupId");
    var msg = "确定对云主机备份执行恢复操作？</br> 云主机：" + vmId + "</br>云主机备份：" + vmBackupId
    var popup = buildCcommonMsg(obj, "提示", msg, function() {
        var info = $.alertMsg().infoWait("正在提交...");
        $.when(getData("/op-console/vm/backup/restore", {
            "vmId": vmId,
            "vmBackupId": vmBackupId
        }, "POST")).done(function(data) {
            info.resetMsg(data.resultMsg);
        });
    });
}

function vmBackup_delete(obj, vmData) {
    var vmId = $(obj).attr("vmId");
    var vmBackupId = $(obj).attr("vmbackupid");
    var msg = "确定对云主机备份执行删除操作？</br> 云主机：" + vmId + "</br>云主机备份：" + vmBackupId
    var popup = buildCcommonMsg(obj, "提示", msg, function() {
        var info = $.alertMsg().infoWait("正在提交...");
        $.when(getData("/op-console/vm/backup/delete", {
            "vmId": vmId,
            "vmBackupId": vmBackupId
        }, "POST")).done(function(data) {
            info.resetMsg(data.resultMsg);
            handleBackup(vmData);
        });
    });
}

function backup_pop(vmData) {
    //check state
    $.when(getData("/op-console/vm/detail", {
        "vmId": vmData.id
    })).done(function(_vm) {
        if (_vm.state == 2 || _vm.state == 4) { //虚拟机需要运行中、关闭状态
            var vmBackup = $($("#template_vmBackup").html()).clone();
            vmBackup.find("#vmBackup_ok").attr("vmId", vmData.id);
            vmBackup.find(".dialog_msg").html("确认创建云主机备份？</br>云主机：" + vmData.id);
            vmBackup.find("#vmBackup_ok").attr("vmId", vmData.id);
            $("body").append(vmBackup);
            var vmBackup_dialog = new PopupLayer().rebuild({
                trigger: "#btn_vmBackup",
                popupBlk: vmBackup,
                popwidth: "450px",
                popheight: "200px"
            });
            vmBackup.find('#vmBackup_ok').click(function(event) {
                backup(event.target, vmBackup_dialog, vmData)
            });
            vmBackup.find('#vmBackup_cancel').click(function() {
                vmBackup_dialog.remove();
            });
        } else {
            var title = "提示";
            var msg = "云主机状态不正确，无法进行备份</br> 云主机：" + vmData.id;
            var popup = buildCcommonMsg("#commonMsg_trigger", title, msg, function() {});
        }
    });
}


function backup(obj, popup, vmData) {
    var vmId = $(obj).attr("vmid");
    var info = $.alertMsg().infoWait("正在提交...");
    $.when(getData("/op-console/vm/backup", {
        "vmId": vmId
    }, "POST")).done(function(data) {
        info.resetMsg(data.resultMsg);
        handleBackup(vmData);
    });
    popup.close();
}

// 加载弹性块存储tab页
function handleVolume(vmData) {
    $("#detail_template").empty();
    $.when(getData("/op-console/vm/volume/list", {
        "vmId": vmData.id
    })).done(function(data) {
        if (nullable(data.resultList) == "") {} else {
            data.resultList.forEach(function(volume, index) {
                var newOne = $($("#template_volume").html()).clone();
                newOne.find("#detail_volumeSize").html(volume.size + "G");
                newOne.find("#detail_volumeId").html(volume.id);
                newOne.find("#btn_volumeDetach").attr("volumeId", volume.id).attr("vmId", vmData.id).attr("volumeId", volume.id);
                newOne.find("#btn_volumeBackup").attr("volumeId", volume.id).attr("vmId", vmData.id).attr("volumeId", volume.id);
                $("#detail_template").append(newOne);

                newOne.find("#btn_volumeDetach").unbind("click").bind("click", function(event) {
                    volume_detach_pop(event.target, vmData, volume);
                });
                newOne.find("#btn_volumeBackup").unbind("click").bind("click", function(event) {
                    volume_backup_pop(event.target, vmData, volume);
                });
            });
        }
    });
}

function volumeAttatch_pop(obj, vmData) {
    var volumeAttatch = $($("#template_volumeAttatch").html()).clone();
    volumeAttatch.find("#volumeAttatch_ok").attr("vmId", vmData.id);
    $("#btn_volumeAttatch").attr("vmId", vmData.id);
    var volumeAttatch_dialog = new PopupLayer().rebuild({
        trigger: "#btn_volumeAttatch",
        popupBlk: volumeAttatch,
        popwidth: "750px",
        popheight: "400px"
    });
    volumeAttatch.find('#volumeAttatch_ok').click(function(event) {
        volume_attach(event.target, volumeAttatch_dialog, vmData)
    });
    volumeAttatch.find('#volumeAttatch_cancel').click(function() {
        volumeAttatch_dialog.remove();
    });

    //初始化数据
    initPaging("attachVolumePage",listUnattachedVolume);
}
function listUnattachedVolume(index,callback){
	$("#volumeAttatch_table").find("tbody").empty();
	$.when(getData("/op-console/vm/volume/listunattached", {"page":index, "size":5})).done(function(data) {
	    data.resultList.forEach(function(volume) {
	        var trContent = '<tr><td><input type="radio" value="' + volume.id + '" name="volume_items"></td><td>' + volume.id + '</td><td>' + volume.name + '</td><td>' + volume.size + '</td></tr>';
	        $("#volumeAttatch_table").find("tbody").append(trContent);
	    });
	    callback(data.totalItems);
	});
}

function volume_detach_pop(obj, vmData, volume) {
    var volumeDetach = $($("#template_volumeDetach").html()).clone();
    volumeDetach.find(".dialog_msg").html("确定卸载弹性块存储？</br>云主机：" + vmData.id + "</br>块存储名称：" + volume.id);
    volumeDetach.find('#volumeDetach_ok').attr("volumeId", volume.id).attr("vmId", vmData.id).attr("volumeId", volume.id);
    var volumeDetach_dialog = new PopupLayer().rebuild({
        trigger: $(obj),
        popupBlk: volumeDetach,
        popwidth: "450px",
        popheight: "200px"
    });
    volumeDetach.find('#volumeDetach_ok').click(function(event) {
        volume_detach(event.target, volumeDetach_dialog, vmData)
    });
    volumeDetach.find('#volumeDetach_cancel').click(function() {
        volumeDetach_dialog.remove();
    });
}

function volume_backup_pop(obj, vmData, volume) {
    var volumeBackup = $($("#template_volumeBackup").html()).clone();
    volumeBackup.find(".dialog_msg").html("确定创建弹性块存储备份？</br>块存储名称：" + volume.id);
    volumeBackup.find('#volumeBackup_ok').attr("volumeId", volume.id).attr("vmId", vmData.id).attr("volumeId", volume.id);
    $("#btn_volumeBackup").attr("volumeId", volume.id).attr("vmId", vmData.id).attr("volumeId", volume.id);
    $("body").append(volumeBackup);
    var volumeAttatch_dialog = new PopupLayer().rebuild({
        trigger: $(obj),
        popupBlk: volumeBackup,
        popwidth: "450px",
        popheight: "200px"
    });
    volumeBackup.find('#volumeBackup_ok').click(function(event) {
        volume_backup(event.target, volumeAttatch_dialog, vmData)
    });
    volumeBackup.find('#volumeBackup_cancel').click(function() {
        volumeAttatch_dialog.remove();
    });
}

function updateVmName_pop(obj) {
    var vmId = $(obj).attr("vm_id");
    var vmName = $("#" + vmId).attr("vm_name");
    var updateVmName = $($("#template_updateVmName").html()).clone();
    updateVmName.find("#vm_name").val(vmName);
    updateVmName.find('#updateVmName_ok').attr("vmId", vmId);
    var updateVmName_dialog = new PopupLayer().rebuild({
        trigger: $(obj),
        popupBlk: updateVmName,
        popwidth: "450px",
        popheight: "200px"
    });
    updateVmName.find('#updateVmName_ok').click(function(event) {
        update_vmName(event.target, updateVmName_dialog)
    });
    updateVmName.find('#updateVmName_cancel').click(function() {
        updateVmName_dialog.remove();
    });
}

function update_vmName(obj, popup) {
    var vmId = $(obj).attr("vmid");
    var info = $.alertMsg().infoWait("正在提交...");
    var vmName = popup.popupBlk.find("#vm_name").val();
    $.when(getData("/op-console/vm/updateName", {
        "vmId": vmId,
        "vmName": vmName
    }, "POST")).done(function(data) {
        if (data.resultMsg.resultCode == "0") {
            if (data.resultMsg.end) {
                popup.remove();
            }
            info.resetMsg(data.resultMsg);
        } else {
            popup.remove();
            $("#" + vmId).html(vmName);
            $("#" + vmId).attr("vm_name", vmName);
            $("#detail_name").html(vmName);
            info.resetMsg(data.resultMsg);
        }
    });

}

function volume_detach(obj, popup, vmData) {
    var vmId = $(obj).attr("vmid");
    var volumeId = $(obj).attr("volumeid");
    var info = $.alertMsg().infoWait("正在提交...");
    $.when(getData("/op-console/vm/volume/detach", {
        "vmId": vmId,
        "volumeId": volumeId
    }, "POST")).done(function(data) {
        handleVolume(vmData);
        info.resetMsg(data.resultMsg);
    });
    popup.remove();
}

function volume_attach(obj, popup, vmData) {
    var vmId = $(obj).attr("vmid");
    var volumeId = $("input[name='volume_items']:checked").val();
    if (volumeId) {
        var info = $.alertMsg().infoWait("正在提交...");
        $.when(getData("/op-console/vm/volume/attach", {
            "vmId": vmId,
            "volumeId": volumeId
        }, "POST")).done(function(data) {
            handleVolume(vmData);
            info.resetMsg(data.resultMsg);
        });
    } else {

    }
    popup.remove();
}

function volume_backup(obj, popup, vmData) {
    var vmId = $(obj).attr("vmid");
    var volumeId = $(obj).attr("volumeid");
    var info = $.alertMsg().infoWait("正在提交...");
    $.when(getData("/op-console/vm/volume/backup", {
        "vmId": vmId,
        "volumeId": volumeId
    }, "POST")).done(function(data) {
        info.resetMsg(data.resultMsg);
    });
    popup.remove();
}

// 初始化
function init() {
	/* 主机详细信息 */
    $('.activator').click(function() {
        if ($(this).parent().hasClass('selected')) {
            return;
        }
        // 移除所有弹出层
        $('body').find(".popupLayer").remove();

        // 赋值给监控tab页
        var vmId = $(this).attr("id");
        $("#tab_vm_monitor").attr("vmId", vmId);

        $.when(getData("/op-console/vm/detail", {
            "vmId": vmId
        })).done(function(vmData) {
            // 显示详细信息
            $("#detail_name").html(nullable(vmData.name));
            $("#detail_id").html(nullable(vmData.id));
            $("#detail_cpu").html(nullable(vmData.cpu) + "核");
            $("#detail_mem").html(nullable(vmData.mem) + "M");
            $("#detail_rootDisk").html(nullable(vmData.rootDisk) + "G");
            $("#detail_keyName").html(nullable(vmData.keyName));
            $("#detail_pwd").html(nullable(vmData.pwd));
            $("#detail_createTime").html(vmData.createTime);
            $("#detail_privateIp").html(nullable(vmData.privateIp));
            
            // 获取云主机状态
            $("#detail_state").empty().html(getVmState(vmData.state));
            // $("#detail_privateIp")
            
            // 显示网络信息
            handleNetwork(vmData);

            // 显示安全组信息
            handleSG(vmData);

            // 显示块设备信息
            handleVolume(vmData);

            // 解除绑定事件
            $("#btn_volumeAttatch").unbind("click").bind("click", function(event) {
                volumeAttatch_pop(event.target, vmData);
            });
            
            // 解除绑定事件
            $("#btn_vmBackup").unbind("click").bind("click", function() {
                backup_pop(vmData);
            });

            //显示备份信息
            handleBackup(vmData);
        });
    });
}


function getCBValues(name) {
    var spCodesTemp = "";
    $('input:checkbox[name=' + name + ']:checked').each(function(i) {
        if (0 == i) {
            spCodesTemp = $(this).val();
        } else {
            spCodesTemp += ("," + $(this).val());
        }
    });
    return spCodesTemp;
}

var currentPage = 0;
var pageSize = 10;
var unAttachVolumePage;

//function initPaging(pageID,listPage) {
//	var thePage = $("#"+pageID);
//	var pageNav = thePage.find("#pagediv").pagination({
//     	itemsOnPage: pageSize,
//     	cssStyle: 'light-theme',
//     	onPageClick:function(pageNumber, event){
//			listPage(pageNumber-1,function(totalItems){
//				pageNav.pagination("updateItems",totalItems);
//			});
//			if(event){
//	            event.preventDefault();
//	        }
//		},
//		onInit:function(){
//			listPage(0,function(totalItems){
//				pageNav.pagination("updateItems",totalItems);
//			});
//		}
// });
//	thePage.find("#gotoBtn").click(checkAndSelect);
//	thePage.find("#currentpage").bind("keypress", function(event) {
//        if (event.keyCode == 13) {
//        	event.preventDefault();
//        	checkAndSelect();
//        }
//    });
//	function checkAndSelect(){
//		var pageNumber = parseInt(thePage.find("#currentpage").val());
//        var pageCount = thePage.find("#pagediv").pagination("getPagesCount");
//        if(pageNumber > pageCount){
//        	pageNumber = pageCount;
//        	thePage.find("#currentpage").val(pageNumber);
//        }
//        if (pageNumber > 0) {
//        	thePage.find("#pagediv").pagination("selectPage", pageNumber);
//        }
//	}
//	return pageNav;
//}

function listPage(index, callback) {
    var filterValue = $("#filter").val();
    currentPage = index;
  /*$("#table_vmList>tbody").remove();
    var loading = '<tbody><td colspan="8" class="loading">正在加载中...</td></tbody>';
    $("#table_vmList").append(loading);*/
    $('#movebox').removeClass('visible').addClass('invisible');
    $("#items_all").prop("checked", false);
   /* $.when(getData("/op-console/vm/listdata", {
        "page": index,
        "size": pageSize,
        "vmName": filterValue,
        "publicIp": filterValue
    })).done(function(data) {
        $("#table_vmList>tbody").remove();
        var content = '<tbody>';
        data.resultList.forEach(function(vm) {
            content += '<tr>';
            content += '<td><input type="checkbox" value="' + vm.id + '" name="items">';
            content += '</td>';
            content += '<td ><a id="' + vm.id + '" class="activator blue" href="javascript:void(0)" vm_name="' + vm.name + '"';
            content += ' vm_state="' + vm.state + '" vm_id="' + vm.id + '">' + vm.name + '</a>';
            content += '</td>';
            content += '<td nowrap="nowrap"><img style="cursor:pointer"  width="16" height="16" src="/op-console/statics/images/bianji.png" vm_id="' + vm.id + '" onclick="updateVmName_pop(this);"/></td>';
            content += '<td><div id="' + vm.id + '_state" class="state">';
            content += getVmState_list(vm.state);
            content += '</div>';
            content += '</td>';
            content += '<td nowrap="nowrap">' + vm.id + '</td>';
            content += '<td>' + nullable(vm.publicIp) + '</td>';
            content += '<td>' + nullable(vm.cpu) + '核/' + nullable(vm.mem) + 'M/' + nullable(vm.rootDisk) + 'G' + '</td>';
            content += '<td nowrap="nowrap">' + vm.username + '</td>';
            content += '<td width="190px">';
            content += '<a class="action_VNClogin blue"';
            content += 'href="javascript:void(0)" target="_blank" onclick="getNovncUrl(this)" vmId="' + vm.id + '">VNC登录</a>';
            content += '<a class="action_checkorder blue"';
            content += 'href="//dev.bcop.com:18080/op-user/usercenter/orderDetail?instanceid=' + vm.id + '" target="_blank">查看订单</a>';
            content += '<div class="select_div">';
            content += '<div class="select_input" vmid="' + vm.id + '">';
            content += '<a class="blue" id=""> 更多 </a> <span class="select_dropdown"></span>';
            content += '</div>';
            content += '<span class="select_ul" id="actionList"> <a>暂停</a> <a>恢复</a>';
            content += '<a>停用</a> <a>恢复</a> <a>停用</a> <a>恢复</a> <a>停用</a> </span>';
            content += '</div></td>';
            content += '</tr>';
        });
        content += '</tbody>';
        $("#table_vmList").append(content);
        callback(data.totalItems);
         });*/
      
   
     init();
     moveBox();
    return false;
}

$(function() {
	// 切换tab页
	$(".tab_vm").click(function(){
		$(".vm-pane").hide();
		$(".tab_vm").removeClass("tab_current");
		$(this).addClass("tab_current");

		if($(this).attr("id") == "tab_vm_detail"){
			$(".pane-detail").show();
		} else if($(this).attr("id") == "tab_vm_volume"){
			$(".pane-volume").show();
		} else if($(this).attr("id") == "tab_vm_network"){
			$(".pane-network").show();
		} else if($(this).attr("id") == "tab_vm_backup"){
			$(".pane-backup").show();
		} else if($(this).attr("id") == "tab_vm_securitygroup"){
			$(".pane-securitygroup").show();
		} else if($(this).attr("id") == "tab_vm_monitor"){
			$(".pane-monitor").show();
		}
	});
	
//	initPaging("vmListPage",listPage);

    $(document).on("click", "#sg_items_all", function() {
        if ($(this).prop("checked") == true) {
            $("input[name='sg_items']").prop("checked", true);
        } else {
            $("input[name='sg_items']").prop("checked", false);
        }
    });

    $('#volumeDetach_ok').click(function() {
        var volumeId = $(this).attr("volumeId");
        var vmId = $(this).attr("vmId");
        var volumeId = $(this).attr("volumeId");
        $("#volumeDetach_dialog").find(".dialog_msg").html("确定卸载弹性块存储？</br>云主机名称：" + vmId + "</br>块存储名称：" + volumeId);
        var info = $.alertMsg().infoWait("正在提交...");
        $.when(getData("/op-console/vm/volume/detach", {
            "vmId": vmId,
            "volumeId": volumeId
        }, "POST")).done(function(data) {
            info.resetMsg(data.resultMsg);
        });
    });
    $(document).on("mouseover", "#table_vmList .select_ul a", function() {
        $(".select_ul a").removeClass("select_blue");
        $(this).addClass("select_blue");
    });
    //操作
    $(document).on("click", ".select_input", function() {
        var vmId = $(this).attr("vmId");
        var actionList = $(this).parent().find("#actionList");
        actionList.empty();
        var loading = '<img style="margin-left:20px;margin-top:5px;" width="20" height="20" src="/op-console/statics/images/loading-min.gif">';
        actionList.append(loading);
        //获取操作列表
        $.when(getData("/op-console/vm/action/list", {
            "vmId": vmId
        })).done(function(data) {
            vmData = 'vmid="' + vmId + '"';
            if (data.resultMsg != undefined && data.resultMsg.resultCode == "0") {
                $.alertMsg().display(data.resultMsg);
                return;
            }
            actionList.empty();
            dataRefresh(vmId);
            data.actionList.forEach(function(actType) {
                var trContent = "";
                if (actType == 101) {
                    trContent = '<a  href="javascript:void(0)" ' + vmData + '  onclick="deleteVm(this);">删除</a>';
                } else if (actType == 1) {
                    trContent = '<a  href="javascript:void(0)" id="action_powerOn" ' + vmData + ' onclick="vmAction(this,' + actType + ')">启动</a>';
                } else if (actType == 2) {
                    trContent = '<a  href="javascript:void(0)" id="action_suspend" ' + vmData + ' onclick="vmAction(this,' + actType + ')">暂停</a>';
                } else if (actType == 3) {
                    trContent = '<a  href="javascript:void(0)" id="action_resume" ' + vmData + ' onclick="vmAction(this,' + actType + ')">恢复</a>';
                } else if (actType == 4) {
                    trContent = '<a  href="javascript:void(0)" id="action_powerOff" ' + vmData + ' onclick="vmAction(this,' + actType + ')">关闭</a>';
                } else if (actType == 5) {
                    trContent = '<a  href="javascript:void(0)" id="action_reboot" ' + vmData + ' onclick="vmAction(this,' + actType + ')">重启</a>';
                }
                actionList.append(trContent);
            });
        });
    });

    //checkbox
    $("#items_all").click(function() {
        if ($(this).prop("checked") == true) {
            $("input[name='items']").prop("checked", true);
        } else {
            $("input[name='items']").prop("checked", false);
        }
    });

    $("#act_suspend").click(function() {
        actVms(2);
    });
    $("#act_resume").click(function() {
        actVms(3);
    });
    $("#act_more").change(function() {
        var actType = $(this).children('option:selected').val()
        actVms(actType);
    });
    $("#filter").keyup(function(e) {
        if (e.which == 13) {
            listPage(0);
        }
    });
});

function initOption(title, yValueFormatter) {
    var option = {
        title: {
            text: title
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: []
        },
        toolbox: {
            show: false
        },
        dataZoom: {
            show: false,
            start: 0,
            end: 100
        },
        grid: {
            x: 60,
            y: 40,
            x2: 20,
            y2: 40,
            borderColor: '#ccc'
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: []
        }],
        yAxis: [{
            type: 'value',
            axisLabel: (function() {
                if (yValueFormatter) {
                    return {
                        formatter: yValueFormatter
                    };
                } else {
                    return {
                        formatter: '{value}'
                    };
                }
            })()
        }],
        series: []
    };
    return option;
}

function handlOption(data, option) {
    for (var key in data) {
        option.legend.data.push(key);
        var x = [];
        y = [];
        for (var i = 0; i < data[key].length; i++) {
            x.push(data[key][i].xData);
            y.push(data[key][i].yData);
        }
        if (x.length > 0) {
            option.xAxis[0].data = x;
        }
        option.series.push({
            name: key,
            type: 'line',
            data: y
        });
    }
}

function initMonitorGraph(vmId, type, count) {
    var cpu_usage_chart = echarts.init(document.getElementById('cpu_usage'));
    var cpu_usage_option = initOption('', '{value}%');
    cpu_usage_chart.showLoading({
        text: '加载中...'
    });

    var mem_usage_chart = echarts.init(document.getElementById('mem_usage'));
    var mem_usage_option = initOption('', '{value}%');
    mem_usage_chart.showLoading({
        text: '加载中...'
    });

    var disk_usage_chart = echarts.init(document.getElementById('disk_usage'));
    var disk_usage_option = initOption('', '{value}%');
    disk_usage_chart.showLoading({
        text: '加载中...'
    });

    var disk_io_chart = echarts.init(document.getElementById('disk_io'));
    var disk_io_option = initOption('', '{value}b/s');
    disk_io_chart.showLoading({
        text: '加载中...'
    });

    var net_bandth_chart = echarts.init(document.getElementById('net_bandth'));
    var net_bandth_option = initOption('', '{value}');
    net_bandth_chart.showLoading({
        text: '加载中...'
    });

    $.when(getData("/op-console/vmMonitor/" + type, {
        "vmId": vmId,
        "count": count
    })).done(function(data) {
        handlOption(data.cpu_usage, cpu_usage_option);
        cpu_usage_chart.setOption(cpu_usage_option);
        cpu_usage_chart.hideLoading();

        handlOption(data.mem_usage, mem_usage_option);
        mem_usage_chart.setOption(mem_usage_option);
        mem_usage_chart.hideLoading();

        handlOption(data.disk_usage, disk_usage_option);
        disk_usage_chart.setOption(disk_usage_option);
        disk_usage_chart.hideLoading();

        handlOption(data.disk_io, disk_io_option);
        disk_io_chart.setOption(disk_io_option);
        disk_io_chart.hideLoading();

        handlOption(data.net_bandth, net_bandth_option);
        net_bandth_chart.setOption(net_bandth_option);
        net_bandth_chart.hideLoading();
    }).fail(function(){
    	$('#cpu_usage').empty().append('暂无数据');
    	$('#mem_usage').empty().append('暂无数据');
    	$('#disk_usage').empty().append('暂无数据');
    	$('#disk_io').empty().append('暂无数据');
    	$('#net_bandth').empty().append('暂无数据');
    });
}

function init_monitor_template() {
    var monitor = $($("#template_monitor").html()).clone();
    $("#monitor").empty().append(monitor);
}

function draw_monitor(vmId, type, count) {
    init_monitor_template();
    //initMonitorGraph(vmId,type,count);
    initMonitorGraph("CIDC-R-01-000-VM-00013116", type, count);
}

$(function() {
    $(".btn-monitor").click(function() {
        $(".btn-monitor").removeClass("selected");
        $(this).addClass("selected");
        var data_type = $(this).attr("data_type");
        var data_range = $(this).attr("data_range");
        var vmId = $("#tab_vm_monitor").attr("vmId");
        draw_monitor(vmId, data_type, data_range);
    });
    $("#tab_vm_monitor").click(function() {
        var vmId = $(this).attr("vmId");
        $(".btn-monitor").removeClass("selected");
        $("#6hours").addClass("selected");
        draw_monitor(vmId, "hours", 6);
    });
});

//资源分配相关功能

function doAllocate() {
    var checkboxs = []; //保存选中的VMID
    $("input[name=items]:checked").each(function(index) {
        checkboxs.push($(this).val());
    });
    var selectedUserId = $("input[name=userId]:checked").val();
    $.ajax({
        url: '/op-console/resource/allocation',
        type: "POST",
        traditional: true,
        data: {
            "userId": selectedUserId,
            "resourceIds": checkboxs,
            "type": 1
        },
        success: function(data) {
            setTimeout(function() {
                $("#allocate_user_cancel_btn").click();
                window.location.href = "/op-console/vm/list";
            }, 1000);
        },
        error: function(data) {
            var poptip = buildCcommonMsg("#commonMsg_trigger", "提示", data.responseText, function() {});
            return false;
        }
    });
}

$(function() {

//    var isRootUser = $.cookie("u_root");
//    if (isRootUser == '0') {
//        $("#act_allocate_user").hide();
//        $("#act_un_allocate_user").hide();
//    }

    /*
     * 点击分配按钮
     */
    $('#act_allocate_user').click(function() {
        var checkboxs = [];
        $("input[name=items]:checked").each(function(index) {
            checkboxs.push($(this).val());
        });
        if (checkboxs.length == 0) {
            var poptip = buildCcommonMsg("#commonMsg_trigger", "提示", "请选择云主机！", function() {});
        } else {
            var select_user_dlg_html = $($("#template_select_user_div").html()).clone();
            var selectUserDlg = new PopupLayer().rebuild({
                trigger: "#act_allocate_user",
                popupBlk: select_user_dlg_html
            });
            select_user_dlg_html.find("#allocate_user_ok_btn").click(function() {
                doAllocate();
            });
            select_user_dlg_html.find("#allocate_user_cancel_btn").click(function() {
                selectUserDlg.remove();
            });
            //bindPage(0);
            initPaging("userListPage",bindPage);
        }
    });

    function bindPage(index,callback) {
        $.ajax({
            url: '/op-console/resource/allocation/' + $.cookie("bcop_cid") + "/" + index + "/"+5+"/users",
            type: "GET",
            success: function(data) {
                $(".modal-table > tbody").remove(); // 移除表格里的行，从第二行开始（这里根据页面布局不同页变）
                // 将返回的数据追加到表格
                var content = '<tbody>';
                for (var i = 0; i < data.content.length; i++) {
                    content += '<tr>';
                    content += '<td><input type="radio" name="userId" value="' + data.content[i].id + '"/></td>';
                    content += '<td>' + data.content[i].name + '</td>';
                    content += '<td>' + data.content[i].email + '</td>';
                    content += '<td>' + data.content[i].telephone + '</td>';
                    content += '</tr>';
                }
                content += '</tbody>';
                $(".modal-table").append(content);
                callback(data.totals);
            },
            error: function(data) {
                var poptip = buildCcommonMsg("#commonMsg_trigger", "提示", data.responseText, function() {});
                return false;
            }
        });
        return false;
    }

    /*
     * 取消分配
     */
    $('#act_un_allocate_user').click(function() {
        var checkboxs = [];
        $("input[name=items]:checked").each(function(index) {
            checkboxs.push($(this).val());
        });
        if (checkboxs.length == 0) {
            var poptip = buildCcommonMsg("#commonMsg_trigger", "提示", "请选择云主机！", function() {});
            return false;
        }

        var popup = buildCcommonMsg("#act_un_allocate_user", "提示", "确定要取消分配给用户的云主机？", function() {
            $.ajax({
                url: '/op-console/resource/cancel/allocation',
                type: "POST",
                traditional: true,
                data: {
                    "resourceIds": checkboxs,
                    "type": 1
                },
                success: function(data) {
                    setTimeout(function() {
                        window.location.href = "/op-console/vm/list";
                    }, 1000);
                },
                error: function(data) {
                    var poptip = buildCcommonMsg("#commonMsg_trigger", "提示", data.responseText, function() {});
                    return false;
                }
            });
        });
    });
});
