/**
 * Created by chenlei on 2017/12/2.
 */
$(document).ready(function(){


var datestar = "";
var dateend = "";

// var tit = "";
// var num = '1';
// var total = '0';
// var acturalPage = acturalPage || 1;
var reportId;
var gridData = [];


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
    caption: '日报列表',
    colNames: ['发送日期', '姓名', '学习内容', '学习收获', '问题反馈', '操作'],
    colModel: [
        {name: 'createTime'},
        {name: 'studentName'},
        {name: 'studyContent'},
        {name: 'studyHarvest'},
        {name: 'questionFeedback'},
        {
            name: 'myac',
            width:200
        }
    ],
    key: 'id',
    urlCreater: 'mobile/dailyPaper/school?type=0&state=0&',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var studentName = jQuery("#student-keyword").val();
        var key = isRegular(studentName);
        var createTime = $('input[name="sendtime"]').val();

        var newUrl = apiUrl + "mobile/dailyPaper/school?type=0&state=0&page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
        if(studentName !== ""){
            newUrl +=  "&"+ key + "=" + studentName;
        }
        if(createTime !== ""){
            newUrl +=  "&createTime="+createTime;
        }
        jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
    },
    loadComplete: function (ids, data) {

        gridData = data;

        for (var i = 0; i < ids.length; i++) {
            var cl = ids[i];
            var ae = '<button id="detail_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" onclick="detail_fn(this)"><i class="icon-trash align-top bigger-125"></i>详情</button>';
            var ce = '<button id="approve_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" onclick="approve_fn(this)"><i class="icon-trash align-top bigger-125"></i>通过</button>';
            var se = '<button id="noapprove_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" onclick="noapprove_fn(this)"><i class="icon-trash align-top bigger-125"></i>打回</button>';
            jQuery("#grid-table").jqGrid(
                'setRowData',
                ids[i],
                {
                    myac: ae + ce + se
                }
            );
        }

    }
});



    //搜索
    var btnSeacher = $("#btn-search");

    // 正则
    function isRegular(str) {
        var morn = "";
        var math = /^[0-9]*$/g;   //纯数字
        var name = /^[A-Za-z0-9\u4e00-\u9fa5]+$/g;  //数字英文中文，不包含特殊字符
        if(str.match(math) !== null ){
            morn = "userId";
        }else{
            if(str.match(name) !== null ){
                morn = "studentName";
            }else{
                alert("请输入正确的姓名或者学号");
            }
        }
        return morn;
    }

    btnSeacher.on("click",function(){
        jQuery("#grid-table").jqGrid('setGridParam', {
            url : ''
        }).trigger('reloadGrid');
    });
});