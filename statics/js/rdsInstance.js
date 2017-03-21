/*实例页面自动执行的function---开始*/
$(function(){
  //自动执行检验是否登陆
  checkLogin();
  //动态展示所有的实例信息
  instance_first_function();
  //刷新按钮
  $(".refresh-btn").click(function ()
  {
    location.reload();
  });
  //rds-tab选项卡切换js代码---开始
  $(".rds-tabtitle .tab_vm").click(function ()
  {
    $(".tab_vm").removeClass('rds-tab-current');
    $(this).addClass('rds-tab-current');
    var index = $(this).attr("id");
    number = index;
    $('.rds-contentsm').hide();
    kk = ("rds-contentsm-") + index;
    $('#' + kk).show();
  });
  //确认添加用户
  $(".add-user").click(function ()
  {
    var volumeDetach = $($("#template_add_user").html()).clone();
    var confirm_dialog = new PopupLayer().rebuild({
      trigger: $(".add-user"),
      popupBlk: volumeDetach,
      popwidth: "600px",
      popheight: "150px"
    });
    //调用表单验证
    var id = document.getElementById("ds_id").innerHTML;
    addUserShowDB(id);
    //调用表单验证
    validateAddUserForm();
    volumeDetach.find('#confirm_cancel').click(function () {
      $.fn.jqLoading("destroy");
      confirm_dialog.remove();
    });
  })//click

  //确认添加数据库
  $(".add-database").click(function ()
  {
    var volumeDetach = $(
      $("#template_add_database").html())
      .clone();
    var confirm_dialog = new PopupLayer().rebuild({
      trigger: $(".add-database"),
      popupBlk: volumeDetach,
      popwidth: "600px",
      popheight: "150px"
    });
    //调用表单验证
    validateAddDatabaseForm();
    volumeDetach.find('#confirm_cancel').click(
      function () {
        $.fn.jqLoading("destroy");
        confirm_dialog.remove();
      });
  });
});
/*实例页面自动执行的function---结束*/

//页面每隔20秒 刷新一次实例信息
window.setInterval(instance_first_function, "20000");
/*----------------------------------------------------------------*/
//搜索框可以回车或者鼠标触发
$(function ()
{
  document.onkeydown = function (e) {
    var ev = document.all ? window.event : e;
    if (ev.keyCode == 13) {
      findIt();
    }
  }
});
//检验是否登陆
function checkLogin()
{
  $.ajax({
    url: "com.cmss.rds.dashboard.rdsLogin",
    type: "post",
    dataType: "json",
    data: {},
    success: function (returndata) {
      if (returndata.state == "success") {
      } else {
        alert_redefine_signin('create_instance', "登录错误，原因："
          + returndata.state);
      }
    }//success
  })
}

//提示框代码
function alert_redefine(btn_id, str)
{
  var volumeDetach = $($("#template_alert").html()).clone();
  volumeDetach.find(".dialog_msg").html(str);
  var confirm_dialog = new PopupLayer().rebuild({
    trigger: $(document.getElementById(btn_id)),
    popupBlk: volumeDetach,
    popwidth: "450px",
    popheight: "200px"
  });
  volumeDetach.find('#alert_ok').click(function (event)
  {
    confirm_dialog.remove();
  });
  volumeDetach.find('#confirm_cancel').click(function (event)
  {
    confirm_dialog.remove();
  });
}

//未登录提示框
function alert_redefine_signin(btn_id, str)
{
  var volumeDetach = $($("#template_alert").html()).clone();
  volumeDetach.find(".dialog_msg").html(str);
  var confirm_dialog = new PopupLayer().rebuild({
    trigger: $(document.getElementById(btn_id)),
    popupBlk: volumeDetach,
    popwidth: "450px",
    popheight: "200px"
  });
  volumeDetach.find('#alert_ok').click(function (event)
  {
    confirm_dialog.remove();
    window.location.href = 'rdsSignIn.html';

  });
  volumeDetach.find('#confirm_cancel').click(function (event)
  {
    confirm_dialog.remove();
    window.location.href = 'rdsSignIn.html';
  });
}

//转换时间格式2015-07-28T07:27:54变为2015-07-28 07:27
function timeFormTransfer(time)
{
  var Newtime = time.substring(0, time.indexOf('T'))
    + " "
    + time.substring(time.indexOf('T') + 1, time.lastIndexOf(':'));
  return Newtime;
}

//传入实例id 获取实例name,append到主备详情中。status为状态，是父备份还是子备份
function use_id_get_name(instanceID,status){
  //ajax列出实例的详细信息开始
  $.ajax({
    url: "com.cmss.rds.instance.instanceDisplay",
    type: "get",
    dataType: "json",
    data: {
      "id": instanceID
    },
    success: function (returndata) {
      var original = returndata.display;
      $.each(
        $.parseJSON(original),
        function (i, item) {
          console.log(item);
          if(status=="father"){
            $("#replica_td").empty();
            $("#replica_td").append('是master节点，其slave节点为 '+item.name);
          }
          else if(status=="son"){
            $("#replica_td").empty();
            $("#replica_td").append('是slave节点，其master节点为 '+item.name);
          }
        })
    }
  })
}

//点击实例名称，带着id为参数 发送ajax请求，列出该实例的详细信息。用户，数据库。
function rds_instance_detail(id) {
  //ajax列出实例的详细信息开始
  $.ajax({
    url: "com.cmss.rds.instance.instanceDisplay",
    type: "get",
    dataType: "json",
    data: {
      "id": id
    },
    success: function (returndata) {
      var original = returndata.display;
      var configID;
      $.each(
        $.parseJSON(original),
        function (i, item) {
          if (item.configuration) {
            configID = item.configuration.id
          } else {
            configID = "no configuration"
          }
          Get_flavorInfo(item.flavor.id);
          $("#ds_name").html(
            item.name);
          $("#ds_id").html(item.id);
          $("#ds_storage")
            .html(
            item.datastore.type);
          $("#ds_version")
            .html(
            item.datastore.version);
          $("#ds_config").html(
            configID);
          $("#ds_status").html(
            item.status);
          $("#ds_cloud_disk").html(
            item.volume.size
            + " GB");//从flavor里面获得
          $("#ds_cloud_create")
            .html(
            timeFormTransfer(item.created));
          $("#ds_cloud_update")
            .html(
            timeFormTransfer(item.updated));
          $("#ds_main").html(item.ip);
          $("#ds_port").html("3306");//端口
          //链接举例
          $("#ds_instance")
            .html(
            "mysql -h "
            + item.ip
            + " -u 用户名 -p</br>用户名 -p mysql://用户名:密码@"
            + item.ip
            + ":3306/数据库");
          if(item.replica_of){
            use_id_get_name(item.replica_of.id,'son');
            console.log(item.replica_of.id);
          }
          else if(item.replicas){
            $.each(
              (item.replicas),
              function (i2,item2) {
                use_id_get_name(item2.id,'father');
                console.log(item2.id);
              }
            )
          }
          else{
            $("#replica_td").empty();
            $("#replica_td").html('暂无');
          }
        })
        //ajax列出 实例下的用户
        showUser(id);
    }
  });
  //ajax列出实例的详细信息结束
}


