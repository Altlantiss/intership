
// by Altlantis 12.28

$(document).ready(function(){
    var backgroundImg;
    var teacherId;
    $.ajax({
        type: "GET",  //提交方式
        beforeSend: function (request) {
            request.setRequestHeader("token", cookie.get("token"));
        },
        url: apiUrl + "/mobile/getMyInfo",//路径
        data: {
            // "id": id
        },
        success: function (data) {//返回数据根据结果进行相应的处理
            if (data.code === 0) {

                $.ajax({
                    type: "GET",  //提交方式
                    beforeSend: function (request) {
                        request.setRequestHeader("token", cookie.get("token"));
                    },
                    url: apiUrl + "/mobile/school?page=1&limit=15",//路径
                    data: {
                        // "id": schoolID
                    },
                    success: function (data) {//返回数据根据结果进行相应的处理
                        if (data.code === 0) {
                            $("#school").text(data.data[0]["schoolName"])
                        } else {
                            alert("获取学校信息失败!");
                        }
                    }
                });

                $("#username").text(data.data.teacher.username);
                $("#name").text(data.data.teacher.name);
                $("#sex").text(data.data.teacher.sex);
                $("#tel").text(data.data.teacher.tel);
                $("#qq").text(data.data.teacher.qq);
                $("#email").text(data.data.teacher.email);
                $("#politicalVisage").text(data.data.teacher.politicalVisage);
                $("#nation").text(data.data.teacher.nation);
                teacherId = data.data.teacher.id;

                $.ajax({
                    type: "GET",  //提交方式
                    beforeSend: function (request) {
                        request.setRequestHeader("token", cookie.get("token"));
                    },
                    url: apiUrl + "/mobile/teacher/findTeacherById?page=1&limit=10",//路径
                    data: {
                        id: teacherId
                    },
                    success: function (data) {//返回数据根据结果进行相应的处理
                        if (data.code === 0) {
                            console.log(data);
                            if( data.data.headImg != undefined &&  data.data.headImg != ""){
                                $("#person-img").attr("src",data.data.headImg);
                                backgroundImg = data.data.headImg;
                            }else{
                                $("#person-img").attr("src",'../../assets/images/touxiang.jpg');
                                backgroundImg = '../../assets/images/touxiang.jpg';
                            }
                        }
                    }
                });

            } else {
                alert("获取个人信息失败!");
            }
        }
    });


    //点击头像放大
    var personImg = $("#person-img");
    personImg.on("click",function(){
        $("#group_add_dialog").css("display","block");
        $(".m-popup-box").css("background-image","url("+ backgroundImg +")");
        $(".m-popup-box").css("background-repeat","no-repeat");
        $(".m-popup-box").css("background-size","700px 500px");
    });
    //点击取消
    var chance = $("#upload-chance");
    chance.on("click",function(){
        $("#group_add_dialog").css("display","none");
    });
    //点击上传
    var upload = $("#upload");
    upload.on("click",function(){

    });
    var uploadFile = $("#upload-file");
    uploadFile.on("change",function(){

        $("#upload-submit").click(function(){
            var options = {
                success: function (data) {
                    alert("上传成功");
                    $("#group_add_dialog").css("display","none");
                    var str = data.data.substr(1);
                    $("#person-img").attr("src",apiUrl + str );
                    backgroundImg = apiUrl + str;
                    $.ajax({
                        type: "PUT",  //提交方式
                        beforeSend: function (request) {
                            request.setRequestHeader("token", cookie.get("token"));
                        },
                        url: apiUrl + "/mobile/teacher",//路径
                        data: {
                            "headImg": backgroundImg,
                            "id":teacherId
                        },
                        success: function (data) {//返回数据根据结果进行相应的处理
                            if (data.code === 0) {
                                console.log(data);
                            }
                        }
                    });

                },
                error:function(err){
                    alert("上传失败");
                    console.log(err);
                }
            };
            $("#upload-form").ajaxForm(options);
        });
        if( isFile() ){
            $("#upload-submit").click();
        }

    });

    //导入按钮  -- 判断文件类型已经是否为空
    function isFile(){
        var file = $("#upload-file").val();
        if (file === "") {
            alert("请选择要上传的文件");
            return false
        } else {
            //检验文件类型是否正确
            var exec = (/[.]/.exec(file)) ? /[^.]+$/.exec(file.toLowerCase()) : '';
            if (exec != "png") {
                alert("文件格式不对，请上传Png文件!");
                return false;
            }
        }
        return true;
    }
});