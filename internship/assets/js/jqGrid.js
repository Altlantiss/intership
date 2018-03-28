/**
 * Created by wanghaijiang on 2017/12/22.
 */

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

function enableTooltips(table) {
    $('.navtable .ui-pg-button').tooltip({container: 'body'});
    $(table).find('.ui-pg-div').tooltip({container: 'body'});
}

function reloadJqGrid() {

    jQuery("#grid-table").jqGrid().trigger("reloadGrid");

}

//{
//  caption,
//  colNames,
//  colModel,
//  key,
//  urlCreater,
//  loadComplete?
//}
function initJqGrid(option) {

    var caption = option.caption;
    var colNames = option.colNames;
    var colModel = option.colModel;
    var key = option.key;
    var urlCreater = option.urlCreater;
    var loadComplete = option.loadComplete;
    var beforeRequest = option.beforeRequest;

    if (colNames.length !== colModel.length) {

        alert('jqGrid表头和数据列数不同');

        return;

    }

    var colNamesRebuilded = [key.toUpperCase()].concat(colNames);

    var colModelRebuilded = [{
        name: key,
        index: key,
        sortable: false,
        editable: false,
        hidden: true
    }];
    var colModelItem;
    var colModelRebuildedItem;
    for (var i = 0; i < colModel.length; i++) {

        colModelItem = colModel[i];
        if( colModelItem.width ){
            colModelRebuildedItem = {
                name: colModelItem.name,
                index: colModelItem.name,
                sortable: false,
                editable: false,
                width:colModelItem.width
            };
        }else{
            colModelRebuildedItem = {
                name: colModelItem.name,
                index: colModelItem.name,
                sortable: false,
                editable: false
            };
        }


        if (colModelItem.formatter) {

            colModelRebuildedItem.formatter = colModelItem.formatter;

        }

        colModelRebuilded.push(colModelRebuildedItem);

    }


    jQuery(function ($) {
        var grid_selector = "#grid-table";
        var pager_selector = "#grid-pager";

        jQuery(grid_selector).jqGrid({
            url: "",
            mtype: "GET",
            datatype: "json",
            height: 500,
            colNames: colNamesRebuilded,
            colModel: colModelRebuilded,
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
                beforeRequest  && beforeRequest();
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
                var data = jQuery("#grid-table").jqGrid('getRowData');
                loadComplete && loadComplete(ids, data);
                // for (var i = 0; i < ids.length; i++) {
                //     var cl = ids[i];
                //     var ce = '<button id="delete_' + cl + '" class="btn btn-xs" style="float:left;margin-left:5px;" onclick="delete_fn(this)"><i class="icon-trash align-top bigger-125"></i>删除</button>';
                //     jQuery("#grid-table").jqGrid(
                //         'setRowData',
                //         ids[i],
                //         {
                //             myac: ce
                //         }
                //     );
                // }
            },
            caption: caption,
            autowidth: true
        });

    });

}