//实例页面自动执行的方法，列出当前实例的信息
function instance_first_function() {
  $.ajax({
    url: "com.cmss.rds.instance.instances",
    type: "get",
    dataType: "json",
    data: {},
    success: function (returndata) {
      var original = returndata.instances;
      //console.log(original);
      $_content = $(".rds-content-1-body");
      $('.content-instance').remove();
      //分页启用
      instance_pagination($.parseJSON(original).instances.length);
      //如果返回信息里面有instance参数
      // if((original).instances){
      $.each(
        $.parseJSON(original).instances,
        function (i, item)
        {
          //手写，拼接的动态div实例
          var flavor = "";
          //console.log(item.flavor.id);
          switch (item.flavor.id) {
            // 虚拟机上的case
            case '310':
              flavor = "rds-tiny";
              break;
            case '311':
              flavor = "rds-small";
              break;
            case '312':
              flavor = "rds-middle";
              break;
            case '313':
              flavor = "rds-large";
              break;
          }
          var backupStatus = "";
          //如果查到有replicas的参数
          if (item.replicas) {
            backupStatus = "master";
          }
          //如果查到有replica_of的参数
          if (item.replica_of) {
            backupStatus = "slave";
          }
          //实例信息拼接
          var new_instance = "<div class='content-instance'style='' id=" + item.id + "  title=" + item.status + "><input type='checkbox' name='instance_name' class='instance-box'/><a href='javascript:void(0)' class='instance-id' id='"
            + item.id
            + "'><p>"
            + item.name
            + "</p></a><p>"
            + item.status
            + "</p><p>"
            + item.datastore.version
            + "</p><p>"
            + item.ip
            + "</p><p class='instance_name" + item.id + "'>"
            + flavor
            + "</p><p>"
            + item.volume.size
            + "GB</p><p>"
            + backupStatus
            + "</p><p>"
            + item.datastore.type
            + "</p><div class='btn-group'><a href='javascript:void(0)' title="
            + item.status
            + " style='font-size:12px 'class='zhongzhi' id='zhongzhi'>终止</a><a href='javascript:void(0)' style='font-size:12px ' title='chognqi' class='chongqi'>重启</a></div></div>";
          //通过接口获得flavourID
          //Get_flavorname(item.flavor.id,item.id);
          $_content.append(new_instance);
        })//end of each
      /* }
       else{
       alert_redefine('instance_first_id', "网络错误，实例信息展示失败");
       }*/
      //分页
      changePage();

      

      //movebox功能开始
      $('#rds-boxclose').click(
        function () {
          $('#rds-movebox').animate({
            'left': '2000px'
          }, 300);
          $('#rds-movebox').removeClass(
            'visible').addClass(
            'invisible');
          $(document).find(
            '.content-instance')
            .removeClass(
            'check-selected');
        });
      //moveBox功能结束
    }//end of ajax
  })
}

//重启按钮click方法的开始
$(document).on('click', ".btn-group .chongqi", function ()
{
  //获得id
  var id = $(this).parent().parent().attr("id");
  //确认终止弹出框
  var volumeDetach = $($("#template_confirm").html()).clone();
  volumeDetach.find(".dialog_msg").html("确认重启实例吗？");
  var confirm_dialog = new PopupLayer().rebuild({
    trigger: $(".rds-btn-instance"),
    popupBlk: volumeDetach,
    popwidth: "450px",
    popheight: "200px"
  });
  volumeDetach.find('#confirm_ok').click(function (event) {
    confirm_dialog.remove();
    //点击重启按钮 发送ajajx 并有loading条
    $.fn.jqLoading({
      height: 100,
      width: 240,
      text: "正在加载中，请耐心等待...."
    });

    $.ajax({
      url: "com.cmss.rds.instance.restartInstance",
      type: "post",
      dataType: "json",
      data: {
        "id": id
      },
      success: function (returndata) {
        setTimeout(function () {
          $.fn.jqLoading("destroy");
          location.reload();
        }, 1000);
        if(returndata.status!==''){
          alert_redefine('chongqi', "重启实例失败，原因为："+returndata.status);
        }
      }//success结束
    })
  });
  volumeDetach.find('#confirm_cancel').click(function () {
    $.fn.jqLoading("destroy");
    confirm_dialog.remove();
  });
});//重启按钮click方法的结束

//中断实例 按钮click方法的开始
$(document).on('click',".btn-group .zhongzhi", function ()
{
  //确认终止弹出框
  //实例状态为error或active才可以被终止
  if (!(this.title == "ACTIVE" || this.title == "ERROR")) {
    alert_redefine('zhongzhi',
      "实例状态为error或active才可以被终止。");
  } else {
    var id = $(this).parent().parent().attr("id");
    var volumeDetach = $(
      $("#template_confirm").html())
      .clone();
    volumeDetach.find(".dialog_msg").html(
      "确认终止实例吗？");
    var confirm_dialog = new PopupLayer()
      .rebuild({
        trigger: $(".rds-btn-instance"),
        popupBlk: volumeDetach,
        popwidth: "450px",
        popheight: "200px"
      });
    volumeDetach
      .find('#confirm_ok')
      .click(
      function (event) {
        confirm_dialog.remove();
        //点击中断实例按钮 发送ajajx 并有loading条
        $.fn.jqLoading({
          height: 100,
          width: 240,
          text: "正在加载中，请耐心等待...."
        });
        $.ajax({
          url: "com.cmss.rds.instance.restartInstance",
          type: "get",
          dataType: "json",
          data: {
            "id": id
          },
          success: function (returndata) {
            //如果有返回信息，说明失败了。如果没有返回信息，关闭loading，操作成功
            if (returndata.status !=='') {
              $.fn.jqLoading("destroy");
              alert_redefine('zhongzhi', "删除失败，原因为：" + returndata.status);
            }
            else{
              setTimeout(function () {
                $.fn.jqLoading("destroy");
                location.reload();
              }, 1000);
            }
          }//success结束
        })
      });
    volumeDetach.find('#confirm_cancel').click(function ()
    {
      confirm_dialog.remove();
    });
  }//else
});//中断实例 按钮click方法的结束

//movebox开始
$(document).on(
  'click',
  ".rds-content-1-body .content-instance .instance-id",
  function () {
    var name = $(this).children('p').html();
    var id = $(this).parent().attr("id");
    //发送详细信息ajax请求
    rds_instance_detail(id);
    //发送详细信息ajax请求
    var _this = $(this);
    $('#rds-movebox').addClass('visible');
    ;
    $('#rds-movebox #3').attr('name', name);
    if (_this.parent().hasClass('check-selected')) {
      //当前行再次点击box消失
      _this.parent().removeClass("check-selected");
      $('.content-instance')
        .removeClass('check-selected');
      $("#rds-boxclose").click();
      //每次点击的时候，让tab维持在详情页
      $(".tab_vm").removeClass('rds-tab-current');
      $("#0").addClass('rds-tab-current');
      $('.rds-contentsm').hide();
      $('#rds-contentsm-0').show();
    } else {
      //消除兄弟行的的选中状态
      $('.content-instance')
        .removeClass('check-selected');
      //当前行选中增加状态
      _this.parent().addClass("check-selected");
      $('#rds-movebox').animate({
        'left': $(".db-engine").offset().left - 75
      }, 300);
      $('#rds-movebox').removeClass('invisible')
        .addClass('visible');
      //每次点击的时候，让tab维持在详情页
      $(".tab_vm").removeClass('rds-tab-current');
      $("#0").addClass('rds-tab-current');
      $('.rds-contentsm').hide();
      $('#rds-contentsm-0').show();
    }
  })//movebox结束

