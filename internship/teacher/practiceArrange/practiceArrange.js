/**
 * Created by chenlei on 2017/12/2.
 */


var datestar = "";
var dateend = "";

// var tit = "";
// var num = '1';
// var total = '0';
// var acturalPage = acturalPage || 1;
var groupInfo;

function open_arrange_pratice_dialog() {
    $('#arrange_practice_dialog').show();
    // $('#job').val("");
    // $('#treatment').val("");
    // $('#enterprise').val("");
    // $('#workAddress').val("");
    // $('#stayAddress').val("");
}

function close_arrange_pratice_dialog(){
    $('#arrange_practice_dialog').hide();
}

// var today = new Date();
// beginday = today.getTime()-31 * 24 * 3600 * 1000;

$(function () {

    // 统一安排实习
    $('#arrange-practice').click(function () {
        open_arrange_pratice_dialog();
    });

    initTime('sendtime', function () {

        datestar = '';
        dateend = '';

    }, function (startDate, endDate) {

        datestar = startDate.format('YYYY-MM-DD');
        dateend = endDate.format('YYYY-MM-DD');

    });

    initTime('pratice-time', function () {

        praticeStartDate = '';
        praticeEndDate = '';

    }, function (startDate, endDate) {

        praticeStartDate = startDate.format('YYYY-MM-DD');
        praticeEndDate = endDate.format('YYYY-MM-DD');

    });

    $.ajax({
        type: 'GET',
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get('token'));
        },
        url: apiUrl + 'mobile/practiceGroup',
        data: {
            page: 1,
            limit: 100,
            token: cookie.get('token')
        },
        success: function (data) {
            var optionString = '';

            groupInfo = data.data.list;

            if (groupInfo) {

                $.each(groupInfo, function (i, item) {

                    optionString += "<option value='" + item.id + "' " + (i === 0 ? "selected" : "") + ">" + item.groupName + "</option>";

                });

            }

            $('#choose-group').empty().append(optionString);

        }
    });


    function initTime(name, cancelDelegate, applyDelegate) {

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



    }

});


initJqGrid({
    caption: '实习列表',
    colNames: ['实习单位', '实习岗位', '实习地址', '安排老师', '安排时间', '实习学生','操作'],
    colModel: [
        {
            name: 'enterprise'
        },
        {
            name: 'job'
        },
        {
            name: 'stayAddress'
        },
        {
            name: 'teacherName'
        },
        {
            name: 'createTime'
        },
        {
            name: 'studentName'
        },
        {
            name: 'myac'
        }
    ],
    key: 'id',
    urlCreater: 'mobile/practice?',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var studentName = jQuery("#student-keyword").val();
        var key = isRegular(studentName);
        var createTime = $('input[name="sendtime"]').val();
        var newUrl = apiUrl + "/mobile/practice?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
        if(studentName !== ""){
            newUrl +=  "&"+ key + "=" + studentName;
        }

        if(createTime !== ""){
            newUrl +=  "&createTime="+createTime;
        }
        jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
    },
    loadComplete: function (ids, data) {
        for (var i = 0; i < ids.length; i++) {
            var cl = ids[i];
            var se = '<button id="class_studentqq_' + cl + '" class="btn btn-xs btn-success" onclick="update_dialog_fn(' + cl + ');" style="float:left;margin-left:5px;"><i class="icon-trash align-top bigger-125"></i>编辑</button>';
            var ce = '<button id="class_delete_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" onclick="delete_fn(this)"><i class="icon-trash align-top bigger-125"></i>删除</button>';
            jQuery("#grid-table").jqGrid(
                'setRowData',
                cl,
                {
                    myac: se + ce
                }
            );
        }


    }
});



