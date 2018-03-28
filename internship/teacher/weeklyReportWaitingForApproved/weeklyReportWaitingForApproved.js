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

// function detailpopup(id, startDate, studentName, studyContent, studyHarvest, questionFeedback) {
//
//     de_id = id;
//
//     var detailInfo = '';
//     detailInfo += '<p>' + startDate + '</p>'
//     detailInfo += '<p>' + studentName + '</p>'
//     detailInfo += '<p>' + studyContent + '</p>'
//     detailInfo += '<p>' + studyHarvest + '</p>'
//     detailInfo += '<p>' + questionFeedback + '</p>'
//     $('#detail-popup').empty().append(detailInfo);
//
//     $('#detailpopup').find('textarea').val('');
//
//     $('#detailpopup').show();
// }
// function closedetailpopup(id) {
//     $('#detailpopup').hide();
// }


// var today = new Date();
// beginday = today.getTime()-31 * 24 * 3600 * 1000;

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


    // $('#select-all').on('change', function (e) {
    //
    //     var checked = $(this).prop('checked');
    //
    //     $('#daily_check_in_list').find('input[type=checkbox]').prop('checked', checked);
    //
    // });
    //
    // $(document).on('change', '.select-one', function (e) {
    //
    //     var allChecked = true;
    //
    //     $('#daily_check_in_list').find('input[type=checkbox]').each(function () {
    //
    //         if (!$(this).prop('checked')) {
    //
    //             allChecked = false;
    //
    //         }
    //
    //     });
    //
    //     $('#select-all').prop('checked', allChecked);
    //
    // });

});



initJqGrid({
    caption: '周报列表',
    colNames: ['发送日期', '姓名', '学习内容', '学习收获', '问题反馈', '操作'],
    colModel: [
        {name: 'createTime'},
        {name: 'studentName'},
        {name: 'studyContent'},
        {name: 'studyHarvest'},
        {name: 'questionFeedback'},
        {
            name: 'myac',
            width: 200
        }
    ],
    key: 'id',
    urlCreater: 'mobile/dailyPaper/school?type=1&state=0&',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var studentName = jQuery("#student-keyword").val();
        var key = isRegular(studentName);
        var createTime = $('input[name="sendtime"]').val();
        var newUrl = apiUrl + "mobile/dailyPaper/school?type=1&state=0&page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
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

// function getPageSearch(acturalPage, pageSize) {
//
//     $.ax({
//         url: apiUrl + 'mobile/dailyPaper/school',
//         type: 'GET',
//         data: {
//             type: 1,
//             state: 0,
//             page: acturalPage,
//             limit: pageSize,
//             token: cookie.get('token')
//         },
//         success: function (data) {
//
//             if (data['code'] === 0) {
//                 list = '';
//                 if (data.data === null) {
//                     data.data = '';
//                     removeload();
//                 }
//                 if (data.data.total) {
//                     total = data.data.total;
//                     $('#total').html(total);
//                 }
//
//                 var json = data.data.list;
//                 if (json) {
//                     var s_time = '';
//                     $.each(json, function (i, item) {
//                         list += "<tr><td><input type='checkbox' class='select-one' /></td>";
//                         list += "<td>" + item.startDate + "</td>";
//                         list += "<td>" + item.studentName + "</td>";
//                         list += "<td>" + item.studyContent + "</td>";
//                         list += "<td>" + item.studyHarvest + "</td>";
//                         list += "<td>" + item.questionFeedback + "</td>";
//                         list += "<td><a href='javascript:void(0)' onclick='detailpopup(";
//                         list += item.id + ",\"";
//                         list += item.startDate + "\",\"";
//                         list += item.studentName + "\",\"";
//                         list += item.studyContent + "\",\"";
//                         list += item.studyHarvest + "\",\"";
//                         list += item.questionFeedback;
//                         list += "\")'>查看详情</a>&nbsp;&nbsp;";
//                         list += "<a href='javascript:void(0)' onclick='approve(" + item.id + ", 1, \"\")'>通过</a>&nbsp;&nbsp;";
//                         list += "<a href='javascript:void(0)' onclick='approve(" + item.id + ", 2, \"\")'>打回</a></td></tr>";
//                     });
//                 }
//
//                 $('#daily_report_list').html(list);
//                 removeload();
//
//             } else {
//                 removeload();
//                 my_alert('提示(' + data['code'] + ')', data['message']);
//             }
//
//             $('#page').html(page(data.data.pageNum, data.data.pageSize, data.data.total));
//         }
//     });
//
//
//     //限制标题字数
//     $('.tit').each(function () {
//         var maxwidth = 10;
//         if ($(this).text().length > maxwidth) {
//             $(this).text($(this).text().substring(0, maxwidth));
//             $(this).html($(this).html() + '……');
//         }
//     });
//     //限制内容字数
//     $('.cont').each(function () {
//         var maxwidth = 30;
//         if ($(this).text().length > maxwidth) {
//             $(this).text($(this).text().substring(0, maxwidth));
//             $(this).html($(this).html() + '……');
//         }
//     });
//
// }

// function approve(id, state, comment) {
//
//     var comment = $('#detailpopup').find('textarea').val();
//
//     $.ax({
//         url: apiUrl + 'mobile/dailyPaper/approval',
//         type: 'PUT',
//         data: {
//             id: id,
//             state: state,
//             comment: comment,
//             token: cookie.get('token')
//         },
//         success: function (data) {
//
//             window.location = window.location;
//
//         }
//     });
//
// }

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