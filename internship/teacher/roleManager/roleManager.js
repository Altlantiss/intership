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
    caption: '角色列表',
    colNames: ['角色名', '角色代码','操作'],
    colModel: [
        {
            name: 'roleName'
        },
        {
            name: 'roleCode'
        },
        {name: 'myac'}
    ],
    key: 'id',
    urlCreater: 'mobile/role?page=1&limit=10&',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var name = jQuery("#student-keyword").val();
        var newUrl = apiUrl + "/mobile/role?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
        if(name !== ""){
            newUrl +=  "&roleName="+name;
        }
        jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
    },
    loadComplete: function (ids, data) {
        for (var i = 0; i < ids.length; i++) {
            var cl = ids[i];
            var se = '<button id="class_studentqq_' + cl + '" class="btn btn-xs btn-success" onclick="update_dialog_fn(' + cl + ');" style="float:left;margin-left:5px;"><i class="icon-trash align-top bigger-125"></i>编辑角色</button>';
            var ce = '<button id="class_delete_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" onclick="delete_fn(this)"><i class="icon-trash align-top bigger-125"></i>删除角色</button>';
            var cw = '<button id="class_delete_' + cl + '" class="btn btn-xs btn-success btn-role" onclick="roleBoxOpen('+ cl +');" style="float:left;margin-left:5px;"><i class="icon-trash align-top bigger-125"></i>查看角色权限</button>';
            jQuery("#grid-table").jqGrid(
                'setRowData',
                cl,
                {
                    myac: se + ce + cw
                }
            );
        }

    }
});


// 点击新增角色
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
 * 新增角色
 */
function add_groupTeacher() {
    var roleName = jQuery("#roleName").val();
    var roleCode = jQuery("#roleCode").val();

    $.ajax({
        type: "POST",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/role",//路径
        data: {
            "roleName": roleName,
            "roleCode": roleCode
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("新增角色成功!");
                close_add_teacher_dialog();
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("新增角色失败!");
            }
        }
    });
}

/**
 * 编辑角色
 */
function update_groupTeacher() {
    $.ajax({
        type: "PUT",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/role",//路径
        data: {
            "id": editRoleId,
            "roleName": $("#editRoleName").val(),
            "roleCode": $("#editRoleCode").val()
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("编辑角色成功!");
                close_update_dialog();
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("编辑角色失败!");
            }
        }
    });
}

/**
 * 删除角色
 */
function delete_fn(e) {
    /**
     * 获取选择的角色ID
     */
    var choose_teacher_id = parseInt(e.id.split("_")[2]);
    $.ajax({
        type: "DELETE",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/role?id=" + choose_teacher_id,//路径
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("删除角色成功!");
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("删除角色失败!");
            }
        }
    });
}

//打开编辑
var editRoleId;
function update_dialog_fn(id) {

    editRoleId = id;

    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/role?page=1&limit=10&",//路径
        data: {
            "id": id
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                for(var i =0; i<data.data.list.length; i++){
                    if( data.data.list[i].id === editRoleId ){
                        jQuery("#editRoleName").val(data.data.list[i]["roleName"]);
                        jQuery("#editRoleCode").val(data.data.list[i]["roleCode"]);
                        jQuery('#group_update_dialog').css('display', 'block');
                    }
                }
            } else {
                alert("获取角色信息失败!");
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

//打开查看权限
var roleId = 0;
function roleBoxOpen(id){
    roleId = id;
    $("#role_update_dialog").css("display","block");
    //获取角色权限信息
    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/rolePermission?page=1&limit=10&",//路径
        data: {
            "roleId": id
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            console.log(data);
            if (data.code === 0) {
                if( data.data.length > 0 ){
                    var str = "";
                    for( var i = 0; i<data.data.length; i++ ){
                        str += '<li style="margin-left: 10px;" id="'+data.data[i]["id"]+'">' +
                            '<p style="display: inline-block;width: 100px">'+
                            data.data[i]["permissionName"] +
                            '</p>'+
                            '<a style="float:right;margin-right:20px;cursor: pointer" onclick="deletePermission('+data.data[i]["id"] +')">删除权限</a>'+
                            '</li>'
                    }
                    $("#perMission").html(str);
                }else{
                    $("#perMission").empty();
                    alert("暂无权限信息")
                }
            } else {
                alert("获取角色信息失败!");
            }

        }
    });
}
//获取所有的权限信息
function allPermission(){
    //获取所有的权限信息
    $("#rolePermission").css("visibility","visible");
    $("#PermissionAddOk").css("visibility","visible");

    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/getAllMenus?page=1&limit=10&",//路径
        data: {
            // "roleId": 1
        },
        success: function (data) {//返回数据根据结果进行相应的处理

            if (data.code === 0) {
                if( data.data.length > 0 ){
                    var str = "";
                    for( var i = 0; i<data.data.length; i++ ){
                        str += '<option value="'+ data.data[i]["id"] +'">' + data.data[i]["permissionName"] + '</option>'
                    }
                    $("#rolePermission").html(str);
                }
            } else {
                alert("获取角色信息失败!");
            }

        }
    });
}
//删除权限信息
function deletePermission(id){
    $.ajax({
        type: "DELETE",  //提交方式
        url: apiUrl + "mobile/rolePermission?page=1&limit=10&token=" + cookie.get("token") +"&id=" + id,//路径
        data: {
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("删除权限成功");
                roleBoxOpen(roleId);
            } else {
                alert("删除权限失败!");
            }

        },
        error:function(err){
            alert("获取信息失败");
            console.log(err);
        }
    });
}

//关闭查看权限
function close_role_box(){
    $("#rolePermission").css("visibility","hidden");
    $("#PermissionAddOk").css("visibility","hidden");
    $("#role_update_dialog").css("display","none");
}

//增加权限
function addPermission(){

    $.ajax({
        type: "POST",  //提交方式
        url: apiUrl + "mobile/rolePermission?page=1&limit=10&token=" + cookie.get("token") +"&roleId=" + roleId + "&permissionId=" + $("#rolePermission").val(),//路径
        data: {
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("增加权限成功");
                roleBoxOpen(roleId);
            }
            if( data.code === 15 ){
                alert("请勿重复提交")
            }

        },
        error:function(err){
            alert("获取信息失败");
            console.log(err);
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