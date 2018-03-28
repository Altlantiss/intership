/**
 * Created by chenlei on 2017/12/7.
 */
var datestar = "";
var dateend = "";
var tit = "";
var num = '1';
var total = '0';
var acturalPage = acturalPage || 1;
var state = 0;

window.onload = function () {

    // 点击批量通过按钮
    $('#batchApproval').on('click',function () {

        my_alert('提示','是否确定批量审批通过？',true,canApproval);
        getPageSearch();

        var id = getCheckedId();

    });

    // 点击批量不通过
    $('#batchNotApproval').on('click',function () {

        my_alert('提示','是否确定批量审批不通过？',true,cannoApproval);
        getPageSearch();

        var id = getCheckedId();

    });


};

// 页面初始化请求函数
function getPageSearch(acturalPage,pageSize, state) {

    // $.ax({
    //     url: apiUrl + '/mobile/endApply',
    //     type: 'GET',
    //     data: {
    //         page: acturalPage,
    //         limit: pageSize,
    //         state: state,
    //         token: cookie.get('token')
    //     },
    //     success: function (data) {
    //
    //         if (data['code'] == '0') {
    //             list = '';
    //             if (data.data == null) {
    //                 data.data = '';
    //                 removeload();
    //             }
    //             if (data.data.count) {
    //                 total = data.data.count;
    //                 $('#total').html(total);
    //             }
    //
    //             var json = data.data.list;
    //             if (json) {
    //                 var s_time = '';
    //                 $.each(json, function (i, item) {
    //                     list += "<tr>" +
    //                         "<td>" +  item.endTime + "</td>";
    //                     list += "<td>" + item.remark + "</td>";
    //                     list += "<td>" + item.createTime + "</td></tr>"
    //                 });
    //             }
    //
    //             $('#notice_list').html(list);
    //             removeload();
    //
    //         } else {
    //             removeload();
    //             my_alert('提示(' + data['code'] + ')', data['message']);
    //         }
    //         //限制标题字数
    //         $('.tit').each(function () {
    //             var maxwidth = 10;
    //             if ($(this).text().length > maxwidth) {
    //                 $(this).text($(this).text().substring(0, maxwidth));
    //                 $(this).html($(this).html() + '……');
    //             }
    //         });
    //         //限制内容字数
    //         $('.cont').each(function () {
    //             var maxwidth = 30;
    //             if ($(this).text().length > maxwidth) {
    //                 $(this).text($(this).text().substring(0, maxwidth));
    //                 $(this).html($(this).html() + '……');
    //             }
    //         });
    //     }
    // });

}

//点击审批进度切换
$('#approvalProcess').on('change', function (e) {
    state = $("#approvalProcess").val();
    getPageSearch(acturalPage, page_size, state);

});

// 获取选中行的id
function getCheckedId() {

    var arr = $('.ace');
    var idArr = [];

    arr.each(function () {

        var isCheckBox =$(this).is(':checked');
        if(isCheckBox) {
            var id = $(this).attr('key');
            idArr.push(id);
        }

    });

    return idArr;

}

// 查看详情
$('#notice_list').on('click','.detailInfo',function () {

    var data = {
        "code":20000,
        "message":"成功",
        "run_execute_time":"0.0069s",
        "data":{
            "list":[
                {
                    "id":"1",
                    "approvalName":"(学校处)",
                    "approvalResult":"审批中",
                    "approvalOption":""
                },
                {
                    "id":"2",
                    "approvalName":"(教务处)",
                    "approvalResult":"审批中",
                    "approvalOption":""
                },
                {
                    "id":"2",
                    "approvalName":"(学生处)",
                    "approvalResult":"审批中",
                    "approvalOption":""
                }
            ],
            "count":"1",
            "page_no":"1",
            "page_size":"15"
        }
    };

    if (data['code'] == '20000') {
        list = '';
        if (data.data == null) {
            data.data = '';
            removeload();
        }
        if (data.data.count) {
            total = data.data.count;
            $('#total').html(total);
        }

        var json = data.data.list;
        if (json) {
            $.each(json, function (i, item) {

                list += "<div class='approvalDiv'>" +
                    "<div>" +
                    " <span>审批人：</span> " +
                    "<span>"+item.approvalName+"</span> " +
                    "</div> " +
                    "<div> " +
                    "<span>审批结果：</span> " +
                    "<span class='inApproval'>"+item.approvalResult+"</span> " +
                    "<span class='remindApproval'>提醒审批</span> " +
                    "</div> " +
                    "<div> " +
                    "<span>审批意见：</span>" +
                    "<span>"+item.approvalOption+"</span> " +
                    "</div> " +
                    "</div>"
            });
        }

        $('#popUpDetail').html(list);
        removeload();

    } else {
        removeload();
        my_alert('提示(' + data['code'] + ')', data['message']);
    }

    $('#detailPopUp').css('display','block');

});

