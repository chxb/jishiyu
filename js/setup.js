

layui.config({
    base: 'js/'
});

layui.use([
    'util', 'form', 'element',
    'layer', 'laytpl', 'dropdown',
    'viewmgr', 'dataservice',
    'shensha', 'realsuntime'], paipan);


layui.use(['dataservice'], function () {
    layui.dataservice.request(
        "user/ping",
        {},
        null,
        function (result) {
            if (result.code == "401") {
                $(".app-profile-user").text("注册/登录");
                $(".app-logout-btn").hide();
                $("#app-profile-card-user").text("****");
                $("#app-profile-card-nick").text("****");
                $("#app-profile-card-mobile").text("****");
                layui.data('profile', {
                    key: 'loginuser', remove: true,
                });
                layui.data('profile', {
                    key: 'logintoken', remove: true,
                });
            }
        }
    );
});