//下拉框，是否为活动的实例
$(function () {
  $("#rds-content-guolv")
    .change(
    function () {
      var options = $("#rds-content-guolv option:selected"); //获取选中的项
      var textVal = options.text();
      if (textVal == "非活动的实例") {
        $(".content-instance[title='ACTIVE']")
          .css("display", "none");
        $(".content-instance[title!='ACTIVE']")
          .css("display", "block");
      } else if (textVal == "活动的实例") {
        $(".content-instance[title='ACTIVE']")
          .css("display", "block");
        $(".content-instance[title!='ACTIVE']")
          .css("display", "none");
      } else {
        $(".content-instance").css("display",
          "block");
      }
    });
});




//重置密码

function changePassword(username){
  console.log("username: "+username);
  var volumeDetach = $(
    $("#template_resetPassword").html())
    .clone();
  var confirm_dialog = new PopupLayer().rebuild({
    trigger: $(".add-user"),
    popupBlk: volumeDetach,
    popwidth: "600px",
    popheight: "150px"
  });
  //调用表单验证
  validateResetPasswordForm(username);
  volumeDetach.find('#confirm_cancel').click(
    function () {
      $.fn.jqLoading("destroy");
      confirm_dialog.remove();
    });

}


//修改权限开始
function grantUser(username) {
  var volumeDetach = $($("#template_grant_user").html()).clone();
  var confirm_dialog = new PopupLayer().rebuild({
    trigger: $(".grantUser"),
    popupBlk: volumeDetach,
    popwidth: "800px",
    popheight: "250px"
  });
  //调用表单验证
  var id = document.getElementById("ds_id").innerHTML;
  //弹框后自动执行的方法
  $(".grant_username").append(username);
  showUngrantedDb(id, username);
  showGrantedDb(id, username);

  //掉级取消弹框
  volumeDetach.find('#confirm_cancel').click(function () {
    $.fn.jqLoading("destroy");
    confirm_dialog.remove();
  });
}
//修改权限结束

//ajax列出 实例下未授权的数据库开始
function showUngrantedDb(id, username) {
  $.ajax({
    url: "com.cmss.rds.instance.grantUser",
    type: "get",
    dataType: "json",
    data: {
      "id": id,
      "username": username
    },
    success: function (returndata) {
      var original = returndata.Db_display;
      // console.log(original);
      if (original != null) {
        $(".ungranted_ul").empty();
        $.each($.parseJSON(original).databases, function (idx, item) {
          $(".ungranted_ul").append(
            "<li class='ungranted_li'>" + item.name +"</li>");

        })
      }//end if original=null
      else {
        $(".ungranted_ul").append("<li>暂无数据</li>");
      }

      $(".ungranted_li").click(function () {
        $(this).toggleClass('grant_active');
      });

      /*    $(document).on('click',".ungranted_li",function (){
       $(this).toggleClass('grant_active');
       })
       $(document).on('click',".granted_li",function (){
       $(this).toggleClass('grant_active');
       }) */
    }
  })
}

//ajax列出 实例下已经授权的数据库开始
function showGrantedDb(id, username) {
  $.ajax({
    url: "com.cmss.rds.instance.grantUser",
    type: "post",
    dataType: "json",
    data: {
      "id": id,
      "username": username
    },
    success: function (returndata) {
      var original = returndata.jsonString;
      // console.log(original);
      // console.log( $.parseJSON(original).user.databases);
      if (original != null) {
        var hasDb = true;
        $.each($.parseJSON(original).user.databases,
          function (idx, item) {
            if (item.name = "") {
              hasDb = false;
            }
          })//each
        if (hasDb == true) {
          $(".granted_ul").empty();
          $.each($.parseJSON(original).user.databases,
            function (idx, item) {
              $(".granted_ul").append(
                "<li class='granted_li'>"
                + item.name
                + "</li>");
            })//each
        }
      }//end if(hasDb == true)
      else {
        $(".granted_ul").append("<li>暂无数据</li>");
      }

      $(".granted_li").click(function () {
        $(this).toggleClass('grant_active');
      });

      /* 	 $(document).on('click',".ungranted_li",function (){
       $(this).toggleClass('grant_active');
       })
       $(document).on('click',".granted_li",function (){
       $(this).toggleClass('grant_active');
       }) */
    }//success
  })
}

//用户面板授权功能
function addAuth() {
  //把active的li添加到右边
  for (var i = 0; i < $('.ungranted_ul .grant_active').length; i++) {
    //console.log(i);
    //console.log($('.ungranted_ul .grant_active').eq(i).text());
    var ungrantActive = $('.ungranted_ul .grant_active').eq(i)
      .text();
    //console.log("左边挪到右边，左边的active有:" + i + " " + ungrantActive);
    $(".granted_ul")
      .append(
      "<li class='granted_li'>" + ungrantActive
      + "</li>");
  }
  //把左边是active的li删掉
  //console.log("删除 :"+i+" "+$('.ungranted_ul .grant_active').eq(i).text());
  $('.ungranted_ul .grant_active').remove();

  $(".granted_li").unbind();
  $(".ungranted_li").unbind();

  $(".granted_li").click(function () {
    $(this).toggleClass('grant_active');
  });
  $(".ungranted_li").click(function () {
    $(this).toggleClass('grant_active');
  });
  /*   $(document).on('click',".ungranted_li",function (){
   $(this).toggleClass('grant_active');
   })
   $(document).on('click',".granted_li",function (){
   $(this).toggleClass('grant_active');
   }) */
}
//用户面板 取消授权功能
function removeAuth() {
  //把右边active的li移动到左边
  for (var i = 0; i < $('.granted_ul .grant_active').length; i++) {
    //console.log(i);
    //console.log($('.granted_ul .grant_active').eq(i).text());
    var grantActive = $('.granted_ul .grant_active').eq(i)
      .text();
    // console.log("右边挪到左边，右边的active有:" + i + " " + grantActive);
    $(".ungranted_ul")
      .append(
      "<li class='ungranted_li'>" + grantActive
      + "</li>");
  }
  //把右边是active的li删掉
  //console.log("删除 :"+i+" "+$('.ungranted_ul .grant_active').eq(i).text());
  $('.granted_ul .grant_active').remove();

  $(".granted_li").unbind();
  $(".ungranted_li").unbind();

  $(".granted_li").click(function () {
    $(this).toggleClass('grant_active');
  });
  $(".ungranted_li").click(function () {
    $(this).toggleClass('grant_active');
  });

}

/*  function confirmRevokeAll(){
 $.ajax({
 url: "com.cmss.rds.instance.grantDB",
 type: "get",
 dataType: "json",
 data: {
 "id": id,
 "name": $(".grant_username").text(),
 },
 success: function (returndata) {
 var original = returndata.jsonString;
 console.log("original"+original);
 if(original==''){
 confirmGrantDB();
 }
 else{
 alert_redefine('zhongzhi', "授权异常，请重试");
 }
 }
 })
 }*/
// 确认授权当前active的数据库，调用grant接口
function confirmGrantDB() {
  var id = document.getElementById("ds_id").innerHTML;
  var activeDB = [];
  for (var i = 0; i < $('.granted_li').length; i++) {
    var grantDB = $('.granted_ul .granted_li').eq(i)
      .text();
    activeDB.push(grantDB);
  }
  console.log(JSON.stringify(activeDB));

  if (activeDB.length == 0) {
    alert_redefine('zhongzhi', "授权实例参数不能为空");
  }
  else {
    //先把该user下所有的db都revoke掉
    $.ajax({
      url: "com.cmss.rds.instance.revokeDB",
      type: "get",
      dataType: "json",
      data: {
        "id": id,
        "name": $(".grant_username").text(),
      },
      success: function (returndata) {
        var original = returndata.jsonString;
        console.log("original"+original);
        //已经能够revoke成功后，执行grant操作
        if(original==''){
          //按照表单中需要grant的db传入参数，grant对应db，grant前已经revoke掉所有绑定的dbs
          $.ajax({
            url: "com.cmss.rds.instance.grantDB",
            type: "get",
            dataType: "json",
            data: {
              "id": id,
              "name": $(".grant_username").text(),
              "activeDB": JSON.stringify(activeDB)//AJAX不能直接传数组，要把数组转成json字符串
            },
            success: function (returndata) {
              var original2 = returndata.jsonString;
              console.log("original2"+original2);
              if(original2==''){
                alert_redefine('zhongzhi', "授权数据库操作成功");
                $(".modal-close").click();
                showUser(id);
              }
              else{
                alert_redefine('zhongzhi', "授权失败，原因为："+original2);
              }
            }
          })       
          }
        else{
          alert_redefine('zhongzhi', "授权异常，请重试");
        }
      }
    })

  }//else
}


