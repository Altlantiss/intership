/**
 * Created by chenlei on 2017/12/2.
 */
$(document).ready(function(){


var datestar = "";
var dateend = "";
jQuery("#student-keyword").val('');

$(function () {

    // 日历
    $('input[name="sendtime"]').attr("readonly","readonly");
    $('input[name="sendtime"]').daterangepicker({
        singleDatePicker: false,
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
    // 点击取消时清空日期
    $('input[name="sendtime"]').on('cancel.daterangepicker', function (ev, picker) {
        $('input[name="sendtime"]').val('');
        datestar = '';
        dateend = '';
        getPageSearch(tit, datestar, dateend, 1, page_size);
    });

    //选择日期获取详情表
    $('input[name="sendtime"]').on('apply.daterangepicker', function (ev, picker) {
        datestar = picker.startDate.format('YYYY/MM/DD');
        dateend = picker.endDate.format('YYYY/MM/DD');
        getPageSearch(tit, datestar, dateend, 1, page_size);
    });

});


initJqGrid({
    caption: '收到通知列表',
    colNames: ['发送时间', '通知标题', '内容摘要', '发送人', '阅读状态', '操作'],
    colModel: [
        {
            name: 'createTime',
            index: 'createTime',
            sortable: false,
            editable: false
        },
        {
            name: 'title',
            index: 'title',
            sortable: false,
            editable: false
        },
        {
            name: 'content',
            index: 'content',
            sortable: false,
            editable: false
        },
        {
            name: 'sender_name',
            index: 'sender_name',
            sortable: false,
            editable: false
        },
        {
            name: 'read',
            index: 'read',
            sortable: false,
            editable: false
        },
        {
            name: 'myac',
            index: '',
            fixed: true,
            sortable: false,
            resize: false
        }
    ],
    key: 'id',
    // urlCreater: 'mobile/notice/my?',
    // beforeRequest: function () {
    //     var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
    //     var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
    //     var title = jQuery("#student-keyword").val();
    //     var newUrl = apiUrl + "/mobile/notice/my?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
    //     if(title !== ""){
    //         newUrl +=  "&title="+title;
    //     }
    //     jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
    // },
    loadComplete: function (ids, data) {
        for (var i = 0; i < ids.length; i++) {
            var cl = ids[i];
            var ce = '<button id="delete_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" onclick="delete_fn(this)"><i class="icon-trash align-top bigger-125"></i>删除</button>';
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






// 搜索
var btnSeacher = $("#btn-search");
var studentKeyword = $("#student-keyword").val();
btnSeacher.on("click",function(){

    $.ax({
        url: apiUrl + 'mobile/notice/my?page=1&limit=10&title='+studentKeyword,
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

/**
 * 删除通知
 */
function delete_fn(e) {

    var id = parseInt(e.id.split("_")[1]);

    $.ajax({
        type: 'DELETE',
        url: apiUrl + 'mobile/notice?id=' + id + "&token=" + cookie.get("token"),
        data:{
        },
        success: function (data) {
            if (data['code'] === 0) {
                my_alert('提示', '删除成功', null, reloadJqGrid);
            } else {
                my_alert('提示(' + data['code'] + ')', data['msg']);
            }

        }
    });

}