// 更新
function update_groupTeacher() {
    var editEnterprise = jQuery("#editEnterprise").val();
    var editJob = jQuery("#editJob").val();
    var editStayAddress = jQuery("#editStayAddress").val();
    var editTeacherName = jQuery("#editTeacherName").val();
    var editStartDate = jQuery("#editStartDate").val();
    var editStudentName = jQuery("#editStudentName").val();

    $.ajax({
        type: "PUT",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "/mobile/practice",//路径
        data: {
            "id": editTeacherId,
            "enterprise": editEnterprise,
            "job": editJob,
            "stayAddress": editStayAddress,
            "teacherName": editTeacherName,
            "startDate": editStartDate,
            "studentName": editStudentName
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("编辑实习成功!");
                close_update_dialog();
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("编辑实习失败!");
            }
        }
    });
}
// 删除
function delete_fn(e) {
    /**
     * 获取选择的实习ID
     */
    var choose_practice_id = parseInt(e.id.split("_")[2]);
    $.ajax({
        type: "DELETE",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "/mobile/practice?id=" + choose_practice_id,//路径
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("删除记录成功!");
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("删除记录失败!");
            }
        }
    });
}
// 编辑
function update_dialog_fn(id) {

    editTeacherId = id;

    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/practice/"+id ,//路径
        data: {
            // "id": id
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                jQuery("#editEnterprise").val(data.data.enterprise);
                jQuery("#editJob").val(data.data.job);
                jQuery("#editStayAddress").val(data.data.stayAddress);
                jQuery("#editTeacherName").val(data.data.teacherName);
                jQuery("#editStartDate").val(data.data.startDate);
                jQuery("#editStudentName").val(data.data.studentName);
                jQuery('#group_update_dialog').css('display', 'block');
            } else {
                alert("获取实习信息失败!");
            }

        }
    });

}
// 关闭编辑
function close_update_dialog() {
    jQuery('#group_update_dialog').css('display', 'none');
}
// 统一实习安排保存
function save_arrange_practice() {

    var groupId = $('#choose-group').val();
    var teacherId;
    for (var i = 0; i < groupInfo.length; i++) {

        if (groupInfo[i].id + '' === groupId) {

            teacherId = groupInfo[i].teacherId;

            break;

        }

    }
    var job = $('#job').val();
    var treatment = $('#treatment').val();
    var enterprise = $('#enterprise').val();
    var workAddress = $('#workAddress').val();
    var stayType = $('#stayType').val();
    var stayAddress = $('#stayAddress').val();
    var timer = $("#pratice-time").val();
    var startTime = timer.split(" - ")[0]; //开始实习时间
    var endTime = timer.split(" - ")[1]; //结束实习时间

    //把日历时间改写成 年-月-日 格式
    startTime = startTime.split("/");
    startTime = startTime[2] + "-" + startTime[1] + "-" +startTime[0];
    endTime = endTime.split("/");
    endTime = endTime[2] + "-" + endTime[1] + "-" +endTime[0];

    //校验teacher id，接口的锅
    if (!teacherId) {

        my_alert('提示', '该群组未分配教师，请选择其他群组');
        return;

    }

    $.ajax({
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get('token'));
        },
        url: apiUrl + 'mobile/practice',
        data: {
            groupId: groupId,
            teacherId: teacherId,
            job: job,
            treatment: treatment,
            enterprise: enterprise,
            startDate: startTime,
            endDate: endTime,
            workAddress: workAddress,
            stayType: stayType,
            stayAddress: stayAddress,
            token: cookie.get('token')
        },
        success: function (data) {
            if (data['code'] === 0) {

                my_alert('提示', '统一实习安排成功！', false, reloadJqGrid);

            } else {

                my_alert('提示(' + data['code'] + ')', data['msg']);

            }

            close_arrange_pratice_dialog();

        },
        error:function(err){

        }
    });

}


// 正则
function isRegular(str) {
    var morn = "";
    var math = /^[0-9]*$/g;   //纯数字
    var name = /^[A-Za-z0-9\u4e00-\u9fa5]+$/g;  //数字英文中文，不包含特殊字符
    if(str.match(math) !== null ){
        morn = "treatment";
    }else{
        if(str.match(name) !== null ){
            morn = "enterprise";
        }else{
            alert("请输入正确的实习单位名称或者组织机构代码");
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