//创建实例按钮触发表单
function create_instance () {
  var volumeDetach = $(
    $("#template_create_instance").html()).clone();
  var confirm_dialog = new PopupLayer().rebuild({
    trigger: $(".rds-btn-instance"),
    popupBlk: volumeDetach,
    popwidth: "600px",
    popheight: "150px"
  });
  Get_flavor_id();
  Get_datastore_list();
  Get_networks_list();
  //调用表单验证
  validateContactForm();
  volumeDetach.find('#confirm_cancel').click(function () {
    $.fn.jqLoading("destroy");
    confirm_dialog.remove();
  });
  //})//confirm chongqi 结束
}//click

//创建只读实例按钮触发表单
function create_temp_instance() {
  var volumeDetach = $(
    $("#template_create_temp_instance").html())
    .clone();
  var confirm_dialog = new PopupLayer().rebuild({
    trigger: $(".rds-btn-instance"),
    popupBlk: volumeDetach,
    popwidth: "600px",
    popheight: "150px"
  });
  Get_flavor_id();
  Get_datastore_list();
  Get_networks_list();
  Get_temp_instance();
  //调用表单验证
  validateContactTempForm();
  volumeDetach.find('#confirm_cancel').click(function () {
    $.fn.jqLoading("destroy");
    confirm_dialog.remove();
  });
  //})//confirm chongqi 结束
}//click

function createInstance() {
  var label_shili = $("#label_shili").val();
  var label_admin = $("#label_admin").val();
  var label_password = $("#label_password").val();
  var label_check = $("#label_check").val();

  $.fn.jqLoading({
    height: 100,
    width: 240,
    text: "正在加载中，请耐心等待...."
  });
  $.ajax({
    url: "com.cmss.rds.instance.instances",
    type: "post",
    dataType: "json",
    data: {
      "rds-engine": $("#rds-engine").val(),//数据库引擎mysql
      "rds-engine-ver": $("#rds-engine-ver").val(),//数据库引擎版本
      "rds-flavourID": $("#rds-flavourID").val(),//数据库实例类型
      "label_gb": $("#label_gb").val(),//存储容量
      "label_shili": label_shili,//实例
      "label_admin": label_admin,//管理员
      "label_password": label_password,//密码
      "label_check": label_check,//确认密码
      "label_url": $("#label_url").val(),//外部链接
      "rds-safeGroup": $("#rds-safeGroup").val(),//安全组
      "label_DBname": $("#label_DBname").val(),//数据库名称
      "rds-parameter": $("#rds-parameter").val(),//参数组
      "net_id": $("#rds-networks").val()
      //网络
    },
    success: function (returndata) {
      //alert_redefine('zhongzhi',"创建实例状态："+returndata.state);
      console.log("创建实例返回：" + returndata.state);
      $.fn.jqLoading("destroy");
      location.reload();
    }
  });//END OF AJAX
  //返回创建实例的状态
}

function createTempInstance() {
  var label_shili = $("#label_shili").val();
  var label_admin = $("#label_admin").val();
  var label_password = $("#label_password").val();
  var label_check = $("#label_check").val();

  $.fn.jqLoading({
    height: 100,
    width: 240,
    text: "正在加载中，请耐心等待...."
  });
  // alert("ajax");
  $.ajax({
    url: "com.cmss.rds.instance.tempInstances",
    type: "post",
    dataType: "json",
    data: {
      "rds-engine": $("#rds-engine").val(),//数据库引擎mysql
      "rds-engine-ver": $("#rds-engine-ver").val(),//数据库引擎版本
      "rds-flavourID": $("#rds-flavourID").val(),//数据库实例类型
      "label_gb": $("#label_gb").val(),//存储容量
      "label_shili": label_shili,//实例
      "label_admin": label_admin,//管理员
      "label_password": label_password,//密码
      "label_check": label_check,//确认密码
      "label_url": $("#label_url").val(),//外部链接
      "rds-safeGroup": $("#rds-safeGroup").val(),//安全组
      "label_DBname": $("#label_DBname").val(),//数据库名称
      "rds-parameter": $("#rds-parameter").val(),//参数组
      "net_id": $("#rds-networks").val(),//网络
      "rds-temp-instance": $("#rds-temp-instance").val()
      //复制的实例名

    },
    success: function (returndata) {
      //alert_redefine('zhongzhi',"创建实例状态："+returndata.state);
      console.log("创建实例返回：" + returndata.state);
      $.fn.jqLoading("destroy");
      location.reload();
    }
  });//END OF AJAX
  //返回创建实例的状态
}

function addUser() {
  var id = document.getElementById("ds_id").innerHTML;
  var userName = ($('input[name="addUser_admin"]').val());
  var dbName = $("#addUser_db").val();
  var dbUsername = $("#addUser_admin").val();
  var dbPassword = $("#addUser_password").val();
  var host = $("#addUser_host").val();
  var id = document.getElementById("ds_id").innerHTML;

  $.ajax({
    url: "com.cmss.rds.instance.users",
    type: "post",
    dataType: "json",
    data: {
      "id": id,
      "dbName": dbName,
      "name": dbUsername,
      "password": dbPassword,
      "host": host
    },
    success: function (returndata) {
      if (returndata.status == '') {
        console.log("创建用户成功");
        showUser(id);
      }
      else {
        alert_redefine('create_instance', "创建用户 失败，原因：" + returndata.status);
      }
    }
  })
}//end of addUser

function addDatabase() {

  var id = document.getElementById("ds_id").innerHTML;
  var name = $("#addDatabase_admin").val();
  $.ajax({
    url: "com.cmss.rds.instance.dbs",
    type: "post",
    dataType: "json",
    data: {
      "id": id,
      "name": name,
      "character_set": $("#u136_input").val(),
      "collate": $("#u139_input").val(),
    },
    success: function (returndata) {
      //console.log("添加的数据库是： " + id + name);
      if(returndata.status!==''){
          alert_redefine('chongqi', "创建数据库失败，原因为："+returndata.status);
      }
      else{
      showDB(id);
      }
    }
  })
}//end of addDatabase

function instance_pagination(num) {
  var itemsOnPage = 10;
  $("#instance_pagination").pagination({
    items: num,
    itemsOnPage: itemsOnPage,
    cssStyle: 'light-theme',
    onInit: changePage,
    onPageClick: changePage
  });
}

function changePage() {
  var itemsOnPage = 10;
  var page_index = $("#instance_pagination").pagination(
      'getCurrentPage') - 1;
  $(".rds-content-1-body .content-instance").hide();
  for (var i = page_index * itemsOnPage; i < page_index
  * itemsOnPage + itemsOnPage; i++) {
    $(".rds-content-1-body .content-instance:eq(" + i + ")")
      .show();
  }
}

