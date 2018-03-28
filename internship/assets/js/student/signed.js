/**
 * Created by chenlei on 2017/12/6.
 */
var datestar = "";
var dateend = "";
var tit = "";
var num = '1';
var total = '0';
var acturalPage = acturalPage || 1;
var pageSize = pageSize || 15;

window.onload = function () {
    getPageSearch(acturalPage,pageSize);

};

$(function () {

    //日历
    var sendTiem = $(".sendtime");
    sendTiem.daterangepicker({
        singleDatePicker: true,
        showDropdowns: false,
        // startDate: new Date(beginday),
        // endDate: new Date(),
        // maxDate: new Date(),
        locale: {
            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'],
            firstDay: 1
        }
    });

    //选择日期获取详情表
    sendTiem.on('apply.daterangepicker', function (ev, picker) {
        datestar = picker.startDate.format('YYYY-MM-DD');
        $('input[name="sendtime"]').val(datestar);
    });
    $('input[name="sendtime"]').val("");
    jQuery("#student-keyword").val("");
});


// 请求数据
function getPageSearch(acturalPage, pageSize) {
//
//     $.ajax({
//     	url: apiUrl + '/mobile/practice/my',
//         type: 'GET',
//         data: {
//             token: cookie.get('token')
//         },
//         success: function (data) {
//
//         	if(data.code == 0) {
//         		console.log(data);
//                 removeload();
// /*                $('#t_info_1').html(data.data[0].enterprise);
//                 $('#t_info_2').html(data.data[0].enterprise);
//                 $('#t_info_4').html(data.data[0].enterprise);
//                 $('#t_info_5').html(data.data[0].enterprise);
//                 $('#t_info_6').html(data.data[0].enterprise);
//                 $('#t_info_7').html(data.data[0].enterprise);
//                 $('#t_info_8').html(data.data[0].enterprise);
//                 $('#t_info_9').html(data.data[0].enterprise);
//                 $('#t_info_10').html(data.data[0].enterprise);
//                 $('#t_info_11').html(data.data[0].enterprise);
//                 $('#t_info_12').html(data.data[0].enterprise);*/
//                 $('#t_info_13').html(data.data[0].enterprise);
//                 $('#t_info_14').html(data.data[0].job);
//                 $('#t_info_15').html(data.data[0].startDate);
//                 $('#t_info_16').html(data.data[0].endDate);
//                 $('#t_info_17').html(data.data[0].treatment);
//             }
//         }
//     });
//     $.ax({
//     	url: apiUrl + '/mobile/getMyInfo',
//         type: 'GET',
//         data: {
//             token: cookie.get('token')
//         },
//         success: function (data) {
//
//         	if(data.code == 0) {
//         		console.log(data);
//                 removeload();
//                 //$('#t_info_1').html(data.data.student.sex);
//                 $('#t_info_2').html(data.data.student.name);
//                 $('#t_info_3').html(data.data.student.sex);
//                 $('#t_info_4').html(format(data.data.student.birth, 'yyyy-MM-dd HH:mm:ss'));
//                 $('#t_info_5').html(data.data.student.navitePlace);
//                 $('#t_info_6').html(data.data.student.userNo);
//                 $('#t_info_7').html(data.data.student.myClass);
//                 $('#t_info_8').html(data.data.student.major);
//                 $('#t_info_9').html(data.data.student.joindate);
//                 $('#t_info_10').html(data.data.student.leavedate);
//                 $('#t_info_11').html(data.data.student.email);
//                 $('#t_info_12').html(data.data.student.tel);
//             }
//         }
//     });
//     $.ax({
//     	url: apiUrl + '/mobile/attend',
//         type: 'GET',
//         data: {
//         	page: acturalPage,
//             limit: pageSize,
//             token: cookie.get('token')
//         },
//         success: function (data) {
//
//         	if(data.code == 0) {
//         		console.log(data);
//         		list = '';
//         		var json = data.data.list;
//                 if (json) {
//                     var s_time = '';
//                     $.each(json, function (i, item) {
//                         if (item.create !== null) {
//                             s_time = item.createTime;
//                         }
//                         list += "<tr>";
//                         /*list += "<td class='tit'>" + returnnull(item.title) + "</td>";
//
//         				list += "<td>" + s_time + "</td>";
//         */				list += "<td>" + s_time + "</td>";
//         				list += "<td class='tit'>" + returnnull(item.location) + "</td>";
//                        /* list += "<td>{0}&nbsp;&nbsp;</td></tr>".format(
//                            "<a href='javascript:void(0)' onclick='deletepopup(" + item.notification_id + ")'>查看</a>"
//                         );*/
//                     });
//                 }
//
//                 $('#notice_list').html(list);
//             }
//         }
//     });
// }

    var format = function (time, format) {
        var t = new Date(time);
        var tf = function (i) {
            return (i < 10 ? '0' : '') + i
        };
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                case 'HH':
                    return tf(t.getHours());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
            }
        })
    }

