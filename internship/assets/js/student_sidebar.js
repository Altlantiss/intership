/**
 * Created by wanghaijiang on 2017/12/20.
 */

var sidebarDomSelecter = '#sidebar';

$(function () {

    // $('body').css({
    //     visibility: 'hidden'
    // });

    try {
        ace.settings.check('sidebar', 'fixed')
    }
    catch (e) {
    }

    var sidebarInfo = '<ul class="nav nav-list">'+
							'<li class="which-active-page" id="page-is-S_recivedNotice">'+
                    			'<a href="S_recivedNotice.html" class="dropdown-toggle">'+
                        			'<img src="../assets/images/notice_normal.png" alt="通知公告"/>'+
                        			'<span class="menu-text"> 通知公告 </span>'+
								'</a>'+
							'</li>'+
							'<li class="which-active-page" id="page-is-S_classesview">'+
                    			'<a href="S_classesview.html">'+
                        			'<img src="../assets/images/class_manager_normal.png" alt="班级查看">'+
                        			'<span class="menu-text"> 班级查看 </span>'+
                    			'</a>'+
                			'</li>'+
			                '<li class="which-active-page" id="page-is-S_practiceIntention">'+
			                    '<a href="S_practiceIntention.html">'+
			                        '<img src="../assets/images/practice_intention_normal.png" alt="实习意向">'+
			                        '<span class="menu-text"> 实习意向 </span>'+
			                    '</a>'+
			                '</li>'+
							'<li class="which-active-page" id="page-is-S_leaveApproval-or-page-is-S_applications-or-S_practiceWaitApproval-or-S_finishWaitApproval-or-S_changeWaitApproval">'+
			                    '<a href="S_applications.html" class="dropdown-toggle">'+
			                        '<img src="../assets/images/apply_approval_normal.png" alt="实习审批"/>'+
			                        '<span class="menu-text"> 实习申请 </span>'+
			                        '<b class="arrow icon-angle-down"></b>'+
			                    '</a>'+
								'<ul class="submenu">'+
									'<li>'+
										'<a href="S_leaveApproval.html">'+
											'<i class="icon-double-angle-right"></i>请假申请 '+
										'</a>'+
									'</li>'+
									'<li>'+
			                            '<a href="S_practiceWaitApproval.html">'+
			                                '<i class="icon-double-angle-right"></i>实习申请 '+
			                            '</a>'+
			                        '</li>'+
									'<li>'+
			                            '<a href="S_finishWaitApproval.html">'+
			                                '<i class="icon-double-angle-right"></i>结束申请'+
			                            '</a>'+
			                        '</li>'+
									'<li>'+
			                            '<a href="S_changeWaitApproval.html">'+
			                                '<i class="icon-double-angle-right"></i>变更申请'+
			                            '</a>'+
			                        '</li>'+
			                    '</ul>'+
			                '</li>'+
			                '<li class="which-active-page" id="page-is-S_dayReport-or-S_weekReport-or-S_monthReport">'+
			                    '<a href="" class="dropdown-toggle">'+
			                        '<img src="../assets/images/apply_approval_normal.png" alt="实习过程管理"/>'+
			                        '<span class="menu-text"> 实习过程管理 </span>'+
			                        '<b class="arrow icon-angle-down"></b>'+
			                    '</a>'+
								'<ul class="submenu">'+
									'<li>'+
			                            '<a href="S_dayReport.html">'+
			                                '<i class="icon-double-angle-right"></i>实习日报 '+
			                            '</a>'+
			                        '</li>'+
									'<li>'+
			                            '<a href="S_weekReport.html">'+
			                                '<i class="icon-double-angle-right"></i>实习周报 '+
			                            '</a>'+
			                        '</li>'+
									'<li>'+
			                            '<a href="S_monthReport.html">'+
			                                '<i class="icon-double-angle-right"></i>实习月报 '+
			                            '</a>'+
			                        '</li>'+
			                    '</ul>'+
			                '</li>'+
			                '<li class="which-active-page" id="page-is-S_praciceProcess">'+
			                    '<a href="S_praciceProcess.html">'+
			                        '<img src="../assets/images/practice_process_normal.png" alt="实习总结">'+
			                        '<span class="menu-text"> 实习总结 </span>'+
			                    '</a>'+
			                '</li>'+
			                '<li class="which-active-page" id="page-is-S_teachingEvaluation">'+
			                    '<a href="S_teachingEvaluation.html">'+
			                        '<img src="../assets/images/practice_evaluate_normal.png" alt="评教">'+
			                        '<span class="menu-text"> 评教 </span>'+
			                    '</a>'+
			                '</li>'+
							'<li class="which-active-page" id="page-is-S_personal_data">'+
			                    '<a href="S_personal_data.html">'+
			                        '<img src="../assets/images/mine_normal.png" alt="个人资料">'+
			                        '<span class="menu-text"> 个人资料 </span>'+
			                    '</a>'+
			                '</li>'+
							'<li class="which-active-page" id="page-is-S_signed">'+
			                    '<a href="S_signed.html">'+
			                        '<img src="../assets/images/employ_track_normal.png" alt="签到">'+
			                        '<span class="menu-text"> 签到 </span>'+
			                    '</a>'+
			                '</li>'+
            			'</ul>'+
			            '<div class="sidebar-collapse" id="sidebar-collapse">'+
			                '<i class="icon-double-angle-left" data-icon1="icon-double-angle-left"'+
			                   'data-icon2="icon-double-angle-right"></i>'+
			            '</div>'
			            
    $(sidebarDomSelecter).append(sidebarInfo);

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

});