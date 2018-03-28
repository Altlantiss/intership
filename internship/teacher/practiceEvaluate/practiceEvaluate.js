/**
 * Created by wanghaijiang on 2017/12/23.
 */




var datestar = "";
var dateend = "";
var evaluateId;
var gridData;
var studentInfo;



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


    //初始化供选择的学生下拉框（添加按钮点击弹出）
    $.ajax({
        type: 'GET',
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get('token'));
        },
        url: apiUrl + 'mobile/practiceGroupUser',
        data: {
            page: 1,
            limit: 100,
            token: cookie.get('token')
        },
        success: function (data) {

            var optionString = '';

            studentInfo = data.data.list;

            if (studentInfo) {

                $.each(studentInfo, function (i, item) {

                    optionString += "<option value='" + item.studentId + "' " + (i === 0 ? "selected" : "") + ">" + item.studentName + "</option>";

                });

            }

            $('#choose-student').empty().append(optionString);

        }
    });

});

initJqGrid({
    caption: '我对学生的考评列表',
    colNames: ['姓名', '学号', '实习单位', '等级', '创建时间', '评语', '操作'],
    colModel: [
        {name: 'studentName'},
        {name: 'studentId'},
        {name: 'enterprise'},
        {name: 'level'},
        {name: 'createTime'},
        {name: 'comment'},
        {name: 'myac'}
    ],
    key: 'id',
    urlCreater: 'mobile/studentEvaluate?',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var studentName = jQuery("#student-keyword").val();
        var createTime = $('input[name="sendtime"]').val();
        var newUrl = apiUrl + "/mobile/studentEvaluate?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
        if(studentName !== ""){
            newUrl +=  "&studentName="+studentName;
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


//event

function open_add_dialog_fn() {

    $('#choose-student').val('');

    $('#choose-edit-level').val('');

    $('#add_evaluate_dialog').find('textarea').val('');

    open_add_evaluate_dialog();

}

function open_edit_dialog_fn(e) {

    evaluateId = parseInt(e.id.split("_")[1]);

    var evaluateInfo = {};

    for (var i = 0; i < gridData.length; i++) {

        if (parseInt(gridData[i].id) === evaluateId) {

            evaluateInfo = gridData[i];

            break;

        }

    }

    $('#choose-edit-level').val(evaluateInfo.level);

    $('#add_evaluate_dialog').find('textarea').val(evaluateInfo.comment);

    open_edit_evaluate_dialog();

}

function save_add_evaluate() {

    var studentId = jQuery('#choose-student').val();

    var level = jQuery("#choose-add-level").val();

    var comment = jQuery("#add-comment").val();

    add_evaluate(studentId, level, comment);

}

function save_edit_evaluate() {

    var level = jQuery("#choose-edit-level").val();

    var comment = jQuery("#edit-comment").val();

    edit_evaluate(evaluateId, level, comment);

}


//action

function open_add_evaluate_dialog(e) {
    jQuery('#add_evaluate_dialog').css('display', 'block');
}

function close_add_evaluate_dialog() {
    jQuery('#add_evaluate_dialog').css('display', 'none');
}

function open_edit_evaluate_dialog(e) {
    jQuery('#edit_evaluate_dialog').css('display', 'block');
}

function close_edit_evaluate_dialog() {
    jQuery('#edit_evaluate_dialog').css('display', 'none');
}

function add_evaluate(studentId, level, comment) {

    $.ajax({
        type: "POST",
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/studentEvaluate",//路径
        data: {
            studentId: studentId,
            level: level,
            comment: comment
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("评价成功!");
                close_add_evaluate_dialog();
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("评价失败!");
            }
        }
    });
}

function edit_evaluate(id, level, comment) {

    $.ajax({
        type: "PUT",
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/studentEvaluate",//路径
        data: {
            id: id,
            level: level,
            comment: comment
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("评价成功!");
                close_edit_evaluate_dialog();
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("评价失败!");
            }
        }
    });
}

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