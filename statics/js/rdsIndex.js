/*AJAX 获取仪表盘数据---开始*/
    $(function(){
    	get_dashboard();
    });
   
    function get_dashboard(){
    	$.ajax({
            url: "com.cmss.rds.dashboard.dashboard",
            type: "get",
            dataType: "json",
            data: {
            },
            success: function (returndata) {
                console.log(returndata.result);
                var result_json=$.parseJSON(returndata.result);
                var configurations_default_num=1;
                $("#shuju_num").html("<a href='rdsInstance.html'>"+result_json.instance.instances_num+"</a>");
                $("#backup_num").html("<a href='rdsBackup.html'>"+result_json.backup.backups_num+"</a>");
                $("#backup_num2").html("<a href='rdsBackup.html'>"+result_json.backup.backups_num+"</a>");
                $("#config_num").html("<a href='rdsConfig.html'>"+1+"</a>");
                if (result_json.configuration.configurations_num-1<0){
                    $("#config_num2").html("<a href='rdsConfig.html'>"+0+"</a>");
                    $("#config_num").html("<a href='rdsConfig.html'>"+0+"</a>");
                    configurations_default_num=0;
                }
                else{
                	$("#config_num2").html("<a href='rdsConfig.html'>"+(result_json.configuration.configurations_num)+"</a>");
                }
                createIndexCharts(result_json.instance.instances_num, result_json.instance.instances_active_num, result_json.instance.instances_inactive_num, result_json.backup.backups_num, result_json.configuration.configurations_num, result_json.configuration.configurations_55_num, result_json.configuration.configurations_56_num, result_json.configuration.configurations_other_num, configurations_default_num);
            }
        })
    }
   
/*AJAX 获取仪表盘数据---结束*/
    
    
    //仪表盘图表 
    function createIndexCharts(instances_num,instances_active_num,instances_inactive_num,backups_num,configurations_num,configurations_55_num,configurations_56_num,configurations_other_num,configurations_default_num){  
    	//var instanceName = obj.name;
    	//alert(instanceName);
    	
                	var Chart1 = echarts.init(document.getElementById('Chart1'));

                    Chart1.showLoading({
                        text: '图一1正在努力加载中...'
                    });
                   
                    //定义装着time和value的数组
                    var cpuLoadtimes = [];
                    var cpuLoadvalues = [];
                    //向后台发送请求，并获得数据

                    //第一张图的option开始
                    option1 = {
                            /*title : {
                            	 text: '概况',
                                 subtext: 'rds使用情况',
                                 x: 'center'
                            },*/
                            color:[ '#91C7AE','#C23531', '#63869E','#91C7AE','#63869E','#314656','#C23531'],
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            legend: {
                            	show:false,
                                x : 'left',//水平安放位置，默认为全图居中，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
                                y : 'bottom',
                                orient:'vertical',
                                itemGap: 25,
                                itemWidth:20,
                                itemHeight:20,
                                data:['活动的实例','非活动实例','未使用的实例','5.5版本参数组','5.6版本参数组','其他版本参数组','default参数组']
                            },
                            toolbox: {
                                show : false,
                                feature : {
                                    mark : {show: true},
                                    dataView : {show: true, readOnly: false},
                                    magicType : {
                                        show: true,
                                        type: ['pie', 'funnel']
                                    },
                                    restore : {show: true},
                                    saveAsImage : {show: true}
                                }
                            },
                            calculable : true,
                            series : [

                                {
                                
                                	hoverAnimation:true,
                                    name:'实例图',
                                    markLine:true,
                                    type:'pie',
                                    radius : [70, 100],//内半径，外半径
                                    center : ['15%','57%'],//圆心坐标，支持绝对值（px）和百分比
                                    // ，百分比计算min(width, height) * 50%
                                    //roseType : 'radius',//	南丁格尔玫瑰图模式，'radius'（半径） | 'area'（面积）
                                /*    x: '50%',               // for funnel 左上角横坐标，数值单位px，支持百分比（字符串），如'50%'(显示区域横向中心)
                                    sort : 'ascending',     // for funnel 数据排序， 可以取ascending, descending
    */                              min:0,
//                                    max:20,                // for funnel 指定的最大值
                                    splitNumber:1,
                                    data:[
                                        {value:instances_active_num, name:'活动的实例'},
                                        {value:instances_inactive_num, name:'非活动实例'},
                                        {value:20-instances_num, name:'未使用的实例'}

                                    ]
                                },
                                {
                                    name:'访问来源',
                                    type:'pie',
                                    center : ['45%','57%'],//圆心坐标，支持绝对值（px）和百分比
                                    radius : [70, 100],//内半径，外半径
                                    itemStyle : {
                                        normal : {
                                            label : {
                                                show : true
                                            },
                                            labelLine : {
                                                show : true
                                            }
                                        },
                                        emphasis : {
                                            label : {
                                                show : true,
                                                position : 'center',
                                                textStyle : {
                                                    fontSize : '14',
                                                    fontWeight : 'bold'
                                                }
                                            }
                                        }
                                    },
                                    data:[
                                        {value:configurations_55_num, name:'5.5版本参数组'},
                                        {value:configurations_56_num, name:'5.6版本参数组'},
                                        {value:configurations_other_num, name:'其他版本参数组'},
                                        {value:configurations_default_num, name:'default参数组'},
                                    ]
                                },
                              {
                                    name:'备份图',
                                    type:'gauge',
                                    center : ['77%','57%'],//圆心坐标，支持绝对值（px）和百分比
                                
                                    splitNumber:5,
                                    detail : {formatter:'{value}%'},
                                    axisLine:{
                                        show: true,
                                        lineStyle: {
                                            color: [
                                                [0.2, '#91C7AE'],
                                                [0.8, '#63869E'],
                                                [1, '#C23531']
                                            ],
                                            width:25
                                        }
                                    },
                                    splitLine :{
                                        show: true,
                                        splitNumber: 10,
                                        length :25,
                                        lineStyle: {
                                            color: 'white',
                                            width: 1,
                                            type: 'solid',
                                        }
                                    } ,
                                    pointer:{
                                        length : '75%',
                                        width : 5,
                                        color : 'auto'
                                    },
                                    title:{
                                    	textStyle:{
                                    		color:'#91C7AE',
                                    		fontFamily:'微软雅黑' ,
                                    		fontSize:12
                                    	},
                                    	offsetCenter :['-5px','-50px']
                                    },
                                    data:[{value: backups_num, name: '备份使用率'}]
                                }
                                
                                
                            ]
                        };
                    
                    //载入图的option开始
                    Chart1.setOption(option1);
                    Chart1.hideLoading();

                    //载入图的option开始
    }
    
    
    //tab切换代码
    $(".rds-table-wap .rds-tab a").click(function(){
        $(this).addClass('rds-tab-active').siblings().removeClass('rds-tab-active');
    });