// 点击通过按钮
$('#notice_list').on('click','.approval',function () {

    my_alert('提示','是否确定审批通过？',true,canApproval);
    getPageSearch(acturalPage,page_size, state);

});

// 点击不通过按钮
$('#notice_list').on('click','.notApproval',function () {
    my_alert('提示','是否确定审批不通过？',true,canApproval);
    getPageSearch(acturalPage,page_size, state);
});

// 点击弹框的审批通过
$('#canApproval').on('click',function () {

    my_alert('提示','是否确定审批通过？',true,canApproval);
    getPageSearch(acturalPage,page_size, state);

});

// 点击弹框的审批不通过
$('#cannotApproval').on('click',function () {

    my_alert('提示','是否确定审批不通过？',true,canApproval);
    getPageSearch(acturalPage,page_size, state);

});

// 点击弹框的返回按钮
$('#goBack').on('click',function () {

    $('#detailPopUp').css('display','none');

});

// 审批通过
function canApproval() {

    var data = {
        "code":20000,
        "message":"成功",
        "run_execute_time":"0.0069s",
        "data":{
        }
    };

    if(data.code === 20000) {

        $('#detailPopUp').css('display','none');
        $('#makeSureNotice').css('display','block');
        $('#sendContent').html('审批通过成功');
        getPageSearch(acturalPage,page_size, state);

    }

}

// 审批不通过
function cannoApproval() {

    var data = {
        "code":20000,
        "message":"成功",
        "run_execute_time":"0.0069s",
        "data":{
        }
    };

    if(data.code === 20000) {

        $('#detailPopUp').css('display','none');
        $('#makeSureNotice').css('display','block');
        $('#sendContent').html('审批不通过成功');
        getPageSearch(acturalPage,page_size, state);

    }

}




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


// var today = new Date();
// beginday = today.getTime()-31 * 24 * 3600 * 1000;