//添加用户弹出框select表格 展示数据库 开始
function addUserShowDB(id) {
  $.ajax({
    url: "com.cmss.rds.instance.dbDisplay",
    type: "get",
    dataType: "json",
    data: {
      "id": id
    },
    success: function (returndata) {
      var original = returndata.Db_display;
      $("#addUser_db").append("<option>" + "" + "</option>");
      $.each($.parseJSON(original).databases, function (idx,
                                                        item) {
        var new_db_display = "<option>" + item.name
          + "</option>";
        //在apend之前手动绑定button的click方法，不然不管用
        $("#addUser_db").append(new_db_display);
      });
    }
  })
}
//添加用户弹出框select表格 展示数据库 结束

//ajax列出 实例下的数据库开始
function showDB(id) {
  $
    .ajax({
      url: "com.cmss.rds.instance.dbDisplay",
      type: "get",
      dataType: "json",
      data: {
        "id": id
      },
      success: function (returndata) {
        var original = returndata.Db_display;
        //每次添加新的元素的时候，先把旧的都删除掉，防止信息重复
        var firstLine = $("#database_sm_table tr:first");
        $("#database_sm_table").empty();
        $("#database_sm_table").append(firstLine);
        
        //console.log((original).databases);
        if ($.parseJSON(original).databases==null||undefined){
        	alert_redefine('add-database',"加载失败，原因为： "+original);
        }
        else{
        $
          .each(
          $.parseJSON(original).databases,
          function (idx, item) {
            var new_db_display = "<tr class=''><td>"
              + item.name
              + "</td><td><a href='javascript:void(0)' name='"
              + item.name
              + "' type='button' value='删除' class='deleteDB'>删除</a></td></tr>";
            //在apend之前手动绑定button的click方法，不然不管用
            $("#database_sm_table")
              .append(
              new_db_display);
          })
        
        // 删除数据库的弹框
        $('#database_sm_table').off('click');
        $('#database_sm_table')
          .on(
          'click',
          '.deleteDB',
          function () {

            var name = ($(this)
              .attr('name'));
            var volumeDetach = $(
              $(
                "#template_confirm")
                .html())
              .clone();
            volumeDetach.find(
              ".dialog_msg")
              .html("确认删除数据库吗？");
            var confirm_dialog = new PopupLayer()
              .rebuild({
                trigger: $(".rds-btn-instance"),
                popupBlk: volumeDetach,
                popwidth: "450px",
                popheight: "200px"
              });
            volumeDetach
              .find('#confirm_ok')
              .click(
              function (event) {
                confirm_dialog
                  .remove();
                $.fn
                  .jqLoading({
                    height: 100,
                    width: 240,
                    text: "正在加载中，请耐心等待...."
                  });
                //弹框后开始传送数据
                $
                  .ajax({
                    url: "com.cmss.rds.instance.dbs",
                    type: "get",
                    dataType: "json",
                    data: {
                      "id": id,
                      "name": name,
                    },
                    success: function (returndata) {
                      // console.log("删除的数据库"+id+name);
                      if(returndata.status!==''){
                          alert_redefine('chongqi', "删除数据库失败，原因为："+returndata.status);
                      }
                      else{
                      showDB(id);
                      $.fn.jqLoading("destroy");
                      }
                    }
                  })
              });
            volumeDetach
              .find(
              '#confirm_cancel')
              .click(
              function () {
                $.fn
                  .jqLoading("destroy");
                confirm_dialog
                  .remove();
              });

          });
        $(document)
          .on(
          'click',
          '#database_sm_table input,#user_sm_table input',
          function () {
            if ($(this)
                .parent()
                .parent()
                .hasClass(
                "check-selected")) {
              $(this)
                .parent()
                .parent()
                .removeClass(
                "check-selected");
            } else {
              $(this)
                .parent()
                .parent()
                .addClass(
                "check-selected");
            }
          })}
        configDisplay();//参数组展示
      }
    });
}

//用户修改密码，重要！！！必须放在调用  的前面，不然会方法找不到
function doChangePassword(username,password) {
  var id = document.getElementById("ds_id").innerHTML;
  console.log("username2: "+username);
  $.ajax({
    url: "com.cmss.rds.instance.userUpdate",
    type: "post",
    dataType: "json",
    data: {
      "id": id,
      "username": username,
      "password": password
    },
    success: function (returndata) {
      if( returndata.status==''){
        alert_redefine('detachConfig', "重置密码成功");
      }
      else{
        alert_redefine('detachConfig', "重置密码失败，原因为："+returndata.status);

      }
    }
  })
}

//ajax列出 实例下的用户开始
function showUser(id) {
  $
    .ajax({
      url: "com.cmss.rds.instance.userDisplay",
      type: "get",
      dataType: "json",
      data: {
        "id": id
      },
      success: function (returndata) {
        var original = returndata.user_display;
        //每次添加新的元素的时候，先把旧的都删除掉，防止信息重复
        var firstLine = $("#user_sm_table tr:first");
        $("#user_sm_table").empty();
        $("#user_sm_table").append(firstLine);
        //console.log(returndata);
        $.each(
          $.parseJSON(original).users,
          function (idx, item) {

            //手写，拼接的动态div实例
            var new_user_display = "<tr class='' title='" + item.name + "'><td>"
              + item.name
              + "</td><td>"
              + item.host
              + "</td><td class='dbName' id='" + item.name + "'>"
              + ''
              + "</td><td><a onclick='changePassword(this.name)' href='javascript:void(0)' name='"
              + item.name
              + "' value='修改密码' class='changePassword'>修改密码</a><a onclick='grantUser(this.name)' href='javascript:void(0)' name='"
              + item.name
              + "' value='修改权限' class='grantUser'>修改权限</a><a href='javascript:void(0)' name='"
              + item.name
              + "' value='删除' class='deleteUser'>删除</a></td></tr>";
            $("#user_sm_table").append(new_user_display);


            if (item.databases.length > 0) {
              $.each(item.databases,
                function (i,item2) {
                  var a = ("\"#" + item.name + "\"");
                  //console.log(a);
                  $("#" +item.name +"").append("<div class='eachDbClass'>"+item2.name+"</div>");
                });
            }
            else {
              $("#" +item.name +"").append("<div class='eachDbClass'>暂无</div>");
            }

          });
        // 删除用户的弹框
        $('#user_sm_table').off('click');
        $('#user_sm_table')
          .on(
          'click',
          '.deleteUser',
          function () {

            var name = ($(this)
              .attr('name'));
            //                         console.log(name);
            var volumeDetach = $(
              $(
                "#template_confirm")
                .html())
              .clone();
            volumeDetach.find(
              ".dialog_msg")
              .html("确认删除用户吗？");
            var confirm_dialog = new PopupLayer()
              .rebuild({
                trigger: $(".rds-btn-instance"),
                popupBlk: volumeDetach,
                popwidth: "450px",
                popheight: "200px"
              });
            volumeDetach
              .find('#confirm_ok')
              .click(
              function (event) {
                confirm_dialog
                  .remove();
                $.fn
                  .jqLoading({
                    height: 100,
                    width: 240,
                    text: "正在加载中，请耐心等待...."
                  });

                //弹框后开始传送数据
                $
                  .ajax({
                    url: "com.cmss.rds.instance.users",
                    type: "get",
                    dataType: "json",
                    data: {
                      "id": id,
                      "name": name,
                    },
                    success: function (returndata) {
                      if(returndata.status!==''){
                          alert_redefine('chongqi', "删除用户失败，原因为："+returndata.status);
                      }
                      else{
                      //console.log("删除的用户是：  "+id+name);
                      showUser(id);
                      $.fn.jqLoading("destroy");
                      }
                    }
                  })
              });
            volumeDetach
              .find(
              '#confirm_cancel')
              .click(
              function () {
                $.fn
                  .jqLoading("destroy");
                confirm_dialog
                  .remove();
              });

          });
      //ajax列出 实例下的数据库
        showDB(id);
      }
    });
}

