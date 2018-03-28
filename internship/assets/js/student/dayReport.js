/**
 * Created by zzx on 2017/12/7.
 */
var choose_class_id = "";   // 选择的班级ID
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



    jQuery("#btn-search").click(function(){
        jQuery("#grid-table").jqGrid().trigger("reloadGrid");
    });
});

jQuery(document).ready(function(){
	
	var grid_selector = "#grid-table";
	var pager_selector = "#grid-pager";

	jQuery(grid_selector).jqGrid({
		url:"",
		mtype: "GET", 
	    datatype: "json",
		height: 372,
		colNames:['日报ID','发送日期','姓名','学习内容','学习收获', '问题反馈','状态','操作'],
		colModel:[
			{name:'id',index:'id', width:150,editable:false,hidden: true},
			{name:'createTime',index:'createTime', width:150,editable:false},
			{name:'studentName',index:'studentName',width:100, editable:false},
			{name:'studyContent',index:'studyContent', width:250},
			{name:'studyHarvest',index:'studyHarvest', width:250},
			{name:'questionFeedback',index:'questionFeedback', width:150},
			{name:'state',index:'state', width:90},
			{name:'myac',index:'myac', width:90}
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
            var createTime = $('input[name="sendtime"]').val();
            var state = $("#check_status").val();
			var newUrl = apiUrl+"mobile/dailyPaper?page="+currentpage+"&limit="+rowNum+"&type=0&token="+cookie.get("token")
            if(createTime !== ""){
                newUrl +=  "&createTime="+createTime;
            }
            if( state != -1 ){
                newUrl +=  "&state="+state;
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
			var ids = jQuery("#grid-table").jqGrid('getDataIDs');
			var columnData;
			var be;
			var ce;
            for ( var i = 0; i < ids.length; i++) {
                columnData = $("#grid-table").jqGrid('getRowData', ids[i]);
                if(columnData.state == 0){
                	be = '未审批';
                	ce = '';
                }else if(columnData.state == 1){
                	be = '已审批';
                	ce = '';
                }else{
                	be = '打回';
                	ce = '<button id="update_report_' + ids[i] + '" class="btn btn-info btn-xs" onclick="update_dayReport_fn(this);" style="float:left;"><i class="icon-pencil align-top bigger-125"></i>修改日报</button>';
                }
                jQuery("#grid-table").jqGrid('setRowData', ids[i],
                    {
                      state : be,
                      myac : ce
                    });
            }
		},
		caption: "日报列表",
		autowidth: true
	});
	
});



// 点击发送通知
function new_report_dialog_fn(e) {
	jQuery("#study_content_s").val("");
	jQuery("#study_harvest_s").val("");
	jQuery("#question_s").val("");
	jQuery("#report_id").val("");
	jQuery('#new_report_dialog').css('display','block');
};

function close_dialog(){
	jQuery('#new_report_dialog').css('display','none');
}

function new_dayReport(){
	var startDate = new Date().Format("yyyy-MM-dd");
	var endDate = new Date().Format("yyyy-MM-dd");
	var studyContent = jQuery("#study_content_s").val();
	var studyHarvest = jQuery("#study_harvest_s").val();
	var questionFeedback = jQuery("#question_s").val();
	var report_id = jQuery("#report_id").val();
	if(report_id == ""){
		$.ajax({ 
	        type : "POST",  //提交方式  
	        beforeSend: function(request) {
		        request.setRequestHeader("token",  cookie.get("token")) //cookie.get("token"));
		     },
		    data : {
		    	'startDate': startDate,
		    	'endDate': endDate,
		    	'studyContent': studyContent,
		    	'studyHarvest': studyHarvest,
		    	'questionFeedback': questionFeedback,
		    	'type': 0
		    },
	        url : apiUrl+"/mobile/dailyPaper",//路径
	        success : function(data) {//返回数据根据结果进行相应的处理  
	        	if(data.code === 0){
	        		alert("新建日报成功！");
	        		close_dialog();
	        		jQuery("#grid-table").jqGrid().trigger("reloadGrid");
	        	}
	        	if( data.code === -1 ){
                    alert("内容字数过多，请适当缩减内容！");
				}
	        }  
	    }); 
	}else{
		$.ajax({ 
	        type : "PUT",  //提交方式  
	        beforeSend: function(request) {
		        request.setRequestHeader("token", cookie.get("token")) //cookie.get("token"));
		     },
		    data : {
		    	'id': report_id,
		    	'startDate': startDate,
		    	'endDate': endDate,
		    	'studyContent': studyContent,
		    	'studyHarvest': studyHarvest,
		    	'questionFeedback': questionFeedback,
		    	'type': 0
		    },
	        url : apiUrl+"/mobile/dailyPaper",//路径
	        success : function(data) {//返回数据根据结果进行相应的处理  
	        	if(data.code == 0){
	        		alert("修改日报成功！");
	        		close_dialog();
	        		jQuery("#grid-table").jqGrid().trigger("reloadGrid");
	        	}
	        }  
	    }); 
	}
	
}


function update_dayReport_fn(e){
	
	var rowId = e.id.split('_')[2];
	var columnData = $("#grid-table").jqGrid('getRowData', rowId);
	jQuery("#report_id").val(columnData.id);
	jQuery("#study_content_s").val(columnData.studyContent);
	jQuery("#study_harvest_s").val(columnData.studyHarvest);
	jQuery("#question_s").val(columnData.questionFeedback);
	jQuery('#new_report_dialog').css('display','block');
}

function update_grid_css(){
	jQuery(".ui-jqgrid-view>.ui-jqgrid-titlebar").css("background-color","#39a7b3");
	jQuery(".ui-jqgrid .ui-jqgrid-htable th div").css("padding-top", "0px");
	jQuery(".ui-jqgrid .ui-jqgrid-pager").css("height","40px");
	jQuery(".ui-jqgrid .ui-pager-control").css("height","32px");
	jQuery('.ui-jqgrid-labels th[id*="_cb"]:first-child>div').css("padding-top","12px");
}

function aceSwitch( cellvalue, options, cell ) {
		setTimeout(function(){
			$(cell) .find('input[type=checkbox]')
					.wrap('<label class="inline" />')
				.addClass('ace ace-switch ace-switch-5')
				.after('<span class="lbl"></span>');
		}, 0);
	}
//enable datepicker
function pickDate( cellvalue, options, cell ) {
	setTimeout(function(){
		$(cell) .find('input[type=text]')
				.datepicker({format:'yyyy-mm-dd' , autoclose:true}); 
	}, 0);
}

function style_edit_form(form) {
	//enable datepicker on "sdate" field and switches for "stock" field
	form.find('input[name=sdate]').datepicker({format:'yyyy-mm-dd' , autoclose:true})
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
	if(form.data('styled')) return false;
	
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