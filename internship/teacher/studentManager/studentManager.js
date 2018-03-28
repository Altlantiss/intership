/**
 * Created by zzx on 2017/12/7.
 */



var datestar = "";
var dateend = "";
jQuery("#student-keyword").val("");
var tit = "";
var num = '1';
var total = '0';
var choose_group_id_st = "";

function deletepopup(id) {
    $('#deletepopup').show();
    de_id = id;
}
function closepopup() {
    $('#deletepopup').hide();
}
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
    caption: '学生列表',
    colNames: ['用户名', '姓名', '性别','学校','系部','专业','班级','电话', '身份证', '操作'],
    colModel: [
        {
            name: 'username',
            width: 90
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
            name: 'schoolName',
            width:100
        },
        {
            name: 'departName',
            width:50
        },
        {
            name: 'majorName',
            width:50
        },
        {
            name: 'className',
            width:50
        },
        {
            name: 'tel',
            width:80
        },
        {
            name: 'userNo',
            width:130
        },
        {name: 'myac', width:150}
    ],
    key: 'id',
    urlCreater: 'mobile/student?',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var username = jQuery("#student-keyword").val();
        var newUrl = apiUrl + "/mobile/student?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
        if(username !== ""){
            newUrl +=  "&name="+username;
        }
        jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
    },
    loadComplete: function (ids, data) {
        for (var i = 0; i < ids.length; i++) {
            var cl = ids[i];
            var se = '<button id="class_studentqq_' + cl + '" class="btn btn-xs btn-success" onclick="update_student_dialog_fn(' + cl + ');" style="float:left;margin-left:5px;"><i class="icon-trash align-top bigger-125"></i>编辑学生</button>';
            var ce = '<button id="class_delete_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" onclick="delete_group_fn(this)"><i class="icon-trash align-top bigger-125"></i>删除学生</button>';
            jQuery("#grid-table").jqGrid('setRowData', cl,
                {
                    myac: se + ce
                });
        }

    }
});


function close_dialog() {
    jQuery('#student_assign_dialog').css('display', 'none');
}

// 点击新增学生
function group_add_dialog_fn(e) {
    jQuery('#group_add_dialog').css('display', 'block');
    $("#username").val("");
    $("#name").val("");
    $("#sex").val("");
    $("#tel").val("");
    $("#userNo").val("");
    var  departName = $("#departName");
    var  majorName = $("#majorName");
    var  className = $("#className");
    dropDown(departName,majorName,className);
}


//三级联动下拉初始化
function dropDown(departName,majorName,className){
    departName.empty();
    majorName.empty();
    className.empty();
    $.ajax({
        url: apiUrl + '/mobile/department?page=1&limit=10&name=',
        type: 'GET',
        data: {
            token: cookie.get('token')
        },
        success: function (data) {
            //请求系部数据
            if(data.code === 0 && data.data.list.length > 0 ){
                var str = "";
                for(var i = 0;i <data.data.list.length; i++){
                    str += '<option value='+data.data.list[i]['id'] + '>'+data.data.list[i]['departName']+'</option>';
                }
                departName.append(str);
                //成功后继续请求
                $.ajax({
                    url: apiUrl + '/mobile/major?page=1&limit=10&departId=' + departName.val(),
                    type: 'GET',
                    data: {
                        token: cookie.get('token')
                    },
                    success: function (data) {
                        //请求专业数据
                        if( data.code === 0 && data.data.list.length > 0){
                            var str = "";
                            for(var i = 0;i <data.data.list.length; i++){
                                str += '<option value='+data.data.list[i]['id'] + '>'+data.data.list[i]['majorName']+'</option>';
                            }
                            majorName.append(str);
                            //成功后继续请求
                            $.ajax({
                                url: apiUrl + '/mobile/classes?page=1&limit=10&majorId=' + majorName.val(),
                                type: 'GET',
                                data: {
                                    token: cookie.get('token')
                                },
                                success: function (data) {
                                    //请求班级数据
                                    if( data.code === 0 && data.data.list.length > 0){
                                        var str = "";
                                        for(var i = 0;i <data.data.list.length; i++){
                                            str += '<option value='+data.data.list[i]['id'] + '>'+data.data.list[i]['className']+'</option>';
                                        }
                                        className.append(str);
                                    }
                                },
                                error:function(err){
                                    alert("请求出错!请稍后重试");
                                    console.log(err);
                                }
                            });
                        }


                    },
                    error:function(err){
                        alert("请求出错!请稍后重试");
                        console.log(err);
                    }
                });

            }

        },
        error:function(err){
            alert("请求出错!请稍后重试");
            console.log(err);
        }
    });
}