//获取flavor-id
function Get_flavor_id() {
  $
    .ajax({
      url: "com.cmss.rds.backup.backup",
      type: "get",
      dataType: "json",
      data: {
        "flag": "GetFlavorId"
      },
      success: function (returndata) {
        delAllItems("rds-flavourID");//删除下拉框的option
        var flavorId = returndata.flavorId;
        if ($.parseJSON(flavorId).flavors.length == 0) {
          var objOption = document
            .createElement("OPTION");
          objOption.text = "暂无数据库实例类型";
          objOption.value = "0";
          objOption.select = true;
          document.getElementById("rds-flavourID").options
            .add(objOption);
        } else {
          $
            .each(
            $.parseJSON(flavorId).flavors,
            function (i, item) {
              var objOption = document
                .createElement("OPTION");
              objOption.text = item.name
                + "(ram:"
                + item.ram
                / 512
                * 200
                + "MB,disk:"
                + item.disk
                + "GB)";
              objOption.value = item.id;
              objOption.select = true;
              document
                .getElementById("rds-flavourID").options
                .add(objOption);
            });
        }
      }
    })
}
;

//获取数据库版本
function Get_datastore_versions() {
  $
    .ajax({
      url: "com.cmss.rds.backup.backup",
      type: "get",
      dataType: "json",
      data: {
        "flag": "GetDatastoreVersions",
        "datastore_name": $("#rds-engine").find(
          "option:selected").text()
      },
      success: function (returndata) {
        delAllItems("rds-engine-ver");//删除下拉框的option
        var datastoreVersions = returndata.datastoreVersions;
        if ($.parseJSON(datastoreVersions).versions.length == 0) {
          var objOption = document
            .createElement("OPTION");
          objOption.text = "暂无数据库实例类型";
          objOption.value = "0";
          objOption.select = true;
          document.getElementById("rds-engine-ver").options
            .add(objOption);
        } else {
          $
            .each(
            $
              .parseJSON(datastoreVersions).versions,
            function (i, item) {
              var objOption = document
                .createElement("OPTION");
              objOption.text = item.name;
              objOption.value = item.name;
              objOption.select = true;
              document
                .getElementById("rds-engine-ver").options
                .add(objOption);
            });
        }
      }
    })
}
;
//删除select的所有option
function delAllItems(select_id) {
  var child = document.getElementById(select_id);
  for (var i = child.options.length - 1; i >= 0; i--) {
    child.remove(i);
  }
}
//获取datastoreList
function Get_datastore_list() {
  $
    .ajax({
      url: "com.cmss.rds.backup.backup",
      type: "get",
      dataType: "json",
      data: {
        "flag": "GetDatastoreList"
      },
      success: function (returndata) {
        delAllItems("rds-engine");//删除下拉框的option
        var datastoreList = returndata.datastoreList;
        if ($.parseJSON(datastoreList).datastores == null
          || $.parseJSON(datastoreList).datastores.length == 0) {
          var objOption = document
            .createElement("OPTION");
          objOption.text = "暂无数据库";
          objOption.value = "0";
          objOption.select = true;
          document.getElementById("rds-engine").options
            .add(objOption);
          var objOption = document
            .createElement("OPTION");
          objOption.text = "暂无数据库实例类型";
          objOption.value = "0";
          objOption.select = true;
          document.getElementById("rds-engine_ver").options
            .add(objOption);
        } else {
          $
            .each(
            $.parseJSON(datastoreList).datastores,
            function (i, item) {
              var objOption = document
                .createElement("OPTION");
              objOption.text = item.name;
              objOption.value = item.id;
              objOption.select = true;
              document
                .getElementById("rds-engine").options
                .add(objOption);
            });
          Get_datastore_versions();
        }
      }
    })
}
;
//获取网络
function Get_networks_list() {
  $
    .ajax({
      url: "com.cmss.rds.backup.backup",
      type: "get",
      dataType: "json",
      data: {
        "flag": "GetNetworks"
      },
      success: function (returndata) {
        delAllItems("rds-networks");//删除下拉框的option
        var networksList = returndata.networksList;
        //alert(networksList);

        if ($.parseJSON(networksList).networks.length == 0) {
          var objOption = document
            .createElement("OPTION");
          objOption.text = "暂无可用网络";
          objOption.value = "0";
          objOption.select = true;
          document.getElementById("rds-networks").options
            .add(objOption);
        } else {
          $
            .each(
            $.parseJSON(networksList).networks,
            function (i, item) {
              var objOption = document
                .createElement("OPTION");
              objOption.text = item.name;
              objOption.value = item.id;
              objOption.select = true;
              document
                .getElementById("rds-networks").options
                .add(objOption);
              console.log(objOption);
            });
        }

      }
    })
}
;

//获取复制实例的列表
function Get_temp_instance() {
  $
    .ajax({
      url: "com.cmss.rds.instance.instanceDisplay",
      type: "post",
      dataType: "json",
      data: {},
      success: function (returndata) {
        delAllItems("rds-temp-instance");//删除下拉框的option
        var display = returndata.display;
        //alert(display);
        if ($.parseJSON(display).instances) {
          if ($.parseJSON(display).instances.length == 0) {
            var objOption = document
              .createElement("OPTION");
            objOption.text = "暂无可用实例";
            objOption.value = "0";
            objOption.select = true;
            document
              .getElementById("rds-temp-instance").options
              .add(objOption);
          } else {
            $
              .each(
              $.parseJSON(display).instances,
              function (i, item) {
                var objOption = document
                  .createElement("OPTION");
                objOption.text = item.name;
                objOption.value = item.id;
                objOption.select = true;
                document
                  .getElementById("rds-temp-instance").options
                  .add(objOption);
                console
                  .log(objOption);
              });
          }
        }//end if($.parseJSON(display).instances
      }
    })
}
;

//获取网络参数详情
function Get_subnets(subnets_id) {
  $.ajax({
    url: "com.cmss.rds.backup.backup",
    type: "get",
    dataType: "json",
    data: {
      "flag": "GetSubnets",
      "subnets_id": subnets_id
    },
    success: function (returndata) {
      var result = returndata.subnets;
      var cidr = $.parseJSON(result).subnet.cidr;
    }
  })
}
;

//flavorid获取flavor名字
function Get_flavorname(flavorid, instance_id) {
  var name = "";
  $.ajax({
    url: "com.cmss.rds.instance.getFlavorNameById",
    type: "get",
    //                 async:true,
    dataType: "json",
    data: {
      "flavorid": flavorid
    },
    success: function (returndata) {
      var result = returndata.flavorInfo;
      name = $.parseJSON(result).flavor.name;
      $(".instance_name" + instance_id).append(name);
    }
  })
}
;
//flavorid获取flavor名字、大小
function Get_flavorInfo(flavorid) {
  $.ajax({
    url: "com.cmss.rds.instance.getFlavorNameById",
    type: "get",
    //                 async:true,
    dataType: "json",
    data: {
      "flavorid": flavorid
    },
    success: function (returndata) {
      var result = returndata.flavorInfo;
      var name = $.parseJSON(result).flavor.name;
      var ram = $.parseJSON(result).flavor.ram;
      $("#ds_cloud_type").html(name);
      $("#ds_cloud_memory").html(ram/512*200 + "MB");
    }
  })
};


