/**
 * Created by chenlei on 2017/12/7.
 */
var datestar = "";
var dateend = "";
var tit = "";
var num = '1';
var total = '0';

window.onload = function () {

    // 页面初始化请求
    getPageSearch();

};

// 页面初始化请求函数
function getPageSearch() {

    var data = {
        "code":20000,
        "message":"成功",
        "run_execute_time":"0.0069s",
        "data":{
            "list":[
                {
                    "id":"1",
                    "name":"张三",
                    "num":"110119",
                    "system":"机械工程",
                    "special":"机电一体化",
                    "class":"1班",
                    "company":"科技有限公司",
                    "post":"",
                    "time":"1511751608",
                    "like":"0"
                },
                {
                    "id":"2",
                    "name":"李四",
                    "num":"110119",
                    "system":"机械工程",
                    "special":"机电一体化",
                    "class":"1班",
                    "company":"科技有限公司",
                    "post":"",
                    "time":"1511751608",
                    "like":"0"
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
            var s_time = '';
            $.each(json, function (i, item) {
                if (item.create !== null) {
                    s_time = getTimeByTimestamp(item.time);
                }
                list += "<tr><td>" + item.name + "</td>";
                list += "<td>" + item.num + "</td>";
                list += "<td>" + item.system + "</td>";
                list += "<td>" + item.special + "</td>";
                list += "<td>" + item.class + "</td>";
                list += "<td>" + item.company + "</td>";
                list += "<td>" + item.post + "</td>";
                list += "<td>" + s_time + "</td>";
                list += "<td>{0}&nbsp;&nbsp;</td></tr>".format(
                    "<a href='javascript:void(0)' class='detailInfo'>查看详情</a>"

                );
            });
        }

        $('#notice_list').html(list);
        removeload();

    } else {
        removeload();
        my_alert('提示(' + data['code'] + ')', data['message']);
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

}

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

// 点击弹框的返回按钮
$('#closeBtn').on('click',function () {

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
        getPageSearch();

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
        getPageSearch();

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

    // 日历
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
        //getPageSearch(tit, datestar, dateend, 1, page_size);
    });

    //选择日期获取详情表
    $('input[name="sendtime"]').on('apply.daterangepicker', function (ev, picker) {
        datestar = picker.startDate.format('YYYY/MM/DD');
        dateend = picker.endDate.format('YYYY/MM/DD');
        //getPageSearch(tit, datestar, dateend, 1, page_size);
    });

});

//获取通知列表--------------------
/*function getPageSearch(title, start_time, end_time, page_no, page_size) {
 $.ax({
 url: apiurl('notification/sent'),
 type: 'GET',
 datatype: 'json',
 data: {
 title: title,
 start_time: start_time,
 end_time: end_time,
 page_no: page_no,
 page_size: page_size
 },
 success: function (data) {
 if (data['code'] == '20000') {
 list = '';
 if (data.data == null) {
 data.data = '';
 removeload();
 return false;
 }
 if (data.data.count) {
 total = data.data.count;
 $('#total').html(total);
 }
 var json = data.data.list;
 if (json) {
 var s_time = '';
 $.each(json, function (i, item) {
 if (item.create !== null) {
 s_time = getTimeByTimestamp(item.create);
 }
 list += "<tr><td>" + s_time + "</td>";
 list += "<td class='tit'>" + returnnull(item.title) + "</td>";
 list += "<td class='cont'>" + returnnull(item.content) + "</td>";
 list += "<td>" + returnnull(item.read) + "</td>";
 list += "<td>{0}&nbsp;&nbsp;{1}&nbsp;&nbsp;{2}</td></tr>".format(
 "<a href='javascript:void(0)' onclick=\"btnurl('notice-detail&no_id=" + item.notification_id + "')\"'>查看详情</a>",
 "<a href='javascript:void(0)' onclick=\"btnurl('notice-edit&notice_id=" + item.notification_id + "')\"'>修改</a>",
 "<a href='javascript:void(0)' onclick='deletepopup(" + item.notification_id + ")'>删除</a>"
 );

 });
 }

 $('#notice_list').html(list);
 removeload();

 } else {
 removeload();
 my_alert('提示(' + data['code'] + ')', data['message']);
 return false;
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
 $('#page').html(page(data.data.page_no, data.data.page_size, data.data.count));

 }
 });
 }*/


s_change_size(); //切换显示条数的函数
function s_change_size() {

    $('#size').append('<option value="15">15</option> <option value="25">25</option> <option value="50">50</option> <option value="100">100</option>')

    $('#size').change(function () {

        var opt = $('#size').val();
        if (opt == 15) {
            page_size = 15;
            getPageSearch(tit, datestar, dateend, 1, page_size);
        }
        if (opt == 25) {
            page_size = 25;
            getPageSearch(tit, datestar, dateend, 1, page_size);
        }
        if (opt == 50) {
            page_size = 50;
            getPageSearch(tit, datestar, dateend, 1, page_size);
        }
        if (opt == 100) {
            page_size = 100;
            getPageSearch(tit, datestar, dateend, 1, page_size);
        }
    })


}
var page_size = 15;
getPageSearch(tit, datestar, dateend, 1, page_size);


// 标题搜索--------------


$('#btn-search').click(function () {
    tit = $('#student-keyword').val();
    getPageSearch(tit, datestar, dateend, 1, page_size);
});

//回车键搜索
function mylist() {
    tit = $('#student-keyword').val();
    getPageSearch(tit, datestar, dateend, 1, page_size);
}
key_list(mylist);


//分页
$(document).on('click', '#page ul li', function () {
    if ($(this).attr('num') == null) {
        return false;
    }
    num = $(this).attr('num');
    //获取列表
    getPageSearch(tit, datestar, dateend, num, page_size);
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

/*function notice_delete(id) {
 closepopup();
 $.ax({
 url: apiurl('notification/delete'),
 type: 'delete',
 dataType: 'json',
 data: {
 notification_id: id
 },
 success: function (ret_data) {

 removeload();
 if (ret_data['code'] != 20000) {
 my_alert('提示(' + ret_data['code'] + ')', '删除' + ret_data['message']);
 return false;
 } else {
 // my_alert('提示(' + ret_data['code'] + ')', '删除'+ret_data['message']);
 $('#notice_list').html('');
 getPageSearch(tit, datestar, dateend, 1, page_size);
 }
 }
 });
 }*/




