var datestar = "";
var dateend = "";
var tit = "";
var num = '1';
var total = '0';
var acturalPage = acturalPage || 1;

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

    // 教师列表获取
    getTeachers();
});


// 教师列表获取
function getTeachers(){
    $.ajax({
        url: apiUrl + '/mobile/teacher',
        type: 'GET',
        data: {
            page: acturalPage,
            limit: 100,
            token: cookie.get('token')
        },
        success: function (data) {
            if (data['code'] == 0) {
                var ops = '';
                var json = data.data.list;
                if (json) {
                    $.each(json, function (i, item) {
                        ops += '<option value="'+item.id+'">'+item.name+'</option>';
                    });
                    $('#teacherId').html(ops);
                }
            }
        }
    });
}

//获取评教列表--------------------
function getPageSearch(acturalPage,pageSize) {
}

//限制标题字数
$('.tit').each(function () {
    var maxwidth = 10;
    if ($(this).text().length > maxwidth) {
        $(this).text($(this).text().substring(0, maxwidth));
        $(this).html($(this).html() + '……');
    }
});
//限制内容字数
$('.cont').each(function () {
    var maxwidth = 30;
    if ($(this).text().length > maxwidth) {
        $(this).text($(this).text().substring(0, maxwidth));
        $(this).html($(this).html() + '……');
    }
});

s_change_size(); //切换显示条数的函数
function s_change_size() {

    $('#size').append('<option value="15">15</option> <option value="25">25</option> <option value="50">50</option> <option value="100">100</option>')

    $('#size').change(function () {

        var opt = $('#size').val();
        if (opt == 15) {
            page_size = 15;
            getPageSearch(acturalPage, page_size);
        }
        if (opt == 25) {
            page_size = 25
            getPageSearch(acturalPage, page_size);
        }
        if (opt == 50) {
            page_size = 50
            getPageSearch(acturalPage, page_size);
        }
        if (opt == 100) {
            page_size = 100;
            getPageSearch(acturalPage, page_size);
        }
    })


}
var page_size = 15;
getPageSearch(acturalPage,page_size);


// 标题搜索--------------


$('#btn-search').click(function () {
    tit = $('#student-keyword').val();
    getPageSearch(acturalPage, page_size);
});

//回车键搜索
function mylist() {
    tit = $('#student-keyword').val();
    getPageSearch(acturalPage, page_size);
}
key_list(mylist);

// 点击发送通知接口
$('#sendNoticeBtn').on('click',function () {

    $('#sendNotice').css('display','block');
    $("#evaluate").val("");
    $("#comment").val("");
});

// 确定发送通知
$('#makeSureSend').on('click',function () {

    var teacherId = $('#teacherId').val();
    var evaluate = $('#evaluate').val();
    var comment = $('#comment').val();
    if(isNaN(evaluate)){
        my_alert('提示','满意度非数字,1-10分', function(){$('#level').focus();});
        return;
    }
    $.ajax({
        url: apiUrl + 'mobile/teacherEvaluate',
        type: 'POST',
        data: {
            teacherId: teacherId,
            satisfied:evaluate,
            remark:comment,
            token: cookie.get('token')
        },
        success:function (data) {
            if(data.code === 0) {
                my_alert('提示','新增成功');
                $('#sendNotice').css('display','none');
                jQuery("#grid-table").jqGrid('setGridParam', {
                    url : ''
                }).trigger('reloadGrid');

            } else {
                my_alert('提示', data['msg']);
            }
        }
    });

});

// 取消发送通知
$('#clearSend').on('click',function () {

    $('#sendNotice').css('display','none');

});

// 取消发送通知
$('#closeSendNotice').on('click',function () {

    $('#sendNotice').css('display','none');

});


//分页
$(document).on('click', '#page ul li', function () {
    if ($(this).attr('num') == null) {
        return false;
    }
    num = $(this).attr('num');
    //获取列表
    getPageSearch(num, page_size);
});




jQuery(document).ready(function(){

    var grid_selector = "#grid-table";
    var pager_selector = "#grid-pager";

    jQuery(grid_selector).jqGrid({
        url:"",
        mtype: "GET",
        datatype: "json",
        height: 372,
        colNames:['通知ID','更新时间','受评教师','满意度','评价内容'],
        colModel:[
            {name:'id',index:'id', width:150,editable:false,hidden: true},
            {name:'createTime',index:'createTime', width:150,editable:false},
            {name:'teacherName',index:'teacherName',width:100, editable:false},
            {name:'satisfied',index:'satisfied', width:100},
            {name:'remark',index:'remark', width:350}
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
            var notice_title = jQuery("#notic_title_search").val();
            var createTime = $('input[name="sendtime"]').val();
            var newUrl = apiUrl+"mobile/teacherEvaluate?page="+currentpage+"&limit="+rowNum+"&type=0&token="+cookie.get("token");

            if(notice_title != ""){
                newUrl =newUrl + "&name="+ notice_title;
            }
            if(createTime !== ""){
                newUrl +=  "&time="+createTime;
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
        },
        caption: "评教列表",
        autowidth: true
    });

    jQuery("#btn-search").click(function(){
        jQuery("#grid-table").jqGrid().trigger("reloadGrid");
    });

});


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