//解绑参数组开始
function detachConfig() {
  var instanceID = document.getElementById("ds_id").innerHTML;
  var configID = "d73569f2-3af5-4ad7-a33b-591acb1a2ebc";
  console.log("instanceID" + instanceID);
  console.log("configID" + configID);
  $.ajax({
    url: "com.cmss.rds.config.detachConfig",
    type: "post",
    dataType: "json",
    data: {
      "instanceID": instanceID,
      // "configID": configID
    },
    success: function (returndata) {
      configNow();
      if (returndata.jsonstring == "detach success")
        ;
      alert_redefine('detachConfig', "解绑成功，解绑后该实例需要重启");

    }
  });
}
;
//解绑参数组结束
//绑定参数组开始
function attachConfig(configID) {
  var instanceID = document.getElementById("ds_id").innerHTML;
  //alert(configID);
  //var configID = "d73569f2-3af5-4ad7-a33b-591acb1a2ebc";
  console.log("instanceID" + instanceID);
  console.log("configID" + configID);
  $
    .ajax({
      url: "com.cmss.rds.config.attachConfig",
      type: "post",
      dataType: "json",
      data: {
        "instanceID": instanceID,
        "configID": configID
      },
      success: function (returndata) {

        var config = $("#configNow").html();
        //alert(configNow);
        configNow();
        if (config !== "no configuration") {
          alert_redefine('detachConfig',
            "该实例已经绑定了一个参数组，请先解绑");
        } else if (returndata.jsonstring == "attach success") {
          alert_redefine('detachConfig', "实例绑定参数组成功");
          configNow();
        } else {
            alert_redefine('detachConfig', "绑定参数组失败，原因为： "+returndata.jsonstring);

        }
      }
    });
}
;
//绑定参数组结束
//参数组展示ajax
function configDisplay() {
    $("#dbNow").html($("#ds_storage").html());
    $("#versionNow").html($("#ds_version").html());
  $
    .ajax({
      url: "com.cmss.rds.instance.tempInstances",
      type: "get",
      dataType: "json",
      data: {
    	  "versionNow":$("#versionNow").text()
      },
      success: function (returndata) {
        var original = returndata.configs;
       // console.log(original);
        $_content = $("#cnofig_sm_table");
        $_content.empty();
        var title = " <tr id='table-first'><td>参数组</td><td>描述</td><td>动作</td></tr>"
        $_content.append(title);
        $
          .each(
          $.parseJSON(original).configurations,
          function (i, item) {
            // var new_instance="<tr id="+item.id+" title="+item.name+"><a href='rdsConfigDisplay.html?"+item.id+"'><td><input type='radio' title="+item.name+" id="+item.id+"/>"+item.name+"</td></a><td>"+item.description+"</td></tr>";
            // console.log(item);
            var new_instance = "<tr id=" + item.id + " title=" + item.name + "><td><a href='rdsConfigDisplay.html?"
              + item.id
              + "'>"
              + item.name
              + "</a></td><td>"
              + item.description
              + "</td><td><input type='button' id="
              + item.id
              + " value='绑定参数组' class='add-config' onclick='javascript:attachConfig(this.id);'></td></tr>";

            $_content
              .append(new_instance);
          })
        configNow();
      }//success 结束括号
    })//ajax结束括号
}
function configNow() {
  var id = document.getElementById("ds_id").innerHTML;
  //ajax列出实例的详细信息开始
  $.ajax({
    url: "com.cmss.rds.instance.instanceDisplay",
    type: "get",
    dataType: "json",
    data: {
      "id": id
    },
    success: function (returndata) {
      var original = returndata.display;
      var configID = "";
      $.each($.parseJSON(original), function (i, item) {
        if (item.configuration) {
          configID = item.configuration.name
        } else {
          configID = "no configuration"
        }
        $("#configNow").html(configID);
      })


    }
  });
}



var validator1;
var validator2;
var validator3;
var validator4;

function validateContactForm() {
  $(document)
    .ready(
    function () {
      validator1 = $("#contact_form")
        .validate(
        {
          rules: {
            label_gb: {
              required: true,
              digits: true,
              min: 1,
              max: 5
            },
            label_shili: {
              required: true,
              minlength: 2,
              maxlength: 30,
              EstringCheck: true
            },
            label_admin: {
              required: true,
              root: true,
              os_admin: true,
              minlength: 2,
              maxlength: 16,
              EstringCheck: true
            },
            label_password: {
              required: true,
              minlength: 6,
              maxlength: 8
            },
            label_check: {
              equalTo: "#label_password"
            },
            label_url: {
              isIPv4: true
            },
            label_DBname: {
              required: true,
              EstringCheckAddComma: true,
              minlength: 2,
              maxlength: 30
            }
          },
          messages: {
            label_gb: {
              required: '请输入数据库实例容量',
              digits: '必须输入1-5之间正整数',
              min: '不能小于1GB',
              max: '不能超过5GB',
            },
            label_shili: {
              required: '请输入数据库实例名称',
              minlength: '实例名称不能小于2个字符',
              maxlength: '实例名称不能超过30个字符',
              EstringCheck: '只能包括英文字母、数字和下划线和点'

            },
            label_admin: {
              required: '请输入管理员名称',
              minlength: '管理员名称不能小于2个字符',
              maxlength: '管理员名称不能超过16个字符',
              EstringCheck: '只能包括英文字母、数字和下划线'

            },
            label_password: {
              required: '请输入管理员密码',
              minlength: '管理员密码不能小于6个字符',
              maxlength: '管理员密码不能超过8个字符'
            },
            label_check: {
              equalTo: "两次输入密码不一致"
            },
            label_DBname: {
              required: '请输入数据库名称，也可以用逗号分隔的列表来创建数据库，如：database1, database2"',
              minlength: '数据库名称不能小于2个字符',
              maxlength: '数据库名称不能超过30个字符',
            }

          },

          highlight: function (element,
                               errorClass,
                               validClass) {
            $(element)
              .addClass(
              errorClass)
              .removeClass(
              validClass);
            $(element)
              .fadeOut()
              .fadeIn();
          },
          unhighlight: function (element,
                                 errorClass,
                                 validClass) {
            $(element)
              .removeClass(
              errorClass)
              .addClass(
              validClass);
          },

          errorElement: 'div',

          errorPlacement: function (error, element) {
            error
              .addClass('tooltip tooltip-inner');
            element
              .after(error);
            var pos = $
              .extend(
              {},
              element
                .offset(),
              {
                width: element
                  .outerWidth(),
                height: element
                  .outerHeight()
              });
            error
              .css({
                display: 'block',
                opacity: '0.8',
                top: -pos.height / 2,
                left: 217 + pos.width / 8
              });
          },

          submitHandler: function (form) {
            createInstance();
            $(".modal-close")
              .click();
          }
        });
    });
}//function validateContactForm

