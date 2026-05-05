/*
    Copyright (C) 2026 xianbo.chen@gmail.com
    Licensed under AGPL-3.0
*/

(function() {
    // 老黄历
    function doLaohuangli() {
        layui.viewmgr.loadView('view_wannianli', function () {
            $("#calendarNav").addClass("app-footer-tab-selected");
            $(".app-navbar-icon-calendar").addClass("app-navbar-icon-calendar-selected");
            layui.viewmgr.resetViews();
            layui.viewmgr.showView('view_wannianli')
            layui.use(['monthly'], function () {
                layui.monthly.init();
                layui.viewmgr.showView('view_laohuangli');
            });
        });
    }

    globalThis.laohuangliView = {
        display: doLaohuangli
    }

})();
