/**
 * Created by yuqin on 2017/12/25.
 */

$(function(){
	initData();

});

function initData()
{
	$.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/teacher/my",//路径
        success: function (data) {//返回数据根据结果进行相应的处理
        	if(data.data.headImg!=undefined&&data.data.headImg!='')
        	{
        		$("#photo").attr('src',data.data.headImg);
        	}else{
                $("#photo").attr('src','../../assets/images/touxiang.jpg');
            }
            $("#th_teacherName").html(data.data.name+',欢迎您！');
            $("#th_school").html('组织：'+data.data.schoolName);
            $("#th_group").html('管理群组：'+data.data.groupName);
            $("#th_class").html('管理班级：'+data.data.className);
            $("#th_role").html('老师职位：暂无');
            $("#span_total").html(data.data.classTotalNum);
            $("#span_total_practice").html(data.data.classTotalPracticeNum);
        }
    });

    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/notice/my?page=1&limit=10",//路径
        success: function (data) {//返回数据根据结果进行相应的处理
        	var html='';
            for(var i=0;i<data.data.list.length;i++)
            {
            	html+='<tr class="notice" style="cursor: pointer"><td class="notice-title">【'+(data.data.list[i].readState==0?'未读':'已读')+'】 '+data.data.list[i].title+'</td><td>'+data.data.list[i].sendTime.substr(0,10)+'</td></tr>';
            }
            $("#tb_message").append(html);
            
            
        }
    });
    
    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/todo",//路径
        success: function (data) {//返回数据根据结果进行相应的处理
        	var html='';
            for(var i=0;i<data.data.length;i++)
            {
            	var herf='';
            	if(data.data[i].name.indexOf("实习")>-1)
            	{
            		herf='../practiceWaitApproval/practiceWaitApproval.html';
            	}
            	if(data.data[i].name.indexOf("请假")>-1)
            	{
            		herf='../leaveApproval/leaveApproval.html';
            	}
            	if(data.data[i].name.indexOf("变更")>-1)
            	{
            		herf='../changeWaitApproval/changeWaitApproval.html';
            	}
            	if(data.data[i].name.indexOf("结束")>-1)
            	{
            		herf='../finishWaitApproval/finishWaitApproval.html';
            	}
                if(data.data[i].name.indexOf("日报")>-1)
                {
                    herf='../dailyReportWaitingForApproved/dailyReportWaitingForApproved.html';
                }
                if(data.data[i].name.indexOf("周报")>-1)
                {
                    herf='../weeklyReportWaitingForApproved/weeklyReportWaitingForApproved.html';
                }
            	html+='<tr >' +
                    '<td>' +
                    '<a href="'+herf+'" style="color: #1a1a1a;font-size: 15px;">您有 ' +
                    '<b style="color:#F06E4A">'+data.data[i].count+'</b>' +
                    ' 份' +data.data[i].name+'待批阅'+'</a>'+
                    '</td>' +
                    '</tr>';
            }
            
            
            $("#tb_todo").append(html);
            
            
        }
    });

    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "mobile/practiceGroupUser?page=1&limit=10",//路径
        success: function (data) {//返回数据根据结果进行相应的处理
            $("#span_total_practice").html(data.data.total)
        },
        error:function(err){
            alert("请求实习生数据错误");
            console.log(err);
        }
    });

    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "/mobile/practiceGroup/my?page=1&limit=10",//路径
        success: function (data) {//返回数据根据结果进行相应的处理
            var sum = 0;
            for( var i =0; i<data.data.length; i++ ){
               sum += data.data[i].num;
            }
            $("#span_total").html(sum);
        },
        error:function(err){
            alert("请求管理的学生数据错误");
            console.log(err);
        }
    });





}




$(document).ready(function(){
    var notice;
    setTimeout(function(){
        notice = $(".notice");
        notice.on("click",function(){
            // var title =  $(this).children(".notice-title").text().split(" ")[1];
            window.location.href = '../notice/notice.html';
        });
    },1000);

});