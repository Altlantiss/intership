/**
 * Created by chenlei on 2017/12/2.
 */



var datestar = "";
var dateend = "";

// var tit = "";
// var num = '1';
// var total = '0';
// var acturalPage = acturalPage || 1;


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
    caption: '签到列表',
    colNames: ['姓名', '实习企业', '签到时间', '签到地点', '操作'],
    colModel: [
        {
            name: 'studentName'
        },
        {
            name: 'enterprise'
        },
        {
            name: 'attendTime'
        },
        {
            name: 'location'
        },
        {
            name: 'myac'
        }
    ],
    key: 'id',
    urlCreater: 'mobile/attend?classId=' + 1 + '&schoolId=' + 1 + '&',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var studentName = jQuery("#student-keyword").val();
        var key = isRegular(studentName);
        var createTime = $('input[name="sendtime"]').val();
        var newUrl = apiUrl +  'mobile/attend?classId=' + 1 + '&schoolId=' + 1 + '&'+"page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
        if(studentName !== ""){
            newUrl +=  "&"+ key + "=" + studentName;
        }
        if(createTime !== ""){
            newUrl +=  "&time="+createTime;
        }
        jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
    },
    loadComplete: function (ids, data) {
        console.log(data);
        for (var i = 0; i < ids.length; i++) {
            var cl = ids[i];
            var ce = '<button id="remind_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" onclick="remind_checkin_fn(this)"><i class="icon-trash align-top bigger-125"></i>提醒签到</button>';
            jQuery("#grid-table").jqGrid(
                'setRowData',
                ids[i],
                {
                    myac: ce
                }
            );
        }

    }
});




function remind_checkin_fn(e) {

    var id = e.id.split("_")[1] + "";

    $.ajax({
        type: "POST",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "/mobile/notice/attend",//路径
        data: {
            "userIds": id
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                my_alert('提示', '已发送提醒');
            } else {
                alert("获取信息失败!");
            }
        },
        error:function(err){
            my_alert('提示', '提醒出错');
        }
    });

}
// 正则
function isRegular(str) {
    var morn = "";
    var math = /^[0-9]*$/g;   //纯数字
    var name = /^[A-Za-z0-9\u4e00-\u9fa5]+$/g;  //数字英文中文，不包含特殊字符
    if(str.match(math) !== null ){
        morn = "userId";
    }else{
        if(str.match(name) !== null ){
            morn = "name";
        }else{
            alert("请输入正确的姓名或者学号");
        }
    }
    return morn;
}

$(document).ready(function(){
    //搜索
    var btnSeacher = $("#btn-search");

    btnSeacher.on("click",function(){
        jQuery("#grid-table").jqGrid('setGridParam', {
            url : ''
        }).trigger('reloadGrid');
    });
});