function validateContactTempForm() {
  $(document)
    .ready(
    function () {
      validator1 = $("#contact_temp_form")
        .validate(
        {
          rules: {
            label_gb: {
              required: true,
              digits: true,
              min: 1,
              max: 5
            },
            label_shili: {
              required: true,
              minlength: 2,
              maxlength: 30,
              EstringCheck: true
            },
            label_admin: {
              required: true,
              root: true,
              os_admin: true,
              minlength: 2,
              maxlength: 16,
              EstringCheck: true
            },
            label_password: {
              required: true,
              minlength: 6,
              maxlength: 8
            },
            label_check: {
              equalTo: "#label_password"
            },
            label_url: {
              url: true
            },
            label_DBname: {
              required: true,
              EstringCheckAddComma: true,
              minlength: 2,
              maxlength: 30
            }

          },
          messages: {
            label_gb: {
              required: '请输入数据库实例容量',
              digits: '必须输入1-5之间正整数',
              min: '不能小于1GB',
              max: '不能超过5GB',
            },
            label_shili: {
              required: '请输入数据库实例名称',
              minlength: '实例名称不能小于2个字符',
              maxlength: '实例名称不能超过30个字符',
              EstringCheck: '只能包括英文字母、数字和下划线和点'

            },
            label_admin: {
              required: '请输入管理员名称',
              minlength: '管理员名称不能小于2个字符',
              maxlength: '管理员名称不能超过16个字符',
              EstringCheck: '只能包括英文字母、数字和下划线'

            },
            label_password: {
              required: '请输入管理员密码',
              minlength: '管理员密码不能小于6个字符',
              maxlength: '管理员密码不能超过8个字符'
            },
            label_check: {
              equalTo: "两次输入密码不一致"
            },
            label_url: {
              url: '必须符合url格式'
            },
            label_DBname: {
              required: '请输入数据库名称，也可以用逗号分隔的列表来创建数据库，如：database1, database2"',
              minlength: '数据库名称不能小于2个字符',
              maxlength: '数据库名称不能超过30个字符',
            }

          },

          highlight: function (element,
                               errorClass,
                               validClass) {
            $(element)
              .addClass(
              errorClass)
              .removeClass(
              validClass);
            $(element)
              .fadeOut()
              .fadeIn();
          },
          unhighlight: function (element,
                                 errorClass,
                                 validClass) {
            $(element)
              .removeClass(
              errorClass)
              .addClass(
              validClass);
          },

          errorElement: 'div',

          errorPlacement: function (error, element) {
            error
              .addClass('tooltip tooltip-inner');
            element
              .after(error);
            var pos = $
              .extend(
              {},
              element
                .offset(),
              {
                width: element
                  .outerWidth(),
                height: element
                  .outerHeight()
              });
            error
              .css({
                display: 'block',
                opacity: '0.8',
                top: -pos.height / 2,
                left: 217 + pos.width / 8
              });
          },

          submitHandler: function (form) {
            createTempInstance();
            $(".modal-close")
              .click();
          }
        });
    });
}//function validateContactForm
function validateAddUserForm() {
  $(document)
    .ready(
    function () {
      validator2 = $("#addUser_form")
        .validate(
        {
          rules: {
            addUser_admin: {
              required: true,
              minlength: 2,
              maxlength: 16,
              EstringCheck: true
            },
            addUser_password: {
              required: true,
              minlength: 6,
              maxlength: 8
            },
            addUser_check: {
              equalTo: "#addUser_password"
            },
            addUser_host: {
              isIPv4: true
            }
          },
          messages: {
            addUser_admin: {
              required: '请输入用户名',
              minlength: '用户名不能小于2个字符',
              maxlength: '用户名不能超过16个字符',
              EstringCheck: '只能包括英文字母、数字和下划线'

            },
            addUser_password: {
              required: '请输入用户名密码',
              minlength: '用户名密码不能小于6个字符',
              maxlength: '用户名密码不能超过8个字符'
            },
            addUser_check: {
              equalTo: "两次输入密码不一致"
            }
          },

          highlight: function (element,errorClass,validClass) {
            $(element)
             .addClass(errorClass)
             .removeClass(validClass);
            $(element).fadeOut().fadeIn();
          },
          unhighlight: function (element, errorClass,validClass) {
            $(element)
              .removeClass(errorClass)
              .addClass(validClass);
          },
          errorElement: 'div',

          errorPlacement: function (error, element) {
            error
              .addClass('tooltip tooltip-inner');
            element
              .after(error);
            var pos = $
              .extend(
              {},
              element
                .offset(),
              {
                width: element
                  .outerWidth(),
                height: element
                  .outerHeight()
              });
            error
              .css({
                display: 'block',
                opacity: '0.8',
                top: -pos.height / 2,
                left: 217 + pos.width / 8
              });
          },
          submitHandler: function (form) {
            addUser();
            $(".modal-close")
              .click();
          }
        });
    });
}//function validateContactForm

function validateResetPasswordForm(username){
  $(document)
    .ready(
    function () {
      validator4 = $("#resetPassword_form")
        .validate(
        {
          rules: {
            user_new_password: {
              required: true,
              minlength: 6,
              maxlength: 8
            },
            confirm_new_password: {
              equalTo: "#user_new_password"
            },
          },
          messages: {
            user_new_password: {
              required: '请输入用户名密码',
              minlength: '用户名密码不能小于6个字符',
              maxlength: '用户名密码不能超过8个字符'
            },
            confirm_new_password: {
              equalTo: "两次输入密码不一致"
            }
          },

          highlight: function (element,
                               errorClass,
                               validClass) {
            $(element)
              .addClass(
              errorClass)
              .removeClass(
              validClass);
            $(element)
              .fadeOut()
              .fadeIn();
          },
          unhighlight: function (element,
                                 errorClass,
                                 validClass) {
            $(element)
              .removeClass(
              errorClass)
              .addClass(
              validClass);
          },
          errorElement: 'div',

          errorPlacement: function (error, element) {
            error
              .addClass('tooltip tooltip-inner');
            element
              .after(error);
            var pos = $
              .extend(
              {},
              element
                .offset(),
              {
                width: element
                  .outerWidth(),
                height: element
                  .outerHeight()
              });
            error
              .css({
                display: 'block',
                opacity: '0.8',
                top: -pos.height / 2,
                left: 217 + pos.width / 8
              });
          },
          submitHandler: function (form) {
            var password = $("#confirm_new_password").val();
            console.log("password: "+password);
            doChangePassword(username,password);
            $(".modal-close")
              .click();
          }
        });
    });
}
function validateAddDatabaseForm() {
  $(document)
    .ready(
    function () {
      validator3 = $("#addDatabase_form")
        .validate(
        {
          rules: {
            addDatabase_admin: {
              required: true,
              minlength: 3,
              maxlength: 20,
              EstringCheckAddComma: true
            }
          },
          messages: {
            addDatabase_admin: {
              required: '请输入数据库名称，也可以用逗号分隔的列表来创建数据库，如：database1, database2"',
              minlength: '用户名不能小于3个字符',
              maxlength: '用户名不能超过20个字符',
            }
          },

          highlight: function (element,
                               errorClass,
                               validClass) {
            $(element)
              .addClass(
              errorClass)
              .removeClass(
              validClass);
            $(element)
              .fadeOut()
              .fadeIn();
          },
          unhighlight: function (element,
                                 errorClass,
                                 validClass) {
            $(element)
              .removeClass(
              errorClass)
              .addClass(
              validClass);
          },
          errorElement: 'div',

          errorPlacement: function (error, element) {
            error
              .addClass('tooltip tooltip-inner');
            element
              .after(error);
            var pos = $
              .extend(
              {},
              element
                .offset(),
              {
                width: element
                  .outerWidth(),
                height: element
                  .outerHeight()
              });
            error
              .css({
                display: 'block',
                opacity: '0.8',
                top: -pos.height / 2,
                left: 217 + pos.width / 8
              });
          },
          submitHandler: function (form) {
            addDatabase();
            $(".modal-close")
              .click();
          }
        });
    });
}//function validateContactForm