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
    caption: '群组列表',
    colNames: ['名称', '学生人数', '指导老师', '操作'],
    colModel: [
        {name: 'groupName', index: 'groupName', width: 100, sorttype: "int", editable: true},
        {
            name: 'num',
            index: 'num',
            width: 80,
            sortable: false,
            editable: true,
            edittype: "textarea",
            editoptions: {rows: "2", cols: "10"}
        },
        {
            name: 'teacherName',
            index: 'teacherName',
            width: 0,
            sortable: false,
            editable: true,
            edittype: "textarea",
            editoptions: {rows: "2", cols: "10"}
        },
        {name: 'myac', index: '', width: 300, fixed: true, sortable: false, resize: false}
    ],
    key: 'id',
    urlCreater: 'mobile/practiceGroup?',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var groupName = jQuery("#student-keyword").val();
        var newUrl = apiUrl + "/mobile/practiceGroup?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
        if(groupName !== ""){
            newUrl +=  "&groupName="+groupName;
        }
        jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
    },
    loadComplete: function (ids, data) {

        for (var i = 0; i < ids.length; i++) {
            var cl = ids[i];
            be = '<button id="class_assign_' + ids[i] + '" class="btn btn-info btn-xs" onclick="class_assign_fn(this);" style="float:left;"><i class="icon-pencil align-top bigger-125"></i>分配老师</button>';
            se = '<button id="class_studentqq_' + ids[i] + '" class="btn btn-xs btn-success" onclick="group_updateSt_dialog_fn(this);" style="float:left;margin-left:5px;"><i class="icon-trash align-top bigger-125"></i>编辑学生</button>';
            ce = '<button id="class_delete_' + ids[i] + '" class="btn btn-xs" style="float:left;margin-left:5px;" onclick="delete_group_fn(this)"><i class="icon-trash align-top bigger-125"></i>删除分组</button>';
            jQuery("#grid-table").jqGrid('setRowData', ids[i],
                {
                    myac: be + se + ce
                });
        }

    }
});



// 点击发送通知
function class_assign_fn(e) {

    var grid_teacher = "#grid-teacher-group";
    var pager_teacher = "#pager-teacher-group";

    jQuery(grid_teacher).jqGrid({
        url: "",
        mtype: "GET",
        datatype: "json",
        height: 185,
        colNames: ['班级ID', '老师姓名', '手机号', 'QQ'],
        colModel: [
            {name: 'id', index: 'id', width: 100, sorttype: "int", editable: true, hidden: true},
            {
                name: 'name',
                index: 'name',
                width: 0,
                sortable: false,
                editable: true,
                edittype: "textarea",
                editoptions: {rows: "2", cols: "10"}
            },
            {
                name: 'homeTel',
                index: 'homeTel',
                width: 0,
                sortable: false,
                editable: true,
                edittype: "textarea",
                editoptions: {rows: "2", cols: "10"}
            },
            {
                name: 'qq',
                index: 'qq',
                width: 0,
                sortable: false,
                editable: true,
                edittype: "textarea",
                editoptions: {rows: "2", cols: "10"}
            }
        ],
        viewrecords: true,
        rowNum: 5,
        rowList: [5, 10, 15],
        pager: pager_teacher,
        altRows: true,
        autoScroll: true,
        onSelectRow: function (rowid, status) {
            selId = rowid;　　//给最外层的selId赋值
            var rowData = $(grid_teacher).jqGrid('getRowData', rowid);
            jQuery("#choose_teacher").html(rowData.username);
            jQuery("#choose_teacher_id").html(rowData.id);
        },
        jsonReader: {
            root: "data.list", page: "data.pageNum", total: "data.pages",          //   很重要 定义了 后台分页参数的名字。
            records: "data.total"
        },
        beforeRequest: function () {
            var currentpage = jQuery("#grid-teacher-group").jqGrid('getGridParam', 'page');
            var rowNum = jQuery("#grid-teacher-group").jqGrid('getGridParam', 'rowNum');
            var newUrl = apiUrl + "mobile/teacher?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token")
            jQuery("#grid-teacher-group").jqGrid('setGridParam', {url: newUrl});
        },
        loadComplete: function () {
            var table = this;
            setTimeout(function () {
                styleCheckbox(table);

                updateActionIcons(table);
                updatePagerIcons(table);
                enableTooltips(table);

            }, 0);
            jQuery(".ui-jqgrid-view>.ui-jqgrid-titlebar").css("background-color", "#39a7b3");
            jQuery(".ui-jqgrid .ui-jqgrid-htable th div").css("padding-top", "0px");
            jQuery(".ui-jqgrid .ui-jqgrid-pager").css("height", "40px");
            jQuery(".ui-jqgrid .ui-pager-control").css("height", "32px");
            jQuery('.ui-jqgrid-labels th[id*="_cb"]:first-child>div').css("padding-top", "12px");
        },
        width: 650

    });
    /**
     * 获取选择的群组ID
     */
    var choose_group_id = e.id.split("_")[2];
    jQuery("#choose_group_id").html(choose_group_id);
    jQuery('#teacher_assign_dialog').css('display', 'block');
};

