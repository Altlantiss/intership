/**
 * Created by chenlei on 2017/12/2.
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



    $('#sendNoticeBtn').on('click', function () {
        selectFind();
        $('#sendNotice').css('display', 'block');
        $('#form-field-1').val("");
        $('#form-field-2').val("");

    });

    // 确定发送通知
    $('#makeSureSend').on('click', function () {

        var titleVal = $('#form-field-1').val();
        var contentVal = $('#form-field-2').val();
        var objectVal = "";
        if( $("#notice-for-study").attr("disabled") ){
            objectVal = $("#notice-for-group").val();
            if( titleVal !== "" && contentVal !== "" ){
                $.ajax({
                    url: apiUrl + 'mobile/notice?page=1&limit=20',
                    type: 'POST',
                    data: {
                        title: titleVal,
                        content: contentVal,
                        groupId: objectVal,
                        token: cookie.get('token')
                    },
                    success: function (data) {
                        if (data.code === 0) {
                            $('#sendNotice').css('display', 'none');
                            my_alert('提示', '发送成功', null, reloadJqGrid);
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
            }else{
                alert("请填写完整");
            }
        }
        if( $("#notice-for-group").attr("disabled") ){
            objectVal = $("#notice-for-study").val();
            if( titleVal !== "" && contentVal !== "" ){
                $.ajax({
                    url: apiUrl + 'mobile/notice?page=1&limit=20',
                    type: 'POST',
                    data: {
                        title: titleVal,
                        content: contentVal,
                        userIds: objectVal,
                        token: cookie.get('token')
                    },
                    success: function (data) {
                        if (data.code === 0) {
                            $('#sendNotice').css('display', 'none');
                            my_alert('提示', '发送成功', null, reloadJqGrid);
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
            }else{
                alert("请填写完整");
            }

        }




    });

    // 取消发送通知
    $('#clearSend').on('click', function () {

        $('#sendNotice').css('display', 'none');

    });

    // 取消发送通知
    $('#closeSendNotice').on('click', function () {

        $('#sendNotice').css('display', 'none');

    });




initJqGrid({
        caption: '发送通知列表',
        colNames: ['发送时间', '通知标题', '内容摘要', '发送人', '阅读人数', '操作'],
        colModel: [
            {
                name: 'createTime',
                index: 'createTime',
                sortable: false,
                editable: false,
                width:100
            },
            {
                name: 'title',
                index: 'title',
                sortable: false,
                editable: false,
                width:100
            },
            {
                name: 'content',
                index: 'content',
                sortable: false,
                editable: false,
                width:200
            },
            {
                name: 'sender_name',
                index: 'sender_name',
                sortable: false,
                editable: false,
                width:90
            },
            {
                name: 'read',
                index: 'read',
                sortable: false,
                editable: false,
                width:70
            },
            {
                name: 'myac',
                index: '',
                fixed: true,
                sortable: false,
                resize: false,
                width:60
            }
        ],
        key: 'id',
        hight:500,
        urlCreater: '/mobile/notice?',
        beforeRequest: function () {
            var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
            var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
            var title = jQuery("#student-keyword").val();
            var createTime = $('input[name="sendtime"]').val();
            var newUrl = apiUrl + "/mobile/notice?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
            if(title !== ""){
                newUrl +=  "&title="+title;
            }
            if(createTime !== ""){
                newUrl +=  "&createTime="+createTime;
            }
            jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
        },
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







/**
 * Created by Altlantis on 2017/12/27.
 */


    // 发送通知增加下拉并自动获取下拉框内容
    var selectStudy = $("#notice-for-study");
    var selectGroup = $("#notice-for-group");

    function selectFind(){
        $.ajax({
            url: apiUrl + '/mobile/practiceGroup?page=1&limit=10',
            type: 'GET',
            data: {
                token: cookie.get('token')
            },
            success: function (data) {
                selectGroup.empty();
                for(var i = 0; i< data.data.list.length; i++){
                    selectGroup.append("<option value="+data.data.list[i]["id"]+">"+data.data.list[i]["groupName"] +"</option>")
                }
            },
            error:function(err){
                alert("请求出错!请稍后重试");
                console.log(err);
            }
        });
        $.ajax({
            url: apiUrl + '/mobile/student?page=1&limit=10',
            type: 'GET',
            data: {
                token: cookie.get('token')
            },
            success: function (data) {
                selectStudy.empty();
                for(var i = 0; i< data.data.list.length; i++){
                    selectStudy.append("<option value="+data.data.list[i]["id"]+">"+data.data.list[i]["name"] +"</option>")
                }
            },
            error:function(err){
                alert("请求出错!请稍后重试");
                console.log(err);
            }
        });


        // 发送人
        // $.ajax({
        //     url: apiUrl + '/mobile/student?page=1&limit=10',
        //     type: 'GET',
        //     data: {
        //         token: cookie.get('token')
        //     },
        //     success: function (data) {
        //         selectStudy.empty();
        //         for(var i = 0; i< data.data.list.length; i++){
        //             selectStudy.append("<option value="+data.data.list[i]["id"]+">"+data.data.list[i]["name"] +"</option>")
        //         }
        //     },
        //     error:function(err){
        //         alert("请求出错!请稍后重试");
        //         console.log(err);
        //     }
        // })
    }


    var studyRadio = $("#studyRadio");
    var groupRadio =$("#groupRadio");
    var studySelect = $("#notice-for-study");
    var groupSelect = $("#notice-for-group");
    studyRadio.attr("checked","checked");
    groupRadio.removeAttr("checked");
    groupSelect.attr("disabled",true);

    studyRadio.on("click",function(){
        studyRadio.attr("checked","checked");
        groupRadio.removeAttr("checked");
        groupSelect.attr("disabled",true);
        studySelect.removeAttr("disabled");
    });
    groupRadio.on("click",function(){
        groupRadio.attr("checked","checked");
        studyRadio.removeAttr("checked");
        studySelect.attr("disabled",true);
        groupSelect.removeAttr("disabled");
    });


    //搜索
    var btnSeacher = $("#btn-search");
    var studentKeyword = $("#student-keyword").val();
    btnSeacher.on("click",function(){

        $.ajax({
            url: apiUrl + '/mobile/notice?page=1&limit=10&title='+studentKeyword,
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

function delete_fn(e) {

    var id = parseInt(e.id.split("_")[1]);

    $.ajax({
        type: 'DELETE',
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get('token'));
        },
        url: apiUrl + 'mobile/notice?id=' + id,
        success: function (data) {
            if (data['code'] === 0) {
                my_alert('提示', '删除成功', null, reloadJqGrid);
            } else {
                my_alert('提示(' + data['code'] + ')', data['msg']);
            }

        }
    });

}


