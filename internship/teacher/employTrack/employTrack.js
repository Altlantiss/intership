/**
 * Created by wanghaijiang on 2017/12/23.
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
    caption: '就业列表',
    colNames: ['发送时间','姓名', '学号', '就业单位', '地址', '单位性质', '行业', '工作岗位', '薪资', '联系人'],
    colModel: [
        {name: 'createTime'},
        {name: 'studentName'},
        {name: 'studentId'},
        {name: 'enterpriseName'},
        {name: 'address'},
        {name: 'nature'},
        {name: 'industry'},
        {name: 'job'},
        {name: 'treement'},
        {name: 'concatPeople'}
    ],
    key: 'id',
    urlCreater: 'mobile/obtain?',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var studentName = jQuery("#student-keyword").val();
        var createTime = $('input[name="sendtime"]').val();
        var newUrl = apiUrl + "/mobile/obtain?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
        if(studentName !== ""){
            newUrl +=  "&studentName="+studentName;
        }
        if(createTime !== ""){
            newUrl +=  "&createTime="+createTime;
        }
        jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
    }
});


    //搜索
    var btnSeacher = $("#btn-search");

    btnSeacher.on("click",function(){
        var studentKeyword = $("#student-keyword").val();
        $.ajax({
            url: apiUrl + '/mobile/obtain?page=1&limit=10&studentName='+studentKeyword,
            type: 'GET',
            data: {
                token: cookie.get('token')
            },
            success: function (data) {
                jQuery("#grid-table").jqGrid('setGridParam', {
                    url : ''
                }).trigger('reloadGrid');
            },
            error:function(err){
                alert("请求出错!请稍后重试");
                console.log(err);
            }
        });

    });


});