var apiUrl = 'http://101.37.27.185:9898/';

// var apiUrl = 'http://127.0.0.1:8080/';
//导出列表方法
function getExcel(url,json){
    var token=cookie.get("token");
    var str='';
    for(var i in json){
        str+='&'+i+'='+json[i];
    }
    request=JSON.parse(getLocalStorage('user_info')).domain.sx_api+"/"+url+"?token="+token+str;
    return request;
}

//控制台方法封装
console.log=function(string){
    var host=window.location.hostname;
    if(host=="https://www.xixunyun.com/enterprise/js/common/sx.xixunyun.com"){
        return false;
    }else{
        console.info(string);
    }
}
/**
 * @author  xcy
 * 这个方法主要是为了将被转义的文本还原成HTML所能识别的html格式的文本
 * @param  {string} text [被转义的文本]
 * @return {string}      [HTML格式文本]
 */
function changeHTML(text){
    var reg=new RegExp("&lt;","gi");
    text=text.replace(reg,"<");
    var reg1=new RegExp("&gt;","gi");
    text=text.replace(reg1,">");
    return text;
}
/**
 * 获取验证码后倒计时功能实现
 * @param {[string]} btn_id              [按钮的选择器，例如id=one，即为#one]
 * @param {[int]} TIME                [倒计时时间，以秒为单位]
 * @param {[string]} OVER_TIME_SHOW_TEXT [定时器超时后显示的文本]
 */
