// by Altlantis 12.28

$(document).ready(function(){

    var arrX = [];
    var arrY = [];
    var myChart = echarts.init(document.getElementById('main'));
    function dataAjax(address){
        $.ajax({
            type: "GET",  //提交方式
            beforeSend: function (request) {
                request.setRequestHeader("token", cookie.get("token"));
            },
            url: apiUrl + address,//路径
            data: {
            },
            success: function (data) {//返回数据根据结果进行相应的处理

                if (data.code === 0) {
                    arrX = [];
                    arrY = [];
                    for( var i =0; i<data.data.length;i++){

                        var arrKeys = Object.keys(data.data[i]);  //取出对象的所有key

                        for( var j =0; j<arrKeys.length;j++ ){
                            if( arrKeys[j] === "count" ){
                                arrY.push(data.data[i][arrKeys[j]]);
                            }else{
                                arrX.push(data.data[i][arrKeys[j]]);
                            }
                        }
                    }
                    var option = {
                        color: ['#3398DB'],
                        tooltip : {
                            trigger: 'item',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'line',          // 默认为直线，可选为：'line' | 'shadow'
                                axis : 'auto',
                                label:{
                                    show: true
                                }
                            }

                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                data : arrX,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                name:'直接访问',
                                type:'bar',
                                label:{
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                barWidth: '60%',
                                data:arrY
                            }
                        ]
                    };
// 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                } else {
                    alert("获取数据失败");
                }
            }
        });
    }
    dataAjax("mobile/studentLoginLog");



    var pageList = $(".page-list a");

    pageList.on("click",function(){
        $(this).addClass("active");
        $(this).siblings().removeClass("active");

        var address = $(this).attr("href");
        dataAjax(address);

        return false;
    })

});
