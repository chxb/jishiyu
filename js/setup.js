/*
 * 吉时雨 (JiShiYu)
 * Copyright (C) 2026 xianbo.chen@gmail.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the LICENSE file for more details.
 *
 * If you use this software to provide network services (e.g. SaaS, API),
 * you must make your source code available to users.
 *
 * Commercial licensing is available:
 * 📧 xianbo.chen@gmail.com
 */

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


