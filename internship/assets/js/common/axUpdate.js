//创建一个存储URL的数组
var lockMap = [];
jQuery.ax = function (json) {
    json.async = (json.async === true || json.async === null || json.async === "" || typeof(json.async) === "undefined") ? true : false;
    json.type = (json.type == null || json.type == "" || typeof(json.type) == "undefined") ? "post" : json.type;
    json.dataType = (json.dataType == null || json.dataType == "" || typeof(json.dataType) == "undefined") ? "json" : json.dataType;
    json.data = (json.data == null || json.data == "" || typeof(json.data) == "undefined") ? {"date": new Date().getTime()} : json.data;
    json.timeOut = (json.timeOut == null || json.timeOut == "" || typeof(json.timeOut) == "undefined") ? 20000 : json.timeOut;

    //判断发起的请求是否为put或者是post请求
    var typeLowerCase = json.type.toLowerCase();
    if (typeLowerCase === "put" || typeLowerCase === "post") {
        //锁存功能实现，并且处理了网速慢多线程成发起的问题
        if ($.inArray(json.url, lockMap) !== -1) {
            alert("操作正在提交中……");
            return;
        }
        lockMap.push(json.url);
    }

    ajaxMain(json);

    function ajaxMain(json) {
        $.ajax({
            type: json.type,
            async: json.async,
            data: json.data,
            url: json.url,
            dataType: json.dataType,
            context: json.context,
            timeout: json.timeOut, //超时时间设置，单位毫秒
            beforeSend: function () {
                //请求前loading...
                ajaxout('loading');
            },
            success: function (ret_data) {
                if (ret_data['code'] == 40510 || ret_data['code'] == 40511) {
                    xixun_login_off();
                }
                json.success(ret_data, this);
            },
            error: function (request, status, err) {
                removeload();
                if (status == 'timeout') {
                    //请求超时处理
                    my_alert('错误', "请求超时,您当前所处网络状况较差,请刷新页面！");
                } else {
                    my_alert('错误', "请求失败！");
                }
            },
            complete:function(ret_data,ts){
                //从数组中删除当前的url
                for (var i = 0; i < lockMap.length; i++) {
                    if (lockMap[i] === json.url) {
                        lockMap[i] = '';
                    }
                }
            }
        });
    }


};
function ajaxout(name) {
    var len = $(".showLoading").length + 1;
    if (len > 1) {
        $(".showLoading").remove();
    }
    switch (name) {
        case "loading":
            html = ' <div style="position:absolute" class="showLoading">';
            html += '<div class="load_animation">';
            html += '<span></span><span></span><span></span><span></span><span></span>';
            html += ' <div style="margin-left:70px;font-family:FangSong;font-size:15px;">正在加载中,请稍等';
            html += '</div></div></div>';
            $(".main-content").prepend(html);
            break;
        case "imagine":
            html = ' <div style="position:absolute" class="showLoading">';
            html += '<div class="load_animation">';
            html += '<span></span><span></span><span></span><span></span><span></span>';
            html += ' <div style="margin-top:-10px;margin-left:70px;font-family:FangSong;font-size:15px;"图片上传中,请稍等';
            html += '</div></div></div>';
            $(".main-content").prepend(html);
            break;
        case "files":
            html = ' <div style="position:absolute" class="showLoading">';
            html += '<div class="load_animation">';
            html += '<span></span><span></span><span></span><span></span><span></span>';
            html += ' <div style="margin-top:-10px;margin-left:70px;font-family:FangSong;font-size:15px;">文件上传中,请稍等';
            html += '</div></div></div>';
            $(".main-content").prepend(html);
            break;
    }
}
$.ajaxSetup({cache: false});
function removeload() {
    $('.showLoading').fadeOut('slow');
}