function close_dialog() {
    jQuery('#teacher_assign_dialog').css('display', 'none');
}

// 点击新增群组
function group_add_dialog_fn(e) {
    var grid_teacher = "#grid-studengt-group";
    var pager_teacher = "#pager-studengt-group";

    jQuery(grid_teacher).jqGrid({
        url: "",
        mtype: "GET",
        datatype: "json",
        height: 185,
        colNames: ['班级ID', '老师姓名', '手机号', 'QQ'],
        colModel: [
            {name: 'id', index: 'id', width: 100, sorttype: "int", editable: true, hidden: true},
            {
                name: 'name',
                index: 'name',
                width: 0,
                sortable: false,
                editable: true,
                edittype: "textarea",
                editoptions: {rows: "2", cols: "10"}
            },
            {
                name: 'homeTel',
                index: 'homeTel',
                width: 0,
                sortable: false,
                editable: true,
                edittype: "textarea",
                editoptions: {rows: "2", cols: "10"}
            },
            {
                name: 'qq',
                index: 'qq',
                width: 0,
                sortable: false,
                editable: true,
                edittype: "textarea",
                editoptions: {rows: "2", cols: "10"}
            }
        ],
        viewrecords: true,
        rowNum: 5,
        rowList: [5, 10, 15],
        pager: pager_teacher,
        altRows: true,
        onSelectRow: function (rowid, status) {
            selId = rowid;　　//给最外层的selId赋值
            var rowData = $(grid_teacher).jqGrid('getRowData', rowid);
            jQuery("#add_choose_teacher").html(rowData.username);
            jQuery("#add_teacher_id").val(rowData.id);
        },
        jsonReader: {
            root: "data.list", page: "data.pageNum", total: "data.pages",          //   很重要 定义了 后台分页参数的名字。
            records: "data.total"
        },
        beforeRequest: function () {
            var currentpage = jQuery("#grid-studengt-group").jqGrid('getGridParam', 'page');
            var rowNum = jQuery("#grid-studengt-group").jqGrid('getGridParam', 'rowNum');
            var newUrl = apiUrl + "mobile/teacher?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token")
            jQuery("#grid-studengt-group").jqGrid('setGridParam', {url: newUrl});
        },
        loadComplete: function () {
            var table = this;
            setTimeout(function () {
                styleCheckbox(table);

                updateActionIcons(table);
                updatePagerIcons(table);
                enableTooltips(table);

            }, 0);
            jQuery(".ui-jqgrid-view>.ui-jqgrid-titlebar").css("background-color", "#39a7b3");
            jQuery(".ui-jqgrid .ui-jqgrid-htable th div").css("padding-top", "0px");
            jQuery(".ui-jqgrid .ui-jqgrid-pager").css("height", "40px");
            jQuery(".ui-jqgrid .ui-pager-control").css("height", "32px");
            jQuery('.ui-jqgrid-labels th[id*="_cb"]:first-child>div').css("padding-top", "12px");
        },
        width: 650

    });
    jQuery('#group_add_dialog').css('display', 'block');
}