// 点击删除按钮，跳出弹框
    function deletepopup(id) {
        $('#deletepopup').show();
        de_id = id;
    }

    function closepopup() {
        $('#deletepopup').hide();
    }

    function detailpopup(value) {
        $('#detailpopup').show();
        de_id = id;
    }

    function closedetailpopup(id) {
        $('#detailpopup').hide();
    }

// 点击确认删除通知
    function notice_delete(id) {

        closepopup();

        var data = {
            "code": 20000,
            "message": "成功",
            "run_execute_time": "0.0069s",
            "data": {
                "list": [],
                "count": "1",
                "page_no": "1",
                "page_size": "15"
            }
        };

        removeload();
        if (data['code'] != 20000) {
            my_alert('提示(' + data['code'] + ')', '查看' + data['message']);
            return false;
        } else {
            // my_alert('提示(' + ret_data['code'] + ')', '删除'+ret_data['message']);
            $('#notice_list').html('');
            //getPageSearch(tit, datestar, dateend, 1, page_size);
        }
    }

//分页
    $(document).on('click', '#page ul li', function () {
        if ($(this).attr('num') == null) {
            return false;
        }
        num = $(this).attr('num');
        //获取列表
        getPageSearch(num, page_size);
    })

}




jQuery(document).ready(function(){

    var grid_selector = "#grid-table";
    var pager_selector = "#grid-pager";

    jQuery(grid_selector).jqGrid({
        url:"",
        mtype: "GET",
        datatype: "json",
        height: 372,
        colNames:['签到时间','公司','签到人'],
        colModel:[
            {name:'attendTime',index:'attendTime', width:150,editable:false},
            {name:'enterprise',index:'enterprise',width:250, editable:false},
            {name:'studentName',index:'studentName', width:200}
        ],
        key: 'id',
        viewrecords : true,
        rowNum: 10,
        rowList:[10,20,30],
        pager : pager_selector,
        altRows: true,
        multiselect: true,
        multiboxonly: true,
        autoScroll: true,
        jsonReader: {
            root:"data.list", page:"data.pageNum", total:"data.pages",          //   很重要 定义了 后台分页参数的名字。
            records:"data.total"
        },
        beforeRequest:function(){
            var currentpage = jQuery("#grid-table").jqGrid('getGridParam','page');
            var rowNum = jQuery("#grid-table").jqGrid('getGridParam','rowNum');
            var notice_title = jQuery("#notic_title_search").val();
            var createTime = $('input[name="sendtime"]').val();
            var newUrl = apiUrl+"mobile/attend?page="+currentpage+"&limit="+rowNum+"&token="+cookie.get("token");
            if(notice_title != ""){
               newUrl =newUrl + "&enterprise="+ notice_title;
            }
            if(createTime !== ""){
                newUrl +=  "&time="+createTime;
            }
            jQuery("#grid-table").jqGrid('setGridParam',{url:newUrl});
        },
        loadComplete : function(){
            var table = this;
            setTimeout(function(){
                styleCheckbox(table);
                updateActionIcons(table);
                updatePagerIcons(table);
                enableTooltips(table);
            }, 0);
            update_grid_css();
        },
        caption: "签到列表",
        autowidth: true
    });

    jQuery("#btn-search").click(function(){
        jQuery("#grid-table").jqGrid().trigger("reloadGrid");
    });

});

function update_grid_css(){
    jQuery(".ui-jqgrid-view>.ui-jqgrid-titlebar").css("background-color","#39a7b3");
    jQuery(".ui-jqgrid .ui-jqgrid-htable th div").css("padding-top", "0px");
    jQuery(".ui-jqgrid .ui-jqgrid-pager").css("height","40px");
    jQuery(".ui-jqgrid .ui-pager-control").css("height","32px");
    jQuery('.ui-jqgrid-labels th[id*="_cb"]:first-child>div').css("padding-top","12px");
}

function styleCheckbox(table) {
}

function updateActionIcons(table) {
}

function updatePagerIcons(table) {
    var replacement =
        {
            'ui-icon-seek-first' : 'icon-double-angle-left bigger-140',
            'ui-icon-seek-prev' : 'icon-angle-left bigger-140',
            'ui-icon-seek-next' : 'icon-angle-right bigger-140',
            'ui-icon-seek-end' : 'icon-double-angle-right bigger-140'
        };
    $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
        var icon = $(this);
        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

        if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
    })
}
function enableTooltips(table) {
    $('.navtable .ui-pg-button').tooltip({container:'body'});
    $(table).find('.ui-pg-div').tooltip({container:'body'});
}

var attend = $("#attend");
attend.on("click",function(){
    $.ajax({
        type: "post",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/attend",//路径
        data: {

        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("签到成功!");
                jQuery("#grid-table").jqGrid('setGridParam', {
                    url : ''
                }).trigger('reloadGrid');
            } else {
                alert("签到失败!");
            }

        }
    });
});







