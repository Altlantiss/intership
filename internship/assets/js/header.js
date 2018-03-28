/**
 * Created by wanghaijiang on 2017/12/20.
 */

var headerDomSelecter = '#navbar-container';

$(function () {

    try {
        ace.settings.check('navbar', 'fixed');
    }
    catch (e) {
    }

    var headerInfo = '';
    headerInfo += '<div class="navbar-header pull-left">';
    headerInfo += '<a href="#" class="navbar-brand">';
    headerInfo += '<small>';
    headerInfo += '<i class="icon-leaf"></i>';
    headerInfo += '顶岗实习';
    headerInfo += '</small>';
    headerInfo += '</a>';
    headerInfo += '</div>';
    headerInfo += '<div class="navbar-header pull-right">';
    headerInfo += '<a href="#" class="navbar-brand"><small style="font-size:15px !important;">欢迎您&nbsp;' + cookie.get('userName') + '</small></a>';
    headerInfo += '<a href="#" class="navbar-brand" id="logOffButton"><small style="font-size:15px !important;">退出系统</small></a>';
    headerInfo += '</div>';

    $(headerDomSelecter).append(headerInfo);

    $('#logOffButton').click(function () {

        delCookie('token');

        window.location = 'http://101.37.27.185:8080/teacher/login/login.html';

    });

});