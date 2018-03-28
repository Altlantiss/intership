/**
 * Created by chenlei on 2017/12/6.
 */
var datestar = "";
var dateend = "";
var tit = "";
var num = '1';
var total = '0';
var acturalPage = acturalPage || 1;
var pageSize = pageSize || 15;

window.onload = function () {
    getPageSearch();

};

var practiceIntention = {


};

// 请求数据
function getPageSearch() {
    
    $.ax({
        url: apiUrl + '/mobile/practice/my',
        type: 'GET',
        data: {
            token: cookie.get('token')
        },
        success: function (data) {

            if(data.code == 0) {
                removeload();
                $('#form-input-readonly1').val(data.data[0].enterprise);
                $('#form-input-readonly2').val(data.data[0].job);
                $('#form-input-readonly3').val(data.data[0].startDate);
                $('#form-input-readonly4').val(data.data[0].endDate);
                $('#form-input-readonly5').val(data.data[0].workAddress);
            }
        }
    });

}

$('#submit').click(function () {

    var report = $('#form-input-readonly1').val();

    if(report == '') {
        my_alert('提示','请填写实习总结');
        return false;
    }

    $.ajax({
        url: apiUrl + '/mobile/practice',
        type: 'PUT',
        beforeSend: function(request) {
            request.setRequestHeader("token", cookie.get('token'));
        },
        success: function (data) {
            if(data.code == 0) {
                removeload();
                my_alert('提示','提交成功');
                $('#form-input-readonly1').val('');
            }
            else {
                removeload();
                my_alert('提示','提交失败');
            }
        }
    })

});

$('#clear').click(function () {
    $('#form-input-readonly1').val('');
});

// 点击发送通知接口
$('#sendNoticeBtn').on('click',function () {

    $('#sendNotice').css('display','block');

});

// 确定发送通知
$('#makeSureSend').on('click',function () {

    var titleVal = $('#form-field-1').val();
    var contentVal = $('#form-field-2').val();

    $.ax({
        url: apiUrl + 'mobile/notice',
        type: 'POST',
        data: {
            title: titleVal,
            content: contentVal,
            token: cookie.get('token')
        },
        success:function (data) {
            if(data.code === 0) {

                my_alert('提示','保存成功',getPageSearch(acturalPage,page_size));
                $('#sendNotice').css('display','none');

            }
        }
    })

});

// 取消发送通知
$('#clearSend').on('click',function () {

    $('#sendNotice').css('display','none');

});

// 取消发送通知
$('#closeSendNotice').on('click',function () {

    $('#sendNotice').css('display','none');

});

// 点击删除按钮，跳出弹框
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

// 点击确认删除通知
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
        my_alert('提示(' + data['code'] + ')', '查看' + data['message']);
        return false;
    } else {
        // my_alert('提示(' + ret_data['code'] + ')', '删除'+ret_data['message']);
        $('#notice_list').html('');
        //getPageSearch(tit, datestar, dateend, 1, page_size);
    }
}