/**
 * 关闭新增窗口
 */
function close_add_dialog() {
    jQuery('#group_add_dialog').css('display', 'none');
}


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


function update_classTeacher() {
    var tacher_id = parseInt(jQuery("#choose_teacher_id").html());
    var choose_group = parseInt(jQuery("#choose_group_id").html());
    $.ajax({
        type: "PUT",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/practiceGroup?id=" + choose_group + "&teacherId=" + tacher_id,//路径
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("分配指导老师成功!");
                close_dialog();
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("分配指导老师失败!");
            }
        }
    });
}

/**
 * 新增群组
 */
function add_groupTeacher() {
    var add_group_name = jQuery("#groupName").val();
    var add_teacherId = parseInt(jQuery("#add_teacher_id").val());
    $.ajax({
        type: "POST",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/practiceGroup",//路径
        data: {
            "groupName": add_group_name,
            "teacherId": add_teacherId
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("新增群组成功!");
                close_add_dialog();
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("新增群组失败!");
            }
        }
    });
}

/**
 * 删除分组
 */
function delete_group_fn(e) {
    /**
     * 获取选择的班级ID
     */
    var choose_group_id = parseInt(e.id.split("_")[2]);
    $.ajax({
        type: "DELETE",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/practiceGroup?id=" + choose_group_id,//路径
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("删除群组成功!");
                close_add_dialog();
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("删除群组失败!");
            }
        }
    });
}