$(function () {
    //日历
    var sendTiem = $(".sendtime");
    sendTiem.eq(0).daterangepicker({
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
    sendTiem.eq(0).on('apply.daterangepicker', function (ev, picker) {
        datestar = picker.startDate.format('YYYY-MM-DD');
        $('input[name="sendtime"]').val(datestar);
    });
    $('input[name="sendtime"]').val("");


    sendTiem.eq(1).daterangepicker({
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
    sendTiem.eq(1).on('apply.daterangepicker', function (ev, picker) {
        datestar = picker.startDate.format('YYYY-MM-DD');
        $('input[name="input-end"]').val(datestar);
    });
    $('input[name="input-end"]').val("");


    sendTiem.eq(2).daterangepicker({
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
    sendTiem.eq(2).on('apply.daterangepicker', function (ev, picker) {
        datestar = picker.startDate.format('YYYY-MM-DD');
        $('input[name="editEndTime"]').val(datestar);
    });
    $('input[name="editEndTime"]').val("");

});



s_change_size(); //切换显示条数的函数
function s_change_size() {

    $('#size').append('<option value="15">15</option> <option value="25">25</option> <option value="50">50</option> <option value="100">100</option>')

    $('#size').change(function () {

        var opt = $('#size').val();
        if (opt == 15) {
            page_size = 15;
            getPageSearch(acturalPage,page_size);
        }
        if (opt == 25) {
            page_size = 25;
            getPageSearch(acturalPage,page_size);
        }
        if (opt == 50) {
            page_size = 50;
            getPageSearch(acturalPage,page_size);
        }
        if (opt == 100) {
            page_size = 100;
            getPageSearch(acturalPage,page_size);
        }
    })


}
var page_size = 15;
getPageSearch(acturalPage,page_size, state);


// 标题搜索--------------


$('#makeSureSend').click(function () {

    var endTime = $('#form-field-1').val();
    var remark = $('#form-field-2').val();

    if(endTime == '' && remark == '') {

        my_alert('提示','输入内容不能为空');
        return false;

    }

    $.ajax({
        url: apiUrl + '/mobile/endApply',
        type: 'POST',
        data: {
            endTime: endTime,
            remark: remark
        },
        beforeSend: function(request) {
            request.setRequestHeader("token", cookie.get('token'));
        },
        success: function (data) {

            if(data.code === 0) {
                my_alert('提示','申请成功');
                $('#sendNotice').css('display','none');
                jQuery("#grid-table").jqGrid('setGridParam', {
                    url : ''
                }).trigger('reloadGrid');
            }else{
                my_alert('提示','申请失败');
            }

        },
        error:function(err){
            my_alert('提示','获取信息出错');
            console.log(err);
        }
    })

});

// 点击新建
$('#btn-add').on('click',function () {

    $('#sendNotice').css('display','block');

});

jQuery("#btn-search").click(function(){
    jQuery("#grid-table").jqGrid().trigger("reloadGrid");
});
// 取消新建
$('#clearSend').on('click',function () {

    $('#sendNotice').css('display','none');

});

// 取消新建
$('#closeSendNotice').on('click',function () {

    $('#sendNotice').css('display','none');

});

//回车键搜索
function mylist() {
    tit = $('#student-keyword').val();
    getPageSearch(acturalPage,page_size, state);
}
key_list(mylist);


//分页
$(document).on('click', '#page ul li', function () {
    if ($(this).attr('num') == null) {
        return false;
    }
    num = $(this).attr('num');
    //获取列表
    getPageSearch(acturalPage,page_size, state);
});

//删除通知------------
function notice_delete(id) {

    closepopup();

    var data = {
        "code":20000,
        "message":"成功",
        "run_execute_time":"0.0069s",
        "data":{
            "list":[
            ],
            "count":"1",
            "page_no":"1",
            "page_size":"15"
        }
    };

    removeload();
    if (data['code'] != 20000) {
        my_alert('提示(' + data['code'] + ')', '删除' + data['message']);
        return false;
    } else {
        // my_alert('提示(' + ret_data['code'] + ')', '删除'+ret_data['message']);
        $('#notice_list').html('');
        //getPageSearch(tit, datestar, dateend, 1, page_size);
    }
}



jQuery(document).ready(function(){

    var grid_selector = "#grid-table";
    var pager_selector = "#grid-pager";

    jQuery(grid_selector).jqGrid({
        url:"",
        mtype: "GET",
        datatype: "json",
        height: 372,
        colNames:['ID','申请时间','备注','结束时间','状态','操作'],
        colModel:[
            {name:'id',index:'id', width:150,editable:false,hidden: true},
            {name:'createTime',index:'createTime', width:150,editable:false},
            {name:'remark',index:'remark',width:250, editable:false},
            {name:'endTime',index:'endTime', width:150},
            {
                name: 'state',
                index: 'state',
                width: 100,
                formatter: function (cellValue) {

                    return getApproveState(cellValue);

                }
            },
            {name: 'myac', width:150}
        ],
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
            var createTime = $('input[name="sendtime"]').val();
            var state = $("#approvalProcess").val();
            var newUrl = apiUrl+"mobile/endApply?page="+currentpage+"&limit="+rowNum+"&type=0&token="+cookie.get("token");
            if(createTime !== ""){
                newUrl +=  "&createTime="+createTime;
            }
            if(state != -1){
                newUrl +=  "&state="+state;
            }
            jQuery("#grid-table").jqGrid('setGridParam',{url:newUrl});
        },
        loadComplete : function() {
            var table = this;
            setTimeout(function(){
                styleCheckbox(table);
                updateActionIcons(table);
                updatePagerIcons(table);
                enableTooltips(table);
            }, 0);
            update_grid_css();

            var ids = jQuery("#grid-table").jqGrid('getDataIDs');
            var data = jQuery("#grid-table").jqGrid('getRowData');

            for (var i = 0; i < ids.length; i++) {
                var cl = ids[i];
                var ce,se;
                if( data[i]["state"] === "未审批" ){
                    se = '<button id="class_studentqq_' + cl + '" class="btn btn-xs btn-success" onclick="update_student_dialog_fn(this);" style="float:left;margin-left:5px;"><i class="icon-trash align-top bigger-125"></i>编辑申请</button>';
                    ce = '<button id="class_delete_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" onclick="delete_group_fn(this)"><i class="icon-trash align-top bigger-125"></i>删除申请</button>';
                }else{
                    se = '<button id="class_studentqq_' + cl + '" class="btn btn-xs btn-success" disabled="disabled" onclick="update_student_dialog_fn(this);" style="float:left;margin-left:5px;"><i class="icon-trash align-top bigger-125"></i>编辑申请</button>';
                    ce = '<button id="class_delete_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" disabled="disabled" onclick="delete_group_fn(this)"><i class="icon-trash align-top bigger-125"></i>删除申请</button>';
                }
                jQuery("#grid-table").jqGrid('setRowData', cl,
                    {
                        myac: se + ce
                    });
            }
        },
        caption: "结束申请列表",
        autowidth: true
    });

    jQuery("#btn-search").click(function(){
        jQuery("#grid-table").jqGrid().trigger("reloadGrid");
    });

});

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


//打开编辑申请
var editApprovalId;
function update_student_dialog_fn(e) {
    editApprovalId = $(e).parent().parent().attr("id");

    var endTime = $(e).parent().siblings().eq(4).text();
    var remark = $(e).parent().siblings().eq(3).text();

    jQuery('#group_update_dialog').css('display', 'block');

    $("#editEndTime").val(endTime);
    $("#editRemark").val(remark);

}


/**
 * 关闭新增窗口
 */
function close_update_dialog() {
    jQuery('#group_update_dialog').css('display', 'none');
}

//确认编辑
function update_student() {

    var leaveEndDateArr =  $("#editEndTime").val();
    var leaveEndDate;
    leaveEndDateArr = leaveEndDateArr.split("/");
    if( leaveEndDateArr.length > 1 ){
        leaveEndDate = leaveEndDateArr[2] + "-" + leaveEndDateArr[0] + "-" + leaveEndDateArr[1];
    }else{
        leaveEndDate = leaveEndDateArr[0];
    }

    var remark =  $("#editRemark").val();


    $.ajax({
        type: "PUT",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/endApply?page=1&limit=10",//路径
        data: {
            "id": editApprovalId,
            "endTime":leaveEndDate,
            "remark":remark
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                close_update_dialog();
                alert("编辑申请成功!");
                jQuery("#grid-table").jqGrid('setGridParam', {
                    url : ''
                }).trigger('reloadGrid');
            } else {
                alert("编辑申请失败!");
            }

        },
        error:function(err){
            alert("获取信息出错");
            console.log(err);
        }
    });

}

//删除申请
function delete_group_fn(e) {
    /**
     * 获取选择的学生ID
     */
    var choose_student_id = parseInt(e.id.split("_")[2]);
    $.ajax({
        type: "DELETE",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/endApply?id=" + choose_student_id,//路径
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("删除成功!");
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("删除失败!");
            }
        }
    });
}

