/**
 * Created by wanghaijiang on 2017/12/23.
 */
//event

function detail_fn(e) {

    reportId = parseInt(e.id.split("_")[1]);

    var reportInfo = {};

    for (var i = 0; i < gridData.length; i++) {

        if (parseInt(gridData[i].id) === reportId) {

            reportInfo = gridData[i];

            break;

        }

    }

    var detailInfo = '';
    detailInfo += '<p>' + reportInfo.startDate + '</p>';
    detailInfo += '<p>' + reportInfo.studentName + '</p>';
    detailInfo += '<p>' + reportInfo.studyContent + '</p>';
    detailInfo += '<p>' + reportInfo.studyHarvest + '</p>';
    detailInfo += '<p>' + reportInfo.questionFeedback + '</p>';
    $('#detail-content').empty().append(detailInfo);

    $('#detail-dialog').find('textarea').val('');

    open_detail_dialog();

}

function approve_fn(e) {

    var id = parseInt(e.id.split("_")[1]);

    submit_approve(id, 1, '');

}

function noapprove_fn(e) {

    var id = parseInt(e.id.split("_")[1]);

    submit_approve(id, 2, '');

}

function detail_approve_fn() {

    var comment = $('#detail-dialog').find('textarea').val();

    submit_approve(reportId, 1, comment);

}

function detail_noapprove_fn() {

    var comment = $('#detail-dialog').find('textarea').val();

    submit_approve(reportId, 2, comment);

}


//action

function open_detail_dialog() {

    $('#detail-dialog').show();

}

function close_detail_dialog() {

    $('#detail-dialog').hide();

}

function submit_approve(id, state, comment) {

    $.ajax({
        url: apiUrl + 'mobile/dailyPaper/approval',
        type: 'PUT',
        data: {
            id: id,
            state: state,
            comment: comment,
            token: cookie.get('token')
        },
        success: function (data) {
            alert("操作成功");
            jQuery("#grid-table").jqGrid('setGridParam', {
                url : ''
            }).trigger('reloadGrid');

        }
    });


}