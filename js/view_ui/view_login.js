/*
    Copyright (C) 2026 xianbo.chen@gmail.com
    Licensed under AGPL-3.0
*/

(function() {
    //登录页面

    var verCodeCounter = 0;
    var vercodetimeout = null;
    var profile = null;

    //按验证码登录
    function doLoginByMobile() {
        verCodeCounter = 0;
        var uid = $(".app-login-uid-input").val();
        var vercode = $(".app-login-pwd-input").val();
        if (uid && !(/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(uid))  && !(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(uid))) {
            layer.msg("请先输入有效的手机号或电子邮箱", { time: 2000 });
            return;
        }else if( !uid ){
            layer.msg("请先输入手机号或电子邮箱", { time: 2000 });
            return;
        }
        if (!vercode) {
            layer.msg("验证码未输入", { time: 2000 });
            return;
        }
        $.ajax({
            url: "loginByMobile",
            data: { "uid": uid, "password": vercode },
            success: function (result) {
                if (!result) {
                    layer.msg("服务器未响应!", { time: 2000 });
                    return;
                };
                if (result.code == "200") {
                    layui.data('profile', {
                        key: 'logintoken'
                        , value: result.data
                    });
                    profile = layui.data('profile');
                    var dataVal = null;
                    if( /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(uid) ){
                        dataVal = { "mobile": uid };
                    }else{
                        dataVal = { "email": uid };
                    }
                    $.ajax({
                        url: "user/get",
                        headers: {
                            "Authorization": "Bearer " + result.data
                        },
                        data: dataVal,
                        success: function (result) {
                            if (!result) {
                                layer.msg("服务器未响应!", { time: 3000 });
                            };
                            var user = result.data;
                            $(".app-profile-user").text(user.nickname || user.username);
                            $("#app-profile-userid").show();
                            $("#app-profile-userid-val").text(user.username);
                            $("#app-profile-card-nick-val").text(user.nickname || "请填写");
                            if( user.mobile ){
                                $("#app-profile-card-mobile-val").text(user.mobile.substring(0, user.mobile.length - 4) + '****');
                            }
                            if( user.email ){
                                var email = user.email.split("@");
                                email[0] = email[0].substring(0, 1) + "****" + email[0].substring(email[0].length - 1);
                                $("#app-profile-card-email-val").text(email.join("@"));
                            }
                            $(".app-logout-btn").show();
                            $("#app-login-panel").hide();
                            layui.data('profile', {
                                key: 'loginuser'
                                , value: user
                            });
                            profile = layui.data('profile');
                            vercodetimeout && clearInterval(vercodetimeout);
                            $(".app-login-pwd-ver").text("获取验证码");
                            $(".app-login-uid-input").val("");
                            $(".app-login-pwd-input").val("");
                            layui.viewmgr.backView();
                            if( filelistView && filelistView.doListAll ){
                                filelistView.resetFilePageNum();
                                filelistView.doListAll();//刷新档案列表
                            }
                        },
                        error: function () {
                            layer.msg("服务器内部错误!", { time: 3000 });
                        }
                    })
                } else {
                    layer.msg(result.message, { time: 4000 });
                    return;
                }
            },
            error: function () {
                layer.msg("服务器内部错误!", { time: 3000 });
            }
        });
    }


    //发送校验码
    $(".app-login-pwd-ver").on("click", function () {
        if (verCodeCounter > 0) return;
        verCodeCounter = 180;
        var uid = $(".app-login-uid-input").val();
        if (uid) {
            $.ajax({
                url: "reqVerCode",
                data: { "uid": uid },
                success: function (result) {
                    if (!result) {
                        layer.msg("服务器未响应!", { time: 3000 });
                        return;
                    };
                    if (result.code == "200") {
                        $(".app-login-pwd-input").focus();
                        $(".app-login-pwd-ver").text((verCodeCounter--) + "秒后重发");
                        vercodetimeout = setInterval(function () {
                            $(".app-login-pwd-ver").text((verCodeCounter--) + "秒后重发");
                            if (verCodeCounter <= 0) {
                                clearInterval(vercodetimeout);
                                $(".app-login-pwd-ver").text("获取验证码");
                            }
                        }, 1000);
                        layer.msg(result.message, { time: 4000 });
                    } else {
                        layer.msg(result.message, { time: 4000 });
                        verCodeCounter = 0;
                        return;
                    }
                }
            });
        } else {
            layer.msg('手机号或电子邮箱不合法!', { time: 2000 });
            verCodeCounter = 0;
        }
    });

    //按密码登录
    function doLoginByPassword() {
        verCodeCounter = 0;
        var uid = $(".app-login-uid-input2").val();
        var vercode = $(".app-login-pwd-input2").val();
        if (uid && !(/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(uid))  && !(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(uid))) {
            layer.msg("请先输入有效的手机号或电子邮箱", { time: 2000 });
            return;
        }else if( !uid ){
            layer.msg("请先输入手机号或电子邮箱", { time: 2000 });
            return;
        }
        if (!vercode) {
            layer.msg("密码未输入", { time: 2000 });
            return;
        }
        $.ajax({
            url: "loginByMobile",
            data: { "uid": uid, "password": vercode, "type": "1" },
            success: function (result) {
                if (!result) {
                    layer.msg("服务器未响应!", { time: 2000 });
                    return;
                };
                if (result.code == "200") {
                    layui.data('profile', {
                        key: 'logintoken'
                        , value: result.data
                    });
                    profile = layui.data('profile');
                    var dataVal = null;
                    if( /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(uid) ){
                        dataVal = { "mobile": uid };
                    }else{
                        dataVal = { "email": uid };
                    }
                    $.ajax({
                        url: "user/get",
                        headers: {
                            "Authorization": "Bearer " + result.data
                        },
                        data: dataVal,
                        success: function (result) {
                            if (!result) {
                                layer.msg("服务器未响应!", { time: 3000 });
                            };
                            var user = result.data;
                            $(".app-profile-user").text(user.nickname || user.username);
                            $("#app-profile-userid").show();
                            $("#app-profile-userid-val").text(user.username);
                            $("#app-profile-card-nick-val").text(user.nickname || "请填写");
                            if( user.mobile ){
                                $("#app-profile-card-mobile-val").text(user.mobile.substring(0, user.mobile.length - 4) + '****');
                            }
                            if( user.email ){
                                var email = user.email.split("@");
                                email[0] = email[0].substring(0, 1) + "****" + email[0].substring(email[0].length - 1);
                                $("#app-profile-card-email-val").text(email.join("@"));
                            }
                            $(".app-logout-btn").show();
                            $("#app-login-panel").hide();
                            layui.data('profile', {
                                key: 'loginuser'
                                , value: user
                            });
                            profile = layui.data('profile');
                            $(".app-login-uid-input2").val("");
                            $(".app-login-pwd-input2").val("");
                            layui.viewmgr.backView();
                            var currentView = layui.viewmgr.currentView();
                            if( currentView ){
                                if( currentView.data("view")==="view_filelist" ){
                                    filelistView.resetFilePageNum();
                                    filelistView.doListAll();//刷新档案列表
                                }else
                                if( currentView.data("view") === "view_recordlist" ){
                                    recordListView.resetFilePageNum();
                                    recordListView.doListAll();//刷新档案列表
                                }
                            }
                        },
                        error: function () {
                            layer.msg("服务器内部错误!", { time: 3000 });
                        }
                    })
                } else {
                    layer.msg(result.message, { time: 4000 });
                    return;
                }
            },
            error: function () {
                layer.msg("服务器内部错误!", { time: 3000 });
            }
        });
    }

    function doModifyPassword() {
        var uid = $(".app-login-uid-input2").val();
        var vercode = $(".app-login-pwd-input2").val();
        if (uid && !(/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(uid))  && !(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(uid))) {
            layer.msg("请先输入有效的手机号或电子邮箱", { time: 2000 });
            return;
        }else if( !uid ){
            layer.msg("请先输入手机号或电子邮箱", { time: 2000 });
            return;
        }
        if (!vercode) {
            layer.msg("密码未输入", { time: 2000 });
            return;
        }

        layer.prompt(
            {
                title: "输入新密码",
                value: "",
                maxlength: 30,
                placeholder: "请输入新密码",
                formType: 1
            },
            function (val, index) {
                if (!val) return false;
                $.ajax({
                    url: "modifyPassword",
                    data: { "uid": uid, "oldPassword": vercode, "newPassword": val },
                    success: function (result) {
                        if (!result) {
                            layer.msg("服务器未响应!", { time: 2000 });
                        }
                        if (result.code == "200") {
                            layer.msg("密码修改成功！请用新密码登录。", { time: 3000 });
                            $(".app-login-uid-input2").val("");
                            $(".app-login-pwd-input2").val("");
                        }else{
                            layer.msg(result.message, { time: 2000 });
                            return;
                        }
                    },
                    error: function () {
                        layer.msg("服务器内部错误!", { time: 2000 });
                    }
                })
                layer.close(index);
            }
        );
        
    }

    $(".app-login-btn").on("click", doLoginByMobile);
    $(".app-login-btn2").on("click", doLoginByPassword);
    $(".app-modifylogin-btn").on("click", doModifyPassword);

    function doShowLogin() {
        verCodeCounter = 0;
        profile = layui.data('profile');
        if ( profile && profile.loginuser ) return;
        vercodetimeout && clearInterval(vercodetimeout);
        vercodetimeout = null;
        $(".app-login-pwd-ver").text("获取验证码");
        $(".app-login-uid-input").val("");
        $(".app-login-pwd-input").val("");
        layui.viewmgr.showView('view_login');

    }

    globalThis.loginView = {
        display: doShowLogin
    };
    

})();