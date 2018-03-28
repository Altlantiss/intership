/**
 * Created by wanghaijiang on 2017/12/23.
 */


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
    caption: '学生对我的考评列表',
    colNames: ['姓名', '学号', '实习单位', '满意度', '创建时间', '评语'],
    colModel: [
        {name: 'studentName'},
        {name: 'studentId'},
        {name: 'enterprise'},
        {name: 'satisfied'},
        {name: 'createTime'},
        {name: 'remark'}
    ],
    key: 'id',
    urlCreater: 'mobile/teacherEvaluate?',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var studentName = jQuery("#student-keyword").val();
        var createTime = $('input[name="sendtime"]').val();
        var newUrl = apiUrl + "/mobile/teacherEvaluate?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
        if(studentName !== ""){
            newUrl +=  "&name="+studentName;
        }
        if(createTime !== ""){
            newUrl +=  "&time="+createTime;
        }
        jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
    },
    loadComplete: function (ids, data) {

        gridData = data;

        for (var i = 0; i < ids.length; i++) {
            var cl = ids[i];
            var ce = '<button id="evaluate_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" onclick="open_edit_dialog_fn(this)"><i class="icon-trash align-top bigger-125"></i>考评</button>';
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


$(document).ready(function(){
    //搜索
    var btnSeacher = $("#btn-search");

    btnSeacher.on("click",function(){
        jQuery("#grid-table").jqGrid('setGridParam', {
            url : ''
        }).trigger('reloadGrid');
        // var studentKeyword = $("#student-keyword").val();
        // $.ax({
        //     url: apiUrl + '/mobile/studentEvaluate?page=1&limit=10&studentName='+studentKeyword,
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