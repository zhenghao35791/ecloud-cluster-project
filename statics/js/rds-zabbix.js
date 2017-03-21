//<!-- ECharts单文件引入 -->

    // Step:3 conifg ECharts's path, link to echarts.js from current page.
    // Step:3 为模块加载器配置echarts的路径，从当前页面链接到echarts.js，定义所需图表路径
function createCharts(obj){  
	//var e= event.target||event.srcElement;//.parent()
	var instanceName = obj.name;
	//alert(instanceName);
	require.config({
        paths: {
            echarts: 'http://echarts.baidu.com/build/dist'
        }
    });

    // Step:4 require echarts and use it in the callback.
    // Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
    require(
            [
                'echarts',
                'echarts/chart/bar',
                'echarts/chart/line',
                'echarts/chart/map'
            ],
            function(ec) {
                //--- 折柱 ---
                var myChart = ec.init(document.getElementById('mainn'));
                var myChart2 = ec.init(document.getElementById('mainn2'));
                var myChart3 = ec.init(document.getElementById('mainn3'));
                var myChart4 = ec.init(document.getElementById('mainn4'));
                var myChart5 = ec.init(document.getElementById('mainn5'));
                var myChart6 = ec.init(document.getElementById('mainn6'));

                myChart.showLoading({
                    text: '图二正在努力加载中...'
                });
                myChart2.showLoading({
                    text: '图一正在努力加载中...'
                });
                myChart3.showLoading({
                    text: '图三正在努力加载中...'
                });
                myChart4.showLoading({
                    text: '图四正在努力加载中...'
                });
                myChart5.showLoading({
                    text: '图五正在努力加载中...'
                });
                myChart6.showLoading({
                    text: '图六正在努力加载中...'
                });
                //定义装着time和value的数组
                var cpuLoadtimes = [];
                var cpuLoadvalues = [];

                var utilizationTimes = [];
                var utilizationValues = [];

                var memoryTimes = [];
                var memoryValues = [];

                var networkTimes = [];
                var networkValues = [];

                var iostatUtilTimes = [];
                var iostatUtilValues = [];

                var iostatByteTimes = [];
                var iostatByteValues = [];

                //向后台发送请求，并获得数据
                $.ajax({
                    url: "com.cmss.rds.zabbix.get_historydata",
                    type: "post",
                    dataType: "json",
                    async :"false",
                    data: {
                    	"instanceName":instanceName,
                    	"dataNum":100
                    },
                    success: function (returndata) {

                        var original = returndata.data;
                        //original = "["+original+"]";
                       console.log($.parseJSON(original));

                        $.each($.parseJSON(original).host.graph, function (i, item)
                                {          
                        	console.log("item :"+item);
                        	console.log("i :"+i);
                        	console.log(item.graphname);

                        		/*	console.log($.parseJSON(original));
                                    console.log($.parseJSON(original).host);
                                    console.log($.parseJSON(original).host.graph);
                                    console.log($.parseJSON(original).host.graph.graphname);*/

                                    //图一
                                    if(item.graphname=="CPU load"){
                                            $.each((item.item), function (i_1, item_1)
                                            {
                                                $.each((item_1.historydata), function (i_1_1, item_1_1)
                                            {
                                           	//console.log("item_2.value"+item_2.value);
                                           	//console.log("item_2.clock"+item_2.clock);

                                                cpuLoadvalues.push(item_1_1.value);
                                                var time = new Date(item_1_1.clock * 1000);
                                                var hours=time.getHours();
                                                var minutes=time.getMinutes();
                                                var seconds=time.getSeconds();
                                                cpuLoadtimes.push(hours+":"+minutes+":"+seconds);
                                            })
                                            })
                                    }//end If CPU load

                                    //图二
                                    if(item.graphname=="CPU utilization"){
                                    	 $.each((item.item), function (i_2, item_2)
                                                 {
                                                     $.each((item_2.historydata), function (i_2_2, item_2_2)
                                                 {
                                                utilizationValues.push(item_2_2.value);
                                                var time = new Date(item_2_2.clock * 1000);
                                                var hours=time.getHours();
                                                var minutes=time.getMinutes();
                                                var seconds=time.getSeconds();
                                                utilizationTimes.push(hours+":"+minutes+":"+seconds);
                                            })
                                                 })
                                    }//end If CPU utilization

                                    //图三
                                    if(item.graphname=="Memory usage"){
                                    	$.each((item.item), function (i_3, item_3)
                                                {
                                                    $.each((item_3.historydata), function (i_3_3, item_3_3)
                                                {
                                                memoryValues.push(item_3_3.value);
                                                var time = new Date(item_3_3.clock * 1000);
                                                var hours=time.getHours();
                                                var minutes=time.getMinutes();
                                                var seconds=time.getSeconds();
                                                memoryTimes.push(hours+":"+minutes+":"+seconds);
                                            })
                                        })
                                    }//end If Memory usage

                                    //图四
                                    if(item.graphname=="Network traffic on eth0"){
                                    	$.each((item.item), function (i_4, item_4)
                                                {
                                                    $.each((item_4.historydata), function (i_4_4, item_4_4)
                                                {
                                                networkValues.push(item_4_4.value);
                                                var time = new Date(item_4_4.clock * 1000);
                                                var hours=time.getHours();
                                                var minutes=time.getMinutes();
                                                var seconds=time.getSeconds();
                                                networkTimes.push(hours+":"+minutes+":"+seconds);
                                            })
                                        })
                                    }//end If Network traffic

                                    //图五
                                    if(item.graphname=="iostat - vdb - Utilisation"){
                                    	$.each((item.item), function (i_5, item_5)
                                                {
                                                    $.each((item_5.historydata), function (i_5_5, item_5_5)
                                                {
                                                iostatUtilValues.push(item_5_5.value);
                                                var time = new Date(item_5_5.clock * 1000);
                                                var hours=time.getHours();
                                                var minutes=time.getMinutes();
                                                var seconds=time.getSeconds();
                                                iostatUtilTimes.push(hours+":"+minutes+":"+seconds);
                                            })
                                        })
                                    }//end If Network traffic

                                    //图六
                                    if(item.graphname=="iostat - vdb - Bytessec"){
                                    	$.each((item.item), function (i_6, item_6)
                                                {
                                                    $.each((item_6.historydata), function (i_6_6, item_6_6)
                                                {
                                                iostatByteValues.push(item_6_6.value);
                                                var time = new Date(item_6_6.clock * 1000);
                                                var hours=time.getHours();
                                                var minutes=time.getMinutes();
                                                var seconds=time.getSeconds();
                                                iostatByteTimes.push(hours+":"+minutes+":"+seconds);
                                            })
                                        })
                                    }//end If Network traffic
                                    
                                    
                                    
                                    
                                    
                                }
                        );
                        /*
                         * 打印辅助。看留个图像的value数组的长度
                        console.log(cpuLoadvalues.length);
                        console.log(utilizationValues.length);
                        console.log(memoryValues.length);
                        console.log(networkValues.length);
                        console.log(iostatUtilValues.length);
                        console.log(iostatByteValues.length);
						*/
                        
                        //第一张表的数据处理，拿出每一条线的time和value
                        if(cpuLoadtimes.length == 0)
                        {
                            cpuLoadtimes1 = [0];
                        }
                        else
                        {
                            cpuLoadtimes1 = cpuLoadtimes.splice(0,100);
                        }
                        if(cpuLoadvalues.length == 0)
                        {
                            cpuLoadvalues1 = [0];
                            cpuLoadvalues2 = [0];
                            cpuLoadvalues3 = [0];
                        }
                        else
                        {
                            cpuLoadvalues1 = cpuLoadvalues.splice(0,100);
                            cpuLoadvalues2 = cpuLoadvalues.splice(0,100);
                            cpuLoadvalues3 = cpuLoadvalues.splice(0,100);
                        }

                        //第二张表的数据处理，拿出每一条线的time和value
                        if(utilizationTimes.length == 0)
                        {
                            utilizationTimes1 = [0];
                        }
                        else
                        {
                            utilizationTimes1 = utilizationTimes.splice(0,100);
                        }
                        if(utilizationValues.length == 0)
                        {
                            utilizationValues1 = [0];
                            utilizationValues2 = [0];
                            utilizationValues3 = [0];
                            utilizationValues4 = [0];
                            utilizationValues5 = [0];
                            utilizationValues6 = [0];
                            utilizationValues7 = [0];
                            utilizationValues8 = [0];
                        }
                        else
                        {
                            utilizationValues1 = utilizationValues.splice(0,100);
                            utilizationValues2 = utilizationValues.splice(0,100);
                            utilizationValues3 = utilizationValues.splice(0,100);
                            utilizationValues4 = utilizationValues.splice(0,100);
                            utilizationValues5 = utilizationValues.splice(0,100);
                            utilizationValues6 = utilizationValues.splice(0,100);
                            utilizationValues7 = utilizationValues.splice(0,100);
                            utilizationValues8 = utilizationValues.splice(0,100);
                        }


                        //第三张表暂时为空， 数据处理，拿出每一条线的time和value
                        //*****如果第三张表为空，给数组赋值0，起码要有数据，才会画出表的基本框架。
                        if(memoryTimes.length == 0)
                        {
                            memoryTimes1=[0,1,2,3];
                        }
                        else
                        {
                            memoryTimes1 = memoryTimes.splice(0,100);
                        }
                        if(memoryValues.length == 0)
                        {
                            memoryValues1=[0.23,1.35,4.46,2.21];
                            memoryValues2=[6.54,2.31,0.12,4.42];
                        }
                        else
                        {
                            memoryValues1 = memoryValues.splice(0,100);
                            memoryValues2 = memoryValues.splice(0,100);
                        }

                        //第四张表暂时为空， 数据处理，拿出每一条线的time和value
                        //*****如果第四张表为空，给数组赋值0，起码要有数据，才会画出表的基本框架。
                        if(networkTimes.length == 0)
                        {
                            networkTimes1 = [0,2,4,8,10];
                        }
                        else
                        {
                            networkTimes1 = networkTimes.splice(0,100);
                        }
                        if(networkValues.length == 0)
                        {
                            networkValues1 = [0.2,2.2,1.1,2.9,6.7];
                            networkValues2 = [20.1,10.2,5.9,15.2,2.4];
                        }
                        else
                        {
                            networkValues1 = networkValues.splice(0,100);
                            networkValues2 = networkValues.splice(0,100);
                        }

                        //第五张表的数据处理，拿出每一条线的time和value
                        if(iostatUtilTimes.length == 0)
                        {
                            iostatUtilTimes1 = [0];
                        }
                        else
                        {
                            iostatUtilTimes1 = iostatUtilTimes.splice(0,100);
                        }
                        if(iostatUtilValues.length == 0)
                        {
                            iostatUtilValues1 = [0];
                        }
                        else
                        {
                            iostatUtilValues1 = iostatUtilValues.splice(0,100);
                        }

                        //第六张表的数据处理，拿出每一条线的time和value
                        if(iostatByteTimes.length == 0)
                        {
                            iostatByteTimes1 = [0];
                        }
                        else
                        {
                            iostatByteTimes1 = iostatByteTimes.splice(0,100);
                        }
                        if(iostatByteValues.length == 0)
                        {
                            iostatByteValues1 = [0];
                            iostatByteValues2 = [0];
                        }
                        else
                        {
                            iostatByteValues1 = iostatByteValues.splice(0,100);
                            iostatByteValues2 = iostatByteValues.splice(0,100);
                        }


//                        console.log("cpuLoadvalues1"+cpuLoadvalues1);
//                        console.log("cpuLoadvalues2"+cpuLoadvalues2);
//                        console.log("cpuLoadvalues3"+cpuLoadvalues3);
                        //第一张图的option开始
                        var cpuLoadoption = {
                            title : {
                                text: 'CPU load',
                                subtext: 'rds-monitor'
                            },
                            tooltip : {
                                trigger: 'axis'
                            },
                            legend: {
                            	x:150,
                                data:['processor load(1 min average per core)','processor load(5 min average per core)','processor load(15 min average per core)']
                            },
                            toolbox: {
                                show : true,
                                feature : {
                                    mark : {show: false},
                                    dataView : {show: true, readOnly: false},
                                    magicType : {show: true, type: ['line', 'bar']},
                                    restore : {show: false},
                                    saveAsImage : {show: false}
                                }
                            },
                            calculable : true,
                            xAxis : [
                                {
                                    type : 'category',
                                    boundaryGap : false,
                                    data : cpuLoadtimes1
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value',

                                }
                            ],
                            series : [
                                {
                                    name:'processor load(1 min average per core)',
                                    type:'line',
                                    data:cpuLoadvalues1,
//                         	            markPoint : {
//                         	                data : [
//                         	                    {type : 'max', name: '最大值'},
//                         	                    {type : 'min', name: '最小值'}
//                         	                ]
//                         	            },
                                    markLine : {
                                        data : [
                                            {type : 'average', name: '平均值'}
                                        ]
                                    }
                                },
                                {
                                    name:'processor load(5 min average per core)',
                                    type:'line',
                                    data:cpuLoadvalues2,
//                         	           markPoint : {
//                         	                data : [
//                         	                    {type : 'max', name: '最大值'},
//                         	                    {type : 'min', name: '最小值'}
//                         	                ]
//                         	            },
                                    markLine : {
                                        data : [
                                            {type : 'average', name : '平均值'}
                                        ]
                                    }
                                },
                                {
                                    name:'processor load(15 min average per core)',
                                    type:'line',
                                    data:cpuLoadvalues3,
//                         	            markPoint : {
//                         	                data : [
//                         	                    {type : 'max', name: '最大值'},
//                         	                    {type : 'min', name: '最小值'}
//                         	                ]
//                         	            },
                                    markLine : {
                                        data : [
                                            {type : 'average', name : '平均值'}
                                        ]
                                    }
                                }
                            ]
                        };
                        //第一张图的option结束

                        //第二张图的option开始
                        var utilizationOption = {
                            title : {
                                text: 'CPU utilization',
                                subtext: 'rds-monitor'
                            },
                            tooltip : {
                                trigger: 'axis'
                            },
                            legend: {
                            	x: 150,
                                data:['CPU idle time','CPU user time','CPU system time','CPU iowait time','CPU nice time','CPU interrupt time','CPU softirq time','CPU steal time']
                            },
                            toolbox: {
                                show : true,
                                feature : {
                                    mark : {show: false},
                                    dataView : {show: true, readOnly: false},
                                    magicType : {show: true, type: ['line', 'bar']},
                                    restore : {show: false},
                                    saveAsImage : {show: false}
                                }
                            },
                            calculable : true,
                            xAxis : [
                                {
                                    type : 'category',
                                    boundaryGap : false,
                                    data : utilizationTimes1
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value',
                                    axisLabel : {
                                        formatter: '{value} %'
                                    }
                                }
                            ],
                            series : [
                                {
                                    name:'CPU idle time',
                                    type:'line',
                                    stack: '百分比',
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:utilizationValues1
                                },
                                {
                                    name:'CPU user time',
                                    type:'line',
                                    stack: '百分比',
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:utilizationValues2
                                },
                                {
                                    name:'CPU system time',
                                    type:'line',
                                    stack: '百分比',
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:utilizationValues3
                                },
                                {
                                    name:'CPU iowait time',
                                    type:'line',
                                    stack: '百分比',
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:utilizationValues4
                                },
                                {
                                    name:'CPU nice time',
                                    type:'line',
                                    stack: '百分比',
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:utilizationValues5
                                },
                                {
                                    name:'CPU interrupt time',
                                    type:'line',
                                    stack: '百分比',
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:utilizationValues6
                                },
                                {
                                    name:'CPU softirq time',
                                    type:'line',
                                    stack: '百分比',
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:utilizationValues7
                                },
                                {
                                    name:'CPU stael time',
                                    type:'line',
                                    stack: '百分比',
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:utilizationValues8
                                }
                            ]
                        };
                        //第二张图的option结束

                        //第三张图option开始
                        var memoryOption = {
                            title : {
                                text: 'Memory Usage',
                                subtext: 'rds-monitor'
                            },
                            tooltip : {
                                trigger: 'axis'
                            },
                            legend: {
                                data:['total memory','available memory']
                            },
                            toolbox: {
                                show : true,
                                feature : {
                                    mark : {show: false},
                                    dataView : {show: true, readOnly: false},
                                    magicType : {show: true, type: ['line', 'bar']},
                                    restore : {show: false},
                                    saveAsImage : {show: false}
                                }
                            },
                            calculable : true,
                            xAxis : [
                                {
                                    type : 'category',
                                    boundaryGap : false,
                                    data : memoryTimes1
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value'
                                }
                            ],
                            series : [
                                {
                                    name:'total memory',
                                    type:'line',
                                    smooth:true,
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:memoryValues1
                                },
                                {
                                    name:'available memory',
                                    type:'line',
                                    smooth:true,
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:memoryValues2
                                }
                            ]
                        };
                        //第三张图option结束

                        //第四张图option开始
                        var networkOption = {
                            title : {
                                text: 'Network traffic on eth0',
                                subtext: 'rds-monitor'
                            },
                            tooltip : {
                                trigger: 'axis'
                            },
                            legend: {
                            	x:250,
                                data:['Incoming Network traffic on eth0','Outgoing Network traffic on eth0']
                            },
                            toolbox: {
                                show : true,
                                feature : {
                                    mark : {show: false},
                                    dataView : {show: true, readOnly: false},
                                    magicType : {show: true, type: ['line', 'bar']},
                                    restore : {show: false},
                                    saveAsImage : {show: false}
                                }
                            },
                            calculable : true,
                            xAxis : [
                                {
                                    type : 'category',
                                    boundaryGap : false,
                                    data : networkTimes1
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value'
                                }
                            ],
                            series : [
                                {
                                    name:'Incoming Network traffic on eth0',
                                    type:'line',
                                    smooth:true,
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:networkValues1
                                },
                                {
                                    name:'Outgoing Network traffic on eth0',
                                    type:'line',
                                    smooth:true,
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:networkValues2
                                }
                            ]
                        };
                        //第四张图option结束

                        //第五张图option开始
                        var iostatUtilOption = {
                            title : {
                                text: 'iostat - vdb - Utilisation',
                                subtext: 'rds-monitor'
                            },
                            tooltip : {
                                trigger: 'axis'
                            },
                            legend: {
                                data:['vdb %util']
                            },
                            toolbox: {
                                show : true,
                                feature : {
                                    mark : {show: false},
                                    dataView : {show: true, readOnly: false},
                                    magicType : {show: true, type: ['line', 'bar']},
                                    restore : {show: false},
                                    saveAsImage : {show: false}
                                }
                            },
                            calculable : true,
                            xAxis : [
                                {
                                    type : 'category',
                                    boundaryGap : false,
                                    data : iostatUtilTimes1
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value'
                                }
                            ],
                            series : [
                                {
                                    name:'vdb %util',
                                    type:'line',
                                    smooth:true,
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:iostatUtilValues1
                                }
                            ]
                        };
                        //第五张图option结束

                        //第六张图option开始
                        var iostatByteOption = {
                            title : {
                                text: 'iostat - vdb - Bytes/sec',
                                subtext: 'rds-monitor'
                            },
                            tooltip : {
                                trigger: 'axis'
                            },
                            legend: {
                                data:['vdb%util(line1)','vdb%util(line2)']
                            },
                            toolbox: {
                                show : true,
                                feature : {
                                    mark : {show: false},
                                    dataView : {show: true, readOnly: false},
                                    magicType : {show: true, type: ['line', 'bar']},
                                    restore : {show: false},
                                    saveAsImage : {show: false}
                                }
                            },
                            calculable : true,
                            xAxis : [
                                {
                                    type : 'category',
                                    boundaryGap : false,
                                    data : iostatByteTimes1
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value'
                                }
                            ],
                            series : [
                                {
                                    name:'vdb%util(line1)',
                                    type:'line',
                                    smooth:true,
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:iostatByteValues1
                                },
                                {
                                    name:'vdb%util(line2)',
                                    type:'line',
                                    smooth:true,
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:iostatByteValues2
                                }
                            ]
                        };
                        //第六张图option结束


                        //载入图的option开始
                        myChart.setOption(cpuLoadoption);
                        myChart.hideLoading();

                        myChart2.setOption(utilizationOption);
                        myChart2.hideLoading();

                        myChart3.setOption(memoryOption);
                        myChart3.hideLoading();

                        myChart4.setOption(networkOption);
                        myChart4.hideLoading();

                        myChart5.setOption(iostatUtilOption);
                        myChart5.hideLoading();

                        myChart6.setOption(iostatByteOption);
                        myChart6.hideLoading();
                        //载入图的option开始
                    }//success
                })//ajax
            }//function ec
    );
}
//<!-- ECharts单文件引入结束 -->