var apiUrl = 'http://101.37.27.185:9898/';

//导出列表方法
function getExcel(url, json) {
    var token = cookie.get("token");
    var str = '';
    for (var i in json) {
        str += '&' + i + '=' + json[i];
    }
    var location = window.location.href;
    if (location.indexOf("DataCenter") != -1) {
        request = JSON.parse(getLocalStorage('user_info')).domain.sjzx_api + url + "?token=" + token + str;
    } else {
        request = JSON.parse(getLocalStorage('user_info')).domain.sx_api + "/" + url + "?token=" + token + str;
    }
    return request;
}

//控制台方法封装
// console.log = function (string) {
//     var host = window.location.hostname;
//     if (host == "sx.xixunyun.com") {
//         return false;
//     } else {
//         console.info(string);
//     }
// }

/*
 *author:xiecanyong
 *description:analysics string to html
 */
function escapeChars(str) {
    str = str.replace(/&amp;/g, '&');
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    str = str.replace(/&acute;/g, "'");
    str = str.replace(/&quot;/g, '"');
    str = str.replace(/&brvbar;/g, '\|');
    return str;
}

/**
 * 获取验证码后倒计时功能实现
 * @param {[string]} btn_id              [按钮的选择器，例如id=one，即为#one]
 * @param {[int]} TIME                [倒计时时间，以秒为单位]
 * @param {[string]} OVER_TIME_SHOW_TEXT [定时器超时后显示的文本]
 */
function setValidateTime(btn_id, TIME, OVER_TIME_SHOW_TEXT) {
    if (TIME != undefined) {
        window["TIME"] = TIME;
        window["ORIGIN_TIME"] = TIME;
    }
    if (btn_id != undefined) {
        window["countdown_btn"] = btn_id;
    }
    if (OVER_TIME_SHOW_TEXT != undefined) {
        window["OVER_TIME_SHOW_TEXT"] = OVER_TIME_SHOW_TEXT;
    }
    $(window["countdown_btn"]).attr("disabled", "disabled");
    $(window["countdown_btn"]).css("cursor", "default");
    $(window["countdown_btn"]).text(window["TIME"] + "秒");
    if (window["TIME"] == 0) {
        setInterval("", 500);
        $(window["countdown_btn"]).text(window["OVER_TIME_SHOW_TEXT"]);
        $(window["countdown_btn"]).removeAttr("disabled");
        $(window["countdown_btn"]).css('cursor', 'pointer');
        window["TIME"] = window["ORIGIN_TIME"];
        //TIME=60;
        return true;
    } else {
        window["TIME"]--;
        setTimeout("setValidateTime()", 1000);
    }
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}


//获取城市列表
function provinceChange(show_province_id, show_city_id, show_area_id) {
    var show_province = "#" + show_province_id;
    var show_city = "#" + show_city_id;
    var show_area = "#" + show_area_id;
    var selectProvinceId = $(show_province).find("option:selected").prop('id');
    // alert(typeof selectProvinceId);
    if (selectProvinceId == 0 || selectProvinceId == "0") {
        $(show_city).attr("disabled", "disabled");
        $(show_area).attr("disabled", "disabled");
        return false;
    } else {
        $(show_city).removeAttr("disabled", "disabled");
        $(show_area).removeAttr("disabled", "disabled");
    }
    $(show_city).empty();
    $(show_area).empty();
    var areaMsg = getArea();
    for (var i in areaMsg) {
        if (parseInt(areaMsg[i].level) == 2 && areaMsg[i].parent_id == selectProvinceId) {
            var city = '<option id="' + areaMsg[i].id + '">' + areaMsg[i].name + '</option>';
            $(show_city).append(city);
        }
    }
    var selectCityId = $(show_city).find("option:selected").prop('id');
    for (var i in areaMsg) {
        if (parseInt(areaMsg[i].level) == 3 && areaMsg[i].parent_id == selectCityId) {
            var area = '<option id="' + areaMsg[i].id + '">' + areaMsg[i].name + '</option>';
            $(show_area).append(area);
        }
    }

}

