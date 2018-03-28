/**
 * Created by wanghaijiang on 2017/12/20.
 */

var sidebarDomSelecter = '#sidebar';
var data2;

$(function () {
    $.ajax({
        type: "GET",  //提交方式,
        async:false,
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/getMyMenus",//路径
        success: function (data) {   //返回数据根据结果进行相应的处理
            data2 = data;
        }
    });

    // $('body').css({
    //     visibility: 'hidden'
    // });



        var sidebarInfo = '<ul class="nav nav-list">';

        try {
            ace.settings.check('sidebar', 'fixed')
        }
        catch (e) {
        }

        for( var i =0; i<data2.data.length;i++){
            if( data2.data[i].parentId === null ){
                sidebarInfo += '<li class="which-active-page" id="'+data2.data[i].permissionCode+'" name="'+data2.data[i].id+'">';
                sidebarInfo += '<a href="'+data2.data[i].url+'">';
                sidebarInfo += '<img src="'+data2.data[i].iconUrl+'" alt="">';
                sidebarInfo += '<span class="menu-text"> '+data2.data[i].permissionName+'</span>';
                sidebarInfo += '</a>';
                sidebarInfo += '</li>';
            }
        }
        sidebarInfo += '</ul>';
        $(sidebarDomSelecter).append(sidebarInfo);
        $(sidebarDomSelecter).append('<div class="sidebar-collapse" id="sidebar-collapse">\n' +
            '    <i class="icon-double-angle-left" data-icon1="icon-double-angle-left" data-icon2="icon-double-angle-right"></i>\n' +
            '</div>');


        var sidebarDom = $(".which-active-page");

        for( i=0;i<data2.data.length;i++ ){
            var strUlCheck = false;
            if( data2.data[i].parentId !== null ){
                var str = '';
                var strUl = '<ul class="submenu">';

                var strB = '<b class="arrow icon-angle-down"></b>';
                str += '<li>';
                str += '<a href="'+data2.data[i].url+'">';
                str += '<i class="icon-double-angle-right"></i>'+data2.data[i].permissionName;
                str += '</a>';
                str += '</li>';

                for( var j = 0;j<sidebarDom.length;j++){
                    if( sidebarDom.eq(j).attr("name") == data2.data[i].parentId ){
                        var findUl = sidebarDom.eq(j).find("ul");
                        if( findUl.length === 0 ){
                            sidebarDom.eq(j).append(strUl);
                        }
                        sidebarDom.eq(j).children("ul").append(str);
                        sidebarDom.eq(j).children("a").addClass("dropdown-toggle");
                        sidebarDom.eq(j).children("a").attr("href","#");
                        sidebarDom.eq(j).children("a").append(strB);
                    }
                }
            }

        }



        try {
            ace.settings.check('sidebar', 'collapsed');
        } catch (e) {
        }

        //为了解决合起状态的sidebar的闪一下的问题，索性先不可见，等到sidebar收起来后，再恢复可见
        // $('body').css({
        //     visibility: 'visible'
        // });

        var urlComponents = window.location.href.split('/');

        var thisPage = urlComponents[urlComponents.length - 1];

        thisPage = thisPage.replace('.html', '');

        $('.which-active-page').each(function () {

            var id = $(this).attr('id');

            var whichPage = id.replace('page-is-', '').replace(/-or-/g, ".").split('.');

            for (var i = 0; i < whichPage.length; i++) {

                if (whichPage[i] === thisPage) {

                    $(this).addClass('active');

                    return;

                }

            }

        });












    // var sidebarInfo1 = '<ul class="nav nav-list"><li class="which-active-page" id="page-is-main"><a href="../main/main.html"><img src="../../assets/images/index_normal.png" alt="首页"><span class="menu-text"> 首页</span></a></li><li class="which-active-page" id="page-is-notice-or-receivedNotice"><a href="#" class="dropdown-toggle"><!--<i class="icon-desktop"></i>--><img src="../../assets/images/notice_normal.png" alt="通知公告"/><span class="menu-text"> 通知公告 </span><b class="arrow icon-angle-down"></b></a><ul class="submenu"><li><a href="../notice/notice.html"><i class="icon-double-angle-right"></i>发送的通知</a></li><li><a href="../receivedNotice/receivedNotice.html"><i class="icon-double-angle-right"></i>收到的通知</a></li></ul></li><li class="which-active-page" id="page-is-internshipDoc"><a href="../internshipDoc/internshipDoc.html"><img src="../../assets/images/practice_file_normal.png" alt="实习文件"><span class="menu-text"> 实习文件 </span></a></li><li class="which-active-page" id="page-is-organization"><a href="../organization/organization.html"><img src="../../assets/images/class_manager_normal.png" alt="组织管理"><span class="menu-text"> 组织管理 </span></a></li><li class="which-active-page" id="page-is-classManager"><a href="../classManager/classManager.html"><img src="../../assets/images/class_manager_normal.png" alt="班级管理"><span class="menu-text"> 班级管理 </span></a></li><li class="which-active-page" id="page-is-teacherManager"><a href="../teacherManager/teacherManager.html"><img src="../../assets/images/group_normal.png" alt="教师管理"><span class="menu-text"> 教师管理 </span></a></li><li class="which-active-page" id="page-is-studentManager"><a href="../studentManager/studentManager.html"><img src="../../assets/images/group_normal.png" alt="学生管理"><span class="menu-text"> 学生管理 </span></a></li><li class="which-active-page" id="page-is-groupManager"><a href="../groupManager/groupManager.html"><img src="../../assets/images/group_normal.png" alt="群组管理"><span class="menu-text"> 群组管理 </span></a></li><li class="which-active-page" id="page-is-practiceIntention"><a href="../practiceIntention/practiceIntention.html"><img src="../../assets/images/practice_intention_normal.png" alt="实习意向"><span class="menu-text"> 实习意向 </span></a></li><li class="which-active-page" id="page-is-leaveApproval-or-practiceWaitApproval-or-finishWaitApproval-or-changeWaitApproval"><a href="#" class="dropdown-toggle"><img src="../../assets/images/apply_approval_normal.png" alt="申请审批"/><span class="menu-text"> 申请审批 </span><b class="arrow icon-angle-down"></b></a><ul class="submenu"><li><a href="../leaveApproval/leaveApproval.html"><i class="icon-double-angle-right"></i>请假申请审批</a></li><li><a href="../practiceWaitApproval/practiceWaitApproval.html"><i class="icon-double-angle-right"></i>实习申请审批</a></li><li><a href="../finishWaitApproval/finishWaitApproval.html"><i class="icon-double-angle-right"></i>结束申请审批</a></li><li><a href="../changeWaitApproval/changeWaitApproval.html"><i class="icon-double-angle-right"></i>变更申请审批</a></li></ul></li><li class="which-active-page" id="page-is-practiceArrange"><a href="../practiceArrange/practiceArrange.html"><img src="../../assets/images/practice_arrange_normal.png" alt="实习安排"><span class="menu-text"> 实习安排 </span></a></li><li class="which-active-page" id="page-is-mineIntern"><a href="../mineIntern/mineIntern.html"><img src="../../assets/images/mine_intern_normal.png" alt="我的实习生"><span class="menu-text"> 我的实习生 </span></a></li><li class="which-active-page" id="page-is-dailyCheckIn-or-dailyReport-or-dailyReportWaitingForApproved-or-dailyReportRejected-or-weeklyReport-or-weeklyReportWaitingForApproved-or-weeklyReportRejected-or-monthlyReport-or-monthlyReportWaitingForApproved-or-monthlyReportRejected"><a href="#" class="dropdown-toggle"><img src="../../assets/images/practice_process_normal.png" alt="实习过程管理"><span class="menu-text"> 实习过程管理 </span><b class="arrow icon-angle-down"></b></a><ul class="submenu"><li><a href="../dailyCheckIn/dailyCheckIn.html"><i class="icon-double-angle-right"></i>每日签到统计</a></li><li><a href="../dailyReport/dailyReport.html"><i class="icon-double-angle-right"></i>实习日报</a></li><li><a href="../weeklyReport/weeklyReport.html"><i class="icon-double-angle-right"></i>实习周报</a></li><li><a href="../monthlyReport/monthlyReport.html"><i class="icon-double-angle-right"></i>实习月报</a></li><!--<li>--><!--<a href="../summaryMark/summaryMark.html">--><!--<i class="icon-double-angle-right"></i>--><!--总结批阅--><!--</a>--><!--</li>--></ul></li><li class="which-active-page" id="page-is-teacherRecord"><a href="../teacherRecord/teacherRecord.html"><img src="../../assets/images/teacher_work_record_normal.png" alt="教师工作记录"><span class="menu-text"> 教师工作记录 </span></a></li><li class="which-active-page" id="page-is-practiceEvaluate"><a href="../practiceEvaluate/practiceEvaluate.html"><img src="../../assets/images/practice_evaluate_normal.png" alt="实习考评"><span class="menu-text"> 实习考评 </span></a></li><li class="which-active-page" id="page-is-mine"><a href="../mine/mine.html"><img src="../../assets/images/mine_normal.png" alt="个人资料"><span class="menu-text"> 个人资料 </span></a></li><li class="which-active-page" id="page-is-employTrack"><a href="../employTrack/employTrack.html"><img src="../../assets/images/employ_track_normal.png" alt="就业跟踪"><span class="menu-text"> 就业跟踪 </span></a></li><li class="which-active-page" id="page-is-dataStatistic"><a href="../dataStatistic/dataStatistic.html"><img src="../../assets/images/data_statistics_normal.png" alt="数据统计"><span class="menu-text"> 数据统计 </span></a></li></ul><div class="sidebar-collapse" id="sidebar-collapse"><i class="icon-double-angle-left" data-icon1="icon-double-angle-left" data-icon2="icon-double-angle-right"></i></div>';








});