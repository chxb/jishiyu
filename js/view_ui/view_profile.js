(function () {

    function appprofilethemeClickFunc() {
        var themecolor = $(this).css("background-color");
        document.body.style.setProperty("--theme-color", themecolor);
        layui.data('profile', {
            key: 'theme',
            value: themecolor
        });
        var meta = document.querySelector('meta[name="theme-color"]');
        meta.setAttribute('content', themecolor);
    }

    //修改呢称
    function appprofilecardnickClickFunc() {
        var profile = layui.data('profile');
        if (!profile || !profile.loginuser) return;
        var defVal = "请填写" == $("#app-profile-card-nick-val").text() ? "" : $("#app-profile-card-nick-val").text();
        layer.prompt(
            {
                title: "输入呢称",
                value: defVal,
                maxlength: 50,
                placeholder: "请输入呢称",
            },
            function (val, index) {
                if (!val) return false;
                profile = layui.data('profile');
                var loginuser = profile.loginuser;
                var user = {
                    id: loginuser.id,
                    nickname: val
                };
                layui.dataservice.request(
                    "user/update",
                    user,
                    function (result) {
                        if (!result) {
                            layer.msg("服务器未响应!", { time: 2000 });
                            return;
                        };
                        if (result.code == "200") {
                            $("#app-profile-card-nick-val").text(val);
                            $(".app-profile-user").text(val);
                            var user = loginuser;
                            user.nickname = val;
                            layui.data('profile', {
                                key: 'loginuser'
                                , value: user
                            });
                            profile = layui.data('profile');
                        } else {
                            layer.msg(result.message, { time: 4000 });
                            return;
                        }
                    },
                    function (result) {
                        layer.msg(result.message, { time: 2000 });
                    }
                );

                layer.close(index);
            }
        );
    }
    //修改手机号
    function appprofilecardmobileClickFunc() {
        var profile = layui.data('profile');
        if (!profile || !profile.loginuser) return;
        var defVal = "请填写" == $("#app-profile-card-mobile-val").text() ? "" : profile.loginuser.mobile;
        layer.prompt(
            {
                title: "输入手机号",
                value: defVal,
                maxlength: 50,
                placeholder: "请输入手机号",
            },
            function (val, index) {
                if (!val) return false;
                profile = layui.data('profile');
                var loginuser = profile.loginuser;
                var user = {
                    id: loginuser.id,
                    mobile: val
                };
                layui.dataservice.request(
                    "user/update",
                    user,
                    function (result) {
                        if (!result) {
                            layer.msg("服务器未响应!", { time: 2000 });
                            return;
                        };
                        if (result.code == "200") {
                            $("#app-profile-card-mobile-val").text(val.substring(0, val.length - 4) + '****');
                            var user = loginuser;
                            user.mobile = val;
                            layui.data('profile', {
                                key: 'loginuser'
                                , value: user
                            });
                            profile = layui.data('profile');
                        } else {
                            layer.msg(result.message, { time: 4000 });
                            return;
                        }
                    },
                    function (result) {
                        layer.msg(result.message, { time: 2000 });
                    }
                );

                layer.close(index);
            }
        );
    }
    //修改电子邮箱
    function appprofilecardemailClickFunc() {
        var profile = layui.data('profile');
        if (!profile || !profile.loginuser) return;
        var defVal = "请填写" == $("#app-profile-card-email-val").text() ? "" : profile.loginuser.email;
        layer.prompt(
            {
                title: "输入电子邮箱",
                value: defVal,
                maxlength: 100,
                placeholder: "请输入电子邮箱",
            },
            function (val, index) {
                if (!val) return false;
                profile = layui.data('profile');
                var loginuser = profile.loginuser;
                var user = {
                    id: loginuser.id,
                    email: val
                };
                layui.dataservice.request(
                    "user/update",
                    user,
                    function (result) {
                        if (!result) {
                            layer.msg("服务器未响应!", { time: 2000 });
                            return;
                        };
                        if (result.code == "200") {
                            var email = val.split("@");
                            email[0] = email[0].substring(0, 1) + "****" + email[0].substring(email[0].length - 1);
                            $("#app-profile-card-email-val").text(email.join("@"));
                            var user = loginuser;
                            user.email = val;
                            layui.data('profile', {
                                key: 'loginuser'
                                , value: user
                            });
                            profile = layui.data('profile');
                        } else {
                            layer.msg(result.message, { time: 4000 });
                            return;
                        }
                    },
                    function (result) {
                        layer.msg(result.message, { time: 2000 });
                    }
                );

                layer.close(index);
            }
        );
    }

    function appprofilecardaboutClickFunc() {
        layui.viewmgr.loadView('view_about', function () {
            layui.viewmgr.showView('view_about');
        });
    }

    function appprofilecardappClickFunc() {
        layui.viewmgr.loadView('view_download', function () {
            layui.viewmgr.showView('view_download');
        });
    }

    function showLogin() {
        layui.viewmgr.loadView('view_login', function () {
            loginView.display();
        });
    }

    function appprofilePerferenceClickFunc(){
        layui.viewmgr.loadView('view_perference', function () {
            perferenceView.display();
        });
    }

    //注销
    function doLogout() {
        layer.alert('你确定要退出登录帐号吗？', {
            time: 0 //不自动关闭
            , btn: ['是', '否']
            , btnAlign: 'c'
            , yes: function (index) {
                $(".app-profile-user").text("注册/登录");
                $("#app-profile-userid").hide();
                $("#app-profile-userid-val").text("****");
                $("#app-profile-card-nick-val").text("****");
                $("#app-profile-card-mobile-val").text("****");
                $("#app-profile-card-email-val").text("****");
                $(".app-logout-btn").hide();
                $("#app-login-panel").show();
                layui.data('profile', {
                    key: 'loginuser', remove: true,
                });
                layui.data('profile', {
                    key: 'logintoken', remove: true,
                });
                layer.close(index);
                return true;
            }
        });
    }

    $(".app-profile-user").on("click", showLogin);
    $(".app-profile-theme").on("click", appprofilethemeClickFunc);
    $("#app-profile-card-perference").on("click", appprofilePerferenceClickFunc);
    $("#app-profile-card-nick").on("click", appprofilecardnickClickFunc);
    $("#app-profile-card-mobile").on("click", appprofilecardmobileClickFunc);
    $("#app-profile-card-email").on("click", appprofilecardemailClickFunc);
    $("#app-profile-card-about").on("click", appprofilecardaboutClickFunc);
    $("#app-profile-card-app").on("click", appprofilecardappClickFunc);
    $(".app-logout-btn").on("click", doLogout);

    function doProfile() {
        $("#profileNav").addClass("app-footer-tab-selected");
        $(".app-navbar-icon-profile").addClass("app-navbar-icon-profile-selected");
        layui.viewmgr.resetViews();
        layui.viewmgr.showView('view_profile')


        var profile = layui.data('profile');
        if (profile && profile.loginuser) {
            var loginuser = profile.loginuser
            $(".app-profile-user").text(loginuser.nickname || loginuser.username);
            $("#app-profile-userid").show();
            $("#app-profile-userid-val").text(loginuser.username);
            $("#app-profile-card-nick-val").text(loginuser.nickname || "请填写");
            if(loginuser.mobile){
                $("#app-profile-card-mobile-val").text(loginuser.mobile.substring(0, loginuser.mobile.length - 4) + '****');
            }else{
                $("#app-profile-card-mobile-val").text("请填写");
            }
            if(loginuser.email){
                var email = loginuser.email.split("@");
                email[0] = email[0].substring(0, 1) + "****" + email[0].substring(email[0].length - 1);
                $("#app-profile-card-email-val").text(email.join("@"));
            }else{
                $("#app-profile-card-email-val").text("请填写");
            }
            
            $(".app-logout-btn").show();
            $("#app-login-panel").hide();
        } else {
            $(".app-profile-user").text("注册/登录");
            $("#app-profile-userid").hide();
            $("#app-profile-userid-val").text("****");
            $("#app-profile-card-nick-val").text("****");
            $("#app-profile-card-mobile-val").text("****");
            $("#app-profile-card-email-val").text("****");
            $(".app-logout-btn").hide();
            $("#app-login-panel").show();
        }
    }

    globalThis.profileView = {
        display: doProfile,
        showLogin: showLogin
    }
    
    
})();