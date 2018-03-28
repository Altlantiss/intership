$(document).ready(function(){

    var okBtn = $(".ok");
    var id = $("#id");
    var newPwd = $("#newPwd");
    var reNewPwd = $("#reNewPwd");
    okBtn.on("click",function(){

        if( id.val() != "" && newPwd.val() != "" && reNewPwd.val() != "" ){
            if( newPwd.val() === reNewPwd.val() ){
                $.ajax({
                    type: "POST",  //提交方式
                    beforeSend: function (request) {
                        request.setRequestHeader("token", "deae004be87c8e2240ef84cf639b5ab1");
                    },
                    url: apiUrl + "mobile/teacher",
                    data:{
                        "id" : id.val(),
                        "password" : newPwd.val()
                    },
                    success: function (data) {//返回数据根据结果进行相应的处理

                    }
                });
            }else{
                alert("请保证两次输入的新密码一致！")
            }
        }else{
            alert("请填写完整！")
        }
        return false;
    })

});