function group_updateSt_dialog_fn(e) {

    var grid_upStudent_group = "#grid-upStudent-group";
    var pager_upStudent_group = "#pager-upStudent-group";

    jQuery(grid_upStudent_group).jqGrid({
        url: "",
        mtype: "GET",
        datatype: "json",
        height: 265,
        colNames: ['学生ID', '学生姓名'],
        colModel: [
            {name: 'id', index: 'id', width: 100, sorttype: "int", editable: true, hidden: true},
            {
                name: 'name',
                index: 'name',
                width: 0,
                sortable: false,
                editable: true,
                edittype: "textarea",
                editoptions: {rows: "2", cols: "10"}
            }
        ],
        rowNum:'all',
        altRows: true,
        multiselect: true,
        multiboxonly: true,
        onSelectRow: function (rowid, status) {
            selId = rowid;　　//给最外层的selId赋值
            var rowData = $(grid_upStudent_group).jqGrid('getRowData', rowid);
            jQuery("#add_choose_teacher").html(rowData.username);
            jQuery("#add_teacher_id").val(rowData.id);
        },
        jsonReader: {
            root: "data.list"
        },
        beforeRequest: function () {
            var currentpage = jQuery("#grid-upStudent-group").jqGrid('getGridParam', 'page');
            var rowNum = jQuery("#grid-upStudent-group").jqGrid('getGridParam', 'rowNum');
            var timestamp = new Date().getTime();
            var classId = $("#class_id").val();

            var newUrl = apiUrl + "mobile/student?page=" + currentpage + "&limit=1000&token=" + cookie.get("token");
            if( classId != null ){
                newUrl +=  "&myClass="+classId;
            }
            jQuery("#grid-upStudent-group").jqGrid('setGridParam', {url: newUrl});
        },
        loadComplete: function (data) {
            console.log(data)
            var table = this;
            setTimeout(function () {
                styleCheckbox(table);

                updateActionIcons(table);
                updatePagerIcons(table);
                enableTooltips(table);

            }, 0);
            jQuery(".ui-jqgrid-view>.ui-jqgrid-titlebar").css("background-color", "#39a7b3");
            jQuery(".ui-jqgrid .ui-jqgrid-htable th div").css("padding-top", "0px");
            jQuery(".ui-jqgrid .ui-jqgrid-pager").css("height", "40px");
            jQuery(".ui-jqgrid .ui-pager-control").css("height", "32px");
            jQuery('.ui-jqgrid-labels th[id*="_cb"]:first-child>div').css("padding-top", "12px");
            $("#grid-upStudent-group").closest(".ui-jqgrid-bdiv").css({ 'overflow-y' : 'scroll' });  
        },
        caption: "未加入群组学生",
        width: 300
    });

    /**
     * 获取选择的群组ID
     */
    choose_group_id_st = e.id.split("_")[2];
    jQuery("#choose_groupSt_id").val(choose_group_id_st);
    jQuery('#group_updateSt_dialog').css('display', 'block');

    var grid_teacher = "#grid-upStudent-check-group";
    var pager_teacher = "#pager-upStudent-check-group";


    jQuery(grid_teacher).jqGrid({
        url: "",
        mtype: "GET",
        datatype: "json",
        height: 265,
        colNames: ['学生ID', '学生姓名'],
        colModel: [
            {name: 'studentId', index: 'studentId', width: 100, sorttype: "int", editable: true, hidden: true},
            {
                name: 'studentName',
                index: 'studentName',
                width: 0,
                sortable: false,
                editable: true,
                edittype: "textarea",
                editoptions: {rows: "2", cols: "10"}
            }
        ],
        altRows: true,
        multiselect: true,
        multiboxonly: true,
        onSelectRow: function (rowid, status) {
            selId = rowid;　　//给最外层的selId赋值
            var rowData = $(grid_teacher).jqGrid('getRowData', rowid);
            jQuery("#add_choose_teacher").html(rowData.username);
            jQuery("#add_teacher_id").val(rowData.id);
        },
        jsonReader: {
            root: "data.list"
        },
        beforeRequest: function () {
            var currentpage = jQuery("#grid-upStudent-check-group").jqGrid('getGridParam', 'page');
            var rowNum = jQuery("#grid-upStudent-check-group").jqGrid('getGridParam', 'rowNum');
            var newUrl = apiUrl + "mobile/practiceGroupUser?groupId=" + choose_group_id_st + "&page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token")
            jQuery("#grid-upStudent-check-group").jqGrid('setGridParam', {url: newUrl});
            $("#grid-upStudent-check-group").closest(".ui-jqgrid-bdiv").css({ 'overflow-y' : 'scroll' }); 
        },
        loadComplete: function () {
            var table = this;
            setTimeout(function () {
                styleCheckbox(table);

                updateActionIcons(table);
                updatePagerIcons(table);
                enableTooltips(table);

            }, 0);
            jQuery(".ui-jqgrid-view>.ui-jqgrid-titlebar").css("background-color", "#39a7b3");
            jQuery(".ui-jqgrid .ui-jqgrid-htable th div").css("padding-top", "0px");
            jQuery(".ui-jqgrid .ui-jqgrid-pager").css("height", "40px");
            jQuery(".ui-jqgrid .ui-pager-control").css("height", "32px");
            jQuery('.ui-jqgrid-labels th[id*="_cb"]:first-child>div').css("padding-top", "12px");
        },
        caption: "已加入群组学生",
        width: 300
    });

    jQuery("#grid-upStudent-group").jqGrid().trigger("reloadGrid");
    jQuery("#grid-upStudent-check-group").jqGrid().trigger("reloadGrid");


    /**
     * 获取全部班级
     */

    var classes = $("#class_id");
    $.ajax({
        url: apiUrl + '/mobile/classes/simple',
        type: 'GET',
        data: {
            token: cookie.get('token')
        },
        success: function (data) {
            classes.empty();
            for(var i = 0; i< data.data.length; i++){
                classes.append("<option value="+data.data[i]["id"]+">"+data.data[i]["className"] +"</option>")
            }

        },
        error:function(err){
          alert("请求出错!请稍后重试");
          console.log(err);
        }
    })

}

