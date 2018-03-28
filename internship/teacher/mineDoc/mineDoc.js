/**
 * Created by chenlei on 2017/12/2.
 */



var datestar = "";
var dateend = "";

$(function () {

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

    // 点击上传文件
    $('#uploadFile').on('change', function () {
            alert(1)
            // var fileObj = document.getElementById("uploadFile").files[0]; // 获取文件对象
            // var FileController = apiUrl + "file/save";                    // 接收上传文件的后台地址
            // // FormData 对象
            // var form = new FormData();
            // form.append("author", "hooyes");                        // 可以增加表单数据
            // form.append("file", fileObj);                           // 文件对象
            // // XMLHttpRequest 对象
            // var xhr = new XMLHttpRequest();
            // xhr.open("post", FileController, true);
            // xhr.onload = function () {
            //     alert("上传完成!");
            // };
            // xhr.send(form);
        }
    );


});

jQuery(function ($) {
    var grid_selector = "#grid-table";
    var pager_selector = "#grid-pager";

    jQuery(grid_selector).jqGrid({
        url: "",
        mtype: "GET",
        datatype: "json",
        height: 372,
        colNames: ['通知ID', '文件名称', '上传人', '文件描述', '上传时间', '操作'],
        colModel: [
            {name: 'id', index: 'id', width: 100, sorttype: "int", editable: true, hidden: true},
            {
                name: 'fileName',
                index: 'fileName',
                sortable: false,
                editable: false
            },
            {
                name: 'teacherName',
                index: 'teacherName',
                sortable: false,
                editable: false
            },
            {
                name: 'practiceDesc',
                index: 'practiceDesc',
                sortable: false,
                editable: false
            },
            {
                name: 'createTime',
                index: 'createTime',
                sortable: false,
                editable: false
            },
            {
                name: 'myac',
                index: '',
                fixed: true,
                sortable: false,
                resize: false
            }
        ],
        viewrecords: true,
        rowNum: 10,
        rowList: [10, 20, 30],
        pager: pager_selector,
        altRows: true,
        multiselect: true,
        multiboxonly: true,
        autoScroll: true,
        jsonReader: {
            root: "data.list", page: "data.pageNum", total: "data.pages",          //   很重要 定义了 后台分页参数的名字。
            records: "data.total"
        },
        beforeRequest: function () {
            var currentpage = jQuery("#grid-table").jqGrid('getGridParam', 'page');
            var rowNum = jQuery("#grid-table").jqGrid('getGridParam', 'rowNum');
            var fileName = jQuery("#student-keyword").val();
            var createTime = $('input[name="sendtime"]').val();
            var newUrl = apiUrl + "mobile/practiceFile/my?page=" + currentpage + "&limit=" + rowNum + "&token=" + cookie.get("token");
            if(fileName !== "" ){
                newUrl +=  "&fileName="+fileName;
            }
            if(createTime !== ""){
                newUrl +=  "&createTime="+createTime;
            }
            jQuery("#grid-table").jqGrid('setGridParam', {url: newUrl});
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

            var ids = jQuery("#grid-table").jqGrid('getDataIDs');
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
        },
        caption: "我的文件列表",
        autowidth: true
    });

});


function delete_fn(e) {

    var id = parseInt(e.id.split("_")[1]);

    $.ajax({
        type: 'DELETE',
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get('token'));
        },
        url: apiUrl + 'mobile/practiceFile?id=' + id,
        success: function (data) {
            if (data['code'] === 0) {
                my_alert('提示', '删除成功', null, reloadJqGrid);
            } else {
                my_alert('提示(' + data['code'] + ')', data['msg']);
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
            url: apiUrl + 'mobile/practiceFile/my?page=1&limit=10&fileName='+studentKeyword,
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

    var fileName;
    var uploadFile = $("#upload-file");
    uploadFile.val("");
    uploadFile.on("change",function(){

        $("#upload-submit").click(function(){
            var options = {
                success: function (data) {
                    alert(data.msg);

                    $.ajax({
                        url: apiUrl + 'mobile/practiceFile?',
                        type: 'POST',
                        data: {
                            token: cookie.get('token'),
                            fileName:fileName,
                            practiceDesc:fileName,
                            fileUrl:apiUrl + data.data.substr(1)
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
        fileName = file.split('\\')[2];
        if (file === "") {
            alert("请选择要上传的文件");
            return false
        } else {
            //检验文件类型是否正确
            // var exec = (/[.]/.exec(file)) ? /[^.]+$/.exec(file.toLowerCase()) : '';
            // if (exec != "xlsx") {
            //     alert("文件格式不对，请上传Excel文件!");
            //     return false;
            // }
        }
        return true;
    }

});





