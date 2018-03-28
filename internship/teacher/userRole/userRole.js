/**
 * Created by zzx on 2017/12/7.
 */



var datestar = "";
var dateend = "";
// var tit = "";
// var num = '1';
// var total = '0';
var editTeacherId;


$(function () {
    jQuery("#student-keyword").val("");
});


initJqGrid({
    caption: '用户列表',
    colNames: ['用户名', '姓名', '性别', '电话','QQ','邮箱','政治面貌','民族', '家庭住址','操作'],
    colModel: [
        {
            name: 'username'
        },
        {
            name: 'name'
        },
        {
            name: 'sex'
        },
        {
            name: 'tel'
        },
        {
            name: 'qq'
        },
        {
            name: 'email'
        },
        {
            name: 'politicalVisage'
        },
        {
            name: 'nation'
        },
        {
            name: 'homeAddress'
        },

        {name: 'myac'}
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
            var se = '<button id="class_studentqq_' + cl + '" class="btn btn-xs btn-success" onclick="update_dialog_fn(' + cl + ');" style="float:left;margin-left:5px;"><i class="icon-trash align-top bigger-125"></i>查看该用户角色</button>';
            jQuery("#grid-table").jqGrid(
                'setRowData',
                cl,
                {
                    myac: se
                }
            );
        }

    }
});


// 点击新增用户
function open_add_teacher_dialog(e) {
    jQuery('#add_teacher_dialog').css('display', 'block');
}
/**
 * 关闭新增窗口
 */
function close_update_dialog() {
    jQuery('#group_update_dialog').css('display', 'none');
}


/**
 * 关闭查看窗口
 */
function close_add_teacher_dialog() {
    jQuery('#add_teacher_dialog').css('display', 'none');

}


/**
 * 新增用户
 */
function add_groupTeacher() {

    $.ajax({
        type: "POST",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/userRole",//路径
        data: {
            userId: editTeacherId,
            roleId: $("#roleList").val()
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("新增角色成功!");
                update_dialog_fn(editTeacherId);
            } else {
                alert("新增教师失败!");
            }
        }
    });
}

/**
 * 编辑用户
 */
function update_groupTeacher() {
    var editUsername = jQuery("#editUsername").val();
    var editName = jQuery("#editName").val();
    var editSex = jQuery("#editSex").val();
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
 * 删除用户
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


var roleId ;
//查看用户角色
function update_dialog_fn(id) {
    $('#roleList').attr("disabled","disabled");
    $('#makeSureSend').attr("disabled","disabled");
    $("#roleList").empty();
    editTeacherId = id;
    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/userRole?",//路径
        data: {
            "userId": id
        },
        success: function (data) {//返回数据根据结果进行相应的处理

            $("#userRoleList").empty();
            if (data.code === 0) {
               if( data.data.length >0 ){
                   roleId = data.data[0].id;
                   var str = "";
                   for(var i =0; i <data.data.length; i++){
                        str += '<li style="overflow: hidden" id="'+ data.data[i]["roleId"] +'">' +
                                '<p style="width: 100px;float: left">' + data.data[i]["roleName"] + '</p>'+
                                '<a style="float: right;cursor: pointer" onclick="delete_role('+ data.data[i]["roleId"] +')">删除角色</a>'+
                                '</li>'
                   }
                   $("#userRoleList").html(str);
                   $("#add_teacher_dialog").css("display","block");
               }else{
                   $("#add_teacher_dialog").css("display","block");
                   alert("暂无角色信息");
               }

            } else {
                alert("获取教师信息失败!");
            }

        }
    });

}

//获取角色列表
function add_role(){
    $('#roleList').removeAttr("disabled");
    $('#makeSureSend').removeAttr("disabled");
    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/role?page=1&limit=10",//路径
        data: {
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                if( data.data.list.length >0 ){
                    var str = "";
                    for( var i =0; i<data.data.list.length; i++ ){
                        str += '<option value="'+ data.data.list[i]["id"] +'">'+ data.data.list[i]["roleName"]  +'</option>'
                    }
                    $("#roleList").html(str);
                }else{
                    alert("暂无角色信息");
                }
            } else {
                alert("获取角色信息失败!");
            }

        }
    });


}

//删除角色
function delete_role(id){
    $.ajax({
        type: "DELETE",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/userRole?id=" + roleId ,//路径
        data: {
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("删除角色成功!");
                update_dialog_fn(editTeacherId);
            } else {
                alert("删除角色失败!");
            }

        }
    });
}


$(document).ready(function(){

    var btnSeacher = $("#btn-search");

    btnSeacher.on("click",function(){
        jQuery("#grid-table").jqGrid('setGridParam', {
            url : ''
        }).trigger('reloadGrid');
    });

});