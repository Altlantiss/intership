/*sx_domain='https://www.xixunyun.com';
sjzx_domain='https://www.xixunyun.com/DataCenter';
bysj_domain='https://www.xixunyun.com/bysj';
dcwj_domain='https://dcwj.xixunyun.com';
domain='https://www.xixunyun.com/enterprise/js/common/xixunyun.com';
file_domain='https://file.xixunyun.com';
//接口访问地址不带token
function apiurl_ntk(api_uri) {
    var api_protocal = '//';
    if(api_uri.indexOf('.') > -1){
        //检测到是渲染文件,直接使用文件域名
        return JSON.parse(getLocalStorage("user_info")).domain.file+api_uri;
    }else{
        var api_domain = 'api.xixunyun.com/';
    }
    return api_protocal + api_domain + api_uri;
}

//接口访问地址带token
function apiurl(api_uri) {
    var _token = token();

    if(api_uri.indexOf("?")>=0){
        api_uri += "&token=" + _token;
    }else{
        api_uri += "?token=" + _token;
    }
    var api_protocal = '//';
    if(api_uri.indexOf('.') > -1){
        //检测到是渲染文件,直接使用文件域名
        return JSON.parse(getLocalStorage("user_info")).domain.file+api_uri;
    }else{
        var api_domain = 'api.xixunyun.com/';
    }
    return api_protocal + api_domain + api_uri;
}*/