/**
 * 关闭新增窗口
 */
function close_add_dialog() {
    jQuery('#group_add_dialog').css('display', 'none');
}

//enable search/filter toolbar
//jQuery(grid_selector).jqGrid('filterToolbar',{defaultSearch:true,stringResult:true})

//switch element when editing inline
function aceSwitch(cellvalue, options, cell) {
    setTimeout(function () {
        $(cell).find('input[type=checkbox]')
            .wrap('<label class="inline" />')
            .addClass('ace ace-switch ace-switch-5')
            .after('<span class="lbl"></span>');
    }, 0);
}
//enable datepicker
function pickDate(cellvalue, options, cell) {
    setTimeout(function () {
        $(cell).find('input[type=text]')
            .datepicker({format: 'yyyy-mm-dd', autoclose: true});
    }, 0);
}

function style_edit_form(form) {
    //enable datepicker on "sdate" field and switches for "stock" field
    form.find('input[name=sdate]').datepicker({format: 'yyyy-mm-dd', autoclose: true})
        .end().find('input[name=stock]')
        .addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');

    //update buttons classes
    var buttons = form.next().find('.EditButton .fm-button');
    buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
    buttons.eq(0).addClass('btn-primary').prepend('<i class="icon-ok"></i>');
    buttons.eq(1).prepend('<i class="icon-remove"></i>')

    buttons = form.next().find('.navButton a');
    buttons.find('.ui-icon').remove();
    buttons.eq(0).append('<i class="icon-chevron-left"></i>');
    buttons.eq(1).append('<i class="icon-chevron-right"></i>');
}

function style_delete_form(form) {
    var buttons = form.next().find('.EditButton .fm-button');
    buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
    buttons.eq(0).addClass('btn-danger').prepend('<i class="icon-trash"></i>');
    buttons.eq(1).prepend('<i class="icon-remove"></i>')
}

function style_search_filters(form) {
    form.find('.delete-rule').val('X');
    form.find('.add-rule').addClass('btn btn-xs btn-primary');
    form.find('.add-group').addClass('btn btn-xs btn-success');
    form.find('.delete-group').addClass('btn btn-xs btn-danger');
}
function style_search_form(form) {
    var dialog = form.closest('.ui-jqdialog');
    var buttons = dialog.find('.EditTable')
    buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'icon-retweet');
    buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'icon-comment-alt');
    buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'icon-search');
}

function beforeDeleteCallback(e) {
    var form = $(e[0]);
    if (form.data('styled')) return false;

    form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
    style_delete_form(form);

    form.data('styled', true);
}

function beforeEditCallback(e) {
    var form = $(e[0]);
    form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
    style_edit_form(form);
}


//it causes some flicker when reloading or navigating grid
//it may be possible to have some custom formatter to do this as the grid is being created to prevent this
//or go back to default browser checkbox styles for the grid
function styleCheckbox(table) {
    /**
     $(table).find('input:checkbox').addClass('ace')
     .wrap('<label />')
     .after('<span class="lbl align-top" />')


     $('.ui-jqgrid-labels th[id*="_cb"]:first-child')
     .find('input.cbox[type=checkbox]').addClass('ace')
     .wrap('<label />').after('<span class="lbl align-top" />');
     */
}


//unlike navButtons icons, action icons in rows seem to be hard-coded
//you can change them like this in here if you want
function updateActionIcons(table) {
    /**
     var replacement =
     {
         'ui-icon-pencil' : 'icon-pencil blue',
         'ui-icon-trash' : 'icon-trash red',
         'ui-icon-disk' : 'icon-ok green',
         'ui-icon-cancel' : 'icon-remove red'
     };
     $(table).find('.ui-pg-div span.ui-icon').each(function(){
		var icon = $(this);
		var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
		if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
	})
     */
}

//replace icons with FontAwesome icons like above
function updatePagerIcons(table) {
    var replacement =
        {
            'ui-icon-seek-first': 'icon-double-angle-left bigger-140',
            'ui-icon-seek-prev': 'icon-angle-left bigger-140',
            'ui-icon-seek-next': 'icon-angle-right bigger-140',
            'ui-icon-seek-end': 'icon-double-angle-right bigger-140'
        };
    $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function () {
        var icon = $(this);
        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

        if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
    })
}