function search_student() {

    var class_check = jQuery("#class_id").val();
    var rowNum = jQuery("#grid-upStudent-check-group").jqGrid('getGridParam', 'rowNum');
    jQuery("#grid-upStudent-group").jqGrid('setGridParam', {
        // url: apiUrl + "student/findMyClassesStudents?classId=" + class_check + "&page=1&limit=" + rowNum + "&token=" + cookie.get("token")

        url: ''
    }).trigger("reloadGrid");


}

/**
 * 关闭新增窗口
 */
function close_updateSt_dialog() {
    jQuery('#group_updateSt_dialog').css('display', 'none');
}

/**
 * 添加学生至已选择学生列表
 */
function add_student_toGrid() {
    var idsArr = $("#grid-upStudent-group").jqGrid("getGridParam", "selarrrow");
    var ids = [];
    for( var k = 0; k< idsArr.length; k++ ){
        ids[k] = idsArr[k];
    }
    const idsLength = ids.length;
    var dataCheck = $("#grid-upStudent-check-group").jqGrid("getRowData" ); //取得已进去群组的成员信息
    var dataRow;
    if (ids.length > 0) {
        for (var j = 0; j < idsLength; j++) {
            //使用addRowData方法把dataRow添加到表格中
            dataRow = $("#grid-upStudent-group").jqGrid("getRowData", ids[j]); //取得了选中的学生信息

            dataRow.studentName = dataRow.name;
            delete dataRow.name;
            if (!dataRow.studentId) {
                dataRow.studentId = dataRow.id;
            }

            var checked = false;    //是否已经加入群组标志

            for( var i=0;i<dataCheck.length;i++){    //遍历查看选中学生ID是否已经加入群组
                if( dataCheck[i].studentId  === dataRow.studentId ){
                    checked = true;

                }
            }

            if( checked === false ){
                $("#grid-upStudent-group").jqGrid("delRowData", ids[j]);
                $("#grid-upStudent-check-group").jqGrid("addRowData", j+1 , dataRow, "first");
            }else{
                alert("该学生已经加入群组，请重新添加");
            }
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
    const idsLength = ids.length;
    var dataCheck = $("#grid-upStudent-group").jqGrid("getRowData" ); //取得未加入群组的成员信息

    var dataRow;
    if (ids.length > 0) {
        for (var j = 0; j < idsLength; j++) {
            //使用addRowData方法把dataRow添加到表格中
            dataRow = $("#grid-upStudent-check-group").jqGrid("getRowData", ids[0]);
            dataRow.name = dataRow.studentName;
            delete dataRow.studentName;
            if (!dataRow.studentId) {
                dataRow.studentId = dataRow.id;
            }

            var checked = false;    //是否已经加入群组标志

            for( var i=0;i<dataCheck.length;i++){    //遍历查看选中学生NAME是否已经加入群组
                if( dataCheck[i].name  === dataRow.name ){
                    // checked = true;
                }
            }
            if( checked === false ){
                $("#grid-upStudent-check-group").jqGrid("delRowData", ids[0]);
                // $("#grid-upStudent-group").jqGrid("addRowData", ids.length, dataRow, "first");
            }else{
                alert("该学生已经加入群组，请重新添加");
            }
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
            student_ids += ids[i].studentId || ids[i].id;
        } else {
            student_ids += "," + ids[i].studentId || ids[i].id;
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
                close_updateSt_dialog();
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
    var studentKeyword = $("#student-keyword").val();
    btnSeacher.on("click",function(){

        $.ajax({
            url: apiUrl + '/mobile/practiceGroup?page=1&limit=10&groupName='+studentKeyword,
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