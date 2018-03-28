/**
 * Created by zzx on 2017/12/7.
 */



var datestar = "";
var dateend = "";
jQuery("#student-keyword").val("");
// var tit = "";
// var num = '1';
// var total = '0';
var editTeacherId;


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


initJqGrid({
    caption: '教师列表',
    colNames: ['用户名', '姓名', '性别', '电话','QQ','邮箱','政治面貌','民族', '家庭住址','操作'],
    colModel: [
        {
            name: 'username',
            width:90
        },
        {
            name: 'name',
            width:70
        },
        {
            name: 'sex',
            width:30
        },
        {
            name: 'tel',
            width:90
        },
        {
            name: 'qq',
            width:100
        },
        {
            name: 'email',
            width:110
        },
        {
            name: 'politicalVisage',
            width:50
        },
        {
            name: 'nation',
            width: 50
        },
        {
            name: 'homeAddress',
            width: 100
        },

        {
            name: 'myac',
            width:150
        }
    ],
    key: 'id',
    urlCreater: 'mobile/teacher?',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var name = jQuery("#student-keyword").val();
        var newUrl = apiUrl + "/mobile/teacher?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
        if(name !== ""){
            newUrl +=  "&name="+name;
        }
        jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
    },
    loadComplete: function (ids, data) {
        for (var i = 0; i < ids.length; i++) {
            var cl = ids[i];
            var se = '<button id="class_studentqq_' + cl + '" class="btn btn-xs btn-success" onclick="update_dialog_fn(' + cl + ');" style="float:left;margin-left:5px;"><i class="icon-trash align-top bigger-125"></i>编辑教师</button>';
            var ce = '<button id="class_delete_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" onclick="delete_fn(this)"><i class="icon-trash align-top bigger-125"></i>删除教师</button>';
            jQuery("#grid-table").jqGrid(
                'setRowData',
                cl,
                {
                    myac: se + ce
                }
            );
        }

    }
});


// 点击新增老师
function open_add_teacher_dialog(e) {
    jQuery('#add_teacher_dialog').css('display', 'block');
}

/**
 * 关闭新增窗口
 */
function close_add_teacher_dialog() {
    jQuery('#add_teacher_dialog').css('display', 'none');
}


/**
 * 新增教师
 */
function add_groupTeacher() {
    var username = jQuery("#username").val();
    var name = jQuery("#name").val();
    var sex = jQuery("#sex").val();
    var tel = jQuery("#tel").val();
    var qq = jQuery("#qq").val();
    var email = jQuery("#email").val();
    var politicalVisage = jQuery("#politicalVisage").val();
    var nation = jQuery("#nation").val();
    var homeAddress = jQuery("#homeAddress").val();
    $.ajax({
        type: "POST",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/teacher",//路径
        data: {
            "username": username,
            "name": name,
            "sex": sex,
            "tel": tel,
            "qq": qq,
            "email": email,
            "politicalVisage": politicalVisage,
            "nation": nation,
            "homeAddress": homeAddress
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("新增教师成功!");
                close_add_teacher_dialog();
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("新增教师失败!");
            }
        }
    });
}

/**
 * 编辑教师
 */
function update_groupTeacher() {
    var editUsername = jQuery("#editUsername").val();
    var editName = jQuery("#editName").val();
    var editSex = jQuery("#editSex").val();
    var editTel = jQuery("#editTel").val();
    var editQq = jQuery("#editQq").val();
    var editEmail = jQuery("#editEmail").val();
    var editPoliticalVisage = jQuery("#editPoliticalVisage").val();
    var editNation = jQuery("#editNation").val();
    var editHomeAddress = jQuery("#editHomeAddress").val();

    $.ajax({
        type: "PUT",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/teacher",//路径
        data: {
            "id": editTeacherId,
            "username": editUsername,
            "name": editName,
            "sex": editSex,
            "tel":editTel,
            "qq": editQq,
            "email": editEmail,
            "politicalVisage": editPoliticalVisage,
            "nation": editNation,
            "homeAddress": editHomeAddress
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("编辑教师成功!");
                close_update_dialog();
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("编辑教师失败!");
            }
        }
    });
}

/**
 * 删除教师
 */
function delete_fn(e) {
    /**
     * 获取选择的教师ID
     */
    var choose_teacher_id = parseInt(e.id.split("_")[2]);
    $.ajax({
        type: "DELETE",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/teacher?id=" + choose_teacher_id,//路径
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("删除教师成功!");
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("删除教师失败!");
            }
        }
    });
}

function update_dialog_fn(id) {

    editTeacherId = id;

    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/teacher/findTeacherById",//路径
        data: {
            "id": id
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                jQuery("#editUsername").val(data.data.username);
                jQuery("#editName").val(data.data.name);
                jQuery("#editSex").val(data.data.sex);
                jQuery("#editTel").val(data.data.tel);
                jQuery("#editQq").val(data.data.qq);
                jQuery("#editEmail").val(data.data.email);
                jQuery("#editPoliticalVisage").val(data.data.politicalVisage);
                jQuery("#editNation").val(data.data.nation);
                jQuery("#editHomeAddress").val(data.data.homeAddress);
                jQuery('#group_update_dialog').css('display', 'block');
            } else {
                alert("获取教师信息失败!");
            }

        }
    });

}

/**
 * 关闭新增窗口
 */
function close_update_dialog() {
    jQuery('#group_update_dialog').css('display', 'none');
}







$(document).ready(function(){

    var btnSeacher = $("#btn-search");
    var studentKeyword = $("#student-keyword").val();
    btnSeacher.on("click",function(){
        $.ajax({
            url: apiUrl + '/mobile/teacher?page=1&limit=10&name='+studentKeyword,
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

    var uploadFile = $("#upload-file");
    uploadFile.val("");
    uploadFile.on("change",function(){

        $("#upload-submit").click(function(){
            var options = {
                success: function (data) {
                    alert(data.msg);
                    jQuery("#grid-table").jqGrid().trigger("reloadGrid");
                },
                error:function(err){
                    alert("上传失败");
                    console.log(err);
                }
            };
            $("#upload-form").ajaxForm(options);
        });

        if( isFile() ){
            $("#upload-submit").click();
        }

    });
//导入按钮  -- 判断文件类型已经是否为空
    function isFile(){
        var file = $("#upload-file").val();
        if (file === "") {
            alert("请选择要上传的文件");
            return false
        } else {
            //检验文件类型是否正确
            var exec = (/[.]/.exec(file)) ? /[^.]+$/.exec(file.toLowerCase()) : '';
            if (exec != "xlsx") {
                alert("文件格式不对，请上传Excel文件!");
                return false;
            }
        }
        return true;
    }






});