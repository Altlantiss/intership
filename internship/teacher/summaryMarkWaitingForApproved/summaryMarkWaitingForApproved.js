/**
 * Created by chenlei on 2017/12/2.
 */

var datestar = "";
var dateend = "";
var tit = "";
var num = '1';
var total = '0';
var acturalPage = acturalPage || 1;

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

    $('#select-all').on('change', function (e) {

        var checked = $(this).prop('checked');

        $('#daily_check_in_list').find('input[type=checkbox]').prop('checked', checked);

    });

    $(document).on('change', '.select-one', function (e) {

        var allChecked = true;

        $('#daily_check_in_list').find('input[type=checkbox]').each(function () {

            if (!$(this).prop('checked')) {

                allChecked = false;

            }

        });

        $('#select-all').prop('checked', allChecked);

    });

});

function approve(id, state, comment) {

    $.ax({
        url: apiUrl + 'mobile/dailyPaper/approval',
        type: 'PUT',
        data: {
            id: id,
            state: state,
            comment: comment,
            token: cookie.get('token')
        },
        success: function (data) {

            window.location = window.location;

        }
    });

}

function getPageSearch(acturalPage, pageSize) {

    $.ax({
        url: apiUrl + 'mobile/dailyPaper/school',
        type: 'GET',
        data: {
            type: 0,
            state: 0,
            page: acturalPage,
            limit: pageSize,
            token: cookie.get('token')
        },
        success: function (data) {

            if (data['code'] === 0) {
                list = '';
                if (data.data === null) {
                    data.data = '';
                    removeload();
                }
                if (data.data.total) {
                    total = data.data.total;
                    $('#total').html(total);
                }

                var json = data.data.list;
                if (json) {
                    var s_time = '';
                    $.each(json, function (i, item) {
                        list += "<tr><td><input type='checkbox' class='select-one' /></td>";
                        list += "<td>" + item.startDate + "</td>";
                        list += "<td>" + item.studentName + "</td>";
                        list += "<td>" + item.studyContent + "</td>";
                        list += "<td>" + item.studyHarvest + "</td>";
                        list += "<td>" + item.questionFeedback + "</td>";
                        list += "<td><a href='javascript:void(0)'>查看详情</a>&nbsp;&nbsp;";
                        list += "<a href='javascript:void(0)' onclick='approve(" + item.id + ", 1, \"\")'>通过</a>&nbsp;&nbsp;";
                        list += "<a href='javascript:void(0)' onclick='approve(" + item.id + ", 2, \"\")'>打回</a></td></tr>";
                    });
                }

                $('#daily_report_list').html(list);
                removeload();

            } else {
                removeload();
                my_alert('提示(' + data['code'] + ')', data['message']);
            }

            $('#page').html(page(data.data.pageNum, data.data.pageSize, data.data.total));
        }
    });


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
            page_size = 25;
            getPageSearch(acturalPage, page_size);
        }
        if (opt == 50) {
            page_size = 50;
            getPageSearch(acturalPage, page_size);
        }
        if (opt == 100) {
            page_size = 100;
            getPageSearch(acturalPage, page_size);
        }
    })


}
var page_size = 15;
getPageSearch(acturalPage, page_size);


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


//分页
$(document).on('click', '#page ul li', function () {
    if ($(this).attr('num') == null) {
        return false;
    }
    num = $(this).attr('num');
    //获取列表
    getPageSearch(acturalPage, page_size);
});

//删除通知------------
function notice_delete(id) {

    closepopup();

    var data = {
        "code": 20000,
        "message": "成功",
        "run_execute_time": "0.0069s",
        "data": {
            "list": [],
            "count": "1",
            "page_no": "1",
            "page_size": "15"
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


// 点击发送通知
$('#sendNoticeBtn').click(function () {
    window.location.href = 'http://101.37.27.185:8080/dingang/arrangePracticeStudent.html'
    //$('#sendNotice').css('display','block');
    $('#form-field-1').val('');
    $('#form-field-2').val('');
});
// 关闭发送通知
$('#closeSendNotice').click(function () {
    $('#sendNotice').css('display', 'none');
});
// 取消
$('#clearSend').click(function () {
    $('#sendNotice').css('display', 'none');
});
// 确认发送
$('#makeSureSend').click(function () {
    var sendTitle = $('#form-field-1').val();
    var sendContent = $('#form-field-2').val();
    if (sendTitle === '' || sendContent === '') {
        $('#sendContent').html('通知标题或通知内容不能为空');
        $('#makeSureNotice').css('display', 'block');
        return false;

    }

    var data = {
        "code": 20000,
        "message": "成功",
        "run_execute_time": "0.0069s",
        "data": {
            "list": [],
            "count": "1",
            "page_no": "1",
            "page_size": "15"
        }
    };
    if (data['code'] != 20000) {
        my_alert('提示(' + data['code'] + ')', '删除' + data['message']);
        return false;
    } else {
        // my_alert('提示(' + ret_data['code'] + ')', '删除'+ret_data['message']);
        $('#sendContent').html('保存成功');
        $('#sendNotice').css('display', 'none');
        $('#makeSureNotice').css('display', 'block');
    }

});

// 确认发送后点击确定
$('#makeSureNoticeBtn').click(function () {
    $('#makeSureNotice').css('display', 'none');
    getPageSearch(acturalPage, page_size);
});