function enableTooltips(table) {
    $('.navtable .ui-pg-button').tooltip({container: 'body'});
    $(table).find('.ui-pg-div').tooltip({container: 'body'});
}


jQuery(document).ready(function () {
    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", token);
        },
        url: apiUrl + "mobile/classes/simple",//路径
        success: function (data) {//返回数据根据结果进行相应的处理
            for (var i = 0; i < data.data.length; i++) {
                $("#class_id").append("<option value='" + data.data[i].id + "'>" + data.data[i].className + "</option>");
            }
        }
    });
});


/**
 * 新增学生
 */
function add_student() {
    var username = jQuery("#username").val();
    var name = jQuery("#name").val();
    var sex = jQuery("#sex").val();
    var tel = jQuery("#tel").val();
    var userNo = jQuery("#userNo").val();
    var schoolName = jQuery("#schoolName").val();
    var departName = jQuery("#departName").val();
    var majorName = jQuery("#majorName").val();
    var className = jQuery("#className").val();
    if( username != "" && name != "" && sex != "" && userNo != ""  ){
        $.ajax({
            type: "POST",  //提交方式
            beforeSend: function (request) {
                request.setRequestHeader("token", cookie.get("token"));
            },
            url: apiUrl + "mobile/student",//路径
            data: {
                "username": username,
                "name": name,
                "sex": sex,
                "tel": tel,
                "userNo": userNo,
                "schoolName": schoolName,
                "depart": departName,
                "major": majorName,
                "myClass": className
            },
            success: function (data) {//返回数据根据结果进行相应的处理
                if (data.code === 0) {
                    alert("新增学生成功!");
                    close_add_dialog();
                    jQuery("#grid-table").jqGrid().trigger("reloadGrid");
                } else {
                    alert("新增学生失败!");
                }
            }
        });
    }else{
        alert("请完善学生资料")
    }

}

/**
 * 编辑学生
 */
function update_student() {
    var editUsername = jQuery("#editUsername").val();
    var editName = jQuery("#editName").val();
    var editSex = jQuery("#editSex").val();
    var editTel = jQuery("#editTel").val();
    var editUserNo = jQuery("#editUserNo").val();
    var editSchoolName = jQuery("#editSchoolName").val();
    var editDepartName = jQuery("#editDepartName").val();
    var editMajorName = jQuery("#editMajorName").val();
    var editClassName = jQuery("#editClassName").val();
    if( editClassName !== null ){
        $.ajax({
            type: "PUT",  //提交方式
            beforeSend: function (request) {
                request.setRequestHeader("token", cookie.get("token"));
            },
            url: apiUrl + "mobile/student",//路径
            data: {
                "id": editStudentId,
                "username": editUsername,
                "name": editName,
                "sex": editSex,
                "tel": editTel,
                "userNo": editUserNo,
                "schoolName": editSchoolName,
                "depart": editDepartName,
                "major": editMajorName,
                "myClass": editClassName
            },
            success: function (data) {//返回数据根据结果进行相应的处理
                if (data.code === 0) {
                    alert("编辑学生成功!");
                    close_update_dialog();
                    jQuery("#grid-table").jqGrid().trigger("reloadGrid");
                } else {
                    alert("编辑学生失败!");
                }
            }
        });
    }else{
        alert("班级不能为空")
    }

}

/**
 * 删除学生
 */
