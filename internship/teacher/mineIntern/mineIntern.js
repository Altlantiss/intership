/**
 * Created by chenlei on 2017/12/2.
 */



var datestar = "";
var dateend = "";
// var tit = "";
// var num = '1';
// var total = '0';
// var acturalPage = acturalPage || 1;


$(function () {
    jQuery("#student-keyword").val("");

});


initJqGrid({
    caption: '实习生列表',
    colNames: ['姓名', '系', '专业', '实习公司', '操作'],
    colModel: [
        {
            name: 'studentName'
        },
        {
            name: 'departName'
        },
        {
            name: 'majorName'
        },
        {
            name: 'enterprise'
        },
        {
            name: 'myac'
        }
    ],
    key: 'studentId',
    urlCreater: '/mobile/practiceGroupUser?page=1&limit=10&',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var studentName = jQuery("#student-keyword").val();
        var newUrl = apiUrl + "/mobile/practiceGroupUser?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
        if(studentName !== ""){
            newUrl +=  "&studentName="+studentName;
        }
        jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
    },
    loadComplete: function (ids, data) {

        for (var i = 0; i < data.length; i++) {
            var cl = data[i].studentId;
            var ce = '<button id="detail_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" onclick="detail_dialog_fn(this)"><i class="icon-trash align-top bigger-125"></i>显示详情</button>';
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



function detail_dialog_fn(e) {

    var choose_detail_id = parseInt(e.id.split("_")[1]);

    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "/mobile/student/studentInfo",//路径
        data: {
            "id": choose_detail_id
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                $("#username").val(data.data.student.username);
                $("#name").val(data.data.student.name);
                $("#sex").val(data.data.student.sex);
                $("#qq").val(data.data.student.qq);
                $("#tel").val(data.data.student.tel);
                $("#politicalVisage").val(data.data.student.politicalVisage);
                $("#nation").val(data.data.student.nation);
                $("#schoolName").val(data.data.student.schoolName);
                $("#departName").val(data.data.student.departName);
                $("#majorName").val(data.data.student.majorName);
                $("#className").val(data.data.student.className);
                jQuery('#group_update_dialog').css('display', 'block');
            } else {
                alert("获取学生详情信息失败!");
            }

        }
    });
}

function close_update_dialog() {
    jQuery('#group_update_dialog').css('display', 'none');
}

$(document).ready(function(){
    //搜索
    var btnSeacher = $("#btn-search");

    btnSeacher.on("click",function(){
        jQuery("#grid-table").jqGrid('setGridParam', {
            url : ''
        }).trigger('reloadGrid');
        // var studentKeyword = $("#student-keyword").val();
        // $.ax({
        //     url: apiUrl + '/mobile/practiceGroupUser?page=1&limit=10&studentName='+studentKeyword,
        //     type: 'GET',
        //     data: {
        //         token: cookie.get('token')
        //     },
        //     success: function (data) {
        //
        //     },
        //     error:function(err){
        //         alert("请求出错!请稍后重试");
        //         console.log(err);
        //     }
        // });

    });



});