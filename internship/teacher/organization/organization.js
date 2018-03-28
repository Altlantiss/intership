/**
 * Created by chenlei on 2017/12/5.
 */

var organizationType;
var selectedDepartId;
var selectedMajorId;

$(function () {

    select_root_level(function () {

        var queryString = window.location.search.replace('?', '');

        if (!queryString) {

            return;

        }

        var keyValuePairs = queryString.split('&');

        var idArr = [];

        $.each(keyValuePairs, function (i, keyValueStr) {

            var keyValueArr = keyValueStr.split('=');

            idArr[i] = keyValueArr[1];

        });

        if (keyValuePairs.length === 1) {

            selectedDepartId = idArr[0];

            select_department(selectedDepartId);

        }
        else if (keyValuePairs.length === 2) {

            select_department(idArr[0], function () {

                selectedMajorId = idArr[1];

                select_major(selectedMajorId);

            });

        }


    });

});


//event

function open_add_dialog_fn(type) {

    organizationType = type;

    if (organizationType === 2 && !selectedDepartId) {

        alert('请先选择院系');

        return;

    }

    if (organizationType === 3 && !selectedMajorId) {

        alert('请先选择专业');

        return;

    }

    open_add_dialog(organizationType);

}

function close_add_dialog_fn() {

    close_add_dialog();

}

function add_fn() {

    var name = $('#name').val();

    add(organizationType, name);

}

function select_department_fn(e) {

    var id = parseInt(e.id.split("_")[1]);

    window.location = './organization.html?departId=' + id;

}

function select_major_fn(e) {

    var id = parseInt(e.id.split("_")[1]);

    var href = window.location.href;

    var indexOfMajorId = href.indexOf('&majorId');

    if (indexOfMajorId >= 0) {

        href = href.substring(0, indexOfMajorId);

    }

    href += '&majorId=' + id;

    window.location = href;

}

function del_depart_fn(e) {

    var id = parseInt(e.id.split("_")[1]);

    select_department(id, function () {

        if ($('#major-list').html()) {

            alert('该院系下有所属专业，不能删除该院系');

        }
        else {

            del(1, id);

        }

    });

}

function del_major_fn(e) {

    var id = parseInt(e.id.split("_")[1]);

    select_major(id, function () {

        if ($('#class-list').html()) {

            alert('该专业下有所属班级，不能删除该专业');

        }
        else {

            del(2, id);

        }

    });

}

function del_class_fn(e) {

    var id = parseInt(e.id.split("_")[1]);

    del(3, id);

}


//action

function open_add_dialog(type) {

    if (type === 3) {

        $('#join-date-container').show();
        $('#leave-date-container').show();

    }
    else {

        $('#join-date-container').hide();
        $('#leave-date-container').hide();

    }

    $('#add-dialog').show();

}

function close_add_dialog() {

    $('#add-dialog').hide();

}

function add(type, name) {

    var url = apiUrl;

    var data = {};

    if (type === 1) {

        url += 'mobile/department';

        data.departName = name;

    }
    else if (type === 2) {

        url += 'mobile/major';

        data.majorName = name;
        data.departId = selectedDepartId;

    }
    else if (type === 3) {

        url += 'mobile/classes';

        data.className = name;
        data.majorId = selectedMajorId;

        var joinDate = $('#joinDate').val();
        var leaveDate = $('#leaveDate').val();

        if (!checkDate(joinDate) || !checkDate(leaveDate)) {

            alert('时间不符合格式，请输入四位数年份（例如：20xx）');

            return;

        }
        else {

            data.joinDate = joinDate;
            data.leaveDate = leaveDate;

        }


        function checkDate(date) {

            try {
                date = parseInt(date);
            }
            catch (e) {
                return false;
            }

            return String(date).length === 4;

        }

    }

    $.ajax({
        type: "POST",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: url,
        data: data,
        success: function (data) {

            if (data.code === 0) {

                alert("新增成功!");

                window.location = window.location;

            }
            else {

                alert("新增失败!");

            }
        }
    });

}

function del(type, id) {

    var url = apiUrl;

    if (type === 1) {

        url += 'mobile/department';

    }
    else if (type === 2) {

        url += 'mobile/major';

    }
    else if (type === 3) {

        url += 'mobile/classes';

    }

    $.ajax({
        type: "DELETE",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: url + '?id=' + id,
        success: function (data) {

            if (data.code === 0) {

                alert("删除成功!");

                window.location = window.location;

            }
            else {

                alert("删除失败!");

            }
        }
    });

}

function select_root_level(fn) {

    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + 'mobile/department',
        data: {
            page: 1,
            limit: 100
        },
        success: function (data) {

            if (data.code === 0) {

                var departmentStr = '';
                $.each(data.data.list, function (i, item) {

                    departmentStr += '<tr>';
                    departmentStr += '<td class="department-row" id="depart_' + item.id + '" onclick="select_department_fn(this)">' + item.departName + '</td>';
                    departmentStr += '<td><a  id="depart_' + item.id + '" href="javascript:void(0)" onclick="del_depart_fn(this)">删除</a></td>';
                    departmentStr += '</tr>';

                });

                $('#department-list').empty().append(departmentStr);

                fn && fn();

            }
            else {

                alert('获取数据失败');

            }
        }
    });


}

function select_department(departmentId, fn) {

    $('.department-row').css({
        backgroundColor: 'white'
    });

    $('#depart_' + departmentId).css({
        backgroundColor: '#e4efc9'
    });

    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + 'mobile/major',
        data: {
            departId: departmentId,
            page: 1,
            limit: 100
        },
        success: function (data) {

            if (data.code === 0) {

                var majorStr = '';
                $.each(data.data.list, function (i, item) {

                    majorStr += '<tr>';
                    majorStr += '<td class="major-row" id="major_' + item.id + '" onclick="select_major_fn(this)">' + item.majorName + '</td>';
                    majorStr += '<td><a id="major_' + item.id + '" href="javascript:void(0)" onclick="del_major_fn(this)">删除</a></td>';
                    majorStr += '</tr>';

                });

                $('#major-list').empty().append(majorStr);

                $('#class-list').empty();

                fn && fn();

            }
            else {

                alert('获取数据失败');

            }
        }
    });


}

function select_major(majorId, fn) {

    $('.major-row').css({
        backgroundColor: 'white'
    });

    $('#major_' + majorId).css({
        backgroundColor: '#e4efc9'
    });

    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + 'mobile/classes',
        data: {
            majorId: majorId,
            page: 1,
            limit: 100
        },
        success: function (data) {

            if (data.code === 0) {

                var classStr = '';
                $.each(data.data.list, function (i, item) {

                    classStr += '<tr>';
                    classStr += '<td class="class-row" >' + item.className + '</td>';
                    classStr += '<td class="class-row" >' + (item.joinDate ? item.joinDate : '') + '</td>';
                    classStr += '<td class="class-row" >' + (item.leaveDate ? item.leaveDate : '') + '</td>';
                    classStr += '<td><a  id="class_' + item.id + '" href="javascript:void(0)" onclick="del_class_fn(this)">删除</a></td>';
                    classStr += '</tr>';

                });

                $('#class-list').empty().append(classStr);

                fn && fn();

            }
            else {

                alert('获取数据失败');

            }
        }
    });


}