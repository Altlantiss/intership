/**
 * Created by chenlei on 2017/12/7.
 */



var datestar = "";
var dateend = "";






function getApproveState(state) {

    if (state === 0) {

        return '未审批';

    }
    else if (state === 1) {

        return '通过';

    }
    else if (state === 2) {

        return '不通过';

    }

}


// 审批通过
function approve_fn(e) {

    my_alert('提示', '审批通过？', true, function () {

        var id = parseInt(e.id.split("_")[1]);

        $.ajax({
            type: 'PUT',
            beforeSend: function (request) {
                request.setRequestHeader("token", cookie.get('token'));
            },
            url: apiUrl + '/mobile/practiceApply/approval?id=' + id + '&state=' + 1,
            success: function (data) {
                if (data['code'] === 0) {
                    my_alert('提示', '提交成功', true, reloadJqGrid);
                } else {
                    my_alert('提示(' + data['code'] + ')', data['msg']);
                }

            }
        });

    });

}


// 审批不通过
function noapprove_fn(e) {

    my_alert('提示', '审批不通过？', true, function () {

        var id = parseInt(e.id.split("_")[1]);

        $.ajax({
            type: 'PUT',
            beforeSend: function (request) {
                request.setRequestHeader("token", cookie.get('token'));
            },
            url: apiUrl + 'mobile/practiceApply/approval?id=' + id + '&state=' + 2,
            success: function (data) {
                if (data['code'] === 0) {
                    my_alert('提示', '提交成功', true, reloadJqGrid);
                } else {
                    my_alert('提示(' + data['code'] + ')', data['msg']);
                }

            }
        });

    });

}

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
    caption: '实习申请列表',
    colNames: ['姓名', '学号', '系（部）', '专业', '班级', '实习单位', '实习岗位', '开始时间','结束时间','申请时间', '状态', '操作'],
    colModel: [
        {
            name: 'studentName',
            width: 80
        },
        {
            name: 'studentId',
            width: 50
        },
        {
            name: 'departName',
            width: 90
        },
        {
            name: 'majorName',
            width: 90
        },
        {
            name: 'className',
            width: 90
        },
        {
            name: 'enterprise'
        },
        {
            name: 'job'
        },
        {
            name: 'startDate'
        },
        {
            name: 'endDate'
        },
        {
            name: 'createTime'
        },
        {
            name: 'state',
            index: 'state',
            sortable: false,
            editable: false,
            formatter: function (cellValue) {

                return getApproveState(cellValue);

            },
            width: 90
        },
        {
            name: 'myac',
            width:200
        }
    ],
    key: 'id',
    urlCreater: 'mobile/practiceApply/school?',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var studentName = jQuery("#student-keyword").val();
        var key = isRegular(studentName);
        var createTime = $('input[name="sendtime"]').val();
        var state = $("#approvalProcess").val();
        var newUrl = apiUrl + "/mobile/practiceApply/school?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
        if(studentName !== ""){
            newUrl +=  "&" + key+ "=" + studentName;
        }
        if(createTime !== ""){
            newUrl +=  "&createTime="+createTime;
        }
        if( state != -1 ){
            newUrl +=  "&state="+state;
        }
        jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
    },
    loadComplete: function (ids, data) {

        for (var i = 0; i < ids.length; i++) {
            var ce,se;
            var cl = ids[i];
            if( data[i]["state"] === "未审批" ){
                ce = '<button id="approve_' + cl + '" class="btn btn-xs btn-success" style="float:left;margin-left:5px;" onclick="approve_fn(this)"><i class="icon-trash align-top bigger-125"></i>通过</button>';
                se = '<button id="noapprove_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" onclick="noapprove_fn(this)"><i class="icon-trash align-top bigger-125"></i>不通过</button>';
            }else{
                ce = '<button id="approve_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" disabled="disabled" onclick="approve_fn(this)"><i class="icon-trash align-top bigger-125"></i>通过</button>';
                se = '<button id="noapprove_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" disabled="disabled" onclick="noapprove_fn(this)"><i class="icon-trash align-top bigger-125"></i>不通过</button>';
            }
            jQuery("#grid-table").jqGrid(
                'setRowData',
                ids[i],
                {
                    myac: ce + se
                }
            );
        }

    }
});

// 标题搜索--------------
//
//
// $('#btn-search').click(function () {
//     tit = $('#student-keyword').val();
//     getPageSearch(acturalPage, pageSize, state);
// });
//
// //回车键搜索
// function mylist() {
//     tit = $('#student-keyword').val();
//     getPageSearch(acturalPage, pageSize, state);
// }
// key_list(mylist);


// 正则
function isRegular(str) {
    var morn = "";
    var math = /^[0-9]*$/g;   //纯数字
    var name = /^[A-Za-z0-9\u4e00-\u9fa5]+$/g;  //数字英文中文，不包含特殊字符
    if(str.match(math) !== null ){
        morn = "studentId";
    }else{
        if(str.match(name) !== null ){
            morn = "studentName";
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
