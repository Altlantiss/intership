/**
 * Created by chenlei on 2017/12/2.
 */
$(document).ready(function(){


var datestar = "";
var dateend = "";

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

initJqGrid({
    caption: '工作记录列表',
    colNames: ['创建时间','寻访学生','所属系部','专业','班级','实习公司', '寻访方式', '时间', '寻访内容'],
    colModel: [
        {name: 'createTime'},
        {name: 'studentName'},
        {name: 'departName'},
        {name: 'majorName'},
        {name: 'className'},
        {name: 'enterprise'},
        {name: 'tour'},
        {name: 'tourDate'},
        {
            name: 'remark',
            formatter: function (cellValue) {

                return cellValue ? cellValue : '';

            }
        }
    ],
    key: 'id',
    urlCreater: 'mobile/guide?',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var studentName = jQuery("#student-keyword").val();
        var createTime = $('input[name="sendtime"]').val();
        var newUrl = apiUrl + "/mobile/guide?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
        if(studentName !== ""){
            newUrl +=  "&studentName="+studentName;
        }
        if(createTime !== ""){
            newUrl +=  "&createTime="+createTime;
        }
        jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
    }
});

$(document).ready(function(){
    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/guide?page=1&limit=10",//路径
        data: {
            // "id": id
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            console.log(data)
            if (data.code === 0) {

            } else {
                alert("获取教师信息失败!");
            }

        }
    });
});


    //搜索
    var btnSeacher = $("#btn-search");

    btnSeacher.on("click",function(){
        jQuery("#grid-table").jqGrid('setGridParam', {
            url : ''
        }).trigger('reloadGrid');
        // var studentKeyword = $("#student-keyword").val();
        // $.ax({
        //     url: apiUrl + '/mobile/guide?page=1&limit=10&studentName='+studentKeyword,
        //     type: 'GET',
        //     data: {
        //         token: cookie.get('token')
        //     },
        //     success: function (data) {
        //
        //     },
        //     error:function(err){
        //         alert("请求出错!请稍后重试");
        //         console.log(err);
        //     }
        // });

    });

});