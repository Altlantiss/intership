/**
 * Created by zzx on 2017/12/7.
 */







var datestar = "";
var dateend = "";
var classId = "";
var tit = "";
var num = '1';
var total = '0';

function deletepopup(id) {
    $('#deletepopup').show();
    de_id = id;
}
function closepopup() {
    $('#deletepopup').hide();
}

$(document).ready(function(){
    //搜索
    var btnSeacher = $("#btn-search");

    btnSeacher.on("click",function(){
        jQuery("#grid-table").jqGrid('setGridParam', {
            url : ''
        }).trigger('reloadGrid');
    });

    $("#class_id").change(function(){

        classId = $(this).val();
    });

    var joinDateList = $("#inSchool_year");
    var leaveDateLits = $("#outSchool_year");

    var startYear = 2000;
    var time = new Date();
    var endYear = time.getFullYear();
    var str = "  <option value=\"0\">请选择年份</option>";
    for( var i = startYear; i <= endYear; i++ ){
        str +=  '<option value="'+ i + '" >' + i + '</option>'
    }
    joinDateList.html(str);
    leaveDateLits.html(str);
});

initJqGrid({
    caption: '班级列表',
    colNames: ['专业',  '班级', '入学年份', '毕业年份', '学生人数', '实习中人数', '班主任', '操作'],
    colModel: [
        {name: 'majorName'},
        {name: 'className'},
        {name: 'joinDate'},
        {name: 'leaveDate'},
        {name: 'studentNum'},
        {name: 'practiceNum'},
        {name: 'teacherName'},
        {name: 'myac'}
    ],
    key: 'id',
    urlCreater: 'mobile/classes?',
    beforeRequest: function () {
        var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
        var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
        var joinDate = $("#inSchool_year").val();
        var leaveDate = $("#outSchool_year").val();
        var newUrl = apiUrl + "/mobile/classes?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
        if(classId !== ""){
            newUrl +=  "&id="+classId;
        }
        if( joinDate != 0){
            newUrl +=  "&joinDate="+joinDate;
        }
        if(leaveDate != 0){
            newUrl +=  "&leaveDate="+leaveDate;
        }
        jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
    },
    loadComplete: function (ids, data) {

        for (var i = 0; i < ids.length; i++) {
            var cl = ids[i];
            var be = '<button id="class_assign_' + cl + '" class="btn btn-info btn-xs" onclick="class_assign_fn(this);" style="float:left;"><i class="icon-pencil align-top bigger-125"></i>分配班主任</button>';
            jQuery("#grid-table").jqGrid('setRowData', ids[i],
                {
                    myac: be
                });
        }

    }
});



function class_assign_fn(e) {
    var grid_teacher = "#grid-teacher-111";
    var pager_teacher = "#pager-teacher-111";

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
            var currentpage = jQuery("#grid-teacher-111").jqGrid('getGridParam', 'page');
            var rowNum = jQuery("#grid-teacher-111").jqGrid('getGridParam', 'rowNum');
            var newUrl = apiUrl + "mobile/teacher?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token")
            jQuery("#grid-teacher-111").jqGrid('setGridParam', {url: newUrl});
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
     * 获取选择的班级ID
     */
    var choose_class_id = e.id.split("_")[2];
    jQuery("#choose_class_id").html(choose_class_id);
    jQuery('#class_assign_dialog').css('display', 'block');
}

function close_dialog() {
    jQuery('#class_assign_dialog').css('display', 'none');
}


jQuery(document).ready(function () {
    /**
     * DOM结构加载完成,第一步，加载列表
     */
    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/classes/simple",//路径
        success: function (data) {//返回数据根据结果进行相应的处理
            for (var i = 0; i < data.data.length; i++) {
                $("#class_id").append("<option value='" + data.data[i].id + "'>" + data.data[i].className + "</option>");
            }
            // classId = $("#class_id").val();
        }
    });
});


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

//var selr = jQuery(grid_selector).jqGrid('getGridParam','selrow');

function update_classTeacher() {
    var tacher_id = parseInt(jQuery("#choose_teacher_id").html());
    var choose_class = parseInt(jQuery("#choose_class_id").html());

    $.ajax({
        type: "PUT",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/classes?id=" + choose_class + "&teacherId=" + tacher_id,//路径
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {
                alert("分配班主任成功!");
                close_dialog();
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            } else {
                alert("分配班主任失败!");
            }
        }
    });
}



