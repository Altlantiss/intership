/**
 * Created by chenlei on 2017/12/5.
 */

var datestar = "";
var dateend = "";
var tit = "";
var num = '1';
var total = '0';
var addSystemType = 0;

window.onload = function () {
    // 点击删除按钮
    messageHide('.systemLine');
    clickSystem('.systemLine');

};

function messageHide(id) {
    $(id).on("click", '.deleteBtn', function(event) {
        event.stopPropagation();
        $('#deletepopup').show();
    });
}

// 点击院系某一行
function clickSystem(id) {
    $(id).on('click',function () {

        var data = {
            "code":20000,
            "message":"成功",
            "run_execute_time":"0.0069s",
            "data":{
                "list":[
                    {
                        "profession":"11",
                        "system":"会计专业"
                    },
                    {
                        "system_id":"2",
                        "system":"国际贸易专业"
                    },
                    {
                        "system_id":"3",
                        "system":"商务英语专业"
                    }
                ]
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
                    list += "<tr class='systemLine'><td>" + item.system + "</td>";
                    list += "<td>{0}&nbsp;&nbsp;</td></tr>".format(
                        "<a href='javascript:void(0)' onclick='deletepopup(" + item.notification_id + ")'>删除</a>"
                    );
                });
            }

            $('#profession_notice_list').html(list);
            removeload();

        } else {
            removeload();
            my_alert('提示(' + data['code'] + ')', data['message']);
        }

    });

}

// 点击专业某一行
function clickProfession(id) {

    var data = {
        "code":20000,
        "message":"成功",
        "run_execute_time":"0.0069s",
        "data":{
            "list":[
                {
                    "profession":"111",
                    "system":"会计101"
                },
                {
                    "system_id":"222",
                    "system":"会计102"
                },
                {
                    "system_id":"333",
                    "system":"会计103"
                }
            ]
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
                list += "<tr class='systemLine'><td>" + item.system + "</td>";
                list += "<td>{0}&nbsp;&nbsp;</td></tr>".format(
                    "<a href='javascript:void(0)' onclick='deletepopup(" + item.notification_id + ")'>删除</a>"
                );
            });
        }

        $('#class_notice_list').html(list);
        removeload();

    } else {
        removeload();
        my_alert('提示(' + data['code'] + ')', data['message']);
    }

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

function getPageSearch() {

    var data = {
        "code":20000,
        "message":"成功",
        "run_execute_time":"0.0069s",
        "data":{
            "list":[
                {
                    "system_id":"1",
                    "system":"经济管理学院"
                },
                {
                    "system_id":"2",
                    "system":"计算机信息学院"
                },
                {
                    "system_id":"3",
                    "system":"外语言文学专业"
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
                list += "<tr class='systemLine'><td>" + item.system + "</td>";
                list += "<td>{0}&nbsp;&nbsp;</td></tr>".format(
                    "<a href='javascript:void(0)' key=item.notification_id class='deleteBtn' style='display: inline-block;width: 50px'>删除</a>"
                );
            });
        }

        $('#notice_list').html(list);
        removeload();

    } else {
        removeload();
        my_alert('提示(' + data['code'] + ')', data['message']);
    }

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

// 删除数据
function notice_delete(id) {

    closepopup();

    var data = {
        "code":20000,
        "message":"成功",
        "run_execute_time":"0.0069s",
        "data":{
            "list":[
                {
                    "system_id":"2",
                    "system":"计算机信息学院"
                },
                {
                    "system_id":"3",
                    "system":"外语言文学专业"
                }
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
        var json = data.data.list;
        var list='';
        if (json) {
            var s_time = '';
            $.each(json, function (i, item) {
                if (item.create !== null) {
                    s_time = getTimeByTimestamp(item.create);
                }
                list += "<tr onClick='clickSystem("+ item.system_id+")'><td>" + item.system + "</td>";
                list += "<td>{0}&nbsp;&nbsp;</td></tr>".format(
                    "<a href='javascript:void(0)' onclick='deletepopup(" + item.notification_id + ")'>删除</a>"
                );
            });
        }
        $('#notice_list').html(list);
    }
}

// 点击添加按钮
function addSystem(type) {
debugger;
    $('#sendNotice').css('display','block');
    $('#form-field-1').val('');
    addSystemType = type;

    if(type === 1) {
        $('#sendNoticeTitle').html('添加院系');
        $('#addName').html('院系名称');
    }
    else if(type === 2) {
        $('#sendNoticeTitle').html('添加专业');
        $('#addName').html('专业名称');
    }
    else if(type === 3) {
        $('#sendNoticeTitle').html('添加班级');
        $('#addName').html('班级名称');
    }

}

// 点击添加弹框取消
$('#clearSend').click(function () {
    $('#sendNotice').css('display','none');
});

$('#closeSendNotice').click(function () {
    $('#sendNotice').css('display','none');
});

// 点击添加弹框确认
$('#makeSureSend').click(function () {

    var data = {
        "code":20000,
        "message":"成功",
        "run_execute_time":"0.0069s",
        "data":{
            "list":[
                {
                    "system_id":"1",
                    "system":"经济管理学院"
                },
                {
                    "system_id":"2",
                    "system":"计算机信息学院"
                },
                {
                    "system_id":"3",
                    "system":"外语言文学专业"
                },
                {
                    "system_id":"4",
                    "system":"机电工程学院"
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
                list += "<tr onClick='clickSystem("+ item.system_id+")'><td>" + item.system + "</td>";
                list += "<td>{0}&nbsp;&nbsp;</td></tr>".format(
                    "<a href='javascript:void(0)' onclick='deletepopup(" + item.notification_id + ")'>删除</a>"
                );
            });
        }

        if(addSystemType === 1) {
            $('#notice_list').html(list);
        }
        else if(addSystemType === 2) {
            $('#profession_notice_list').html(list);
        }
        else if(addSystemType === 3) {
            $('#class_notice_list').html(list);
        }

        removeload();
        $('#sendNotice').css('display','none');

    } else {
        removeload();
        my_alert('提示(' + data['code'] + ')', data['message']);
    }

});