function area(bind_province_id, bind_city_id, bind_area_id) {
    var areaMsg = getArea();
    var show_province = "#" + bind_province_id;
    var show_city = "#" + bind_city_id;
    var show_area = "#" + bind_area_id;
    // if(state==0){
    for (var i in areaMsg) {
        if (parseInt(areaMsg[i].level) == 1) {
            var province = '<option id="' + areaMsg[i].id + '">' + areaMsg[i].name + '</option>';
            $(show_province).append(province);
        }
    }
    var provinceId = $(show_province).find("option:selected").attr("id");
    for (var i in areaMsg) {
        if (parseInt(areaMsg[i].level) == 2 && areaMsg[i].parent_id == provinceId) {
            var city = '<option id="' + areaMsg[i].id + '">' + areaMsg[i].name + '</option>';
            $(show_city).append(city);
        }
    }
    var cityId = $(show_city).find("option:selected").attr("id");
    for (var i in areaMsg) {
        if (parseInt(areaMsg[i].level) == 3 && areaMsg[i].parent_id == cityId) {
            var area = '<option id="' + areaMsg[i].id + '">' + areaMsg[i].name + '</option>';
            $(show_area).append(area);
        }
    }
    // }
}
//获取地区列表
function cityChange(show_city_id, show_area_id) {
    var show_city = "#" + show_city_id;
    var show_area = "#" + show_area_id;
    var areaMsg = getArea();
    $(show_area).empty();
    var selectCityId = $(show_city).find("option:selected").prop('id');
    for (var i in areaMsg) {
        if (parseInt(areaMsg[i].level) == 3 && areaMsg[i].parent_id == selectCityId) {
            var area = '<option id="' + areaMsg[i].id + '">' + areaMsg[i].name + '</option>';
            $(show_area).append(area);
        }
    }
}
function logoff() {
    //this.preventDefault();

    var dialog = $("#dialog-message").removeClass('hide').dialog({
        modal: true,
        title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='icon-ok'></i> 确定要退出吗?</h4></div>",
        title_html: true,
        buttons: [
            {
                text: "Cancel",
                "class": "btn btn-xs",
                click: function () {
                    $(this).dialog("close");
                }
            },
            {
                text: "OK",
                "class": "btn btn-primary btn-xs",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });
}


//获取URL参数
function GetRequest() {

    var url = window.location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

// function ajaxout(name) {
//     removeload();
//     switch (name) {
//         case "loading":
//             html = '<div class="loading"><div class="f-pr" style="height:100%;">';
//             html += '<div style="top:50%;left:50%;position:fixed; margin-left:47px; margin-top:-30px;">';
//             html += '<img src="images/loading.gif" height="80" width="80">';
//             html += '<h4>加载中......</h4>';
//             html += '</div></div></div>';
//             $(".main-content").append(html);
//             break;
//         case "imagine":
//             html = '<div class="loading"><div class="f-pr" style="height:100%;">';
//             html += '<div style="top:50%;left:50%;position:fixed; margin-left:47px; margin-top:-30px;">';
//             html += '<img src="images/loading.gif" height="80" width="80">';
//             html += '<h4>图片上传中......</h4>';
//             html += '</div></div></div>';
//             $(".main-content").append(html);
//             break;
//         case "files":
//             html = '<div class="loading"><div class="f-pr" style="height:100%;">';
//             html += '<div style="top:50%;left:50%;position:fixed; margin-left:47px; margin-top:-30px;">';
//             html += '<img src="images/loading.gif" height="80" width="80">';
//             html += '<h4>文件上传中......</h4>';
//             html += '</div></div></div>';
//             $(".main-content").append(html);
//             break;
//     }
// }


//菜单链接访问
function btnurl(url) {
    window.location.href = "index.html?url=" + url;
}

function operator_btnurl(url) {
    window.location.href = "operatorindex.html?url=" + url;
}


/**实现文本slect控件跟随变化
 *  @param textObj 绑定的文本对象
 *  @param selectObj select控件对象
 */
function selectObj(textObj, selectObj) {
    var political = $(textObj).text();
    $(selectObj).find("option").each(function (i, e) {
        if ($(e).text() == political) {
            $(e).attr("selected", 'selected');
        }
    })
}

function getGraduateYear(obj) {
    var graduate_list = JSON.parse(getLocalStorage("user_info")).year.select_graduate_year;
    var default_gra = JSON.parse(getLocalStorage("user_info")).year.default_year.graduate_year;
    var teacher_gra = JSON.parse(getLocalStorage("user_info")).year.teacher_year.graduate_year;
    var totalGraduate = teacher_gra ? teacher_gra : default_gra;
    var graduateHtml = "";
    $.each(graduate_list, function (i, item) {
        if (item.value == totalGraduate) {
            graduateHtml += "<option value='{0}' selected='selected'>{1}</option>".format(item.value, item.name);
        } else {
            graduateHtml += "<option value='{0}'>{1}</option>".format(item.value, item.name);
        }
    });
    obj.append(graduateHtml);
}
/**
 * 入学年份毕业年份下拉框渲染
 * @param entrance_graduate string 父节点ID, 在该元素下面构建组织结构下拉框，此节点一般为div
 * @param org_id string 组织结构ID, 构造的组织结构下拉框将使用此作为ID
 * @param status boolean 判断是否渲染全部选项
 * @param filter string 设置对组织结构的筛选功能（特指去除特定的包含字符串），设置的内容为要去除的,例如：group,structure
 */
function select_ent_gra(entrance_graduate, org_id, status, filter) {
    var entrance_id = 'entrance_year';
    var graduate_id = 'graduate_year';
    var ent_gra = '<div class="col-sm-8" style="margin-top: 20px;"><div class="m-row f-pr"><div class="col-xs-4"><div class="m-tab"><div class="m-tabcell"><label style="width:80px">组织结构：</label></div><div class="m-tabcell f-width"><select class="f-width" name="' + org_id + '" id="' + org_id + '"></select></div></div></div><div class="col-xs-4"><div class="m-tab"><div class="m-tabcell"><label style="width:80px;">入学年份：</label></div><div class="m-tabcell f-width"><select class="form-control" style="width:100%;display: inline-block;" id="' + entrance_id + '"> </select></div></div></div><div class="col-xs-4"><div class="m-tab"><div class="m-tabcell"><label style="width:80px;">毕业年份：</label></div><div class="m-tabcell f-width"><select class="form-control" style="width:100%;display: inline-block;" id="' + graduate_id + '"></select></div></div></div></div></div>';
    var structures = getSectionStorage("user_info", "structures");
    var default_view_id = getSectionStorage("user_info", "default_view");
    var structures_list = '';
    var tmp_arr = [];
    //添加过滤提交
    if (filter) {
        var filter_arr = filter.split(",");
        for (var i = 0; i < filter_arr.length; i++) {
            for (var index = 0; index < structures.length; index++) {
                if (structures[index].value.indexOf(filter_arr[i]) === -1) {
                    tmp_arr.push(structures[index]);
                }
            }
        }
        structures = tmp_arr;
    }

    for (var i = 0; i < structures.length; i++) {
        if (status == true) {
            if (structures[i].value == "all") {
                continue;
            }
            if (default_view_id == structures[i].value) {
                structures_list += '<option level="' + structures[i].level + '" value="' + structures[i].value + '" selected="selected">' + structures[i].name + '</option>';
            } else {
                structures_list += '<option level="' + structures[i].level + '" value="' + structures[i].value + '">' + structures[i].name + '</option>';
            }

        } else {
            if (default_view_id == structures[i].value) {
                structures_list += '<option level="' + structures[i].level + '" value="' + structures[i].value + '" selected="selected">' + structures[i].name + '</option>';
            } else {
                structures_list += '<option level="' + structures[i].level + '" value="' + structures[i].value + '">' + structures[i].name + '</option>';
            }
        }

    }
    $(entrance_graduate).prepend(ent_gra);
    $("#" + org_id).html(structures_list);
    //获取入学年份和毕业年份列表
    var entrance_list = JSON.parse(getLocalStorage("user_info")).year.select_entrance_year;
    var graduate_list = JSON.parse(getLocalStorage("user_info")).year.select_graduate_year;
    var entrance_html_list = '';
    var graduate_html_list = '';
    for (var i = 0; i < entrance_list.length; i++) {
        entrance_html_list += '<option value="' + entrance_list[i].value + '">' + entrance_list[i].name + '</option>';
    }
    for (var i = 0; i < graduate_list.length; i++) {
        graduate_html_list += '<option value="' + graduate_list[i].value + '">' + graduate_list[i].name + '</option>';
    }
    $("#" + entrance_id).html(entrance_html_list);
    $("#" + graduate_id).html(graduate_html_list);
    //获取学校设置的入学年份和毕业年份
    var default_ent = JSON.parse(getLocalStorage("user_info")).year.default_year.entrance_year;
    var default_gra = JSON.parse(getLocalStorage("user_info")).year.default_year.graduate_year;
    //获取老师设置的入学年份和毕业年份
    var teacher_entrance = JSON.parse(getLocalStorage("user_info")).year.teacher_year.entrance_year;
    var teacher_graduate = JSON.parse(getLocalStorage("user_info")).year.teacher_year.graduate_year;
    var len_entrance = $("#entrance_year option").length;
    var len_gradaute = $("#graduate_year option").length;
    var tmp_select = "";
    for (var i = 0; i < len_entrance; i++) {
        if (teacher_entrance) {
            tmp_select = teacher_entrance;
        } else {
            tmp_select = default_ent;
        }
        if ($('#entrance_year option').eq(i).val() == tmp_select) {
            $("#entrance_year option").eq(i).attr("selected", "true");
        }
    }

    for (var i = 0; i < len_gradaute; i++) {
        if (teacher_entrance) {
            tmp_select = teacher_graduate;
        } else {
            tmp_select = default_gra;
        }
        if ($('#graduate_year option').eq(i).val() == tmp_select) {
            $("#graduate_year option").eq(i).attr("selected", "true");
        }
    }

}
//格式化时间
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
/**
 * 为控件渲染毕业年份和入学年份
 * @param {[type]} entrance_id [入学年份ID,class,name…………]
 * @param {[type]} graduate_id [毕业年份ID,class,name…………]
 */
function set_entrance_graduate_year(entrance_id, graduate_id) {
    //获取返回的入学年份和毕业年份列表
    var entrance_select_list = JSON.parse(getLocalStorage("user_info")).year.select_entrance_year;
    var graduate_select_list = JSON.parse(getLocalStorage("user_info")).year.select_graduate_year;
    //获取老师设置的入学年份和毕业年份
    var teacher_entrance_year = JSON.parse(getLocalStorage("user_info")).year.teacher_year.entrance_year;
    var teacher_graduate_year = JSON.parse(getLocalStorage("user_info")).year.teacher_year.graduate_year;
    //获取学校设置的入学年份和毕业年份
    var default_entrance_year = JSON.parse(getLocalStorage("user_info")).year.default_year.entrance_year;
    var default_graduate_year = JSON.parse(getLocalStorage("user_info")).year.default_year.graduate_year;
    var entrance_list = '';
    var graduate_list = '';
    var tmp_select = "";
    for (var i = 0; i < entrance_select_list.length; i++) {
        //判断老师是否自定义入学年份或者毕业年份
        if (teacher_entrance_year) {
            tmp_select = teacher_entrance_year;
        } else {
            tmp_select = default_entrance_year;
        }
        if (tmp_select == entrance_select_list[i].value) {
            entrance_list += '<option data="' + entrance_select_list[i].value + '" selected="selected">' + entrance_select_list[i].name + '</option>';
        } else {
            entrance_list += '<option data="' + entrance_select_list[i].value + '">' + entrance_select_list[i].name + '</option>';
        }
    }
    for (var i = 0; i < graduate_select_list.length; i++) {
        if (teacher_entrance_year) {
            tmp_select = teacher_graduate_year;
        } else {
            tmp_select = default_graduate_year;
        }
        if (tmp_select == graduate_select_list[i].value) {
            graduate_list += '<option data="' + graduate_select_list[i].value + '" selected="selected">' + graduate_select_list[i].name + '</option>';
        } else {
            graduate_list += '<option data="' + graduate_select_list[i].value + '">' + graduate_select_list[i].name + '</option>';
        }
    }
    $(entrance_id).html(entrance_list);
    $(graduate_id).html(graduate_list);
}

function set_ent_gra(entrance, graduate) {
    //学校设置的入学年份和毕业年份
    var default_ent = JSON.parse(getLocalStorage("user_info")).year.default_year.entrance_year;
    var default_gra = JSON.parse(getLocalStorage("user_info")).year.default_year.graduate_year;
    //老师设置的入学年份和毕业年份
    var teacher_ent = JSON.parse(getLocalStorage("user_info")).year.teacher_year.entrance_year;
    var teacher_graduate = JSON.parse(getLocalStorage("user_info")).year.teacher_year.graduate_year;
    var tmp_select = "";
    var entrance_id = entrance + " option";
    var graduate_id = graduate + " option";
    var len_entrance = $(entrance_id).length;
    var len_gradaute = $(graduate_id).length;
    for (var i = 0; i < len_entrance; i++) {
        if (teacher_ent) {
            tmp_select = default_ent;
        } else {
            tmp_select = teacher_ent;
        }
        if ($(entrance_id).eq(i).val() == tmp_select) {
            $(entrance_id).eq(i).attr("selected", "true");
        }
    }
    for (var i = 0; i < len_gradaute; i++) {
        if (teacher_ent) {
            tmp_select = default_gra;
        } else {
            tmp_select = teacher_graduate;
        }
        if ($(graduate_id).eq(i).val() == tmp_select) {
            $(graduate_id).eq(i).attr("selected", "true");
        }
    }
}
/**
 * 模板弹出窗
 * @param title 窗口标题
 * @param content 提示内容
 * @param no_button true显示取消按钮 false不显示取消按钮  默认false
 * @param callback1 确认按钮回调方法
 * @param callback2 取消按钮回调方法
 * @param callBack3 点X按钮回调方法
 */
function my_alert(title, content, no_button, callback1, callback2, callback3) {
    if (!no_button) {
        no_button = false
    }
    if (!callback1) {
        callback1 = function () {
        }
    }
    if (!callback2) {
        callback2 = function () {
        }
    }
    if (!callback3) {
        callback3 = function () {
        }
    }
    html = '<div id="my_alert" class="m-popup">';
    html += '<div class="m-popup-box" style="width:500px; min-height:170px;margin-top:200px;">';
    html += '<h2>' + title;
    html += '<a id="btn-no_1" href="javascript:void(0)" class="pull-right  bigger-150 s-c999" style="margin-right:20px;">×</a>';
    html += '</h2>';
    html += '<div style="max-height: 400px;overflow-y: auto;">';
    html += '<div style="padding:20px;max-height:200px">';
    html += '<p>' + content + '</p></div>';
    html += '</div> <div class="f-tr f-pb10">';
    html += '<input id="btn-yes" type="button" class="u-btn" value="确定">&nbsp;&nbsp;';
    if (no_button) {
        html += '<input id="btn-no" type="button" class="u-btn u-btn-2" value="取消">&nbsp;&nbsp;';
    }
    html += '</div></div></div>';
    $('body').append(html);
    $('#my_alert').show();
    $('#btn-yes').click(function () {
        callback1();
        $('#my_alert').remove();
    });
    $('#btn-no').click(function () {
        callback2();
        $('#my_alert').remove();
    });
    $('#btn-no_1').click(function () {
        callback2();
        $('#my_alert').remove();
    });
    $('#btn-no_1').click(function () {
        callback3();
        $('#my_alert').remove();
    });
}

/**
 * *前端分页函数
 * @author lr
 * @param num  当前页码
 * @param size 每页记录数
 * @param count 列表总记录数
 * @param page_num_max 限制页码图标数，默认10个 << 1,2,3……10 >>
 * @returns {string}
 */
function page(num, size, count, page_num_max) {
    num = parseInt(num);
    count = parseInt(count);
    size = parseInt(size);
    page_num_max = parseInt(page_num_max);
    page_num_max = !page_num_max ? 10 : page_num_max;
    //实际页码数
    page_num_count = Math.ceil(count / size);
    num = num > page_num_count ? page_num_count : num;
    var html = '<ul class="pagination" current-num="' + num + '">';

    if (page_num_count > 1) {
        //处理上一页图标
        if (num > 1) {
            html += '<li num="' + (num - 1) + '"> <a href="javascript:void(0)"> <i class="icon-double-angle-left"></i> </a> </li>';
        }
        //中间页码
        page_num_mid = Math.ceil(page_num_max / 2);
        //设置开始页码 start_num
        if (num <= page_num_mid) {
            //第一种情况，小于中间页码
            start_num = 1;
        } else {
            //第二种情况，小于总页码
            if (page_num_count <= page_num_max) {
                start_num = 1
            } else {
                //第三种情况，假设当前页码为中间页码
                start_num = num + 1 - page_num_mid;
                while ((page_num_count + 1 - start_num) < page_num_max) {
                    //假设情况不存在，开始页码后退一页
                    start_num--;
                }
            }
        }
        i = start_num;
        //分页图标数必须小于实际页码数和限制页码图标数
        while (i <= page_num_count && i <= (start_num + page_num_max - 1)) {
            html += (i == num) ? '<li  num="' + i + '" class="active"><a  href="javascript:void(0)">' + i + '</a> </li>' : '<li num="' + i + '"> <a href="javascript:void(0)">' + i + '</a> </li>';
            i++;
        }
        //处理下一页图标
        if (page_num_count > num) {
            html += '<li num="' + (num + 1) + '"><a href="javascript:void(0)"><i class="icon-double-angle-right"></i></a></li>';
        }
    }
    html += '<ul>';
    return html;
}

//去除首尾空字符串
function trimStr(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

//去除双引号
function trimDouble(str) {
    var reg = /^\".+\"$/gi;
    var result = reg.test(str);
    var last = '';
    if (result) {
        last = str.substr(1, str.length - 2);
        return last;
    } else {
        last = str;
        return last;
    }
}
//判断Token是否为空，空跳回登录页
function token() {
    var token = cookie.get('token');
    if (token == null) {
        localStorage.removeItem("organization");
        window.location.href = "login.html";
    } else {
        return token;
    }
}
//统一平台token
function operator_token() {
    var token = cookie.get('token');
    if (token == null) {
        localStorage.removeItem("organization");
        window.location.href = "operatorLogin.html";
    } else {
        return token;
    }
}

//时间操作
function getAppointTime(day) {
    var newDate = new Date();
    var day = parseInt(day) ? parseInt(day) : 0;
    var tmp_time = newDate.getTime() + day * 24 * 60 * 60 * 1000;
    return new Date(tmp_time).toLocaleDateString();
}

//退出登录
function closeUser() {
    history.go(0);
    var storage = window.localStorage;
    storage.removeItem("tmp_default_view");
    delCookie('token');
    localStorage.removeItem("organization");

}

//设置默认视图联动
function setDefaultView(setShowDefaultViewId, DefaultViewId, DefaultViewName) {
    var storage = window.localStorage;
    var setShowDefaultViewObj = "#" + setShowDefaultViewId;
    var test = organization(setShowDefaultViewObj);
    DefaultViewId = trimDouble(DefaultViewId);
    DefaultViewName = trimDouble(DefaultViewName);
    if (storage.getItem("teacher_default_view") != "null") {
        $(setShowDefaultViewObj).find("option[value='" + DefaultViewId + "']").prop("selected", true);
    }
}
//表格封装
function tab_obj(obj, tab_head) {
    var html = '';
    for (var i = 0; i < obj.length; i++) {
        html += "<tr";
        if (tab_head) {
            for (var tabkey in tab_head[i]) {
                html += " " + tabkey + "=" + tab_head[i][tabkey];
            }
        }
        html += ">";
        for (var key in obj[i]) {
            if (key.indexOf("HIDDEN") == -1) {
                html += '<td>' + obj[i][key] + '</td>';
            } else {
                html += '<td class="edit" style="display:none">' + obj[i][key] + '</td>';
            }
        }
        html += '</tr>';
    }
    return html;
}

//ajax封装
// jQuery.ax = function (json) {
//     json.async = (json.async === true || json.async === null || json.async === "" || typeof(json.async) === "undefined") ? true : false;
//     json.type = (json.type == null || json.type == "" || typeof(json.type) == "undefined") ? "post" : json.type;
//     json.dataType = (json.dataType == null || json.dataType == "" || typeof(json.dataType) == "undefined") ? "json" : json.dataType;
//     json.data = (json.data == null || json.data == "" || typeof(json.data) == "undefined") ? {"date": new Date().getTime()} : json.data;

//     $.ajax({
//         type: json.type,
//         async: json.async,
//         data: json.data,
//         url: json.url,
//         dataType: json.dataType,
//         context:json.context,
//         timeout: 20000, //超时时间设置，单位毫秒
//         beforeSend: function () {
//             //请求前loading...
//             ajaxout('loading');
//         },
//         success: function (ret_data) {
//             if(ret_data['code'] == 40510||ret_data['code'] == 40511){
//                 //token过期
//                 delCookie('token');
//                 //去登录
//                 window.location.href = "login.html";
//                 return false;
//             }
//                 json.success(ret_data, this);


//         },
//         error: function (request, status, err) {
//             removeload();
//             if (status == 'timeout') {
//                 //请求超时处理
//                 my_alert('错误', "请求超时,您当前所处网络状况较差,请刷新页面！")
//             } else {
//                 my_alert('错误', "请求失败！")
//             }
//         }
//     });
// };
/**
 * @author  xcy
 * 这个方法主要是为了将被转义的文本还原成HTML所能识别的html格式的文本
 * @param  {string} text [被转义的文本]
 * @return {string}      [HTML格式文本]
 */
function changeHTML(text) {
    var reg = new RegExp("&lt;", "gi");
    text = text.replace(reg, "<");
    var reg1 = new RegExp("&gt;", "gi");
    text = text.replace(reg1, ">");
    return text;
}

//判断文件的类型，file文件，img图片
function judgeFileType(str) {

    //获取文件API的主域名
    var domain = JSON.parse(getLocalStorage("user_info")).domain.file_domain;
    if (str.indexOf(domain) != -1) {
        str = str.replace(domain, "");
    }
    //拓展名获取
    var extension = str.split(".").reverse()[0].toLowerCase();
    //判断是否为空
    if (extension.length) {
        var imageExtension = ["png", "jpg", "gif", "jpeg"];
        for (var i = 0; i < imageExtension.length; i++) {
            if (imageExtension[i] == extension) {
                return "img";
            }
        }
        return "file";
    }
    return "null";

}

//获取下载文件或者图片的完整链接
function getDownUrl(param) {
    var storage = JSON.parse(getLocalStorage("user_info")).domain.file_domain;
    if (param.indexOf("http") == -1 || param.indexOf("https") == -1) {
        return storage + param;
    } else {
        return param;
    }

}
//判断要渲染的是图片还是文件
function loadImgOrFile(fileType, filePath) {
    switch (fileType) {
        case "file":
            return "<a name='viewfile' style='display: block;margin-left:20px;margin-bottom:5px;' target='_blank' href='" + getDownUrl(filePath) + "'>查看文件&nbsp;&nbsp;</a>"
            break;
        case "img":
            return "<a target='_blank' href='" + getDownUrl(filePath) + "'><img style='height:80px;margin-left:20px;max-width: 150px;display: block;margin-bottom:10px;' target='_blank' src='" + getDownUrl(filePath) + "' /></a>";
            break;
    }
}

function removeload() {
    $('.showLoading').fadeOut('slow');
}
//删除上传文件最后一个逗号
function deleteLastComma(str) {
    var lastSymbol = str.substr(str.length - 1, 1);
    if (lastSymbol == ",") {
        return str.substr(0, str.length - 1);
    } else {
        return str;
    }

}
/**
 * 时间戳转时间
 * @author: luzg (2016-04-09 11:29:27)
 *
 * @returns {string}
 * @param nS int
 * @param showTimePart bool
 * @param splitPart 分隔符
 */
function getTimeByTimestamp(nS, showTimePart, splitPart) {
    var p = function (s) {
        return s < 10 ? '0' + s : s;
    };
    splitPart = splitPart ? splitPart : '-';

    showTimePart = showTimePart ? showTimePart : false;
    if (nS == 0) {
        return '-';
    }
    var parseDate = new Date(parseInt(nS));
    if (parseDate == "Invalid Date") {
        return '-';
    }
    var Y = parseDate.getFullYear();
    var M = p(parseDate.getMonth() + 1);
    var D = p(parseDate.getDate());
    var h = p(parseDate.getHours());
    var m = p(parseDate.getMinutes());
    var s = p(parseDate.getSeconds());
    if (showTimePart) {
        return "{0}{6}{1}{6}{2} {3}:{4}:{5}".format(Y, M, D, h, m, s, splitPart);
    }

    return "{0}{3}{1}{3}{2}".format(Y, M, D, splitPart);
}

/**
 * 全选/反选表格里面的复选框
 * @author: luzg (2016-04-09 17:34:20)
 *     例如：
 *     <input type="checkbox" class="control" onclick="javascript:checkAll(this, 'wait-tab');">
 *
 * @param  control string 主复选框拥有的class name
 * @param  parentId string 父复选框拥有的class name
 * @param  childName string 子复选框的name, 默认是 check-list
 */
function checkAll(control, parentId, childName) {
    if (!childName) {
        childName = 'check-list';
    }
    $('#' + parentId + ' input[name=' + childName + ']').prop('checked', control.checked);
}

//数据为null转回""或者数据需要转换的字符串
function returnnull(data, str) {
    if (str) {
        var _data = data == null ? str : data;
    } else {
        var _data = data == null ? "" : data;
    }
    return _data;
}

/**
 * form 表单异步提交
 * @author zjz
 * @param  formObj 需要提交的form表单 $('#form');
 * @param  diySuccess 成功后调用的方法
 * @param  diyError 失败后调用的方法
 * @PS     调用该方法 需要在 表单form 设置 action 和 method
 */
var isJQAjaxFormIng = []; // 防止正在提交同一id表单重复提交
function JQAjaxForm(formObj, diySuccess, diyError) {
    if (!diySuccess) diySuccess = function (a, b, c) {
        inits();
        console.log(a, b, c);
    }
    if (!diyError) diyError = function (a, b, c) {
        inits();
        console.log(a, b, c);
    }
    var $return = undefined;
    var errors = [];
    var type = undefined;
    var url = undefined;

    function inits() {
        errors = [];
        type = url = undefined;
        if (!formObj) errors.push('无对象');
        isJQAjaxFormIng[formObj.attr('id')] = 0;
    }

    function getUrl() {
        url = formObj.attr('action')
        if (!url) errors.push('未设置“Action”');
        return url ? url : '';
    }

    function isJQAjaxFormIng() {
        if (isJQAjaxFormIng[formObj.attr('id')]) {
            errors.push('不能重复提交表单');
            return true;
        }
    }

    function ajaxSubmitGo(diySuccess, diyError) {
        var actions = getUrl();
        if (errors.length)
            return errors;
        else if (isJQAjaxFormIng())
            return '99999';
        isJQAjaxFormIng[formObj.attr('id')] = 1;
        formObj.ajaxSubmit({
            type: formObj.attr('method') ? formObj.attr('method') : 'GET',
            url: apiurl(actions),
            success: function (result) {

                diySuccess(result);

            },
            error: function (result) {
                diyError(result);
                removeload();
            },
            beforeSend: function () {
                ajaxout('loading');
            }
        });
    }

    inits();
    return ajaxSubmitGo(diySuccess, diyError);
}

//获取学校组织数据
function obj_organization() {
    $.ajax({
        url: apiurl("view"),
        timeout: 20000,
        success: function (json) {
            if (json.code == "20000") {
                html = '';
                obj = json.data.view;
                if (obj) {
                    $.each(obj, function (i, item) {
                        html += '<option value="' + item.value + '">' + item.name + '</option>';
                    });
                }
                //存储在SessionStorage
                localStorage.setItem("organization", html);
            }
        }
    });
}
//展示学校组织数据
function organization(name) {
    //若Storage有数据直接展示，没有数据重新接口获取
    var organize = getOrganizationList('user_info');
    //console.log(organize);
    var html = '';
    for (var i in organize) {
        html += '<option value="' + organize[i].value + '">' + organize[i].name + '</option>';
    }
    $(name).html(html);
    var select_item = getSectionStorage('user_info', 'default_view');
    $(name).val(select_item);
}

/*
 *@function:获取组织结构列表
 *@param1:传入指定本地存储的字段
 */
function getOrganizationList(name) {
    var organize = '{"structures":{';
    var structures = JSON.parse(getLocalStorage(name)).structures;
    var views_sturcture_id = JSON.parse(getLocalStorage(name)).views.structure_id;
    return structures;
}

//获取地区方法
function getarea(position, sel_id, numid) {
    area_html = '<option value="-1">请选择</option>';
    $.ajax({
        url: apiurl('GetArea/GetDownArea'),
        type: 'get',
        dataType: 'json',
        data: {
            area_id: numid
        },
        success: function (data) {
            if (data['code'] == '20000') {
                json = data['data']['data'];
                $.each(json, function (i, item) {
                    area_html += '<option value="' + item.id + '">' + item.area_name + '</option>'
                });
            }
            $(position).html(area_html);
            $(position).val(sel_id);
        }
    });
}

function xixun_login_off() {
    var storage = window.localStorage;
    var school_id = JSON.parse(getLocalStorage('user_info')).school_id;
    var default_view_name = JSON.parse(getLocalStorage('user_info')).school_name;
    // var sjzx=sjzx_domain+"/loginout.html";
    // var bysj=bysj_domain+"/loginout.html";
    // var dcwj=dcwj_domain+"/logout/index";
//     $('body').append('<iframe id="frame1" style="display:none;" src="' + bysj + '"></iframe>');
//     $('body').append('<iframe id="frame2" style="display:none;" src="' + sjzx + '"></iframe>');
//     $('body').append('<iframe id="frame4" style="display:none;" src="' + dcwj + '"></iframe>');


    setTimeout(function () {
        var storage = window.localStorage;
        var tk = getSectionStorage("user_info", "token");
        var time = new Date();
        time.setDate(time.getDate() - 1);
        time = time.toGMTString();
        document.cookie = "token=" + tk + ";domain=" + domain + ";path=/;expires=" + time;
        storage.setItem("school_id", school_id);
        storage.setItem("school_name", default_view_name);
        //清除本地所有的sessionStorage
        window.sessionStorage.clear();
        window.location.href = "/login.html"
    }, 100);
    //去登录
    return false;
}

function xixun_cross_login_off() {
    var school_id = getSectionStorage('user_info', 'school_id');
    var default_view_name = getSectionStorage('user_info', 'school_name');
    // var sjzx=sjzx_domain+"/loginout.html";
    // var bysj=bysj_domain+"/loginout.html";
    // var dcwj=dcwj_domain+"/logout/index";
    var sx = sx_domain + "/loginout.html";
//     $('body').append('<iframe id="frame1" style="display:none;" src="' + bysj + '"></iframe>');
//             $('body').append('<iframe id="frame2" style="display:none;" src="' + sjzx + '"></iframe>');
//             $('body').append('<iframe id="frame4" style="display:none;" src="' + dcwj + '"></iframe>');
    setTimeout('var storage=window.localStorage;;var tk=cookie.get("token");   var time=new Date();time.setDate(time.getDate()-1);time=time.toGMTString();document.cookie="token="+tk+";domain=' + domain + ';path=/;expires="+time;storage.setItem("school_id",' + school_id + ');storage.setItem("school_name","' + default_view_name + '");window.location.href="' + sx_domain + '/login.html";', 100);
    return false;
}
//改变地区方法
function changeArea(position, numid) {
    area_html = '<option value="-1">请选择</option>';
    if (numid == -1) {
        $(position).html(area_html);
        return false;
    }
    $.ajax({
        url: apiurl('GetArea/GetDownArea'),
        type: 'get',
        dataType: 'json',
        data: {
            area_id: numid
        },
        success: function (ret_data) {
            if (ret_data['code'] == '20000') {
                json = ret_data['data']['data'];
                $.each(json, function (i, item) {
                    area_html += '<option value="' + item.id + '">' + item.area_name + '</option>'
                });
            }
            $(position).html(area_html);
        }
    });
}

// 编辑换行格式
function tobr(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}


//切换显示条数
function change_size() {
    $('#size').append('<option value="15">15</option> <option value="25">25</option> <option value="50">50</option> <option value="100">100</option>')
    $('#size').change(function () {

        var opt = $('#size').val();
        if (opt == 15) {
            page_size = 15
            getPageSearch(1, page_size, $('#student-keyword').val());
        }
        if (opt == 25) {
            page_size = 25
            getPageSearch(1, page_size, $('#student-keyword').val());
        }
        if (opt == 50) {
            page_size = 50
            getPageSearch(1, page_size, $('#student-keyword').val());
        }
        if (opt == 100) {
            page_size = 100
            getPageSearch(1, page_size, $('#student-keyword').val());
        }
    })


}

//回车键搜索
function key_list(mylist) {
    $('#student-keyword').keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            $('#keyword-hidden').val($('#student-keyword').val());
            mylist();
        }
    });
}
//数组去重
function unique(arr) {
    var res = [];
    var json = {};
    for (var i = 0; i < arr.length; i++) {
        if (!json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
        }
    }
    return res;
}