function delete_group_fn(e) {
    /**
     * 获取选择的学生ID
     */
    var choose_student_id = parseInt(e.id.split("_")[2]);
    $.ajax({
        type: "DELETE",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/student?id=" + choose_student_id,//路径
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("删除学生成功!");
                close_add_dialog();
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("删除学生失败!");
            }
        }
    });
}
//编辑学生
function update_student_dialog_fn(id) {

    editStudentId = id;

    var  departName = $("#editDepartName");
    var  majorName = $("#editMajorName");
    var  className = $("#editClassName");
    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/student/findStudentById",//路径
        data: {
            "id": id
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                jQuery("#editUsername").val(data.data.username);
                jQuery("#editName").val(data.data.name);
                jQuery("#editSex").val(data.data.sex);
                jQuery("#editTel").val(data.data.tel);
                jQuery("#editUserNo").val(data.data.userNo);
                jQuery("#editSchoolName").val(data.data.schoolName);
                var depart = data.data.depart;
                var major = data.data.major;
                var myClass = data.data.myClass;
                departName.empty();
                majorName.empty();
                className.empty();
                $.ajax({
                    url: apiUrl + '/mobile/department?page=1&limit=30&',
                    type: 'GET',
                    data: {
                        token: cookie.get('token')
                    },
                    success: function (data) {
                        //请求系部数据
                        if(data.code === 0 && data.data.list.length > 0 ){
                            var str = "";
                            for(var i = 0;i <data.data.list.length; i++){
                                str += '<option value='+data.data.list[i]['id'] + '>'+data.data.list[i]['departName']+'</option>';
                            }
                            departName.append(str);
                            departName.val(depart);
                            //成功后继续请求
                            $.ajax({
                                url: apiUrl + '/mobile/major?page=1&limit=30&departId=' + departName.val(),
                                type: 'GET',
                                data: {
                                    token: cookie.get('token')
                                },
                                success: function (data) {
                                    //请求专业数据
                                    if( data.code === 0 && data.data.list.length > 0){
                                        var str = "";
                                        for(var i = 0;i <data.data.list.length; i++){
                                            str += '<option value='+data.data.list[i]['id'] + '>'+data.data.list[i]['majorName']+'</option>';
                                        }
                                        majorName.append(str);
                                        majorName.val(major);
                                        //成功后继续请求
                                        $.ajax({
                                            url: apiUrl + '/mobile/classes?page=1&limit=30&majorId=' + majorName.val(),
                                            type: 'GET',
                                            data: {
                                                token: cookie.get('token')
                                            },
                                            success: function (data) {
                                                //请求班级数据
                                                if( data.code === 0 && data.data.list.length > 0){
                                                    var str = "";
                                                    for(var i = 0;i <data.data.list.length; i++){
                                                        str += '<option value='+data.data.list[i]['id'] + '>'+data.data.list[i]['className']+'</option>';
                                                    }
                                                    className.append(str);
                                                    className.val(myClass);
                                                }
                                            },
                                            error:function(err){
                                                alert("请求出错!请稍后重试");
                                                console.log(err);
                                            }
                                        });
                                    }


                                },
                                error:function(err){
                                    alert("请求出错!请稍后重试");
                                    console.log(err);
                                }
                            });

                        }

                    },
                    error:function(err){
                        alert("请求出错!请稍后重试");
                        console.log(err);
                    }
                });
                jQuery('#group_update_dialog').css('display', 'block');
            } else {
                alert("获取学生信息失败!");
            }

        }
    });
}
//重置密码
function pwdReset(){
    $.ajax({
        type: "PUT",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/student",//路径
        data: {
            "id": editStudentId,
            "password": "123456"
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("重置成功!");
                close_update_dialog();
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("重置失败!");
            }
        }
    });
}

function search_student() {

    var class_check = jQuery("#class_id").val();
    var rowNum = jQuery("#grid-upStudent-check-group").jqGrid('getGridParam', 'rowNum');
    jQuery("#grid-upStudent-group").jqGrid('setGridParam', {
        url: apiUrl + "student/findMyClassesStudents?classId=" + class_check + "&page=1&limit=" + rowNum + "&token=" + cookie.get("token")
    }).trigger("reloadGrid");
}

/**
 * 关闭新增窗口
 */
function close_update_dialog() {
    jQuery('#group_update_dialog').css('display', 'none');
}

/**
 * 添加学生至已选择学生列表
 */
function add_student_toGrid() {

    var ids = $("#grid-upStudent-group").jqGrid("getGridParam", "selarrrow");

    var dataRow;
    if (ids.length > 0) {
        for (var j = 0; j < ids.length; j++) {
            //使用addRowData方法把dataRow添加到表格中
            dataRow = $("#grid-upStudent-group").jqGrid("getRowData", ids[j]);
            // console.log(dataRow);
            $("#grid-upStudent-group").jqGrid("delRowData", ids[j]);
            $("#grid-upStudent-check-group").jqGrid("addRowData", j + 1, dataRow, "first");
        }
    } else {
        alert("你没有选取或者选取为多行数据，不允许进入下一级");
    }
}

/**
 * 删除选择学生列表
 */
