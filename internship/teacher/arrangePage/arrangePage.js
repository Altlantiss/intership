/**
 * Created by chenlei on 2017/12/2.
 */

var datestar = "";
var dateend = "";
var tit = "";
var num = '1';
var total = '0';

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

function getPageSearch() {

    var data = {
        "code":20000,
        "message":"成功",
        "run_execute_time":"0.0069s",
        "data":{
            "list":[
                {
                    "notification_id":"1",
                    "name":"张三",
                    "code":"11112",
                    "school":"机电学院",
                    "system": "机械工程",
                    "profession":"机电一体化",
                    "class":"1班"
                },
                {
                    "notification_id":"2",
                    "name":"李四",
                    "code":"11112",
                    "school":"机电学院",
                    "system": "机械工程",
                    "profession":"机电一体化",
                    "class":"2班"
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
                    s_time = getTimeByTimestamp(item.create);
                }
                list += "<tr><td class='center'><label><input type='checkbox' class='ace' key="+ item.id +"><span class='lbl'></span></label></td>";
                list+= "<td>" + item.name + "</td>";
                list += "<td class='tit'>" + item.code + "</td>";
                list += "<td class='cont' title="+ item.school +">" + item.school + "</td>";
                list += "<td>" + item.system + "</td>";
                list += "<td>" + item.profession + "</td>";
                list += "<td>" + item.class + "</td></tr>";
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

    /*$.ajax({
     url: 'http://101.37.27.185:9898/mobile/notice',
     type: 'GET',
     datatype: 'json',
     data: {
     page: 1,
     limit: 15
     },
     headers: {
     'token': cookie.get('token'),
     },
     success: function (data) {
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
     s_time = getTimeByTimestamp(item.create);
     }
     list += "<tr><td>" + s_time + "</td>";
     list += "<td class='tit'>" + returnnull(item.title) + "</td>";
     list += "<td class='cont' title="+ item.content +">" + returnnull(item.content) + "</td>";
     list += "<td>" + returnnull(item.read) + "</td>";
     list += "<td>{0}&nbsp;&nbsp;</td></tr>".format(
     "<a href='javascript:void(0)' onclick='deletepopup(" + item.notification_id + ")'>删除</a>"
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
     });*/

    /*var data = {
     "code":20000,
     "message":"成功",
     "run_execute_time":"0.0069s",
     "data":{
     "list":[
     {
     "notification_id":"2241554",
     "title":"测试",
     "content":"测试测试测试，测试测试测试，测试测试测试",
     "type":"12",
     "create":"1511751608",
     "extra":"null",
     "sender_name":"系统",
     "portrait":null,
     "read":"2",
     "like":"0"
     }
     ],
     "count":"1",
     "page_no":"1",
     "page_size":"15"
     }
     };*/

}

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


// 点击返回
$('#return').click(function () {

    window.location.href = 'http://101.37.27.185:8080/dingang/arrangePracticeStudent.html'

});
// 关闭发送通知
$('#closeSendNotice').click(function () {
    $('#sendNotice').css('display','none');
});
// 取消
$('#clearSend').click(function () {
    $('#sendNotice').css('display','none');
});
// 确认发送
$('#makeSureSend').click(function () {
    var sendTitle = $('#form-field-1').val();
    var sendContent = $('#form-field-2').val();
    if(sendTitle === '' || sendContent === '') {
        $('#sendContent').html('通知标题或通知内容不能为空');
        $('#makeSureNotice').css('display','block');
        return false;

    }

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
    if (data['code'] != 20000) {
        my_alert('提示(' + data['code'] + ')', '删除' + data['message']);
        return false;
    } else {
        // my_alert('提示(' + ret_data['code'] + ')', '删除'+ret_data['message']);
        $('#sendContent').html('保存成功');
        $('#sendNotice').css('display','none');
        $('#makeSureNotice').css('display','block');
    }

});

// 确认发送后点击确定
$('#makeSureNoticeBtn').click(function () {
    $('#makeSureNotice').css('display','none');
    getPageSearch(tit, datestar, dateend, 1, page_size);
});



