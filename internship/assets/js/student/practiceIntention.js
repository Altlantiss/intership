/**
 * Created by chenlei on 2017/12/6.
 */
var datestar = "";
var dateend = "";
var tit = "";
var num = '1';
var total = '0';
var acturalPage = acturalPage || 1;
var page_size = page_size || 15;

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
});

jQuery(document).ready(function(){
    jQuery("#notic_title_search").val("");
	var grid_selector = "#grid-table";
	var pager_selector = "#grid-pager";

	jQuery(grid_selector).jqGrid({
		url:"",
		mtype: "GET", 
	    datatype: "json",
		height: 372,
		colNames:['意向ID','发送时间','姓名','学号','实习单位','职位','实习地址'],
		colModel:[
			{name:'id',index:'id', width:150,editable:false,hidden: true},
            {name:'createTime',index:'createTime', width:150},
			{name:'studentName',index:'studentName', width:100,editable:false},
			{name:'studentId',index:'studentId',width:70, editable:false},
			{name:'enterprise',index:'enterprise', width:150},
			{name:'job',index:'job', width:70},
			{name:'address',index:'address', width:250}

		], 
		viewrecords : true,
		rowNum: 10,
		rowList:[10,20,30],
		pager : pager_selector,
		altRows: true,
		multiselect: true,
        multiboxonly: true,
        autoScroll: true,
        jsonReader: {  
			root:"data.list", page:"data.pageNum", total:"data.pages",          //   很重要 定义了 后台分页参数的名字。
			records:"data.total"
		},
		beforeRequest:function(){
			var currentpage = jQuery("#grid-table").jqGrid('getGridParam','page');
			var rowNum = jQuery("#grid-table").jqGrid('getGridParam','rowNum');
			var notice_title = jQuery("#notic_title_search").val();
            var createTime = $('input[name="sendtime"]').val();
			var newUrl = apiUrl+"mobile/practiceIntention?page="+currentpage+"&limit="+rowNum+"&type=0&token="+cookie.get("token");
            if(notice_title != ""){
                newUrl =newUrl + "&param="+ notice_title;
            }
            if(createTime !== ""){
                newUrl +=  "&createTime="+createTime;
            }
			jQuery("#grid-table").jqGrid('setGridParam',{url:newUrl});
		},
		loadComplete : function() {
			var table = this;
			setTimeout(function(){
				styleCheckbox(table);
				updateActionIcons(table);
				updatePagerIcons(table);
				enableTooltips(table);
			}, 0);
			update_grid_css();
		},
		caption: "实习意向列表",
		autowidth: true
	});
	
	jQuery("#btn-search").click(function(){
		jQuery("#grid-table").jqGrid().trigger("reloadGrid");
	});
	
});


function update_grid_css(){
	jQuery(".ui-jqgrid-view>.ui-jqgrid-titlebar").css("background-color","#39a7b3");
	jQuery(".ui-jqgrid .ui-jqgrid-htable th div").css("padding-top", "0px");
	jQuery(".ui-jqgrid .ui-jqgrid-pager").css("height","40px");
	jQuery(".ui-jqgrid .ui-pager-control").css("height","32px");
	jQuery('.ui-jqgrid-labels th[id*="_cb"]:first-child>div').css("padding-top","12px");
}




$('#makeSureSend').click(function () {

    var enter = $('#form-field-1').val();
    var job = $('#form-field-2').val();
    var address = $('#form-field-3').val();

    if(enter == '' || job === '' || address === '') {
        my_alert('提示','输入内容不能为空');
        return false;
    }

    $.ajax({
        url: apiUrl + '/mobile/practiceIntention',
        type: 'POST',
        data: {
            enterprise: enter,
            address: address,
            job: job
        },
        beforeSend: function(request) {
            request.setRequestHeader("token", cookie.get('token'));
        },
        success: function (data) {

            if(data.code === 0) {
                my_alert('提示','新建成功');
                jQuery("#form-field-1").val("");
				jQuery("#form-field-2").val("");
				jQuery("#form-field-3").val("");
				jQuery('#sendNotice').css('display','none');
                jQuery("#grid-table").jqGrid().trigger("reloadGrid");
            }else{
            	my_alert('提示','新建失败');
            }
        }
    })

});

// 点击新疆弹框
$('#sendNoticeBtn').click(function () {

    $('#sendNotice').css('display','block');

});

$('#closeSendNotice').click(function () {

    $('#sendNotice').css('display','none');

});

$('#clearSend').click(function () {

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


function styleCheckbox(table) {
}

function updateActionIcons(table) {
}

function updatePagerIcons(table) {
	var replacement = 
	{
		'ui-icon-seek-first' : 'icon-double-angle-left bigger-140',
		'ui-icon-seek-prev' : 'icon-angle-left bigger-140',
		'ui-icon-seek-next' : 'icon-angle-right bigger-140',
		'ui-icon-seek-end' : 'icon-double-angle-right bigger-140'
	};
	$('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
		var icon = $(this);
		var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
		
		if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
	})
}
function enableTooltips(table) {
	$('.navtable .ui-pg-button').tooltip({container:'body'});
	$(table).find('.ui-pg-div').tooltip({container:'body'});
}