function delete_student_toGrid() {
    var ids = $("#grid-upStudent-check-group").jqGrid("getGridParam", "selarrrow");
    var dataRow;
    if (ids.length > 0) {
        for (var j = 0; j < ids.length; j++) {
            //使用addRowData方法把dataRow添加到表格中
            dataRow = $("#grid-upStudent-check-group").jqGrid("getRowData", ids[j]);
            $("#grid-upStudent-check-group").jqGrid("delRowData", ids[j]);
            $("#grid-upStudent-group").jqGrid("addRowData", j + 1, dataRow, "first");
        }
    } else {
        alert("你没有选取或者选取为多行数据，不允许进入下一级");
    }
}

/**
 * 保存学生编辑
 */
function add_groupStudent() {
    var ids = $("#grid-upStudent-check-group").jqGrid("getRowData");
    var group_id = jQuery("#choose_groupSt_id").val();
    var student_ids = "";
    for (var i = 0; i < ids.length; i++) {
        if (student_ids == "") {
            student_ids += ids[i].studentId;
        } else {
            student_ids += "," + ids[i].studentId;
        }
    }

    $.ajax({
        type: "POST",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/practiceGroupUser",//路径
        data: {
            "groupId": group_id,
            "userIds": student_ids
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("编辑群组成员成功!");
                close_update_dialog();
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("编辑群组成员失败!");
            }
        }
    });
}

$(document).ready(function(){
//搜索
var btnSeacher = $("#btn-search");
btnSeacher.on("click",function(){
    var studentKeyword = $("#student-keyword").val();
    $.ajax({
        url: apiUrl + '/mobile/student?page=1&limit=10&name='+studentKeyword,
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


var departName = $("#departName");
var majorName = $("#majorName");
var className = $("#className");
var editDepartName = $("#editDepartName");
var editMajorName = $("#editMajorName");
var editClassName = $("#editClassName");

//一级菜单变动
function firstDropChange(departName,majorName,className){
    $.ajax({
        url: apiUrl + '/mobile/major?page=1&limit=10&departId=' + departName.val(),
        type: 'GET',
        data: {
            token: cookie.get('token')
        },
        success: function (data) {
            //请求专业数据
            if( data.code === 0 && data.data.list.length > 0){
                majorName.empty();
                var str ="";
                for(var i = 0;i <data.data.list.length; i++){
                    str += '<option value='+data.data.list[i]['id'] + '>'+data.data.list[i]['majorName']+'</option>';
                }
                majorName.append(str);
                //成功后继续请求
                $.ajax({
                    url: apiUrl + '/mobile/classes?page=1&limit=10&majorId=' + majorName.val(),
                    type: 'GET',
                    data: {
                        token: cookie.get('token')
                    },
                    success: function (data) {
                        //请求班级数据
                        className.empty();
                        var str = "";
                        if( data.code === 0 && data.data.list.length > 0){
                            for(var i = 0;i <data.data.list.length; i++){
                                str += '<option value='+data.data.list[i]['id'] + '>'+data.data.list[i]['className']+'</option>';
                            }
                            className.append(str);
                        }
                    },
                    error:function(err){
                        alert("请求出错!请稍后重试");
                        console.log(err);
                    }
                });
            }


        },
        error:function(err){
            alert("请求出错!请稍后重试");
            console.log(err);
        }
    });
}
//二级菜单变动
function secondDropChange(majorName,className){
    $.ajax({
        url: apiUrl + '/mobile/classes?page=1&limit=10&majorId=' + majorName.val(),
        type: 'GET',
        data: {
            token: cookie.get('token')
        },
        success: function (data) {
            //请求班级数据
            className.empty();
            var str = "";
            if( data.code === 0 && data.data.list.length > 0){
                for(var i = 0;i <data.data.list.length; i++){
                    str += '<option value='+data.data.list[i]['id'] + '>'+data.data.list[i]['className']+'</option>';
                }
                className.append(str);
            }
        },
        error:function(err){
            alert("请求出错!请稍后重试");
            console.log(err);
        }
    });
}

departName.on("change",function(){
    firstDropChange(departName,majorName,className);
});
majorName.on("change",function(){
    secondDropChange(majorName,className);
});
editDepartName.on("change",function(){
    firstDropChange(editDepartName,editMajorName,editClassName);
});
editMajorName.on("change",function(){
    secondDropChange(editMajorName,editClassName);
});





});