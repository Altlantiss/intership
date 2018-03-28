/**
 * Created by chenlei on 2017/12/6.
 */
$(document).ready(function(){


var datestar = "";
var dateend = "";
jQuery("#student-keyword").val("");

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

initJqGrid({
    caption: '实习意向列表',
    colNames: ['发送时间', '发送学生', '学生实习意向工作', '学生实习意向单位', '意向公司地址'],
    colModel: [
        {
            name: 'createTime'
        },
        {
            name: 'studentName'
        },
        {
            name: 'job'
        },
        {
            name: 'enterprise'
        },
        {
            name: 'address'
        }
    ],
    key: 'id',
    urlCreater: 'mobile/practiceIntention/school?',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var studentName = jQuery("#student-keyword").val();
        var createTime = $('input[name="sendtime"]').val();
        var newUrl = apiUrl + "/mobile/practiceIntention/school?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
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
    var studentKeyword = $("#student-keyword").val();
    btnSeacher.on("click",function(){

        $.ajax({
            url: apiUrl + '/mobile/practiceIntention/school?page=1&limit=10&studentName='+studentKeyword,
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