function setValidateTime(btn_id,TIME,OVER_TIME_SHOW_TEXT){
    if(TIME!=undefined){
        window["TIME"]=TIME;
        window["ORIGIN_TIME"]=TIME;
    }
    if(btn_id!=undefined){
        window["countdown_btn"]=btn_id;
    }
    if(OVER_TIME_SHOW_TEXT!=undefined){
        window["OVER_TIME_SHOW_TEXT"]=OVER_TIME_SHOW_TEXT;
    }
    $(window["countdown_btn"]).attr("disabled","disabled");
    $(window["countdown_btn"]).css("cursor","default");
    $(window["countdown_btn"]).text(window["TIME"]+"秒");
    if(window["TIME"]==0){
        setInterval("", 500);
        $(window["countdown_btn"]).text(window["OVER_TIME_SHOW_TEXT"]);
        $(window["countdown_btn"]).removeAttr("disabled");
        $(window["countdown_btn"]).css('cursor','pointer');
        window["TIME"]=window["ORIGIN_TIME"];
        //TIME=60;
        return true;
    }else{
        window["TIME"]--;
        setTimeout("setValidateTime()",1000);
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
    function provinceChange(show_province_id,show_city_id,show_area_id,text){
        var show_province="#"+show_province_id;
        var show_city="#"+show_city_id;
        var show_area="#"+show_area_id;
        var city='';
        var area='';
        var selectProvinceId=$(show_province).find("option:selected").prop('id');
        $(show_city).empty();
        $(show_area).empty();
        var areaMsg=getArea();
        for(var i in areaMsg){
            if(parseInt(areaMsg[i].level)==2&&areaMsg[i].parent_id==selectProvinceId){
                city='<option id="'+areaMsg[i].id+'">'+areaMsg[i].name+'</option>';
                $(show_city).append(city);
            }
        }
        console.log(city);
        if(city==''){
            console.log(123);
            console.log(show_city);
            $(show_city).append('<option>'+text+'</option>');
        }
        var selectCityId=$(show_city).find("option:selected").prop('id');
        for(var i in areaMsg){
            if(parseInt(areaMsg[i].level)==3&&areaMsg[i].parent_id==selectCityId){
                area='<option id="'+areaMsg[i].id+'">'+areaMsg[i].name+'</option>';
                $(show_area).append(area);
            }
        }
        if(area==''){
            $(show_area).append('<option>'+text+'</option>');
        }
        
    }

    function area(bind_province_id,bind_city_id,bind_area_id){
        var areaMsg=getArea();
        var show_province="#"+bind_province_id;
        var show_city="#"+bind_city_id;
        var show_area="#"+bind_area_id;
        // if(state==0){
            for(var i in areaMsg){
                if(parseInt(areaMsg[i].level)==1){
                    var province='<option id="'+areaMsg[i].id+'">'+areaMsg[i].name+'</option>';
                    $(show_province).append(province);
                }
            }
            var provinceId=$(show_province).find("option:selected").attr("id");
            for(var i in areaMsg){
                if(parseInt(areaMsg[i].level)==2&&areaMsg[i].parent_id==provinceId){
                    var city='<option id="'+areaMsg[i].id+'">'+areaMsg[i].name+'</option>';
                    $(show_city).append(city);
                }
            }
            var cityId=$(show_city).find("option:selected").attr("id");
            for(var i in areaMsg){
                if(parseInt(areaMsg[i].level)==3&&areaMsg[i].parent_id==cityId){
                    var area='<option id="'+areaMsg[i].id+'">'+areaMsg[i].name+'</option>';
                    $(show_area).append(area);
                }
            }
        // }
    }
    //获取地区列表
    function cityChange(show_city_id,show_area_id){
        var show_city="#"+show_city_id;
        var show_area="#"+show_area_id;
        var areaMsg=getArea();
        $(show_area).empty();
        var selectCityId=$(show_city).find("option:selected").prop('id');
        for(var i in areaMsg){
            if(parseInt(areaMsg[i].level)==3&&areaMsg[i].parent_id==selectCityId){
                var area='<option id="'+areaMsg[i].id+'">'+areaMsg[i].name+'</option>';
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

function ajaxout(name) {
    removeload();
    switch (name) {
        case "loading":
            html = '<div class="loading"><div class="f-pr" style="height:100%;">';
            html += '<div style="top:50%;left:50%;position:fixed; margin-left:47px; margin-top:-30px;">';
            html += '<img src="images/loading.gif"/*tpa=https://www.xixunyun.com/enterprise/js/common/images/loading.gif*/ height="80" width="80">';
            html += '<h4>加载中......</h4>';
            html += '</div></div></div>';
            $(".main-content").append(html);
            break;
        case "imagine":
            html = '<div class="loading"><div class="f-pr" style="height:100%;">';
            html += '<div style="top:50%;left:50%;position:fixed; margin-left:47px; margin-top:-30px;">';
            html += '<img src="images/loading.gif"/*tpa=https://www.xixunyun.com/enterprise/js/common/images/loading.gif*/ height="80" width="80">';
            html += '<h4>图片上传中......</h4>';
            html += '</div></div></div>';
            $(".main-content").append(html);
            break;
        case "files":
            html = '<div class="loading"><div class="f-pr" style="height:100%;">';
            html += '<div style="top:50%;left:50%;position:fixed; margin-left:47px; margin-top:-30px;">';
            html += '<img src="images/loading.gif"/*tpa=https://www.xixunyun.com/enterprise/js/common/images/loading.gif*/ height="80" width="80">';
            html += '<h4>文件上传中......</h4>';
            html += '</div></div></div>';
            $(".main-content").append(html);
            break;
    }
}


/**实现文本slect控件跟随变化
*  @param textObj 绑定的文本对象
*  @param selectObj select控件对象
*/
function selectObj(textObj,selectObj){
    var political=$(textObj).text();
    $(selectObj).find("option").each(function(i,e){
        if($(e).text()==political){
            $(e).attr("selected",'selected');
        }
    })
}

/**
 * 入学年份毕业年份下拉框渲染
 * @param 插入渲染位置
 * @param 插入组织结构ID
 */
function select_ent_gra(entrance_graduate,org_id){
    var entrance_id='entrance_year';
    var graduate_id='graduate_year';
    var ent_gra='<div class="col-sm-8" style="margin-top: 20px;"><div class="m-row f-pr"><div class="col-xs-4"><div class="m-tab"><div class="m-tabcell"><label style="width:80px">组织结构：</label></div><div class="m-tabcell f-width"><select class="f-width" name="'+org_id+'" id="'+org_id+'"></select></div></div></div><div class="col-xs-4"><div class="m-tab"><div class="m-tabcell"><label style="width:80px;">入学年份：</label></div><div class="m-tabcell f-width"><select class="form-control" style="width:100%;display: inline-block;" id="'+entrance_id+'"><option value="all">全部</option><option value="2012">2012年</option><option value="2013">2013年</option><option value="2014">2014年</option><option value="2015">2015年</option><option value="2016">2016年</option></select></div></div></div><div class="col-xs-4"><div class="m-tab"><div class="m-tabcell"><label style="width:80px;">毕业年份：</label></div><div class="m-tabcell f-width"><select class="form-control" style="width:100%;display: inline-block;" id="'+graduate_id+'"><option value="all">全部</option><option value="2015">2015年</option><option value="2016">2016年</option><option value="2017">2017年</option><option value="2018">2018年</option><option value="2019">2019年</option></select></div></div></div></div></div>';
    //var graduate='';
    $(entrance_graduate).prepend(ent_gra);
    //$(gra).html(graduate);
    var default_ent=getSectionStorage('user_info','entrance_year');
    var default_gra=getSectionStorage('user_info','graduate_year');
    var len_entrance=$("#entrance_year option").length;
    var len_gradaute=$("#graduate_year option").length;
    for(var i=0;i<len_entrance;i++){
        if($('#entrance_year option').eq(i).val()==default_ent){
            $("#entrance_year option").eq(i).attr("selected","true");
        }
    }
    for(var i=0;i<len_gradaute;i++){
        if($('#graduate_year option').eq(i).val()==default_gra){
            $("#graduate_year option").eq(i).attr("selected","true");
        }
    }

}

function set_ent_gra(entrance,graduate){
    var default_ent=getSectionStorage('user_info','entrance_year');
    var default_gra=getSectionStorage('user_info','graduate_year');
    var entrance_id=entrance+" option";
    var graduate_id=graduate+" option";
    var len_entrance=$(entrance_id).length;
    var len_gradaute=$(graduate_id).length;
    for(var i=0;i<len_entrance;i++){
        if($(entrance_id).eq(i).val()==default_ent){
            $(entrance_id).eq(i).attr("selected","true");
        }
    }
    for(var i=0;i<len_gradaute;i++){
        if($(graduate_id).eq(i).val()==default_gra){
            $(graduate_id).eq(i).attr("selected","true");
        }
    }
}
/**
 * 选择器组件
 * @param title 窗口标题
 * @param content 渲染内容，这一部分需要传入JSON的形式
 * @param no_button true显示取消按钮 false不显示取消按钮  默认false
 * @param callback1 确认按钮回调方法
 * @param callback2 取消按钮回调方法
 * @param callBack3 点X按钮回调方法
 */
function select_subgroup(title, list, no_button, callback1, callback2, callback3) {
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
    html = '<div style="display:none" id="my_alert1" class="m-popup">';
    html += '<div class="m-popup-box" style="width:430px; min-height:230px;max-height:350px;margin-top:150px;">';
    html += '<h2>' + title;
    html += '<a id="btn-no_1" href="javascript:void(0)" class="pull-right  bigger-150 s-c999" style="margin-right:20px;">×</a>';
    html += '</h2>';
    html += '<div style="max-height: 300px;overflow-y: auto;">';
    html += '<div style="padding:20px;min-height:130px">';
    if(list!=undefined||list!=" "||list!=null){

        for(var i in list){
            html+='<div class="checkbox"><label><input id="'+list[i].school_id+'" value="'+list[i].school_name+'" type="checkbox">'+list[i].school_name+'</label></div>';
        }
    }else{
        html+='<p>暂无学校</p>'
    }
    if(list==false){
        html+='<p>暂无学校</p>';
    }
    html+='</div>';
    html += '<div style="text-align:center" class="f-tr f-pb10">';
    html += '<input id="btn-yes1" type="button" class="u-btn" value="确定">&nbsp;&nbsp;';
    if (no_button) {
        html += '<input id="btn-no" type="button" class="u-btn u-btn-2" value="取消">&nbsp;&nbsp;';
    }
    html += '</div> </div> </div></div>';
    $('body').append(html);
    //$('#my_alert').show();
   
    $('#btn-yes1').click(function () {
        if($(".checkbox").find("input")!=null||$(".checkbox").find("input")!=undefined||$(".checkbox").find("input")!=""){
            var len=$(".checkbox").find("input").length;
            var json_select='{"componentID":"my_alert1","return_message":[';
            for(var i=0;i<len;i++){
                if($(".checkbox").find("input").eq(i).is(":checked")==true){
                    var id=$(".checkbox").find("input").eq(i).attr("id");
                    var v=$(".checkbox").find("input").eq(i).val();
                    json_select+='{"key":"'+id+'","value":"'+v+'"},';
                }
            }
            if(json_select=='{"componentID":"my_alert1","return_message":['){
                alert(1);
                json_select='{"componentID":"my_alert1"}';
            }else{
                json_select=json_select.substring(0,json_select.length-1);
                json_select+="]}";
            }
            $('#my_alert1').hide();
            callback1();
            window["subgroup_certain"]=JSON.parse(json_select);

        }else{
            $('#my_alert1').hide();
            window["subgroup_certain"]="empty";
        }
        
    });
    $('#btn-no').click(function () {
        callback2();
        $('#my_alert1').hide();
    });
    $('#btn-no_1').click(function () {
        callback2();
        $('#my_alert1').hide();
    });
    $('#btn-no_1').click(function () {
        callback3();
        $('#my_alert1').hide();
    });
    return JSON.parse('{"componentID":"my_alert1"}');
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
    var html = '';
    html = '<div id="my_alert" class="m-popup">';
    html += '<div class="m-popup-box" style="width:500px; min-height:170px;margin-top:200px;">';
    html += '<h2>' + title;
    html += '<a id="btn-no_1" href="javascript:void(0)" class="pull-right  bigger-150 s-c999" style="margin-right:20px;">×</a>';
    html += '</h2>';
    html += '<div style="max-height: 400px;overflow-y: auto;">';
    html += '<div style="padding:20px;">';
    html += '<p>' + content + '</p></div>';
    html += '<div class="f-tr f-pb10">';
    html += '<input id="btn-yes" type="button" class="u-btn" value="确定">&nbsp;&nbsp;';
    if (no_button) {
        html += '<input id="btn-no" type="button" class="u-btn u-btn-2" value="取消">&nbsp;&nbsp;';
    }
    html += '</div> </div> </div></div>';
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

/* ajax封装
 * url 发送请求的地址
 * data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
 * async 默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
 *       注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
 * type 请求方式("POST" 或 "GET")， 默认为 "GET"
 * dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text
 * successfn 成功回调函数
 */



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
    var reg=/^\".+\"$/gi;
    var result=reg.test(str);
    var last='';
    if(result){
        last=str.substr(1,str.length-2);
        return last;
    }else{
        last=str;
        return last;
    }
}
//判断Token是否为空，空跳回登录页
function token() {
    var token = cookie.get('ent_token');
    if (token == null) {
        localStorage.removeItem("organization");
        window.location.href = "";
    } else {
        return token;
    }
}
//统一平台token
function operator_token() {
    var token = cookie.get('token');
    if (token == null) {
        localStorage.removeItem("organization");
        window.location.href = "";
    } else {
        return token;
    }
}

//存储sessionStorage数组
function setSessionStorage(name, obj) {
    var str = JSON.stringify(obj);
    localStorage.setItem(name, str);
}

//读取sessionStorage数组
function getSessionStorage(name) {
    str = localStorage.getItem(name);
    obj = JSON.parse(str);
    return obj;
}

//退出登录
function closeUser() {
    window.location.href='';
    delCookie('ent_token');

}

//设置默认视图联动
function setDefaultView(setShowDefaultViewId,DefaultViewId,DefaultViewName){            
    var storage=window.localStorage;
    var setShowDefaultViewObj="#"+setShowDefaultViewId;
    var test=organization(setShowDefaultViewObj);
    DefaultViewId=trimDouble(DefaultViewId);
    DefaultViewName=trimDouble(DefaultViewName);
    if(storage.getItem("teacher_default_view")!="null"){
         $(setShowDefaultViewObj).find("option[value='"+DefaultViewId+"']").prop("selected",true);
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
            html += '<td>' + obj[i][key] + '</td>';
        }
        html += '</tr>';
    }
    return html;
}

//ajax封装
jQuery.ax = function (json) {
    json.async = (json.async === true || json.async === null || json.async === "" || typeof(json.async) === "undefined") ? true : false;
    json.type = (json.type == null || json.type == "" || typeof(json.type) == "undefined") ? "post" : json.type;
    json.dataType = (json.dataType == null || json.dataType == "" || typeof(json.dataType) == "undefined") ? "json" : json.dataType;
    json.data = (json.data == null || json.data == "" || typeof(json.data) == "undefined") ? {"date": new Date().getTime()} : json.data;

    $.ajax({
        type: json.type,
        async: json.async,
        data: json.data,
        url: json.url,
        dataType: json.dataType,
        context:json.context,
        timeout: 20000, //超时时间设置，单位毫秒
        beforeSend: function () {
            //请求前loading...
            ajaxout('loading');
        },
        success: function (ret_data) {
            if(ret_data['code'] == 40510||ret_data['code'] == 40511){
                //token过期
                delCookie('token');
                //去登录
                window.location.href = "";
                return false;
            }
                json.success(ret_data, this);
          
            
        },
        error: function (request, status, err) {
            removeload();
            if (status == 'timeout') {
                //请求超时处理
                my_alert('错误', "请求超时,您当前所处网络状况较差,请刷新页面！")
            } else {
                my_alert('错误', "请求失败！")
            }
        }
    });
};
function ajaxout(name){
    var len=$(".showLoading").length+1;
    //console.log("leng:"+len);
    if(len>1){
        $(".showLoading").hide();
        //$(".showLoading:first").show();
    }else{
        
    }
   switch(name){
        case "loading":
            html=' <div style="margin-top:10px;" class="showLoading">';
            html+='<div class="load_animation">';
            html+='<span></span><span></span><span></span><span></span><span></span>';
            html+=' <div style="margin-top:-10px;margin-left:70px;font-family:FangSong;font-size:15px;">正在加载中,请稍等';
            html+='</div></div></div>';
            $(".main-content").prepend(html);
            break;
        case "imagine":
            html=' <div style="margin-top:10px;" class="showLoading">';
            html+='<div class="load_animation">';
            html+='<span></span><span></span><span></span><span></span><span></span>';
            html+=' <div style="margin-top:-10px;margin-left:70px;font-family:FangSong;font-size:15px;"图片上传中,请稍等';
            html+='</div></div></div>';
            $(".main-content").prepend(html);
            break;
        case "files":
            html=' <div style="margin-top:10px;" class="showLoading">';
            html+='<div class="load_animation">';
            html+='<span></span><span></span><span></span><span></span><span></span>';
            html+=' <div style="margin-top:-10px;margin-left:70px;font-family:FangSong;font-size:15px;">文件上传中,请稍等';
            html+='</div></div></div>';
            $(".main-content").prepend(html);
            break;
       }
}

function removeload(){
   $('.showLoading').fadeOut('slow');
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
    console.log(diySuccess);
    console.log(diyError);
    if (!diySuccess)  diySuccess = function (a, b, c) {
        inits();
        console.log(a, b, c);
    }
    if (!diyError)    diyError = function (a, b, c) {
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
    var organize=getOrganizationList('user_info');
    var html='';
    for(var i in organize.structures){
        html+='<option value="'+organize.structures[i]+'">'+i+'</option>';
    }
    $(name).html(html);
    var select_item=getSectionStorage('user_info','default_view');
    $(name).val(select_item);
}

/*
 *@function:获取组织结构列表
 *@param1:传入指定本地存储的字段
 */
function getOrganizationList(name){
    var organize='{"structures":{';
    var structures=JSON.parse(getLocalStorage(name)).structures;
    var views_sturcture_id=JSON.parse(getLocalStorage(name)).views.structure_id;
    for(var i in structures){
        if(structures[i].value=="all"){
            continue;
        }
        organize+='"'+structures[i].name+'"'+":"+'"'+structures[i].value+'"'+',';
    }
    organize=organize.substr(0,organize.length-1);
    organize+="}}";
    return JSON.parse(organize);
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

function xixun_login_off(){
    delCookie('ent_token');
    window.location.href='';
}

function xixun_cross_login_off(){
    var school_id=getSectionStorage('user_info','school_id');
    var default_view_name=getSectionStorage('user_info','school_name');
    var sjzx=sjzx_domain+"/loginout.html";
    var bysj=bysj_domain+"/loginout.html";
    var dcwj=dcwj_domain+"/logout/index";
    var sx=sx_domain+"/loginout.html";
    $('body').append('<iframe id="frame1" style="display:none;" src="' + bysj + '"></iframe>');
            $('body').append('<iframe id="frame2" style="display:none;" src="' + sjzx + '"></iframe>');
            $('body').append('<iframe id="frame4" style="display:none;" src="' + dcwj + '"></iframe>');
    setTimeout('var storage=window.localStorage;;var tk=cookie.get("token");   var time=new Date();time.setDate(time.getDate()-1);time=time.toGMTString();document.cookie="token="+tk+";domain='+domain+';path=/;expires="+time;storage.setItem("school_id",'+school_id+');storage.setItem("school_name","'+default_view_name+'");window.location.href="https://www.xixunyun.com/enterprise/js/common/'+sx_domain+'/login.html";',100);
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
function change_size(){
    $('#size').append('<option value="15">15</option> <option value="25">25</option> <option value="50">50</option> <option value="100">100</option>')
    $('#size').change(function () {

        var opt= $('#size').val();
        if(opt==15){
            page_size=15
            getPageSearch(1, page_size, $('#student-keyword').val());
        }
        if(opt==25){
            page_size=25
            getPageSearch(1, page_size, $('#student-keyword').val());
        }
        if(opt==50){
            page_size=50
            getPageSearch(1, page_size, $('#student-keyword').val());
        }
        if(opt==100){
            page_size=100
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



